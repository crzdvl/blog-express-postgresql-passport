import { inject } from 'inversify';
import {
    controller, httpGet,
} from 'inversify-express-utils';

import { TYPES } from '../services/types';
import { UserService } from '../services/user.service';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';

interface BloggerServiceDTO {
    getAll(page: number, per: number): Promise<Users[]>;
    getById(id: number): Promise<Users | undefined>;
    update(data: any): Promise<Users>;
}

@controller('/blogger')
export class BloggerController extends BaseController<BloggerServiceDTO> {
    @inject(TYPES.UserService) declare public service: UserService;

    @httpGet('/blogger')
    public async blogger(): Promise<string> {
        return 'blogger';
    }
}
