import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { PlayerCard } from './entities/player-card.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, PlayerCard, Player]),
    PlayerModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
