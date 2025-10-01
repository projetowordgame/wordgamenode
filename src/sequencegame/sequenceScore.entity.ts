import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class sequenceScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  sequenceId: number;

  @Column({ type: 'int' })
  correctAnswers: number;

  @Column({ type: 'int' })
  timeInSeconds: number; // Tempo total do quiz em segundos
}