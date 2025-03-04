import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createQuestion(
    @Body() body: { text: string; answers: { text: string; isCorrect: boolean }[] },
  ) {
    return this.questionService.createQuestion(body.text, body.answers);
  }

  @Get()
  async getAllQuestions() {
    return this.questionService.getAllQuestions();
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: number) {
    return this.questionService.getQuestionById(id);
  }
}
