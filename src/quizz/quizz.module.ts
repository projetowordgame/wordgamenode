import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Question } from './question.entity';
import { QuestionService } from './question.service';
import { Quizz } from './quizz.entity';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { QuestionController } from './question.controller';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ Importando AuthModule
import { Score } from './score.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Quizz, User, Score]), AuthModule ],
  providers: [QuestionService, QuizzService],
  controllers: [QuestionController, QuizzController],
  exports: [QuestionService, QuizzService],
})
export class QuizzModule {}