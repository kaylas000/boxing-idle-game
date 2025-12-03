import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { StakingPool } from './entities/staking-pool.entity';
import { Stake } from './entities/stake.entity';
import { Player } from '../player/entities/player.entity';
import { Wallet } from '../blockchain/entities/wallet.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StakingPool, Stake, Player, Wallet]),
    BlockchainModule,
    PlayerModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
