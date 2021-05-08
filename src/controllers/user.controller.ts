import {
    controller,
    httpGet,
} from 'inversify-express-utils';
import { Users } from '../entities/users';
import { BaseController } from './base.controller';

@controller('/user')
export class UserController extends BaseController<Users> {
    @httpGet('/user')
    public async user(): Promise<string> {
        return 'user';
    }
}
