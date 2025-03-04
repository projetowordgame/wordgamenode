import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quizz } from '../quizz/quizz.entity'; // Importando Quizz

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Quizz, (quizz) => quizz.user)
  quizzes: Quizz[]; // Relacionamento com os quizzes criados pelo usuário
}
