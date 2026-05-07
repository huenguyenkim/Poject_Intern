import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BannerPosition {
  HOME = 'home',
  SHOP = 'shop',
  CATEGORY = 'category',
  CHECKOUT = 'checkout',
  POPUP = 'popup'
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'image_pc_url' })
  imagePcUrl: string;

  @Column({ name: 'image_mobile_url', nullable: true })
  imageMobileUrl: string;

  @Column({ name: 'link_url', nullable: true })
  linkUrl: string;

  @Column({ name: 'start_date', type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ 
    type: 'simple-enum', 
    enum: BannerPosition, 
    default: BannerPosition.HOME 
  })
  position: BannerPosition;

  @Column({ name: 'priority', default: 0 })
  priority: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Analytics
  @Column({ name: 'impressions', default: 0 })
  impressions: number;

  @Column({ name: 'clicks', default: 0 })
  clicks: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
