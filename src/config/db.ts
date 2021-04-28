import 'dotenv/config';

import { createConnection } from 'typeorm';

import { Users } from '../entities/users';

export async function getDbConnection() {
  const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD } = process.env;
  const DATABASE_PORT = 5432;

  const entities = [Users];

  const conn = await createConnection({
    type: 'postgres',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    synchronize: false,
    entities,
  });

  return conn;
}
