import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentParticipant } from './entities/tournament-participant.entity';
import { Player } from '../player/entities/player.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentParticipant)
    private participantRepository: Repository<TournamentParticipant>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getActiveTournaments() {
    return this.tournamentRepository.find({
      where: { status: In(['registration', 'active']) },
      order: { startTime: 'ASC' },
    });
  }

  async getTournament(id: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.player'],
    });

    if (!tournament) {
      throw new BadRequestException('Турнир не найден');
    }

    return tournament;
  }

  async registerForTournament(tournamentId: string, playerId: string) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
      relations: ['participants'],
    });

    if (!tournament) {
      throw new BadRequestException('Турнир не найден');
    }

    if (tournament.status !== 'registration') {
      throw new BadRequestException('Регистрация закрыта');
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      throw new BadRequestException('Турнир заполнен');
    }

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Игрок не найден');
    }

    // Проверка entry fee
    if (Number(player.money) < tournament.entryFee) {
      throw new BadRequestException('Недостаточно средств');
    }

    // Списать entry fee
    player.money = Number(player.money) - tournament.entryFee;
    await this.playerRepository.save(player);

    // Зарегистрировать
    const participant = this.participantRepository.create({
      tournament,
      player,
      status: 'active',
    });

    await this.participantRepository.save(participant);

    return {
      success: true,
      message: 'Вы зарегистрированы в турнире!',
      tournament: {
        id: tournament.id,
        name: tournament.name,
        participants: tournament.participants.length + 1,
        maxParticipants: tournament.maxParticipants,
      },
    };
  }

  @Get('my-tournaments')
  @ApiOperation({ summary: 'Мои турниры' })
  async getMyTournaments(@CurrentUser() player: Player) {
    const participants = await this.participantRepository.find({
      where: { player: { id: player.id } },
      relations: ['tournament'],
      order: { createdAt: 'DESC' },
    });

    return participants.map((p) => ({
      tournament: p.tournament,
      status: p.status,
      placement: p.placement,
      prize: p.prize,
    }));
  }

  // Cron job - создавать турниры каждые 6 часов
  @Cron(CronExpression.EVERY_6_HOURS)
  async createScheduledTournament() {
    const tournament = this.tournamentRepository.create({
      name: `Турнир ${new Date().toLocaleDateString('ru')}`,
      maxParticipants: 16,
      entryFee: 5000,
      prizePool: 100000,
      status: 'registration',
      startTime: new Date(Date.now() + 3600000), // Через 1 час
    });

    await this.tournamentRepository.save(tournament);
    console.log(`Создан новый турнир: ${tournament.name}`);
  }
}
