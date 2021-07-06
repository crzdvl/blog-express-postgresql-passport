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
import PostModel from '../models/postModel';

@controller('/posts')
export class PostController {
    @inject(TYPES.PostService) declare public service: PostService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpGet('/')
    public async find(@queryParam('page') page: number): Promise<Posts[]> {
        return this.service.getAll(page);
    }

    @httpGet('/findOne')
    public async findOne(@queryParam('id') id: number): Promise<Posts> {
        const postDataResult = await this.service.getById(id);
        if (!postDataResult) throw new ValidationError('post hasn\'t been found');

        return postDataResult;
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<Posts> {
        const postData: PostModel = new PostModel(req.body);
        await this.baseService.validateData(postData);

        const postDataResult = await this.service.create(req.body);
        if (!postDataResult) throw new ValidationError('post hasn\'t been created');

        return postDataResult;
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
