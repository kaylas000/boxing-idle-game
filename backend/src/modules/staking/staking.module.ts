import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakingController } from './staking.controller';
import { StakingService } from './staking.service';
import { Stake } from './entities/stake.entity';
import { CryptoModule } from '../crypto/crypto.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stake]),
    CryptoModule,
    PlayerModule,
  ],
  controllers: [StakingController],
  providers: [StakingService],
  exports: [StakingService],
})
export class StakingModule {}
