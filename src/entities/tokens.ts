import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';

import { Users } from './users';

export type TokenType = 'access_token' | 'refresh_token' | 'email_token';

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
      type: 'enum',
      enum: ['access_token', 'refresh_token', 'email_token'],
  })
  public type: TokenType;

  @Column()
  public token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: string;

  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  user: Users;

  @Column()
  userId: number;
}
