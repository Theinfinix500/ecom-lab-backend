import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  comparedPrice?: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsArray()
  @ArrayNotEmpty()
  categories: number[]; // Array of category IDs

  @IsArray()
  @ArrayNotEmpty()
  images: string[]; // Array of image URLs

  @IsArray()
  @ArrayNotEmpty()
  tags: string[]; // Array of tags
}
