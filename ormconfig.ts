export = {
  type: 'postgres',
  port: 5432,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false,
  logging: true,
  entities: ['src/entities/*.ts'],
  seeds: ['database/seeds/*.ts'],
  factories: ['database/factories/*.ts'],
};
