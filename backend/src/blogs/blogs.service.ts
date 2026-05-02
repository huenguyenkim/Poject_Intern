import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async findAll() {
    return this.blogsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!blog) throw new NotFoundException('Blog post not found');
    return blog;
  }

  async findRelated(id: number) {
    const blog = await this.findOne(id);
    return this.blogsRepository.find({
      where: {
        category: blog.category,
        id: Not(id),
      },
      take: 3,
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: any) {
    const blog = this.blogsRepository.create(data);
    return this.blogsRepository.save(blog);
  }
}
