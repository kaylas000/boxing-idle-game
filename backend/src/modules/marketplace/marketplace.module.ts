import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MarketListing } from './entities/market-listing.entity';
import { Sale } from './entities/sale.entity';
import { NftModule } from '../nft/nft.module';
import { CryptoModule } from '../crypto/crypto.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketListing, Sale]),
    NftModule,
    CryptoModule,
    PlayerModule,
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
