import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
    httpGet,
    httpPut,
    httpDelete,
    httpPost,
    request,
    queryParam,
    controller,
} from 'inversify-express-utils';
import { DeleteResult } from 'typeorm';
import { UserService } from '../services/user.service';
import { TYPES } from '../services/types';
import { Users } from '../entities/users';

import { OperationsDTO } from '../models/operations.model';

@injectable()
export abstract class BaseController<T> implements OperationsDTO<T> {
    constructor(@inject(TYPES.UserService) public userService: UserService) {}

    @httpGet('/')
    public async find(@queryParam('page') page: number): Promise<Users[]> {
        return this.userService.getAllUsers(page);
    }

    @httpGet('/:id')
    public async findOne(@queryParam('id') id: number): Promise<Users> {
        return this.userService.getUserById(id);
    }

    @httpPost('/')
    public async create(@request() req: express.Request): Promise<Users> {
        return this.userService.createUser(req.body);
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<Users> {
        return this.userService.updateUser(req.body);
    }

    @httpDelete('/')
    public async delete(@queryParam('id') id: number): Promise<DeleteResult> {
        return this.userService.deleteUserById(id);
    }
}
