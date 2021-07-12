import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { UserFeedDTO } from 'src/interfaces/UserFeedDTO';
import ValidationError from '../error/ValidationError';
import { Users } from '../entities/users';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { Followers } from '../entities/followers';
import { Posts } from '../entities/posts';

export interface IUser {
  email: string;
  name: string;
}

@injectable()
export class UserService {
    private userRepository: Repository<Users>;

    private followersRepository: Repository<Followers>;

    constructor() {
        this.userRepository = getConnection().getRepository<Users>('users');
        this.followersRepository = getConnection().getRepository<Followers>('followers');
    }

    async getAll(page: number, per: number): Promise<Users[]> {
        return this.userRepository.find({
            skip: page ? page * per : 0,
            take: per,
        });
    }

    async getById(id: number): Promise<Users | undefined> {
        return this.userRepository.findOne(id);
    }

    async getUserByEmail(email: string): Promise<Users> {
        const result = await this.userRepository.findOne({ email });

        if (!result) throw new ValidationError('we don\'t have account in database with this email');

        return result;
    }

    async update(userData: DBUserDataDTO): Promise<Users> {
        const hashedPassword = await bcrypt.hash(userData.password, 5);

        return this.userRepository.save({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        });
    }

    async create(blogger: number, user: number): Promise<Followers> {
        return this.followersRepository.save({
            blogger,
            user,
        });
    }

    async checkRoleOfMember(id: number, role: 'blogger' | 'user'): Promise<boolean> {
        const user = await this.userRepository
            .createQueryBuilder('users')
            .where('users.id = :id', { id })
            .leftJoin('users.roles', 'roles')
            .leftJoinAndSelect('users.roles', 'rolesSelect')
            .getOne();

        if (!user) throw new Error('member hasn\'t been found or doesn\'t have appropriate role');

        return user.roles.some((e) => e.role === role) || false;
    }

    getFeed(id: number): Promise<UserFeedDTO[]> {
        return this.followersRepository
            .createQueryBuilder('followers')
            .where('followers.user = :id', { id })
            .innerJoin(Posts, 'post', 'post.bloggerId = followers.blogger')
            .select([
                'followers.blogger',
                'post.id',
                'post.title',
                'post.subtitle',
                'post.text',
                'post.created_at',
            ])
            .getRawMany();
    }
}
