import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { DeleteResult, getConnection, In, Repository } from 'typeorm';

import { date } from 'faker';
import _ from 'lodash';
import { Users } from '../entities/users';
import { Roles } from '../entities/roles';

import UserSignupModel from '../models/userSignup.model';
import UserLoginModel from '../models/userLogin.model';

import { Tokens, TokenType } from '../entities/tokens';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { JwtUserInfmDTO } from '../interfaces/JwtUserInfmDTO';

import { TYPES } from './types';
import { UserService } from './user.service';
import ValidationError from '../error/ValidationError';

@injectable()
export class AuthService {
    private tokensRepository: Repository<Tokens>;

    private rolesRepository: Repository<Roles>;

    private usersRepository: Repository<Users>;

    constructor(@inject(TYPES.UserService) private userService: UserService) {
        this.tokensRepository = getConnection().getRepository<Tokens>('tokens');
        this.rolesRepository = getConnection().getRepository<Roles>('roles');
        this.usersRepository = getConnection().getRepository<Users>('users');
    }

    async register(userData: UserSignupModel): Promise<Users> {
        const hashedPassword = await bcrypt.hash(userData.password, 5);

        const roles = await this.rolesRepository
            .find({
                where: { role: In(userData.roles) },
            });

        return this.usersRepository.save({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            is_confirmed_email: false,
            roles,
        });
    }

    async authenticate(userData: UserLoginModel): Promise<Users> {
        const userFound = await this.userService.getUserByEmail(userData.email);
        if (_.isUndefined(userFound)) throw new ValidationError('user with this email wasn\'t found');

        if (!userFound.is_confirmed_email) {
            throw new Error('You need to confirm your email first');
        }

        const passwordIsGood = await bcrypt.compare(userData.password, userFound.password);

        if (!passwordIsGood) {
            throw new ValidationError('Your password is incorrect');
        }

        return userFound;
    }

    async getTokenFromDB(token: string, type: TokenType): Promise<Tokens | undefined> {
        return this.tokensRepository.findOne({ token, type });
    }

    async generateToken(
        userData: DBUserDataDTO | JwtUserInfmDTO,
        type: TokenType,
        expiresIn: number,
    ): Promise<Tokens> {
        const token = jwt.sign({
            id: userData.id,
            email: userData.email,
            name: userData.name,
        },
            process.env.TOKEN_SECRET!, { expiresIn });

        // current time in ms + expires in coverted from s to ms
        const finished_at = new Date(new Date().getTime() + expiresIn * 1000).toISOString();

        return this.tokensRepository.save({
            type,
            token,
            userId: userData.id,
            finished_at,
        });
    }

    async verifyToken(token: string): Promise<string | any> {
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET!);
        await this.tokensRepository.delete({ token });

        return decoded;
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return this.usersRepository.delete(id);
    }

    async confirmEmailVerificationInDB(tokenData: Tokens): Promise<Users> {
        const user = await this.usersRepository.findOne(tokenData.userId);
        const updatedUser = Object.assign(user, tokenData.userId, { is_confirmed_email: true });

        return this.usersRepository.save(updatedUser);
    }
}
