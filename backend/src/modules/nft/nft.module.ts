import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { Nft } from './entities/nft.entity';
import { NftMetadata } from './entities/nft-metadata.entity';
import { PlayerModule } from '../player/player.module';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, NftMetadata]),
    PlayerModule,
    CryptoModule,
  ],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
