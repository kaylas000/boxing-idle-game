import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IapController } from './iap.controller';
import { IapService } from './iap.service';
import { Purchase } from './entities/purchase.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, Player]),
    PlayerModule,
  ],
  controllers: [IapController],
  providers: [IapService],
  exports: [IapService],
})
export class IapModule {}
