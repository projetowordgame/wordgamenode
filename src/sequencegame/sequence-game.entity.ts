import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { SequenceCard } from './sequence-card.entity';
import { User } from '../user/user.entity';

@Entity('sequence_games')
export class SequenceGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  introduction_text: string;

  // 👇 associação com usuário criador
  @ManyToOne(() => User, (user) => user.sequenceGames, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => SequenceCard, (card) => card.game, { cascade: true })
  cards: SequenceCard[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
