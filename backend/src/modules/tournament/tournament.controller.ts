import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TournamentService } from './tournament.service';
import { Player } from '../player/entities/player.entity';

@ApiTags('tournament')
@Controller('tournament')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get('active')
  @ApiOperation({ summary: 'Получить активные турниры' })
  async getActiveTournaments() {
    return this.tournamentService.getActiveTournaments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о турнире' })
  async getTournament(@Param('id') id: string) {
    return this.tournamentService.getTournament(id);
  }

  @Post(':id/register')
  @ApiOperation({ summary: 'Зарегистрироваться в турнире' })
  async register(@Param('id') id: string, @CurrentUser() player: Player) {
    return this.tournamentService.registerForTournament(id, player.id);
  }

  @Get('my/tournaments')
  @ApiOperation({ summary: 'Мои турниры' })
  async getMyTournaments(@CurrentUser() player: Player) {
    return this.tournamentService.getMyTournaments(player.id);
  }
}
