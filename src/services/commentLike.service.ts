import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { CommentLikes } from '../entities/commentLikes';

@injectable()
export class CommentLikeService {
  private repository: Repository<CommentLikes>;

  constructor() {
      this.repository = getConnection().getRepository<CommentLikes>('commentLikes');
  }

  async getAll(page: number): Promise<CommentLikes[]> {
      return this.repository.find({
          skip: page ? page * 5 : 0,
          take: 5,
      });
  }

  async getById(id: number): Promise<CommentLikes | undefined> {
      return this.repository.findOne(id);
  }

  async create(data: CommentLikes): Promise<CommentLikes | undefined> {
      return this.repository.save(data);
  }

  async update(userData: DBUserDataDTO): Promise<CommentLikes> {
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
