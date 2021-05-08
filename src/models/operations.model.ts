import * as express from 'express';
import { Users } from 'src/entities/users';
import { DeleteResult } from 'typeorm';

export interface OperationsDTO<> {
  create(req: express.Request): Promise<Users>;
  update(req: express.Request): Promise<Users>;
  delete(id: number): Promise<DeleteResult>;
  find(page: number): Promise<Users[]>;
  findOne(id: number): Promise<Users>;
}
