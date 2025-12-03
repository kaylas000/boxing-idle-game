import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { TonController } from './ton.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/entities/player.entity';
import { TonTransaction } from './entities/ton-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, TonTransaction])],
  controllers: [TonController],
  providers: [TonService],
  exports: [TonService],
})
export class TonModule {}
