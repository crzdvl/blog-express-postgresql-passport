import { createConnection } from 'typeorm';

import { Users } from '../entities/users';
import { Roles } from '../entities/roles';
import { Tokens } from '../entities/tokens';
import { Posts } from '../entities/posts';
import { Comments } from '../entities/comments';
import { PostLikes } from '../entities/postLikes';
import { CommentLikes } from '../entities/commentLikes';

export async function getDbConnection() {
    const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
    const DATABASE_PORT = 5432;

    const entities = [Users, Roles, Tokens, Posts, Comments, PostLikes, CommentLikes];

    const conn = await createConnection({
        type: 'postgres',
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_NAME,
        synchronize: true,
        entities,
    });

    return conn;
}
