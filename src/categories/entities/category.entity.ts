import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Category, category => category.children, {
    nullable: true
  })
  parent?: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 'active' })
  status: string;
}
