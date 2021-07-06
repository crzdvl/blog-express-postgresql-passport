import express from 'express';
import { inject } from 'inversify';
import {
    controller, httpGet, httpPut, httpPost, httpDelete, queryParam, request,
} from 'inversify-express-utils';
import _ from 'lodash';
import { Comments } from 'src/entities/comments';

import { TYPES } from '../services/types';
import { CommentService } from '../services/comment.service';
import ValidationError from '../error/ValidationError';
import { BaseService } from '../services/base.service';
import CommentModel from '../models/commentModel';

@controller('/comments')
export class CommentController {
    @inject(TYPES.CommentService) declare public service: CommentService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpGet('/')
    public async find(@queryParam('page') page: number): Promise<Comments[]> {
        return this.service.getAll(page);
    }

    @httpGet('/findOne')
    public async findOne(@queryParam('id') id: number): Promise<Comments> {
        const commentDataResult = await this.service.getById(id);
        if (!commentDataResult) throw new ValidationError('comment hasn\'t been found');

        return commentDataResult;
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<Comments> {
        const commentData: CommentModel = new CommentModel(req.body);
        await this.baseService.validateData(commentData);

        const commentDataResult = await this.service.create(req.body);
        if (!commentDataResult) throw new ValidationError('comment hasn\'t been created');

        return commentDataResult;
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<Comments> {
        return this.service.update(req.body);
    }

    @httpDelete('/')
    public async delete(@request() req: express.Request): Promise<Comments> {
        return this.service.delete(req.body);
    }
}
