import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
import { PlayerService } from '../player/player.service';

interface Training {
  id: string;
  name: string;
  icon: string;
  duration: number;
  cost: number;
  bonus: Record<string, number>;
  description: string;
}

@Injectable()
export class TrainingService {
  private readonly trainings: Training[] = [
    {
      id: 'power-training',
      name: 'Работа на мешке',
      icon: '🥊',
      duration: 30,
      cost: 100,
      bonus: { power: 1 },
      description: '+1 Сила',
    },
    {
      id: 'speed-training',
      name: 'Работа на лапах',
      icon: '⚡',
      duration: 30,
      cost: 100,
      bonus: { speed: 1 },
      description: '+1 Скорость',
    },
    {
      id: 'stamina-training',
      name: 'Кардио',
      icon: '🏃',
      duration: 45,
      cost: 150,
      bonus: { stamina: 1 },
      description: '+1 Выносливость',
    },
    {
      id: 'defense-training',
      name: 'Спарринг',
      icon: '🛡️',
      duration: 60,
      cost: 200,
      bonus: { defense: 1 },
      description: '+1 Защита',
    },
  ];

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private playerService: PlayerService,
  ) {}

  async getAvailableTrainings() {
    return this.trainings;
  }

  async startTraining(playerId: string, trainingId: string) {
    const player = await this.playerService.getProfile(playerId);
    const training = this.trainings.find((t) => t.id === trainingId);

    if (!training) {
      throw new BadRequestException('Тренировка не найдена');
    }

    if (Number(player.money) < training.cost) {
      throw new BadRequestException('Недостаточно денег');
    }

    // Списание денег
    player.money = Number(player.money) - training.cost;

    // Применение бонусов
    for (const [stat, value] of Object.entries(training.bonus)) {
      player[stat] = Number(player[stat]) + value;
    }

    await this.playerRepository.save(player);

    // Добавление опыта
    await this.playerService.addExperience(playerId, 20);

    return {
      success: true,
      message: `Тренировка "${training.name}" завершена`,
      bonuses: training.bonus,
      newBalance: player.money,
    };
  }
}
