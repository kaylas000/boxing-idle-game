import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AchievementsService } from './achievements.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('achievements')
@Controller('achievements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все достижения' })
  async getAchievements(@CurrentUser() player: Player) {
    return this.achievementsService.getPlayerAchievements(player.id);
  }

  @Post('check')
  @ApiOperation({ summary: 'Проверить новые достижения' })
  async checkAchievements(@CurrentUser() player: Player) {
    return this.achievementsService.checkAchievements(player.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика достижений' })
  async getStats(@CurrentUser() player: Player) {
    return this.achievementsService.getAchievementStats(player.id);
  }
}
