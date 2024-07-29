import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../../products/entities/product.entity';

define(Product, () => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.description = faker.lorem.paragraph();
  product.price = parseFloat(faker.commerce.price());
  product.stock = faker.datatype.number({ min: 1, max: 100 });
  product.images = [''];
  product.tags = [''];
  console.log(`Creating product: ${product.name}`);
  return product;
});
