import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { Listing } from './entities/listing.entity';
import { Trade } from './entities/trade.entity';
import { NFT } from '../nft/entities/nft.entity';
import { Player } from '../player/entities/player.entity';
import { NftModule } from '../nft/nft.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing, Trade, NFT, Player]),
    NftModule,
    BlockchainModule,
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
