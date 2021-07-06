import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { Posts } from '../entities/posts';

@injectable()
export class PostService {
  private repository: Repository<Posts>;

  constructor() {
      this.repository = getConnection().getRepository<Posts>('posts');
  }

  async getAll(page: number): Promise<Posts[]> {
      return this.repository.find({
          skip: page ? page * 5 : 0,
          take: 5,
      });
  }

  async getById(id: number): Promise<Posts | undefined> {
      return this.repository.findOne(id);
  }

  async create(data: Posts): Promise<Posts | undefined> {
      return this.repository.save(data);
  }

  async update(userData: DBUserDataDTO): Promise<Posts> {
      const hashedPassword = await bcrypt.hash(userData.password, 5);

      return this.repository.save({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
      });
  }

  async delete(id: number): Promise<string | any> {
      return this.repository.delete(id);
  }
}
