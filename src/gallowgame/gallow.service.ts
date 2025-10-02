import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GallowGame } from './gallow.entity';
import { User } from '../user/user.entity';
import { gallowScore } from './gallowScore.entity';

@Injectable()
export class GallowService {
  constructor(
    @InjectRepository(GallowGame)
    private readonly gameRepo: Repository<GallowGame>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(gallowScore) private scoreRepo: Repository<gallowScore>,
  ) {}

  async create( userId: number, title: string, keyword: string, tip1: string, tip2: string): Promise<GallowGame> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const game = this.gameRepo.create({
      title: title,
      keyword: keyword,
      tip1: tip1,
      tip2: tip2,
      user, // associa ao usuário encontrado
    });

    return this.gameRepo.save(game);
  }

  async findAll(): Promise<GallowGame[]> {
    return this.gameRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<GallowGame> {
    const game = await this.gameRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!game) throw new NotFoundException(`Game #${id} not found`);
    return game;
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepo.remove(game);
  }

  async findByUser(userId: number): Promise<GallowGame[]> {
    return this.gameRepo.find({
        where: { user: { id: userId } },
        relations: ['user'],
    });
  }

  async getAllAdminFreeSequence() {
      return this.gameRepo.find({
        where: { user: { name: "admin" } },
        relations: ["user"],
      });
  }

    async saveOrUpdateScore(userId: number, gallowId: number, correctAnswers: number, timeInSeconds: number) {
    // Verifica se já existe score para esse usuário e sequence
    const existingScore = await this.scoreRepo.findOne({
      where: { userId, gallowId },
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
      gallowId,
      correctAnswers,
      timeInSeconds
    });
  
    return this.scoreRepo.save(newScore);
  }

    async getRankingBySequence(gallowId: number) {
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
      .where('score.gallowId = :gallowId', { gallowId })
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
