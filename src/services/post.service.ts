import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { Posts } from '../entities/posts';
import ValidationError from '../error/ValidationError';
import { Comments } from '../entities/comments';

@injectable()
export class PostService {
    private repository: Repository<Posts>;

    private commentsRepository: Repository<Comments>;

    constructor() {
        this.repository = getConnection().getRepository<Posts>('posts');
        this.commentsRepository = getConnection().getRepository<Comments>('comments');
    }

    async getAll(page: number, per: number): Promise<Posts[]> {
        return this.repository.find({
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getComments(postId: number, page: number, per: number): Promise<Comments[]> {
        return this.commentsRepository.find({
            where: {
                postId,
            },
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getById(id: number): Promise<Posts> {
        const result = await this.repository.findOne(id);

        if (!result) throw new ValidationError('post hasn\'t been found');

        return result;
    }

    async create(data: Posts): Promise<Posts> {
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
