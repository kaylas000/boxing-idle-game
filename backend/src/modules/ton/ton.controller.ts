import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TonService } from './ton.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('ton')
@Controller('ton')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TonController {
  constructor(private readonly tonService: TonService) {}

  @Post('link-wallet')
  @ApiOperation({ summary: 'Связать TON кошелёк с аккаунтом' })
  async linkWallet(
    @CurrentUser() player: Player,
    @Body() dto: { tonAddress: string },
  ) {
    return this.tonService.linkWallet(player.id, dto.tonAddress);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Получить баланс BOX токенов из blockchain' })
  async getBalance(@CurrentUser() player: Player) {
    if (!player.tonWalletAddress) {
      return { balance: '0', message: 'No wallet linked' };
    }

    const balance = await this.tonService.getBoxTokenBalance(player.tonWalletAddress);
    return { balance, walletAddress: player.tonWalletAddress };
  }

  @Get('nfts')
  @ApiOperation({ summary: 'Получить все NFT игрока из blockchain' })
  async getNFTs(@CurrentUser() player: Player) {
    if (!player.tonWalletAddress) {
      return { nfts: [], total: 0, message: 'No wallet linked' };
    }

    return this.tonService.getPlayerNFTs(player.tonWalletAddress);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'История транзакций игрока' })
  async getTransactions(
    @CurrentUser() player: Player,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    // TODO: реализовать получение из БД
    return {
      transactions: [],
      total: 0,
      page,
    };
  }

  @Get('transaction/:hash')
  @ApiOperation({ summary: 'Проверить статус транзакции' })
  async checkTransaction(@Param('hash') txHash: string) {
    return this.tonService.checkTransactionStatus(txHash);
  }
}
