import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('referral')
@Controller('referral')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('use-code')
  @ApiOperation({ summary: 'Использовать реферальный код' })
  @ApiResponse({ status: 201, description: 'Код успешно использован' })
  @ApiResponse({ status: 400, description: 'Неверный код или код уже использован' })
  async useReferralCode(
    @Request() req,
    @Body('referralCode') referralCode: string,
  ) {
    await this.referralService.useReferralCode(req.user.id, referralCode);
    return {
      message: 'Реферальный код успешно применен! Вы получили 5000 денег и 25 BOX токенов.',
    };
  }

  @Get('my-code')
  @ApiOperation({ summary: 'Получить свой реферальный код' })
  @ApiResponse({ status: 200, description: 'Реферальный код игрока' })
  async getMyCode(@Request() req) {
    // Код должен быть в Player entity
    // Если нет - генерируем
    const code = this.referralService.generateReferralCode(req.user.id);
    return {
      referralCode: code,
      referralLink: `https://t.me/your_bot/game?ref=${code}`,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика рефералов' })
  @ApiResponse({ status: 200, description: 'Статистика реферальной программы' })
  async getStats(@Request() req) {
    const stats = await this.referralService.getReferralStats(req.user.id);
    return stats;
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Лидерборд рефереров' })
  @ApiResponse({ status: 200, description: 'Топ-100 рефереров' })
  async getLeaderboard(@Query('limit') limit: string = '100') {
    const leaderboard = await this.referralService.getLeaderboard(parseInt(limit, 10));
    return leaderboard;
  }

  @Post('milestone/:id/claim')
  @ApiOperation({ summary: 'Получить награду за милстоун' })
  @ApiResponse({ status: 200, description: 'Награда получена' })
  @ApiResponse({ status: 400, description: 'Награда уже получена' })
  async claimMilestone(@Request() req, @Param('id') milestoneId: string) {
    const rewards = await this.referralService.claimMilestoneReward(
      req.user.id,
      parseInt(milestoneId, 10),
    );
    return {
      message: 'Награда получена!',
      rewards,
    };
  }
}
