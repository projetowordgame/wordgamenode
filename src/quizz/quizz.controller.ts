import { Controller, Post, Get, Param, Body, Delete, Req } from '@nestjs/common';
import { QuizzService } from './quizz.service';

@Controller('quizzes')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}


  @Get('freequizz')
  async getAllFreeQuizzes() {

    return await this.quizzService.getAllAdminFreeQuizzes();
  }

  @Delete('ranking/:id')
  async deleteRanking(@Param('id') id: number) {
    return this.quizzService.remove(id);
  }


  @Post('ranking/:quizzId')
  async updateScore(
    @Param('quizzId') quizzId: number,
    @Body() body: { userId: number; correctAnswers: number; timeInSeconds: number },
  ) {
    return this.quizzService.saveOrUpdateScore(body.userId, quizzId, body.correctAnswers,body.timeInSeconds);
  }




  @Get('ranking/:id')
  getRanking(@Param('id') id: number) {
    return this.quizzService.getRankingByQuizz(id);
  }


  @Post()
  async createQuizz(
    @Body()
    body: {
      userId: number; // ✅ Agora o ID do usuário vem no body
      title: string;
      questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[];
    },
  ) {
    return this.quizzService.createQuizz(body.userId, body.title, body.questions);
  }

  // 🔹 Nova rota para buscar quizzes pelo ID do usuário
  @Get('user/:userId')
  async getQuizzesByUser(@Param('userId') userId: number) {
    return this.quizzService.getQuizzesByUser(userId);
  }

  @Get(':id')
  async getQuizzById(@Param('id') id: number) {
    return this.quizzService.getQuizzById(id);
  }

  @Delete(':id')
  async deleteQuizz(@Param('id') id: number) {
    return this.quizzService.deleteQuizz(id);
  }

}

