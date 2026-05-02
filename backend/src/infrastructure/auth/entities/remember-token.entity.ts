import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity('remember_tokens')
export class RememberToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  selector: string;

  @Column()
  validatorHash: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
