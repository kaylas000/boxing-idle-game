import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { UpdatePlayerDto } from './dto/update-player.dto';

@ApiTags('player')
@Controller('player')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль игрока' })
  async getProfile(@CurrentUser() player: Player) {
    return this.playerService.getProfile(player.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль' })
  async updateProfile(
    @CurrentUser() player: Player,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playerService.updateProfile(player.id, updatePlayerDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику игрока' })
  async getStats(@CurrentUser() player: Player) {
    return this.playerService.getStats(player.id);
  }

  @Patch('collect-offline')
  @ApiOperation({ summary: 'Собрать оффлайн доход' })
  async collectOfflineIncome(@CurrentUser() player: Player) {
    return this.playerService.collectOfflineIncome(player.id);
  }
}
