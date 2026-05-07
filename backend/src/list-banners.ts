import { DataSource } from 'typeorm';
import { Banner } from './banners/entities/banner.entity';

async function listBanners() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Banner],
    synchronize: false,
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(Banner);
  const banners = await repo.find();
  console.log(JSON.stringify(banners, null, 2));
  await dataSource.destroy();
}

listBanners();
