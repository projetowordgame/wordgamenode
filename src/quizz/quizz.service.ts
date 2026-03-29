import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from './quizz.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { User } from '../user/user.entity';
import { Score } from './score.entity';
import { UserAnswer } from './user-answer.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz) private quizzRepo: Repository<Quizz>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Score) private scoreRepo: Repository<Score>,
    @InjectRepository(UserAnswer) private userAnswerRepo: Repository<UserAnswer>,
  ) {}

  async createQuizz(userId: number, title: string, questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[]) {
    if (questions.length > 10) {
      throw new Error('O quiz pode ter no máximo 10 perguntas.');
    }
  
    // 🔹 Verifica se o usuário existe
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');
  
    if (user.role !== 'professor') {
      throw new Error('Apenas professores podem criar quizzes');
    }

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
  
  async getAllAdminFreeQuizzes() {

    const adminUser = await this.userRepo.findOne({ where: { name: "admin" } });
  
    if (!adminUser) {
      throw new Error("Usuário admin não encontrado");
    }
  
    return this.quizzRepo.find({
      where: { user: { id: adminUser.id } },
      relations: ["questions", "questions.answers"],
    });
  }


  async deleteQuizz(id: number): Promise<{ message: string }> {
    const result = await this.quizzRepo.delete(id);

    if (result.affected === 0) {
      throw new Error('Quiz não encontrado.');
    }

    return { message: 'Quiz deletado com sucesso.' };
  }


  async getRankingByQuizz(quizzId: number) {
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
      .where('score.quizzId = :quizzId', { quizzId })
      .orderBy('score.correctAnswers', 'DESC')  // primeiro critério: acertos
      .addOrderBy('score.timeInSeconds', 'ASC') // segundo critério: menor tempo
      .getRawMany();
  }

  async saveOrUpdateScore(userId: number, quizzId: number, correctAnswers: number, timeInSeconds: number) {
    // Verifica se já existe score para esse usuário e quiz
    const existingScore = await this.scoreRepo.findOne({
      where: { userId, quizzId },
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
      quizzId,
      correctAnswers,
      timeInSeconds
    });
  
    return this.scoreRepo.save(newScore);
  }
  

  async remove(id: number) {
    const ranking = await this.scoreRepo.findOne({ where: { id } });
  
    if (!ranking) {
      throw new Error(`Ranking com id ${id} não encontrado.`);
    }
  
    return this.scoreRepo.remove(ranking);
  }

  /**
   * Salva as respostas individuais do usuário para cada pergunta do quiz
   * @param userId - ID do usuário
   * @param quizzId - ID do quizz
   * @param userAnswers - Array com as respostas do usuário
   */
  async saveUserAnswers(
    userId: number,
    quizzId: number,
    userAnswers: {
      questionId: number;
      answerId: number;
      isCorrect: boolean;
      timeSpentInSeconds?: number;
    }[]
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const quizz = await this.quizzRepo.findOne({ where: { id: quizzId } });

    if (!user || !quizz) {
      throw new Error('Usuário ou Quizz não encontrado');
    }

    // Deleta respostas antigas (se o usuário respondeu novamente)
    await this.userAnswerRepo.delete({ userId, quizzId });

    // Salva as novas respostas
    const answers = userAnswers.map((answer) => {
      return this.userAnswerRepo.create({
        userId,
        quizzId,
        questionId: answer.questionId,
        answerId: answer.answerId,
        isCorrect: answer.isCorrect,
        timeSpentInSeconds: answer.timeSpentInSeconds || 0,
        user,
        quizz,
      });
    });

    return this.userAnswerRepo.save(answers);
  }

  /**
   * Retorna os dados analíticos de um aluno em um quizz específico
   * @param quizzId - ID do quizz
   * @param userId - ID do aluno
   * @returns Objeto com análise completa das respostas
   */
  async getQuizzAnalytics(quizzId: number, userId: number) {
    // Busca o usuário
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Busca o quizz com todas as perguntas e respostas
    const quizz = await this.quizzRepo.findOne({
      where: { id: quizzId },
      relations: ['questions', 'questions.answers'],
    });

    if (!quizz) {
      throw new Error('Quizz não encontrado');
    }

    // Busca a pontuação do usuário
    const score = await this.scoreRepo.findOne({
      where: { userId, quizzId },
    });

    // Busca as respostas do usuário para cada pergunta
    const userAnswers = await this.userAnswerRepo.find({
      where: { userId, quizzId },
      relations: ['answer', 'question'],
    });

    // Monta o array de perguntas com as respostas do usuário
    const questionsWithAnswers = quizz.questions.map((question) => {
      const userAnswer = userAnswers.find(
        (ua) => ua.questionId === question.id
      );

      const userSelectedAnswer = userAnswer
        ? question.answers.find((ans) => ans.id === userAnswer.answerId)
        : null;

      const correctAnswer = question.answers.find(
        (ans) => ans.isCorrect === true
      );

      return {
        questionId: question.id,
        questionText: question.text,
        userAnswerId: userAnswer?.answerId || null,
        userAnswerText: userSelectedAnswer?.text || null,
        isCorrect: userAnswer?.isCorrect || false,
        correctAnswerId: correctAnswer?.id,
        correctAnswerText: correctAnswer?.text,
      };
    });

    // Calcula totais
    const totalCorrect = score?.correctAnswers || 0;
    const totalIncorrect = quizz.questions.length - totalCorrect;
    const timeInSeconds = score?.timeInSeconds || 0;

    return {
      playerName: user.name,
      playerId: user.id,
      totalCorrect,
      totalIncorrect,
      totalQuestions: quizz.questions.length,
      timeInSeconds,
      questions: questionsWithAnswers,
    };
  }
  



}
