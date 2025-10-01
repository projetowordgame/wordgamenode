import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('gallow_game')
export class GallowGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  keyword: string;

 @Column({ length: 255 })
  tip1: string;

 @Column({ length: 255 })
  tip2: string;

  // 👇 associação com usuário criador
  @ManyToOne(() => User, (user) => user.gallowGame, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}