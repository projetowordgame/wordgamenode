import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  quizzId: number;

  @Column()
  correctAnswers: number;

  @Column()
  timeInSeconds: number; // Tempo total do quiz em segundos
}

