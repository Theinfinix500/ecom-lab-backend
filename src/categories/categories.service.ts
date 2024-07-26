import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const parentCategory = createCategoryDto.parent
      ? await this.categoryRepository.findOne({
          where: { id: createCategoryDto.parent }
        })
      : null;

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      parent: parentCategory
    });

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['children', 'products']
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products']
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent']
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Prepare the updated data
    const { parent, ...updateData } = updateCategoryDto;

    // Fetch the parent category if a parent ID is provided
    const parentCategory = parent
      ? await this.categoryRepository.findOneBy({ id: parent })
      : null;

    // Merge the existing category with the updated data
    const updatedCategory = this.categoryRepository.merge(existingCategory, {
      ...updateData,
      parent: parentCategory // Assign the parent category entity
    });

    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
