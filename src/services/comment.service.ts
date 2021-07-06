import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { Comments } from '../entities/comments';

@injectable()
export class CommentService {
  private repository: Repository<Comments>;

  constructor() {
      this.repository = getConnection().getRepository<Comments>('comments');
  }

  async getAll(page: number): Promise<Comments[]> {
      return this.repository.find({
          skip: page ? page * 5 : 0,
          take: 5,
      });
  }

  async getById(id: number): Promise<Comments | undefined> {
      return this.repository.findOne(id);
  }

  async create(data: Comments): Promise<Comments | undefined> {
      return this.repository.save(data);
  }

  async update(userData: DBUserDataDTO): Promise<Comments> {
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
