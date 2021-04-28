import { injectable } from 'inversify';
import { getConnection, Repository } from 'typeorm';

import { Users } from '../entities/users';

export interface IUser {
  email: string;
  name: string;
}

@injectable()
export class UserService {
  private repository: Repository<Users>;

  constructor() {
    this.repository = getConnection().getRepository<Users>('users');
  }

  async getAllUsers(): Promise<Users[]> {
    return this.repository.find();
  }
}
