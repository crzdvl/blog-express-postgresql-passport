import { Container } from 'inversify';

import { TYPES } from './services/types';
import { UserService } from './services/user.service';

const container = new Container();

container.bind<UserService>(TYPES.UserService).to(UserService);

export default container;
