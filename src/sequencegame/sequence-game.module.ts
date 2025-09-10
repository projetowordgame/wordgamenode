import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequenceGame } from './sequence-game.entity';
import { SequenceCard } from './sequence-card.entity';
import { SequenceGameService } from './sequence-game.service';
import { SequenceGameController } from './sequence-game.controller';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceGame, SequenceCard, User])],
  controllers: [SequenceGameController],
  providers: [SequenceGameService],
})
export class SequenceGameModule {}
