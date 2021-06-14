import * as express from 'express';
import { injectable } from 'inversify';
import { httpGet, httpPut, queryParam, request } from 'inversify-express-utils';

// FIX: get rid of 'any' types
export interface BaseCrudService {
    getAll(page: number): Promise<any[]>;
    getById(id: number): Promise<any>;
    update(data: any): Promise<any>;
}

@injectable()
export abstract class BaseController<T extends BaseCrudService> {
    constructor(public service: T) {}

    @httpGet('/')
    public async find(@queryParam('page') page: number): Promise<T[]> {
        return this.service.getAll(page);
    }

    @httpGet('/findOne')
    public async findOne(@queryParam('id') id: number): Promise<T> {
        return this.service.getById(id);
    }

    @httpPut('/')
    public async update(@request() req: express.Request): Promise<T> {
        return this.service.update(req.body);
    }
}
