import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {}

  async createQuestion(text: string, answers: { text: string; isCorrect: boolean }[]) {
    if (answers.length > 4) {
      throw new Error('Uma pergunta pode ter no máximo 4 respostas.');
    }

    const question = this.questionRepo.create({ text });
    question.answers = answers.map((ans) => this.answerRepo.create(ans));

    return this.questionRepo.save(question);
  }

  async getAllQuestions() {
    return this.questionRepo.find({ relations: ['answers'] });
  }

  async getQuestionById(id: number) {
    return this.questionRepo.findOne({ where: { id }, relations: ['answers'] });
  }
}
