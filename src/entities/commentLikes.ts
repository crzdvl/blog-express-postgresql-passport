import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Comments } from './comments';
import { Users } from './users';

@Entity('commentLikes')
export class CommentLikes {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public created_at: string;

    @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
    user: Users;

    @Column()
    userId: number;

    @ManyToOne(() => Comments, (comment) => comment.id, {
        onDelete: 'CASCADE',
    })
    comment: Comments;

    @Column()
    commentId: number;
}
