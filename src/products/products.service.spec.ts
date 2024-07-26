import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { mockRepository } from '../utils/test/mock-repository';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

describe('ProductsService', () => {
  let service: ProductsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: MockType<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockRepository
        },
        {
          provide: getRepositoryToken(Category),
          useFactory: mockRepository
        }
      ]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockType<Repository<Product>>>(
      getRepositoryToken(Product)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
