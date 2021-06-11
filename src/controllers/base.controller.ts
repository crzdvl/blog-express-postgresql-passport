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

interface BaseCrudService {
    find(page: any): any;
    update(id: any): any;
    tratata(payload: any): any;
}

export abstract class BaseController<T extends BaseCrudService> implements OperationsDTO<T> {
    constructor(private service: T) {
    }

    public async find(page: number): Promise<T[]> {
        return this.service.find(page);
    }

    public async findOne(id: number): Promise<T> {
        return this.service.update(id);
    }

    public async update(@request() req: express.Request): Promise<T> {
        return this.service.tratata(req.body);
    }
}
