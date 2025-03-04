import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { User } from '../user/user.entity';

@Entity()
export class Quizz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Nome do quiz

  @ManyToOne(() => User, (user) => user.quizzes, { onDelete: 'CASCADE' })
  user: User; // Dono do quiz

  @OneToMany(() => Question, (question) => question.quizz, { cascade: true })
  questions: Question[];
}
