import { Controller, Post, Get, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PvpService } from './pvp.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('pvp')
@Controller('pvp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PvpController {
  constructor(private readonly pvpService: PvpService) {}

  @Post('matchmaking/join')
  @ApiOperation({ summary: 'Присоединиться к поиску матча' })
  async joinMatchmaking(@CurrentUser() player: Player) {
    return this.pvpService.joinMatchmaking(player.id);
  }

  @Post('matchmaking/leave')
  @ApiOperation({ summary: 'Выйти из поиска' })
  async leaveMatchmaking(@CurrentUser() player: Player) {
    return this.pvpService.leaveMatchmaking(player.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'История PvP матчей' })
  async getHistory(
    @CurrentUser() player: Player,
    @Query('page') page: number = 1,
  ) {
    return this.pvpService.getMatchHistory(player.id, page);
  }
}
