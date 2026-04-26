import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tableName: string;

  @Column()
  recordId: number;

  @Column()
  actionType: string; // CREATE, UPDATE, DELETE, RESTORE

  @Column({ nullable: true })
  fieldName: string;

  @Column('text', { nullable: true })
  oldValue: string;

  @Column('text', { nullable: true })
  newValue: string;

  @Column({ default: 0 })
  userId: number; // 0 for SYSTEM

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
