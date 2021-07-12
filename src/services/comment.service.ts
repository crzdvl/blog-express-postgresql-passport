import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { Comments } from '../entities/comments';
import ValidationError from '../error/ValidationError';

@injectable()
export class CommentService {
    private repository: Repository<Comments>;

    constructor() {
        this.repository = getConnection().getRepository<Comments>('comments');
    }

    async getAll(page: number, per: number): Promise<Comments[]> {
        return this.repository.find({
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getById(id: number): Promise<Comments> {
        const result = await this.repository.findOne(id);
        if (!result) throw new ValidationError('comment hasn\'t been found');

        return result;
    }

    async create(data: Comments): Promise<Comments> {
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
