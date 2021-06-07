import * as express from 'express';
import { inject, injectable } from 'inversify';
import {
    httpGet,
    httpPut,
    request,
    queryParam,
} from 'inversify-express-utils';

import { TYPES } from '../services/types';
import { Users } from '../entities/users';
import { UserService } from '../services/user.service';
import { OperationsDTO } from '../interfaces/OperationsDTO';

@injectable()
export abstract class BaseController<T> implements OperationsDTO<T> {
    @inject(TYPES.UserService) public userService: UserService;

    @httpGet('/')
    public async find(@queryParam('page') page: number): Promise<Users[]> {
        return this.userService.getAllUsers(page);
    }

    @httpGet('/findOne')
    public async findOne(@queryParam('id') id: number): Promise<Users> {
        return this.userService.getUserById(id);
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<Users> {
        return this.userService.updateUser(req.body);
    }
}
