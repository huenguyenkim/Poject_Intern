import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'link_url', nullable: true })
  linkUrl: string;

  @Column({ name: 'end_date', nullable: true })
  endDate: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
