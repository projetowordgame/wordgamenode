import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from './quizz.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { User } from '../user/user.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz) private quizzRepo: Repository<Quizz>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createQuizz(userId: number, title: string, questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[]) {
    if (questions.length > 10) {
      throw new Error('O quiz pode ter no máximo 10 perguntas.');
    }
  
    // 🔹 Verifica se o usuário existe
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');
  
    // 🔹 Primeiro, cria e salva o quiz
    const quizz = this.quizzRepo.create({ title, user });
    await this.quizzRepo.save(quizz);
  
    // 🔹 Agora, adiciona as perguntas
    const questionEntities = await Promise.all(
      questions.map(async (q) => {
        const question = this.questionRepo.create({ text: q.text, quizz: quizz });
        await this.questionRepo.save(question);
  
        // 🔹 Agora adiciona as respostas para cada pergunta
        const answerEntities = q.answers.map((ans) =>
          this.answerRepo.create({ text: ans.text, isCorrect: ans.isCorrect, question })
        );
  
        await this.answerRepo.save(answerEntities);
        return question;
      })
    );
  
    // 🔹 Retorna o quiz com todas as perguntas e respostas salvas
    return { ...quizz, questions: questionEntities };
  }
  

  async getAllQuizzes() {
    return this.quizzRepo.find({ relations: ['questions', 'questions.answers', 'user'] });
  }

  async getQuizzById(id: number) {
    return this.quizzRepo.findOne({ where: { id }, relations: ['questions', 'questions.answers', 'user'] });
  }

  async getQuizzesByUser(userId: number) {
    return this.quizzRepo.find({
      where: { user: { id: userId } },
      relations: ['questions', 'questions.answers'],
    });
  }
  

  async deleteQuizz(id: number): Promise<{ message: string }> {
    const result = await this.quizzRepo.delete(id);

    if (result.affected === 0) {
      throw new Error('Quiz não encontrado.');
    }

    return { message: 'Quiz deletado com sucesso.' };
  }


}
