import { IsString, IsNumber, IsPositive, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  productName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'Image path is required' })
  image: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: number;
}
