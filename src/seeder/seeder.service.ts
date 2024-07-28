import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async seed() {
    console.log('Seeding');
    await this.seedCategories();
    await this.seedProducts();
  }

  private async seedCategories() {
    const categories = Array.from({ length: 10 }).map(() => ({
      name: faker.commerce.department(),
      description: faker.lorem.sentence()
    }));

    for (const category of categories) {
      const categoryEntity = this.categoryRepository.create(category);
      await this.categoryRepository.save(categoryEntity);
    }
  }

  private async seedProducts() {
    const categories = await this.categoryRepository.find();
    const products = Array.from({ length: 50 }).map(() => ({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.datatype.number({ min: 1, max: 100 }),
      categories: [
        categories[
          faker.datatype.number({ min: 0, max: categories.length - 1 })
        ]
      ]
    }));

    for (const product of products) {
      const productEntity = this.productRepository.create(product);
      await this.productRepository.save(productEntity);
    }
  }
}
