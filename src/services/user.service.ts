import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { Users } from '../entities/users';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';

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

  async getAll(page: number): Promise<Users[]> {
      return this.repository.find({
          skip: page ? page * 5 : 0,
          take: 5,
      });
  }

  async getById(id: number): Promise<Users | undefined> {
      return this.repository.findOne(id);
  }

  async getUserByEmail(email: string): Promise<Users | undefined> {
      return this.repository.findOne({ email });
  }

  async update(userData: DBUserDataDTO): Promise<Users> {
      const hashedPassword = await bcrypt.hash(userData.password, 5);

      return this.repository.save({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
      });
  }
}
