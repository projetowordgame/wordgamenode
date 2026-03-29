import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Quizz } from './quizz.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  quizzId: number;

  @Column({ type: 'int' })
  questionId: number;

  @Column({ type: 'int' })
  answerId: number; // ID da resposta que o usuário escolheu

  @Column({ type: 'boolean' })
  isCorrect: boolean; // Se a resposta estava correta

  @Column({ type: 'int', nullable: true })
  timeSpentInSeconds?: number; // Tempo gasto naquela pergunta específica

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Quando o quiz foi respondido

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Quizz, { onDelete: 'CASCADE' })
  quizz: Quizz;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => Answer, { onDelete: 'CASCADE' })
  answer: Answer;
}
