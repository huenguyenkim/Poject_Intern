import { DataSource } from 'typeorm';
import { Banner } from './banners/entities/banner.entity';

async function updateBanner() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Banner],
    synchronize: false,
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(Banner);
  
  // Find banner with "SPRING" in title
  const banner = await repo.createQueryBuilder('banner')
    .where('banner.title LIKE :title', { title: '%SPRING%' })
    .getOne();

  if (banner) {
    console.log(`Updating banner: ${banner.title} (ID: ${banner.id})`);
    banner.imagePcUrl = '/images/banners/spring-delights.png';
    banner.imageMobileUrl = '/images/banners/spring-delights.png'; // Use same for now
    await repo.save(banner);
    console.log('Update successful');
  } else {
    console.log('Banner not found, creating new one...');
    const newBanner = repo.create({
      title: 'SPRING DELIGHTS',
      imagePcUrl: '/images/banners/spring-delights.png',
      imageMobileUrl: '/images/banners/spring-delights.png',
      isActive: true,
      priority: 10,
      linkUrl: '/shop'
    });
    await repo.save(newBanner);
    console.log('Creation successful');
  }
  
  await dataSource.destroy();
}

updateBanner();
