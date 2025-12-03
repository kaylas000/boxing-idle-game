import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { NFT } from './entities/nft.entity';
import { NFTMetadata } from './entities/nft-metadata.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NFT, NFTMetadata, Player]),
    PlayerModule,
    BlockchainModule,
  ],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
