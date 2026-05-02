import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'simple-enum',
    enum: ['ORDER', 'SYSTEM', 'TASK', 'MESSAGE'],
    default: 'SYSTEM',
  })
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: number;

  @Column({ nullable: true })
  senderId: number;

  @Column({ nullable: true })
  relatedId: string; // Order UUID or Task ID
}
