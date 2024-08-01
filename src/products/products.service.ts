import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Between,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

export interface FindAllOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  globalFilter?: string;
  globalFilterFields?: string[];
  where?: { [key: string]: any };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const categories = await this.categoryRepository.findBy({
      id: In(createProductDto.categories)
    });

    if (categories.length !== createProductDto.categories.length) {
      throw new NotFoundException('Some categories not found');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      categories
    });

    return this.productRepository.save(product);
  }

  async findAll(options: FindAllOptions = {}): Promise<{
    data: Product[];
    count: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
      globalFilter = '',
      globalFilterFields = []
    } = options;
    let { where = {} } = options;

    if (globalFilter) {
      const filters = globalFilterFields.map(field => ({
        [field]: ILike(`%${globalFilter}%`)
      }));

      where = filters;
    }

    where = this.createWhereClause(where);

    const [data, count] = await this.productRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit
    });

    const totalPages = Math.ceil(count / limit);

    return { data, count, totalPages, currentPage: page };
  }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Fetch the existing product
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories']
    });

    // Handle case where the product does not exist
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Fetch categories from the database based on the IDs provided
    const categories = await this.categoryRepository.findBy({
      id: In(updateProductDto.categories)
    });

    // Check if all provided categories exist
    if (categories.length !== updateProductDto.categories.length) {
      throw new NotFoundException('Some categories not found');
    }

    // Update product fields
    this.productRepository.merge(product, {
      ...updateProductDto,
      categories // Assign the fetched categories
    });

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
  }

  private createWhereClause(filters: any): any {
    const where = [];
    for (const field in filters) {
      const { matchMode, value } = filters[field];
      if (!value) continue;

      if (field === 'price' || field === 'stock') {
        switch (matchMode) {
          case 'equals':
            where.push({ [field]: value });
            break;
          case 'gt':
            where.push({ [field]: MoreThan(value) });
            break;
          case 'lt':
            where.push({ [field]: LessThan(value) });
            break;
          case 'gte':
            where.push({ [field]: MoreThanOrEqual(value) });
            break;
          case 'lte':
            where.push({ [field]: LessThanOrEqual(value) });
            break;
          case 'range':
            if (value.min !== undefined && value.max !== undefined) {
              where.push({ [field]: Between(value.min, value.max) });
            }
            break;
        }
      } else {
        switch (matchMode) {
          case 'startsWith':
            where.push({ [field]: ILike(`${value}%`) });
            break;
          case 'contains':
            where.push({ [field]: ILike(`%${value}%`) });
            break;
          case 'notContains':
            where.push({ [field]: Not(ILike(`%${value}%`)) });
            break;
          case 'endsWith':
            where.push({ [field]: ILike(`%${value}`) });
            break;
          case 'equals':
            where.push({ [field]: value });
            break;
          case 'notEquals':
            where.push({ [field]: Not(value) });
            break;
        }
      }
    }
    return where.length > 0 ? where : {};
  }
}
