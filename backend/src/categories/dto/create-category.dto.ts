import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;
}
