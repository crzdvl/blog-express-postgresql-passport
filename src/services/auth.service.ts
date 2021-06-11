import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { DeleteResult, getConnection, Repository } from 'typeorm';

import { Users } from '../entities/users';
import { Roles } from '../entities/roles';

import UserSignupModel from '../models/userSignup.model';
import UserLoginModel from '../models/userLogin.model';

import { Tokens, TokenType } from '../entities/tokens';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { JwtUserInfmDTO } from '../interfaces/JwtUserInfmDTO';

import { TYPES } from './types';
import { UserService } from './user.service';
import nodemailerTransporter from '../config/nodemailerTransporter';
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

        this.userService.getUserById(1);

        const userRoles = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const role of userData.roles) {
            userRoles.push(this.rolesRepository.findOneOrFail({ role }));
        }

        const roles = await this.rolesRepository
            .createQueryBuilder('roles')
            .where(':role in (:...roles)', { roles: userData.roles });

        if (roles.length !== userData.roles.length) {
            return; // blabla bla wrong role
        }

        return this.usersRepository.save({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            is_confirmed_email: false,
            roles: await Promise.all(userRoles),
        });
    }

    async authenticate(userData: UserLoginModel): Promise<Users> {
        const userFound = await this.userService.getUserByEmail(userData.email);

        if (!userFound.is_confirmed_email) {
            throw new ValidationError('You need to confirm your email first');
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

        return this.tokensRepository.save({
            type,
            token,
            userId: userData.id,
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
        const user = await this.usersRepository.findOneOrFail(tokenData.userId);
        const updatedUser = Object.assign(user, tokenData.userId, { is_confirmed_email: true });

        return this.usersRepository.save(updatedUser);
    }
}
