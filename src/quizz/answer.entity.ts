import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string; // Texto da resposta

  @Column({ default: false })
  isCorrect: boolean; // Indica se a resposta é correta

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question: Question;
}
