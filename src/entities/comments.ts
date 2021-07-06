import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { Posts } from './posts';
import { Users } from './users';

@Entity('comments')
export class Comments {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public message: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public created_at: string;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    user: Users;

    @Column()
    userId: number;

    @ManyToOne(() => Posts, (post) => post.id, { onDelete: 'CASCADE' })
    post: Posts;

    @Column()
    postId: number;
}
