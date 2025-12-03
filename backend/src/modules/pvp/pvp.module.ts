import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PvpController } from './pvp.controller';
import { PvpService } from './pvp.service';
import { PvpGateway } from './pvp.gateway';
import { Player } from '../player/entities/player.entity';
import { PvpMatch } from './entities/pvp-match.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player, PvpMatch]),
    PlayerModule,
  ],
  controllers: [PvpController],
  providers: [PvpService, PvpGateway],
  exports: [PvpService],
})
export class PvpModule {}
