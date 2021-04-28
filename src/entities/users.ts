import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public role: number;

  @Column()
  public is_confirmed_email: boolean;
}
