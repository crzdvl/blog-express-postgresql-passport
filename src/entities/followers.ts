import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    Column,
} from 'typeorm';
import { Posts } from './posts';
import { Users } from './users';

@Entity('followers')
export class Followers {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Users, (user) => user.id, {
        cascade: true,
    })

    @JoinColumn()
    user: number;

    @ManyToOne(() => Users, (user) => user.id, {
        cascade: true,
    })

    @JoinColumn()
    blogger: number;
}
