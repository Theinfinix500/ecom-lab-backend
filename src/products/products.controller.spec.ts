import { Test, TestingModule } from '@nestjs/testing';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

export const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
};

describe('ProductsController', () => {
  let controller: ProductsController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService
        }
      ]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 1233,
        stock: 1,
        categories: [1],
        images: [],
        tags: [],
        comparedPrice: 2222
      };
      const result = { id: 1, ...createProductDto };

      mockProductsService.create.mockResolvedValue(result);

      expect(await controller.create(createProductDto)).toEqual(result);
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test Description',
          price: 100
        }
      ];

      mockProductsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockProductsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100
      };

      mockProductsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150
      };

      mockProductsService.update.mockResolvedValue(null);

      expect(await controller.update('1', updateProductDto)).toBeNull();
      expect(mockProductsService.update).toHaveBeenCalledWith(
        1,
        updateProductDto
      );
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue(null);

      expect(await controller.remove('1')).toBeNull();
      expect(mockProductsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
