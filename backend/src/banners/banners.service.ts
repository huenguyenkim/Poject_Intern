import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  findAll() {
    return this.bannerRepository.find();
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  create(data: Partial<Banner>) {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async update(id: number, data: Partial<Banner>) {
    await this.findOne(id);
    await this.bannerRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    return this.bannerRepository.remove(banner);
  }
}
