import { injectable } from 'inversify';
import { getConnection, Repository } from 'typeorm';

import { User } from '../enteties/user';

export interface IUser {
  email: string;
  name: string;
}

@injectable()
export class UserService {
  private repository: Repository<User>;

  constructor() {
    this.repository = getConnection().getRepository<User>('users');
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.find();
  }
}
