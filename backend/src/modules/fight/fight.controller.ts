import { Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FightService } from './fight.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('fight')
@Controller('fight')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FightController {
  constructor(private readonly fightService: FightService) {}

  @Get('generate-opponent')
  @ApiOperation({ summary: 'Генерировать противника' })
  async generateOpponent(@CurrentUser() player: Player) {
    return this.fightService.generateOpponent(player);
  }

  @Post('start')
  @ApiOperation({ summary: 'Начать бой' })
  async startFight(@CurrentUser() player: Player) {
    return this.fightService.startFight(player.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Получить историю боёв' })
  async getFightHistory(
    @CurrentUser() player: Player,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.fightService.getFightHistory(player.id, page, limit);
  }
}
