import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    BeforeInsert,
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

  @ManyToOne(() => Roles, (role) => role.id)
  role: Roles;

  @Column()
  public roleId: number;

  @OneToMany(() => Tokens, (token) => token.id, {
      cascade: true,
  })
  tokens: Tokens[];

  @BeforeInsert()
  async setPassword(password: string) {
      this.password = await bcrypt.hash(password || this.password, 5);
  }
}
