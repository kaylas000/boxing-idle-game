import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction, Player]),
    PlayerModule,
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}
