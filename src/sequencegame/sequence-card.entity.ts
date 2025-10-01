// sequence-card.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { SequenceGame } from './sequence-game.entity';

@Entity('sequence_cards')
export class SequenceCard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SequenceGame, (game) => game.cards, { onDelete: 'CASCADE' })
  game: SequenceGame;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  position: number; // ordem correta (1..10)
}
