import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type UserRoleType = 'admin' | 'blogger' | 'user';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'enum',
    enum: ['admin', 'blogger', 'user'],
    default: 'user',
  })
  public role: UserRoleType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at?: string;
}
