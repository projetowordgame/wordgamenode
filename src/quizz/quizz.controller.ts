import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { QuizzService } from './quizz.service';

@Controller('quizzes')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

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

