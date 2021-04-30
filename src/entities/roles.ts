import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

import { Users } from './users';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at?: string;
}
