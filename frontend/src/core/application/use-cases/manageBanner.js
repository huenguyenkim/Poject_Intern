import { bannerRepository } from '../../../data/repositories/bannerRepository';

/**
 * Get Banners Use Case
 */
export class GetBanners {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    return this.repository.getBanners();
  }
}

/**
 * Create Banner Use Case
 */
export class CreateBanner {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    return this.repository.createBanner(data);
  }
}

/**
 * Update Banner Use Case
 */
export class UpdateBanner {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data) {
    return this.repository.updateBanner(id, data);
  }
}

/**
 * Delete Banner Use Case
 */
export class DeleteBanner {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    return this.repository.deleteBanner(id);
  }
}

export const getBannersUseCase = new GetBanners(bannerRepository);
export const createBannerUseCase = new CreateBanner(bannerRepository);
export const updateBannerUseCase = new UpdateBanner(bannerRepository);
export const deleteBannerUseCase = new DeleteBanner(bannerRepository);
