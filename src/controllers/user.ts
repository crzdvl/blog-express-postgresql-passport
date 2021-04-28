import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserService } from '../services/user.service';
import { Users } from '../entities/users';
import { TYPES } from '../services/types';

@controller('/user')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @httpGet('/')
  public async getUsers(): Promise<any[]> {
    console.log(1);
    const allUsers: Users[] = await this.userService.getAllUsers();

    return allUsers;
  }
}
