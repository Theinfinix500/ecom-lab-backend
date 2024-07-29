export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'ecommerce-lab',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['../src/migration/*.ts'],
  seeds: ['src/db/seeds/**/*{.ts,.js}'],
  factories: ['src/db/seeds/factories/**/*{.ts,.js}']
};
