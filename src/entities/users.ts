import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
    JoinTable,
    ManyToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';

import { Roles } from './roles';
import { Tokens } from './tokens';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column()
    password: string;

    @Column()
    public is_confirmed_email: boolean;

    @ManyToMany(() => Roles, (role) => role.id, {
        cascade: true,
    })
    @JoinTable()
    roles: Roles[];

    @OneToMany(() => Tokens, (token) => token.id, {
        cascade: true,
    })
    tokens: Tokens[];

    @BeforeInsert()
    async setPassword(password: string) {
        this.password = await bcrypt.hash(password || this.password, 5);
    }
}
