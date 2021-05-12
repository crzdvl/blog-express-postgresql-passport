import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import {
    DeleteResult,
    getConnection,
    Repository,
} from 'typeorm';
import bcrypt from 'bcrypt';

import { TYPES } from './types';
import { Users } from '../entities/users';
import { UserService } from './user.service';
import { Tokens, TokenType } from '../entities/tokens';
import { UserDataDTO, DBUserDataDTO, JwtUserInfmDTO } from '../models/user.model';

@injectable()
export class AuthService {
    private tokensRepository: Repository<Tokens>;

    private usersRepository: Repository<Users>;

    constructor(@inject(TYPES.UserService) private userService: UserService) {
        this.tokensRepository = getConnection().getRepository<Tokens>('tokens');
        this.usersRepository = getConnection().getRepository<Users>('users');
    }

    async register(userData: UserDataDTO): Promise<Users> {
        const hashedPassword = await bcrypt.hash(userData.password, 5);

        return this.usersRepository.save({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            is_confirmed_email: false,
            roleId: userData.role,
        });
    }

    async authenticate(userData: UserDataDTO): Promise<Users> {
        const userFound = await this.userService.getUserByEmail(userData.email);

        const passwordIsGood = await bcrypt.compare(userData.password, userFound.password);

        if (!passwordIsGood) {
            throw new Error('Bad Password');
        }

        return userFound;
    }

    async getTokenFromDB(token: string, type: TokenType): Promise<Tokens> {
        return this.tokensRepository.findOneOrFail({ token, type });
    }

    async generateToken(
        userData: DBUserDataDTO | JwtUserInfmDTO,
        type: TokenType,
        expiresIn: number,
    ): Promise<Tokens> {
        const token = jwt.sign({
            id: userData.id,
            email: userData.email,
            name: userData.name },
        process.env.TOKEN_SECRET!, { expiresIn });

        return this.tokensRepository.save({
            type,
            token,
            userId: userData.id,
        });
    }

    async verifyToken(token: string): Promise<string | any> {
        try {
            const decoded = await jwt.verify(token, process.env.TOKEN_SECRET!);
            await this.tokensRepository.delete({ token });

            return decoded;
        } catch (err) {
            await this.tokensRepository.delete({ token });
            return err;
        }
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return this.usersRepository.delete(id);
    }
}
