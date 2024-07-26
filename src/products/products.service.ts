import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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

  findAll() {
    return this.productRepository.find();
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

    // Save and return the updated product
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
  }
}
