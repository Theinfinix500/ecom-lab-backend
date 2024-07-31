import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'ecommerce-lab',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsTableName: 'migrations',
      migrations: ['../src/migration/*.ts'],
      logging: true
    }),
    ProductsModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
