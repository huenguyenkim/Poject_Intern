import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findOne(id);
  }

  @Get('related/:id')
  findRelated(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findRelated(id);
  }
}
