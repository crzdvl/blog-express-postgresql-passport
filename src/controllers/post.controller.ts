import express from 'express';
import { inject } from 'inversify';
import {
    controller, httpGet, httpPut, httpPost, httpDelete, queryParam, request,
} from 'inversify-express-utils';
import _ from 'lodash';
import { Posts } from '../entities/posts';

import { TYPES } from '../services/types';
import { PostService } from '../services/post.service';
import ValidationError from '../error/ValidationError';
import { BaseService } from '../services/base.service';
import PostModel from '../models/post.model';
import { UserService } from '../services/user.service';
import RequestOnComments from '../models/requestOnComments.model';
import { Comments } from '../entities/comments';

@controller('/posts')
export class PostController {
    @inject(TYPES.PostService) declare public service: PostService;

    @inject(TYPES.UserService) declare public userService: UserService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpGet('/')
    public async find(
        @queryParam('page') page: number,
        @queryParam('per') per: number,
    ): Promise<Posts[]> {
        return this.service.getAll(page, per);
    }

    @httpGet('/findOne')
    public async findOne(@queryParam('id') id: number): Promise<Posts> {
        return this.service.getById(id);
    }

    @httpPost('/getComments')
    public async getComments(@request() req: express.Request): Promise<Comments[]> {
        const commentsData: RequestOnComments = new RequestOnComments(req.body);
        await this.baseService.validateData(commentsData);

        const { id, page, per } = req.body;

        return this.service.getComments(id, page, per);
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<Posts> {
        const postData: PostModel = new PostModel(req.body);
        await this.baseService.validateData(postData);

        await this.userService.checkRoleOfMember(req.body.bloggerId, 'blogger');

        return this.service.create(req.body);
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<Posts> {
        return this.service.update(req.body);
    }

    @httpDelete('/')
    public async delete(@request() req: express.Request): Promise<Posts> {
        return this.service.delete(req.body);
    }
}
