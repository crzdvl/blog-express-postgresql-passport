import 'dotenv/config';

import { createConnection } from 'typeorm';

import { User } from '../enteties/user';

export async function getDbConnection() {
  const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } = process.env;
  const DATABASE_PORT = 5432;

  const entities = [User];

  const conn = await createConnection({
    type: 'postgres',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    synchronize: true,
    entities,
  });

  return conn;
}
