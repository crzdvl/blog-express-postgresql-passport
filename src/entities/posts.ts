import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
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
    blogger: Users;

    @Column()
    bloggerId: number;
}
