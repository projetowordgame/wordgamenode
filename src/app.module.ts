import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { QuizzModule } from './quizz/quizz.module';
import { SequenceGameModule } from './sequencegame/sequence-game.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // necessário no Render
      },
    }),
    AuthModule,
    UserModule,
    QuizzModule,
    SequenceGameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
