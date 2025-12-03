import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CryptoService } from './crypto.service';
import { Player } from '../player/entities/player.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { TransferTokensDto } from './dto/transfer-tokens.dto';
import { ClaimRewardsDto } from './dto/claim-rewards.dto';

@ApiTags('crypto')
@Controller('crypto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('wallet')
  @ApiOperation({ summary: 'Получить криптокошелёк игрока' })
  async getWallet(@CurrentUser() player: Player) {
    return this.cryptoService.getOrCreateWallet(player.id);
  }

  @Post('wallet/create')
  @ApiOperation({ summary: 'Создать новый кошелёк' })
  async createWallet(
    @CurrentUser() player: Player,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return this.cryptoService.createWallet(player.id, createWalletDto);
  }

  @Get('wallet/balance')
  @ApiOperation({ summary: 'Получить балансы токенов' })
  async getBalance(@CurrentUser() player: Player) {
    return this.cryptoService.getBalances(player.id);
  }

  @Post('tokens/transfer')
  @ApiOperation({ summary: 'Перевести токены другому игроку' })
  async transferTokens(
    @CurrentUser() player: Player,
    @Body() transferDto: TransferTokensDto,
  ) {
    return this.cryptoService.transferTokens(
      player.id,
      transferDto.recipientAddress,
      transferDto.amount,
      transferDto.tokenType,
    );
  }

  @Post('rewards/claim')
  @ApiOperation({ summary: 'Получить награды в токенах' })
  async claimRewards(
    @CurrentUser() player: Player,
    @Body() claimDto: ClaimRewardsDto,
  ) {
    return this.cryptoService.claimRewards(player.id, claimDto.rewardType);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'История транзакций' })
  async getTransactions(@CurrentUser() player: Player) {
    return this.cryptoService.getTransactionHistory(player.id);
  }

  @Get('gas-price')
  @ApiOperation({ summary: 'Текущая цена газа' })
  async getGasPrice() {
    return this.cryptoService.estimateGasPrice();
  }
}
