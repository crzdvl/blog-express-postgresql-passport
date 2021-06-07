import { Container } from 'inversify';

import { TYPES } from './services/types';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { BaseService } from './services/base.service';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<BaseService>(TYPES.BaseService).to(BaseService);

export default container;
