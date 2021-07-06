import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { PostLikes } from '../entities/postLikes';

@injectable()
export class PostLikeService {
  private repository: Repository<PostLikes>;

  constructor() {
      this.repository = getConnection().getRepository<PostLikes>('postLikes');
  }

  async getAll(page: number): Promise<PostLikes[]> {
      return this.repository.find({
          skip: page ? page * 5 : 0,
          take: 5,
      });
  }

  async getById(id: number): Promise<PostLikes | undefined> {
      return this.repository.findOne(id);
  }

  async create(data: PostLikes): Promise<PostLikes | undefined> {
      return this.repository.save(data);
  }

  async update(userData: DBUserDataDTO): Promise<PostLikes> {
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
