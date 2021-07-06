import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';

import { Users } from './users';

@Entity('posts')
export class Posts {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public subtitle: string;

    @Column()
    public text: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public created_at: string;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    user: Users;

    @Column()
    userId: number;
}
