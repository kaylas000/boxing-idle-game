import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
import { FightHistory } from './entities/fight-history.entity';
import { PlayerService } from '../player/player.service';

@Injectable()
export class FightService {
  private readonly opponentNames = [
    'Иван Сильный',
    'Мике Тайсон',
    'Джо Фрэйзер',
    'Мухаммед Али',
    'Рокки Бальбоа',
    'Флойд Мэйвезер',
    'Мэнни Пакьяо',
    'Антонио Маргарито',
  ];

  private currentOpponents = new Map<string, any>();

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(FightHistory)
    private fightHistoryRepository: Repository<FightHistory>,
    private playerService: PlayerService,
  ) {}

  async generateOpponent(player: Player) {
    const variance = 0.8 + Math.random() * 0.4; // 0.8-1.2
    
    const opponent = {
      name: this.opponentNames[Math.floor(Math.random() * this.opponentNames.length)],
      power: Math.floor(player.power * variance),
      speed: Math.floor(player.speed * variance),
      stamina: Math.floor(player.stamina * variance),
      defense: Math.floor(player.defense * variance),
      rating: player.rating + Math.floor((Math.random() - 0.5) * 200),
    };

    this.currentOpponents.set(player.id, opponent);

    return opponent;
  }

  async startFight(playerId: string) {
    const player = await this.playerService.getProfile(playerId);
    const opponent = this.currentOpponents.get(playerId);

    if (!opponent) {
      throw new BadRequestException('Сначала сгенерируйте противника');
    }

    // Проверка энергии
    await this.playerService.deductEnergy(playerId, 1);

    // Симуляция боя
    const playerScore = player.power + player.speed + player.stamina + player.defense;
    const opponentScore = opponent.power + opponent.speed + opponent.stamina + opponent.defense;
    
    const playerChance = playerScore / (playerScore + opponentScore);
    const win = Math.random() < playerChance;
    const knockout = Math.random() < 0.3;

    let reward = 0;
    let fameReward = 0;
    let ratingChange = 0;

    if (win) {
      reward = Math.floor(200 + Math.random() * 300);
      fameReward = Math.floor(10 + Math.random() * 20);
      ratingChange = Math.floor(15 + Math.random() * 25);
      
      player.wins++;
      if (knockout) player.knockouts++;
      player.money = Number(player.money) + reward;
      player.fame += fameReward;
      player.rating += ratingChange;
      
      await this.playerService.addExperience(playerId, 50);
    } else {
      player.losses++;
      ratingChange = -Math.floor(10 + Math.random() * 15);
      player.rating = Math.max(0, player.rating + ratingChange);
      
      await this.playerService.addExperience(playerId, 15);
    }

    await this.playerRepository.save(player);

    // Сохранение истории
    const fightRecord = this.fightHistoryRepository.create({
      player,
      opponentName: opponent.name,
      opponentRating: opponent.rating,
      result: win ? 'win' : 'loss',
      isKnockout: knockout && win,
      reward,
      fameReward,
      ratingChange,
    });
    await this.fightHistoryRepository.save(fightRecord);

    this.currentOpponents.delete(playerId);

    return {
      result: win ? 'win' : 'loss',
      knockout: knockout && win,
      opponent: opponent.name,
      reward,
      fameReward,
      ratingChange,
      newRating: player.rating,
      newBalance: player.money,
    };
  }

  async getFightHistory(playerId: string, page: number = 1, limit: number = 20) {
    const [fights, total] = await this.fightHistoryRepository.findAndCount({
      where: { player: { id: playerId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      fights,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
