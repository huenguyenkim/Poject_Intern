import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum QuestionType {
  TEXT = 'text',
  RATING = 'rating',
  RADIO = 'radio',
  CHECKBOX = 'checkbox'
}

@Entity('survey_questions')
export class SurveyQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({
    type: 'varchar',
    default: QuestionType.TEXT
  })
  type: QuestionType;

  @Column({ type: 'simple-array', nullable: true })
  options: string[];

  @Column({ default: false })
  required: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;
}
