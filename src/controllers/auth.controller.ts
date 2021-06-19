import _ from 'lodash';
import ejs from 'ejs';
import { DeleteResult } from 'typeorm';
import { inject } from 'inversify';
import * as express from 'express';
import {
    controller, httpPost, httpGet, request, BaseHttpController, httpDelete, queryParam,
} from 'inversify-express-utils';
import { JsonResult, BadRequestErrorMessageResult, RedirectResult } from 'inversify-express-utils/dts/results';

import UserSignupModel from '../models/userSignup.model';
import UserLoginModel from '../models/userLogin.model';

import { RefreshTokenModel } from '../models/token.model';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';

import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';
import { MailService } from '../services/mail.service';

import { AuthSerializer } from '../config/jsonApiSerializer';
import UserPasswordResetModel from '../models/userPasswordResetModel.model';
import EmailModel from '../models/emailModel';

@controller('/auth')
export class AuthController extends BaseHttpController {
    @inject(TYPES.AuthService) private authService: AuthService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @inject(TYPES.UserService) public userService: UserService;

    @inject(TYPES.MailService) public mailService: MailService;

    @httpPost('/signup')
    public async create(@request() req: express.Request): Promise<JsonResult> {
        const userData: UserSignupModel = new UserSignupModel({ ...req.body });

        await this.baseService.validateData(userData);

        const userDataResult: DBUserDataDTO = await this.authService.register(req.body);

        const email_token = await this.authService.generateToken(userDataResult, 'email_token', 180);

        const letter = await ejs.renderFile(
            `${__dirname}/../views/email-verification.ejs`,
            {
                user_name: userDataResult.name,
                confirm_link: `${process.env.BACKEND_HOST}/auth/verificateEmail?token=${email_token.token}`,
                frontend_link: process.env.FRONTEND_HOST,
            },
        );

        await this.mailService.sendEmail(userDataResult.email, 'BLOG email verification ✔', letter);

        return this.json(
            AuthSerializer.serialize({
                email: userDataResult.email,
            }),
        );
    }

    @httpPost('/signin')
    public async loginUser(@request() req: express.Request): Promise<JsonResult> {
        const userData: UserLoginModel = new UserLoginModel({ ...req.body });

        await this.baseService.validateData(userData);

        const userDataResult: DBUserDataDTO = await this.authService.authenticate(req.body);

        const access_token = await this.authService.generateToken(userDataResult, 'access_token', 3600);
        const refresh_token = await this.authService.generateToken(userDataResult, 'refresh_token', 86400);

        return this.json(
            AuthSerializer.serialize({
                name: userDataResult.name,
                email: userDataResult.email,

                access_token: access_token.token,
                refresh_token: refresh_token.token,
            }),
        );
    }

    @httpPost('/refresh')
    public async refreshToken(@request() req: express.Request): Promise<JsonResult | BadRequestErrorMessageResult> {
        const userToken: RefreshTokenModel = new RefreshTokenModel(req.body.refresh_token);

        await this.baseService.validateData(userToken);

        const tokenInDB = await this.authService.getTokenFromDB(userToken.refresh_token, 'refresh_token');

        const decodedToken = await this.authService.verifyToken(tokenInDB.token);

        const access_token = await this.authService.generateToken(decodedToken, 'access_token', 3600);
        const refresh_token = await this.authService.generateToken(decodedToken, 'refresh_token', 86400);

        return this.json(
            AuthSerializer.serialize({
                name: decodedToken.name,
                email: decodedToken.email,

                access_token: access_token.token,
                refresh_token: refresh_token.token,
            }),
        );
    }

    @httpDelete('/delete')
    public async delete(@queryParam('id') id: number): Promise<DeleteResult> {
        return this.authService.deleteUser(id);
    }

    @httpGet('/sendRequestToEmailVerification')
    public async sendRequestToEmailVerification(
        @queryParam('email') email: string,
    ): Promise<JsonResult> {
        const userEmail: EmailModel = new EmailModel({ email });
        await this.baseService.validateData(userEmail);

        const userDataResult = await this.userService.getUserByEmail(email);

        if (userDataResult.is_confirmed_email) throw new Error('Your email is already confirmed');

        const email_token = await this.authService.generateToken(userDataResult, 'email_token', 180);

        const letter = await ejs.renderFile(
            `${__dirname}/../views/email-verification.ejs`,
            {
                user_name: userDataResult.name,
                confirm_link: `${process.env.BACKEND_HOST}/auth/verificateEmail?token=${email_token.token}`,
                frontend_link: process.env.FRONTEND_HOST,
            },
        );

        await this.mailService.sendEmail(userDataResult.email, 'BLOG email verification ✔', letter);

        return this.json(
            AuthSerializer.serialize({
                email,
            }),
        );
    }

    @httpGet('/verificateEmail')
    public async verificateEmail(@queryParam('token') token: string): Promise<RedirectResult> {
        const tokenInDB = await this.authService.getTokenFromDB(token, 'email_token');

        const decodedToken = await this.authService.verifyToken(tokenInDB.token);

        await this.authService.confirmEmailVerificationInDB(decodedToken);

        return this.redirect(process.env.FRONTEND_HOST!);
    }

    @httpGet('/sendRequestToPasswordReset')
    public async sendRequestToPasswordReset(
        @queryParam('email') email: string,
    ): Promise<JsonResult> {
        const userEmail: EmailModel = new EmailModel({ email });
        await this.baseService.validateData(userEmail);

        const userDataResult = await this.userService.getUserByEmail(email);

        const password_token = await this.authService.generateToken(userDataResult, 'password_token', 180);

        const letter = await ejs.renderFile(
            `${__dirname}/../views/password-reset.ejs`,
            {
                user_name: userDataResult.name,
                confirm_link: `${process.env.FRONTEND_HOST}/auth/passwordReset?token=${password_token.token}`,
                frontend_link: process.env.FRONTEND_HOST,
            },
        );

        await this.mailService.sendEmail(userDataResult.email, 'BLOG password reset ✔', letter);

        return this.json(
            AuthSerializer.serialize({
                email,
            }),
        );
    }

    @httpPost('/passwordReset')
    public async passwordReset(@request() req: express.Request): Promise<JsonResult> {
        const userData: UserPasswordResetModel = new UserPasswordResetModel({ ...req.body });

        await this.baseService.validateData(userData);

        const tokenInDB = await this.authService.getTokenFromDB(req.body.token, 'password_token');

        const decodedToken = await this.authService.verifyToken(tokenInDB.token);

        await this.userService.update({
            id: decodedToken.id,
            email: decodedToken.email,
            password: userData.password,
        });

        return this.json(
            AuthSerializer.serialize({
                email: decodedToken.email,
            }),
        );
    }
}
