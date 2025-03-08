import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Answer } from './answer.entity';
import { Quizz } from './quizz.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string; // Texto da pergunta

  @ManyToOne(() => Quizz, (quizz) => quizz.questions, { onDelete: 'CASCADE' })
  quizz: Quizz; // A qual quiz essa pergunta pertence

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true, onDelete: 'CASCADE' })
  answers: Answer[];
}
