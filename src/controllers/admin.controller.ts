import * as express from 'express';
import {
  controller,
  httpGet,
  httpPut,
  httpDelete,
  httpPost,
  request,
  queryParam,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { DeleteResult } from 'typeorm';

import { UserService } from '../services/user.service';
import { Users } from '../entities/users';
import { TYPES } from '../services/types';

@controller('/admin')
export class AdminController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  public async getUsers(): Promise<Users[]> {
    const allUsers: Users[] = await this.userService.getAllUsers();

    return allUsers;
  }

  @httpGet('/:id')
  public async getUserById(@queryParam('id') id: number): Promise<Users | undefined> {
    const user: Users | undefined = await this.userService.getUserById(id);

    return user;
  }

  @httpPost('/')
  public async createUser(@request() req: express.Request): Promise<Users> {
    const newUser: Users = await this.userService.createUser(req.body);

    return newUser;
  }

  @httpPut('/')
  public async updateUser(@request() req: express.Request): Promise<Users> {
    const updatedUser: Users = await this.userService.updateUser(req.body);

    return updatedUser;
  }

  @httpDelete('/')
  public async deleteUser(@queryParam('id') id: number): Promise<DeleteResult> {
    const deletedUser = await this.userService.deleteUserById(id);

    return deletedUser;
  }
}
