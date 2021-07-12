import express from 'express';
import { inject } from 'inversify';
import {
    controller, httpGet, httpPut, httpPost, httpDelete, queryParam, request,
} from 'inversify-express-utils';
import _ from 'lodash';
import { Comments } from 'src/entities/comments';

import { TYPES } from '../services/types';
import { CommentService } from '../services/comment.service';
import { BaseService } from '../services/base.service';
import CommentModel from '../models/comment.model';

@controller('/comments')
export class CommentController {
    @inject(TYPES.CommentService) declare public service: CommentService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpGet('/')
    public async find(
        @queryParam('page') page: number,
        @queryParam('page') per: number,
    ): Promise<Comments[]> {
        return this.service.getAll(page, per);
    }

    @httpGet('/findOne')
    public findOne(@queryParam('id') id: number): Promise<Comments> {
        return this.service.getById(id);
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<Comments> {
        const commentData: CommentModel = new CommentModel(req.body);
        await this.baseService.validateData(commentData);

        return this.service.create(req.body);
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
