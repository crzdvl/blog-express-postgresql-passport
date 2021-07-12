import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { CommentLikes } from '../entities/commentLikes';
import ValidationError from '../error/ValidationError';

@injectable()
export class CommentLikeService {
    private repository: Repository<CommentLikes>;

    constructor() {
        this.repository = getConnection().getRepository<CommentLikes>('commentLikes');
    }

    async getAll(page: number, per: number): Promise<CommentLikes[]> {
        return this.repository.find({
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getById(id: number): Promise<CommentLikes> {
        const result = await this.repository.findOne(id);
        if (!result) throw new ValidationError('like hasn\'t been found');

        return result;
    }

    async create(data: CommentLikes): Promise<CommentLikes> {
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
