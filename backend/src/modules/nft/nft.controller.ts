import { Controller, Get, Post, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NftService } from './nft.service';
import { Player } from '../player/entities/player.entity';
import { MintNftDto } from './dto/mint-nft.dto';
import { TransferNftDto } from './dto/transfer-nft.dto';

@ApiTags('nft')
@Controller('nft')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('my-nfts')
  @ApiOperation({ summary: 'Получить NFT коллекцию игрока' })
  async getMyNfts(@CurrentUser() player: Player) {
    return this.nftService.getPlayerNfts(player.id);
  }

  @Get(':tokenId')
  @ApiOperation({ summary: 'Получить информацию о NFT' })
  async getNft(@Param('tokenId') tokenId: string) {
    return this.nftService.getNftById(tokenId);
  }

  @Post('mint')
  @ApiOperation({ summary: 'Создать (минтить) новый NFT' })
  async mintNft(
    @CurrentUser() player: Player,
    @Body() mintDto: MintNftDto,
  ) {
    return this.nftService.mintNft(player.id, mintDto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Передать NFT другому игроку' })
  async transferNft(
    @CurrentUser() player: Player,
    @Body() transferDto: TransferNftDto,
  ) {
    return this.nftService.transferNft(
      player.id,
      transferDto.tokenId,
      transferDto.recipientAddress,
    );
  }

  @Get('metadata/:tokenId')
  @ApiOperation({ summary: 'Получить метаданные NFT' })
  async getMetadata(@Param('tokenId') tokenId: string) {
    return this.nftService.getNftMetadata(tokenId);
  }

  @Get('collection/fighters')
  @ApiOperation({ summary: 'NFT коллекция боксёров' })
  async getFighterNfts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.nftService.getNftsByType('fighter', page, limit);
  }

  @Get('collection/equipment')
  @ApiOperation({ summary: 'NFT коллекция экипировки' })
  async getEquipmentNfts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.nftService.getNftsByType('equipment', page, limit);
  }
}
