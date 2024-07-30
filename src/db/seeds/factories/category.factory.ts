import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Category } from '../../../categories/entities/category.entity';

define(Category, () => {
  const category = new Category();
  category.name = faker.commerce.department();
  category.description = faker.lorem.sentence();
  console.log(`Creating category: ${category.name}`);
  return category;
});
