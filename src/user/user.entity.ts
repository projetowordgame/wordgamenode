import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quizz } from '../quizz/quizz.entity'; // Importando Quizz
import { SequenceGame } from '../sequencegame/sequence-game.entity'; // Importando sequence game
import { GallowGame } from 'src/gallowgame/gallow.entity';

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

  @Column({ default: 'aluno' }) // 🔹 Define aluno como padrão
  role: 'professor' | 'aluno'; // 🔹 Define o tipo de usuário

  @OneToMany(() => Quizz, (quizz) => quizz.user)
  quizzes: Quizz[]; // Relacionamento com os quizzes criados pelo usuário

  @OneToMany(() => SequenceGame, (game) => game.user)
  sequenceGames: SequenceGame[];

  @OneToMany(() => GallowGame, (gallow) => gallow.user)
  gallowGame: GallowGame[];
}
