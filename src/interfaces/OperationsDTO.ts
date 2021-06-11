import * as express from 'express';

import { Users } from '../entities/users';

export interface OperationsDTO<T> {
    update(req: express.Request): Promise<T>;
    find(page: number): Promise<T[]>;
    findOne(id: number): Promise<T>;
}
