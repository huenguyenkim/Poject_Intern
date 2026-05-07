import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And, IsNull, Or } from 'typeorm';
import { Banner, BannerPosition } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async findAll(query?: { position?: BannerPosition; activeOnly?: boolean }) {
    const where: any = {};
    
    if (query?.position) {
      where.position = query.position;
    }

    if (query?.activeOnly) {
      where.isActive = true;
      const now = new Date();
      // Filter by date range: current time between start and end (or null)
      // Note: Simplified logic here, in production we might use more complex TypeORM queries
    }

    let banners = await this.bannerRepository.find({
      where,
      order: { priority: 'DESC', createdAt: 'DESC' }
    });

    if (query?.activeOnly) {
      const now = new Date();
      banners = banners.filter(b => {
        const startOk = !b.startDate || b.startDate <= now;
        const endOk = !b.endDate || b.endDate >= now;
        return startOk && endOk;
      });
    }

    return banners;
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async create(data: Partial<Banner>) {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async update(id: number, data: Partial<Banner>) {
    const banner = await this.findOne(id);
    Object.assign(banner, data);
    return this.bannerRepository.save(banner);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    return this.bannerRepository.remove(banner);
  }

  // Analytics logic
  async trackImpression(id: number) {
    return this.bannerRepository.increment({ id }, 'impressions', 1);
  }

  async trackClick(id: number) {
    return this.bannerRepository.increment({ id }, 'clicks', 1);
  }
}
