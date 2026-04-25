import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Quizz } from './quizz.entity';

@Entity({
  name: 'quizz_analytics',
})
export class QuizzAnalytics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  playerName!: string;

  @Column()
  totalCorrect!: number;

  @Column()
  totalIncorrect!: number;

  @Column()
  totalQuestions!: number;

  @Column()
  timeInSeconds!: number;

  @Column()
  userId!: number;

  @Column()
  quizzId!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Quizz, { eager: true })
  @JoinColumn({ name: 'quizzId' })
  quizz!: Quizz;

  @CreateDateColumn()
  createdAt!: Date;
}
