import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
import { PvpMatch } from './entities/pvp-match.entity';
import { PlayerService } from '../player/player.service';

interface MatchmakingQueue {
  playerId: string;
  rating: number;
  timestamp: number;
}

@Injectable()
export class PvpService {
  private matchmakingQueue: MatchmakingQueue[] = [];
  private activeMatches = new Map<string, any>();

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(PvpMatch)
    private pvpMatchRepository: Repository<PvpMatch>,
    private playerService: PlayerService,
  ) {}

  async joinMatchmaking(playerId: string) {
    const player = await this.playerService.getProfile(playerId);

    // Проверка энергии
    if (player.energy < 1) {
      throw new BadRequestException('Недостаточно энергии');
    }

    // Добавить в очередь
    this.matchmakingQueue.push({
      playerId: player.id,
      rating: player.rating,
      timestamp: Date.now(),
    });

    // Попытка найти пару
    const match = await this.findMatch(player.id, player.rating);

    if (match) {
      return {
        matchFound: true,
        matchId: match.id,
        opponent: match.opponent,
      };
    }

    return {
      matchFound: false,
      message: 'Поиск противника...',
      queuePosition: this.matchmakingQueue.length,
    };
  }

  async leaveMatchmaking(playerId: string) {
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (q) => q.playerId !== playerId
    );
    return { success: true };
  }

  private async findMatch(playerId: string, rating: number) {
    // Поиск подходящего противника (±200 рейтинга)
    const ratingRange = 200;
    const opponent = this.matchmakingQueue.find(
      (q) =>
        q.playerId !== playerId &&
        Math.abs(q.rating - rating) <= ratingRange
    );

    if (!opponent) return null;

    // Удалить обоих из очереди
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (q) => q.playerId !== playerId && q.playerId !== opponent.playerId
    );

    // Создать матч
    const player1 = await this.playerService.getProfile(playerId);
    const player2 = await this.playerService.getProfile(opponent.playerId);

    const match = this.pvpMatchRepository.create({
      player1,
      player2,
      status: 'active',
    });

    await this.pvpMatchRepository.save(match);

    return {
      id: match.id,
      opponent: {
        id: player2.id,
        username: player2.username,
        level: player2.level,
        rating: player2.rating,
        power: player2.power,
        speed: player2.speed,
        stamina: player2.stamina,
        defense: player2.defense,
      },
    };
  }

  async submitMatchResult(matchId: string, winnerId: string) {
    const match = await this.pvpMatchRepository.findOne({
      where: { id: matchId },
      relations: ['player1', 'player2'],
    });

    if (!match) {
      throw new BadRequestException('Матч не найден');
    }

    const winner = match.player1.id === winnerId ? match.player1 : match.player2;
    const loser = match.player1.id === winnerId ? match.player2 : match.player1;

    // Обновить рейтинг
    const ratingChange = 25;
    winner.rating += ratingChange;
    winner.wins++;
    loser.rating = Math.max(0, loser.rating - ratingChange);
    loser.losses++;

    await this.playerRepository.save([winner, loser]);

    // Обновить матч
    match.winnerId = winnerId;
    match.status = 'completed';
    await this.pvpMatchRepository.save(match);

    return {
      winner: {
        id: winner.id,
        username: winner.username,
        newRating: winner.rating,
        ratingChange: +ratingChange,
      },
      loser: {
        id: loser.id,
        username: loser.username,
        newRating: loser.rating,
        ratingChange: -ratingChange,
      },
    };
  }

  async getMatchHistory(playerId: string, page: number = 1, limit: number = 20) {
    const [matches, total] = await this.pvpMatchRepository.findAndCount({
      where: [
        { player1: { id: playerId } },
        { player2: { id: playerId } },
      ],
      relations: ['player1', 'player2'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      matches,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
