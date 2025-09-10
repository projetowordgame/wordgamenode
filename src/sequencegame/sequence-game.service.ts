import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SequenceGame } from './sequence-game.entity';
import { SequenceCard } from './sequence-card.entity';
import { CreateSequenceGameDto } from './dto/create-sequence-game.dto';
import { User } from '../user/user.entity';

@Injectable()
export class SequenceGameService {
  constructor(
    @InjectRepository(SequenceGame)
    private readonly gameRepo: Repository<SequenceGame>,

    @InjectRepository(SequenceCard)
    private readonly cardRepo: Repository<SequenceCard>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateSequenceGameDto): Promise<SequenceGame> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);

    const game = this.gameRepo.create({
      title: dto.title,
      introduction_text: dto.introduction_text,
      user, // associa ao usuário encontrado
      cards: dto.cards.map((card) => this.cardRepo.create(card)),
    });

    return this.gameRepo.save(game);
  }

  async findAll(): Promise<SequenceGame[]> {
    return this.gameRepo.find({ relations: ['cards', 'user'] });
  }

  async findOne(id: number): Promise<SequenceGame> {
    const game = await this.gameRepo.findOne({
      where: { id },
      relations: ['cards', 'user'],
    });
    if (!game) throw new NotFoundException(`Game #${id} not found`);
    return game;
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepo.remove(game);
  }

  async findByUser(userId: number): Promise<SequenceGame[]> {
    return this.gameRepo.find({
        where: { user: { id: userId } },
        relations: ['cards', 'user'],
    });
  }
}
