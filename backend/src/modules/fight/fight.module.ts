import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightController } from './fight.controller';
import { FightService } from './fight.service';
import { Player } from '../player/entities/player.entity';
import { FightHistory } from './entities/fight-history.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, FightHistory]),
    PlayerModule,
  ],
  controllers: [FightController],
  providers: [FightService],
})
export class FightModule {}
