import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('globalFilter') globalFilter: string = '',
    @Query('globalFilterFields') globalFilterFields: string = '',
    @Query() query: { [key: string]: any }
  ): Promise<{
    data: Product[];
    count: number;
    totalPages: number;
    currentPage: number;
  }> {
    const where = { ...query };
    delete where.page;
    delete where.limit;
    delete where.sort;
    delete where.order;
    delete where.globalFilter;
    delete where.globalFilterFields;

    for (const filter in where) {
      where[filter] = JSON.parse(where[filter]);
    }

    return this.productsService.findAll({
      page,
      limit,
      sort,
      order,
      globalFilter,
      globalFilterFields: globalFilterFields.split(','),
      where
    });
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.productsService.findOne(id);
  }

  // TODO should validate request body @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.productsService.remove(id);
  }
}
