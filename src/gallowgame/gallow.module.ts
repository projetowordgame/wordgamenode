import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GallowService } from './gallow.service';
import { GallowController } from './gallow.controller';
import { User } from '../user/user.entity';
import { gallowScore } from './gallowScore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, gallowScore])],
  controllers: [GallowController],
  providers: [GallowService],
})
export class SequenceGameModule {}