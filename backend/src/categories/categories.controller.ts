import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseInterceptors, Query, ParseBoolPipe } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query('tree', new ParseBoolPipe({ optional: true })) tree?: boolean) {
    return this.categoriesService.findAll(tree);
  }

  @Get('overview')
  getOverview() {
    return this.categoriesService.getOverview();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Query('force', new ParseBoolPipe({ optional: true })) force?: boolean
  ) {
    return this.categoriesService.remove(+id, force);
  }
}
