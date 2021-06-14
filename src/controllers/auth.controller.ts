import _ from 'lodash';
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
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';
import { MailService } from '../services/mail.service';

import ValidationError from '../error/ValidationError';
import { AuthSerializer } from '../config/jsonApiSerializer';

@controller('/auth')
export class AuthController extends BaseHttpController {
    @inject(TYPES.AuthService) private authService: AuthService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @inject(TYPES.MailService) public mailService: MailService;

    @httpPost('/signup')
    public async create(@request() req: express.Request): Promise<JsonResult> {
        const userData: UserSignupModel = new UserSignupModel({ ...req.body });

        const error = await this.baseService.validateData(userData);
        if (!_.isNull(error)) throw new ValidationError(error);

        const userDataResult: DBUserDataDTO = await this.authService.register(req.body);

        const email_token = await this.authService.generateToken(userDataResult, 'email_token', 180);
        await this.mailService.sendEmailVerification(userDataResult.email, email_token.token);

        return this.json(
            AuthSerializer.serialize({
                name: userDataResult.name,
                email: userDataResult.email,
            }),
        );
    }

    @httpPost('/signin')
    public async loginUser(@request() req: express.Request): Promise<JsonResult> {
        const userData: UserLoginModel = new UserLoginModel({ ...req.body });

        const error = await this.baseService.validateData(userData);
        if (!_.isNull(error)) throw new ValidationError(error);

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

        const error = await this.baseService.validateData(userToken);
        if (!_.isNull(error)) throw new ValidationError(error);

        const tokenInDB = await this.authService.getTokenFromDB(userToken.refresh_token, 'refresh_token');
        if (_.isUndefined(tokenInDB)) throw new ValidationError('token isn\'t valid more');

        const decodedToken = await this.authService.verifyToken(userToken.refresh_token);

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

    @httpGet('/verificateEmail')
    public async verificateEmail(@queryParam('token') token: string): Promise<RedirectResult> {
        const tokenInDB = await this.authService.getTokenFromDB(token, 'email_token');
        if (_.isUndefined(tokenInDB)) throw new ValidationError('token isn\'t valid more');

        const decodedToken = await this.authService.verifyToken(token);
        await this.authService.confirmEmailVerificationInDB(decodedToken);

        return this.redirect(process.env.FRONTEND_HOST!);
    }
}
