import { inject } from 'inversify';
import {
    controller, httpGet,
} from 'inversify-express-utils';

import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';

interface AdminServiceDTO {
    getAll(page: number): Promise<Users[]>;
    getById(id: number): Promise<Users | undefined>;
    update(data: any): Promise<Users>;
}

@controller('/admin')
export class AdminController extends BaseController<AdminServiceDTO> {
    @inject(TYPES.UserService) public service: UserService;

    @httpGet('/admin')
    public async admin(): Promise<string> {
        return 'admin';
    }
}
