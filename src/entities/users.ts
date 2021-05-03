import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Roles } from './roles';

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
}
