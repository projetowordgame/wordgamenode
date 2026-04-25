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

  /**
   * Endpoint para salvar as respostas detalhadas do usuário em um quizz
   * Body esperado: { userAnswers: [{ questionId, answerId, isCorrect, timeSpentInSeconds }] }
   */
  @Post(':quizzId/user-answers/:userId')
  async saveUserAnswers(
    @Param('quizzId') quizzId: number,
    @Param('userId') userId: number,
    @Body() body: { userAnswers: { questionId: number; answerId: number; isCorrect?: boolean; timeSpentInSeconds?: number }[] },
  ) {
    console.log(`Controller: saveUserAnswers called with ${body.userAnswers.length} answers`);
    return this.quizzService.saveUserAnswers(userId, quizzId, body.userAnswers);
  }

  /**
   * Endpoint para obter análise completa das respostas de um aluno em um quizz
   * Retorna: playerName, totalCorrect, totalIncorrect, totalQuestions, timeInSeconds, questions
   */
  @Get('analytics/:quizzId/:userId')
  async getQuizzAnalytics(
    @Param('quizzId') quizzId: number,
    @Param('userId') userId: number,
  ) {
    return this.quizzService.getQuizzAnalytics(quizzId, userId);
  }

  /**
   * Endpoint para salvar ou atualizar dados de análise
   * Limpa dados anteriores e salva os novos
   */
  @Post('analytics/:quizzId/:userId')
  async saveOrUpdateAnalytics(
    @Param('quizzId') quizzId: number,
    @Param('userId') userId: number,
  ) {
    return this.quizzService.saveOrUpdateQuizzAnalytics(quizzId, userId);
  }

  /**
   * Endpoint para obter todos os registros de análise
   */
  @Get('analytics')
  async getAllAnalytics() {
    return this.quizzService.getAllQuizzAnalytics();
  }

  /**
   * Endpoint para obter análises de um quizz específico
   */
  @Get('analytics-by-quiz/:quizzId')
  async getAnalyticsByQuizz(@Param('quizzId') quizzId: number) {
    return this.quizzService.getAnalyticsByQuizz(quizzId);
  }

  /**
   * Endpoint para obter análises de um aluno específico
   */
  @Get('analytics-by-user/:userId')
  async getAnalyticsByUser(@Param('userId') userId: number) {
    return this.quizzService.getAnalyticsByUser(userId);
  }

  /**
   * Endpoint para gerar relatório completo do quiz
   * Limpa dados anteriores e salva análise de todos os alunos que fizeram o quiz
   */
  @Post('generate-report/:quizzId')
  async generateQuizzReport(@Param('quizzId') quizzId: number) {
    return this.quizzService.generateQuizzReport(quizzId);
  }

  /**
   * Endpoint para obter todas as perguntas erradas arquivadas
   */
  @Get('incorrect-questions')
  async getAllIncorrectQuestions() {
    return this.quizzService.getAllIncorrectQuestions();
  }

  /**
   * Endpoint para obter as perguntas erradas de um registro de análise específico
   */
  @Get('incorrect-questions/:quizzAnalyticsId')
  async getIncorrectQuestionsByAnalyticsId(@Param('quizzAnalyticsId') quizzAnalyticsId: number) {
    return this.quizzService.getIncorrectQuestionsByAnalyticsId(quizzAnalyticsId);
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

