import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IapService } from './iap.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('iap')
@Controller('iap')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IapController {
  constructor(private readonly iapService: IapService) {}

  @Get('products')
  @ApiOperation({ summary: 'Получить список товаров' })
  async getProducts() {
    return this.iapService.getProducts();
  }

  @Post('create-payment')
  @ApiOperation({ summary: 'Создать платёж' })
  async createPayment(
    @CurrentUser() player: Player,
    @Body('productId') productId: string,
  ) {
    return this.iapService.createPayment(player.id, productId);
  }

  @Post('process-payment')
  @ApiOperation({ summary: 'Обработать платёж' })
  async processPayment(@Body() data: any) {
    return this.iapService.processPayment(data);
  }

  @Get('history')
  @ApiOperation({ summary: 'История покупок' })
  async getHistory(
    @CurrentUser() player: Player,
    @Query('page') page: number = 1,
  ) {
    return this.iapService.getPurchaseHistory(player.id, page);
  }
}
