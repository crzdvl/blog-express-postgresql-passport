import { inject } from 'inversify';
import {
    controller, httpGet,
} from 'inversify-express-utils';

import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';

interface UserServiceDTO {
    getAll(page: number): Promise<Users[]>;
    getById(id: number): Promise<Users | undefined>;
    update(data: any): Promise<Users>;
}

@controller('/user')
export class UserController extends BaseController<UserServiceDTO> {
    @inject(TYPES.UserService) public service: UserService;

    @httpGet('/user')
    public async user(): Promise<string> {
        return 'user';
    }
}
