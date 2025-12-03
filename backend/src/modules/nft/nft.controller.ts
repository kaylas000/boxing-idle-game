import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NftService } from './nft.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('nft')
@Controller('nft')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('my')
  @ApiOperation({ summary: 'Получить все NFT игрока' })
  async getMyNFTs(@CurrentUser() player: Player) {
    return this.nftService.getPlayerNFTs(player.id);
  }

  @Post('mint')
  @ApiOperation({ summary: 'Создать новый NFT' })
  async mintNFT(
    @CurrentUser() player: Player,
    @Body() dto: { type: string; rarity: string; attributes: any },
  ) {
    return this.nftService.mintNFT(player.id, dto.type, dto.rarity, dto.attributes);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Выпустить NFT в блокчейн' })
  async publishToBlockchain(
    @Param('id') nftId: string,
    @CurrentUser() player: Player,
  ) {
    return this.nftService.publishToBlockchain(nftId, player.id);
  }

  @Post(':id/equip')
  @ApiOperation({ summary: 'Экипировать/снять NFT' })
  async toggleEquip(
    @Param('id') nftId: string,
    @CurrentUser() player: Player,
  ) {
    return this.nftService.toggleEquip(nftId, player.id);
  }

  @Get('bonuses')
  @ApiOperation({ summary: 'Получить бонусы от экипированных NFT' })
  async getEquippedBonuses(@CurrentUser() player: Player) {
    return this.nftService.getEquippedBonuses(player.id);
  }
}
