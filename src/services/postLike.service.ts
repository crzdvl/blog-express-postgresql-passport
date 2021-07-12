import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { PostLikes } from '../entities/postLikes';
import ValidationError from '../error/ValidationError';

@injectable()
export class PostLikeService {
    private repository: Repository<PostLikes>;

    constructor() {
        this.repository = getConnection().getRepository<PostLikes>('postLikes');
    }

    async getAll(page: number, per: number): Promise<PostLikes[]> {
        return this.repository.find({
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getById(id: number): Promise<PostLikes> {
        const result = await this.repository.findOne(id);
        if (!result) throw new ValidationError('like hasn\'t been found');

        return result;
    }

    async create(data: PostLikes): Promise<PostLikes> {
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
