import _ from 'lodash';
import { inject } from 'inversify';
import * as express from 'express';
import { DeleteResult } from 'typeorm';
import {
    controller,
    httpPost,
    request,
    BaseHttpController,
    httpDelete,
    queryParam,
} from 'inversify-express-utils';
import {
    JsonResult,
    BadRequestErrorMessageResult,
} from 'inversify-express-utils/dts/results';

import { TYPES } from '../services/types';
import { DBUserDataDTO } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@controller('/auth')
export class AuthController extends BaseHttpController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {
        super();
    }

    @httpPost('/register')
    public async create(@request() req: express.Request): Promise<JsonResult> {
        const userData: DBUserDataDTO = await this.authService.register(req.body);

        const access_token = await this.authService.generateToken(userData, 'access_token', 3600);
        const refresh_token = await this.authService.generateToken(userData, 'refresh_token', 86400);

        return this.json({
            userData: {
                name: userData.name,
                email: userData.email,
            },
            access_token: access_token.token,
            refresh_token: refresh_token.token,
        });
    }

    @httpPost('/login')
    public async loginUser(@request() req: express.Request): Promise<JsonResult> {
        const userData : DBUserDataDTO = await this.authService.authenticate(req.body);

        const access_token = await this.authService.generateToken(userData, 'access_token', 3600);
        const refresh_token = await this.authService.generateToken(userData, 'refresh_token', 86400);

        return this.json({
            userData: {
                name: userData.name,
                email: userData.email,
            },
            access_token: access_token.token,
            refresh_token: refresh_token.token,
        });
    }

    @httpPost('/refresh')
    public async refreshToken(@request() req: express.Request): Promise<JsonResult | BadRequestErrorMessageResult> {
        const token = req.body.refresh_token;

        const tokenInDB = await this.authService.getTokenFromDB(token, 'refresh_token');
        if (_.isUndefined(tokenInDB)) return this.badRequest('token isn\'t valid more');

        const decodedToken = await this.authService.verifyToken(token);

        const access_token = await this.authService.generateToken(decodedToken, 'access_token', 3600);
        const refresh_token = await this.authService.generateToken(decodedToken, 'refresh_token', 86400);

        return this.json({
            userData: {
                name: decodedToken.name,
                email: decodedToken.email,
            },
            access_token: access_token.token,
            refresh_token: refresh_token.token,
        });
    }

    @httpDelete('/delete')
    public async delete(@queryParam('id') id: number): Promise<DeleteResult> {
        return this.authService.deleteUser(id);
    }
}
