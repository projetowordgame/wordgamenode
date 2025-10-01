import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { SequenceGameService } from './sequence-game.service';
import { CreateSequenceGameDto } from './dto/create-sequence-game.dto';
import { SequenceGame } from './sequence-game.entity';

@Controller('sequence-games')
export class SequenceGameController {
  constructor(private readonly gameService: SequenceGameService) {}

  @Post()
  create(@Body() dto: CreateSequenceGameDto): Promise<SequenceGame> {
    return this.gameService.create(dto);
  }

  @Get('freesequence')
  async getAllFreeSequences() {
    return await this.gameService.getAllAdminFreeSequence();
  }

  @Get()
  findAll(): Promise<SequenceGame[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SequenceGame> {
    return this.gameService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<SequenceGame[]> {
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
