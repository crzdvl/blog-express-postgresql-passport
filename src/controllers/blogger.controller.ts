import {
    controller,
    httpGet,
} from 'inversify-express-utils';

import { Users } from '../entities/users';
import { BaseController } from './base.controller';

@controller('/blogger')
export class BloggerController extends BaseController<Users> {
    @httpGet('/blogger')
    public async blogger(): Promise<string> {
        return 'blogger';
    }
}
