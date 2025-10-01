import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class gallowScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  gallowId: number;

  @Column({ type: 'int' })
  correctAnswers: number;

  @Column({ type: 'int' })
  timeInSeconds: number; // Tempo total do quiz em segundos
}