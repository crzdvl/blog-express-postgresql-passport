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
import { Posts } from './posts';

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

    @OneToMany(() => Posts, (post) => post.id, {
        cascade: true,
    })
    posts: Posts[];

    @ManyToMany(() => Roles, (role) => role.id, {
        cascade: true,
    })
    @JoinTable({
        name: 'users_roles',
    })
    roles: Roles[];

    @OneToMany(() => Tokens, (token) => token.id, {
        cascade: true,
    })
    tokens: Tokens[];

    @BeforeInsert()
    async setPassword(password: string): Promise<void> {
        this.password = await bcrypt.hash(password || this.password, 5);
    }
}
