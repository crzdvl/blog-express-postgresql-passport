import * as express from 'express';

import { Users } from '../entities/users';

export interface OperationsDTO<T> {
  update(req: express.Request): Promise<Users>;
  find(page: number): Promise<Users[]>;
  findOne(id: number): Promise<Users>;
}
