import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at?: string;
}
