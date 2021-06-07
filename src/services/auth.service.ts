import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { DeleteResult, getConnection, Repository } from 'typeorm';

import { Users } from '../entities/users';
import { Roles } from '../entities/roles';

import { UserModel } from '../models/user.model';
import { Tokens, TokenType } from '../entities/tokens';
import { DBUserDataDTO } from '../interfaces/DBUserDataDTO';
import { JwtUserInfmDTO } from '../interfaces/JwtUserInfmDTO';

import { TYPES } from './types';
import { UserService } from './user.service';

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

    async register(userData: UserModel): Promise<Users> {
        const hashedPassword = await bcrypt.hash(userData.password, 5);

        const userRoles = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const role of userData.roles) {
            userRoles.push(this.rolesRepository.findOneOrFail({ role }));
        }

        return this.usersRepository.save({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            is_confirmed_email: false,
            roles: await Promise.all(userRoles),
        });
    }

    async authenticate(userData: UserModel): Promise<Users> {
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

    async sendVerificationEmail(email: string): Promise<DeleteResult> {
        const { data } = await axios.post('https://api.sendgrid.com/v3/mail/send', {
            headers: {
                'Authorization: Bearer': '<<YOUR_API_KEY>>',
                'Content- Type': 'application/jso\'n',
            },
            params: {
                personalizations: [
                    {
                        to: [
                            {
                                email: 'john.doe@example.com', name: 'John Doe',
                            }],
                        subject: 'Hello, World!',
                    }],
                content: [{ type: 'text/plain', value: 'Heya!' }],
                from: { email: 'sam.smith@example.com', name: 'Sam Smith' },
                reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
            },
        });

        return data || 'ok';
    }
}
