import {
    controller,
    httpGet,
} from 'inversify-express-utils';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';

@controller('/admin')
export class AdminController extends BaseController<Users> {
    @httpGet('/admin')
    public async admin(): Promise<string> {
        return 'admin';
    }
}
