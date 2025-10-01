import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SequenceGame } from './sequence-game.entity';
import { SequenceCard } from './sequence-card.entity';
import { CreateSequenceGameDto } from './dto/create-sequence-game.dto';
import { User } from '../user/user.entity';
import { sequenceScore } from './sequenceScore.entity';

@Injectable()
export class GallowService {
  constructor(
    @InjectRepository(SequenceGame)
    private readonly gameRepo: Repository<SequenceGame>,

    @InjectRepository(SequenceCard)
    private readonly cardRepo: Repository<SequenceCard>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(sequenceScore) private scoreRepo: Repository<sequenceScore>,
  ) {}

  async create( title: string, keyword: string, tip1: string, tip2: string): Promise<SequenceGame> {
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

  async getAllAdminFreeSequence() {
      return this.gameRepo.find({
        where: { user: { name: "admin" } },
        relations: ["user", "cards"],
      });
  }

    async saveOrUpdateScore(userId: number, sequenceId: number, correctAnswers: number, timeInSeconds: number) {
    // Verifica se já existe score para esse usuário e sequence
    const existingScore = await this.scoreRepo.findOne({
      where: { userId, sequenceId },
    });
  
    if (existingScore) {
      // Atualiza o número de acertos se já existir
      existingScore.correctAnswers = correctAnswers;
      existingScore.timeInSeconds = timeInSeconds;
      return this.scoreRepo.save(existingScore);
    }
  
    // Cria novo score se não existir
    const newScore = this.scoreRepo.create({
      userId,
      sequenceId,
      correctAnswers,
      timeInSeconds
    });
  
    return this.scoreRepo.save(newScore);
  }

    async getRankingBySequence(sequenceId: number) {
    return this.scoreRepo
      .createQueryBuilder('score')
      .innerJoin('user', 'user', 'user.id = score.userId')
      .select([
        'score.id AS scoreId',
        'score.correctAnswers AS correctAnswers',
        'score.timeInSeconds AS timeInSeconds',
        'user.id AS userId',
        'user.name AS userName',
      ])
      .where('score.sequenceId = :sequenceId', { sequenceId })
      .orderBy('score.correctAnswers', 'DESC')  // primeiro critério: acertos
      .addOrderBy('score.timeInSeconds', 'ASC') // segundo critério: menor tempo
      .getRawMany();
  }


    async removeRanking(id: number) {
    const ranking = await this.scoreRepo.findOne({ where: { id } });
  
    if (!ranking) {
      throw new Error(`Ranking com id ${id} não encontrado.`);
    }
  
    return this.scoreRepo.remove(ranking);
  }

}
