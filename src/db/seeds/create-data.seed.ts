import { Factory, Seeder } from 'typeorm-seeding';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

export default class CreateData implements Seeder {
  public async run(factory: Factory): Promise<any> {
    console.log('Seeding categories...');
    const categories = await factory(Category)().createMany(10);
    console.log('Seeding products...');
    await factory(Product)().createMany(50, { categories });
    console.log('Finished seeding.');
  }
}
