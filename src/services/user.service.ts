import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
  DeleteResult,
  getConnection,
  Repository,
} from 'typeorm';

import { Users } from '../entities/users';
import { NewUser, UpdatedUser } from '../models/user.model';

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

  async getAllUsers(page: number): Promise<Users[]> {
    console.log(page, page !== undefined ? page : 0);
    return this.repository.find({
      skip: page !== undefined ? page * 5 : 0,
      take: 5,
    });
  }

  async getUserById(id: number): Promise<Users | undefined> {
    console.log(id);
    return this.repository.findOne(id);
  }

  async createUser(userData: NewUser): Promise<Users> {
    const hashedPassword = await bcrypt.hash(userData.password, 5);

    return this.repository.save({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      is_confirmed_email: false,
      roleId: userData.role,
    });
  }

  async updateUser(userData: UpdatedUser): Promise<Users> {
    const hashedPassword = await bcrypt.hash(userData.password, 5);

    return this.repository.save({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
  }

  async deleteUserById(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
