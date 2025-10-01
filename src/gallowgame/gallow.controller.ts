import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { GallowService } from './gallow.service';
import { GallowGame } from './gallow.entity';

@Controller('gallow')
export class GallowController {
  constructor(private readonly gameService: GallowService) {}

  @Post()
  create(@Body() body: { title: string; keyword: string; tip1: string; tip2: string }): Promise<GallowGame> {
    return this.gameService.create(body.title, body.keyword, body.tip1, body.tip2);
  }

  @Get('freegallow')
  async getAllFreeGallow() {
    return await this.gameService.getAllAdminFreeSequence();
  }

  @Get()
  findAll(): Promise<GallowGame[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GallowGame> {
    return this.gameService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<GallowGame[]> {
    return this.gameService.findByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.gameService.remove(id);
  }

  @Post('ranking/:sequenceId')
  async updateScore(
    @Param('sequenceId') sequenceId: number,
    @Body() body: { userId: number; correctAnswers: number; timeInSeconds: number },
    ) {
      return this.gameService.saveOrUpdateScore(body.userId, sequenceId, body.correctAnswers,body.timeInSeconds);
    }

  @Get('ranking/:id')
  getRanking(@Param('id') id: number) {
    return this.gameService.getRankingBySequence(id);
  }

  @Delete('ranking/:id')
  async deleteRanking(@Param('id') id: number) {
    return this.gameService.removeRanking(id);
  }


}
