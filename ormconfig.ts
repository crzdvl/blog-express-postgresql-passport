export = {
    type: 'postgres',
    port: 5432,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: true,
    logging: true,
    entities: ['src/entities/*.ts'],
    seeds: ['database/seeds/*.ts'],
    factories: ['database/factories/*.ts'],
};
