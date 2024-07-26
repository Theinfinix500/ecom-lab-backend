import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'ecommerce-lab',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrationsTableName: 'migrations',
  migrations: ['./src/migration/*.ts']
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization:', err);
  });
