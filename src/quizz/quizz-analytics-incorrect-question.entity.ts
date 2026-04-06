import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { QuizzAnalytics } from './quizz-analytics.entity';

@Entity({
  name: 'quizz_analytics_incorrect_questions',
})
export class QuizzAnalyticsIncorrectQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quizzAnalyticsId: number;

  @Column()
  questionId: number;

  @Column({ type: 'text' })
  questionText: string;

  @Column({ type: 'text' })
  userAnswerText: string;

  @Column({ type: 'text' })
  correctAnswerText: string;

  @Column()
  questionNumber: number;

  @ManyToOne(() => QuizzAnalytics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizzAnalyticsId' })
  quizzAnalytics: QuizzAnalytics;

  @CreateDateColumn()
  createdAt: Date;
}
