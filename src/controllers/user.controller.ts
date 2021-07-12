import { inject } from 'inversify';
import {
    controller, httpPost, request,
} from 'inversify-express-utils';

import express from 'express';
import { UserFeedDTO } from 'src/interfaces/UserFeedDTO';
import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';
import { BaseService } from '../services/base.service';
import FollowModel from '../models/follow.model';
import { Followers } from '../entities/followers';

interface UserServiceDTO {
    getAll(page: number, per: number): Promise<Users[]>;
    getById(id: number): Promise<Users | undefined>;
    update(data: any): Promise<Users>;
}

@controller('/user')
export class UserController extends BaseController<UserServiceDTO> {
    @inject(TYPES.UserService) declare public service: UserService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpPost('/startToFollow')
    public async startToFollow(@request() req: express.Request): Promise<Followers> {
        const data: FollowModel = new FollowModel({ ...req.body });
        await this.baseService.validateData(data);

        await this.service.checkRoleOfMember(req.body.bloggerId, 'blogger');
        await this.service.checkRoleOfMember(req.body.userId, 'user');

        return this.service.create(req.body.bloggerId, req.body.userId);
    }

    @httpPost('/feed')
    public async feed(@request() req: express.Request): Promise<UserFeedDTO[]> {
        await this.service.checkRoleOfMember(req.body.userId, 'user');

        return this.service.getFeed(req.body.userId);
    }
}
