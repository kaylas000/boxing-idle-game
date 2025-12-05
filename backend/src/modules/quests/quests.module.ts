import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import {
  DailyQuest,
  QuestTemplate,
  PlayerQuestHistory,
} from './entities/daily-quest.entity';
import { Player } from '../player/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyQuest, QuestTemplate, PlayerQuestHistory, Player]),
    ScheduleModule.forRoot(),
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}
