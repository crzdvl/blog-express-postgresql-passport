import express from 'express';
import { inject } from 'inversify';
import {
    controller, httpGet, httpPut, httpPost, httpDelete, queryParam, request,
} from 'inversify-express-utils';

import { TYPES } from '../services/types';
import { BaseService } from '../services/base.service';
import { PostLikeService } from '../services/postLike.service';
import { CommentLikeService } from '../services/commentLike.service';

import { PostLikes } from '../entities/postLikes';
import { CommentLikes } from '../entities/commentLikes';

import LikeModel from '../models/like.model';

@controller('/likes')
export class LikeController {
    @inject(TYPES.CommentLikeService) declare public commentLikeService: CommentLikeService;

    @inject(TYPES.PostLikeService) declare public postLikeService: PostLikeService;

    @inject(TYPES.BaseService) public baseService: BaseService;

    @httpGet('/')
    public async find(
        @queryParam('page') page: number,
        @queryParam('per') per: number,
        @queryParam('type') type: 'comment' | 'post',
    ): Promise<PostLikes[] | CommentLikes[]> {
        if (type === 'comment') return this.commentLikeService.getAll(page, per);

        return this.postLikeService.getAll(page, per);
    }

    @httpGet('/findOne')
    public async findOne(
        @queryParam('id') id: number,
        @queryParam('type') type: 'comment' | 'post',
    ): Promise<PostLikes | CommentLikes> {
        let likeDataResult: CommentLikes;

        if (type === 'comment') {
            likeDataResult = await this.commentLikeService.getById(id);
        } else likeDataResult = await this.commentLikeService.getById(id);

        return likeDataResult;
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<PostLikes | CommentLikes> {
        const likeModel: LikeModel = new LikeModel(req.body);
        await this.baseService.validateData(likeModel);

        if (req.body.type === 'comment') {
            return this.commentLikeService.create(req.body);
        }

        return this.postLikeService.create(req.body);
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<PostLikes | CommentLikes> {
        const likeModel: LikeModel = new LikeModel(req.body);
        await this.baseService.validateData(likeModel);

        if (req.body.type === 'comment') {
            return this.commentLikeService.update(req.body);
        }

        return this.postLikeService.update(req.body);
    }

    @httpDelete('/')
    public async delete(@request() req: express.Request): Promise<PostLikes | CommentLikes> {
        if (req.body.type === 'comment') {
            return this.commentLikeService.delete(req.body);
        }
        return this.postLikeService.delete(req.body);
    }
}
