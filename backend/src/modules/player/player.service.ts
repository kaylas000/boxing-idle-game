import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getProfile(playerId: string) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['cards'],
    });

    if (!player) {
      throw new NotFoundException('Игрок не найден');
    }

    // Регенерация энергии
    await this.regenerateEnergy(player);

    return player;
  }

  async updateProfile(playerId: string, updatePlayerDto: UpdatePlayerDto) {
    await this.playerRepository.update(playerId, updatePlayerDto);
    return this.getProfile(playerId);
  }

  async getStats(playerId: string) {
    const player = await this.getProfile(playerId);
    
    return {
      level: player.level,
      experience: player.experience,
      experienceToNext: player.experienceToNext,
      power: player.power,
      speed: player.speed,
      stamina: player.stamina,
      defense: player.defense,
      wins: player.wins,
      losses: player.losses,
      knockouts: player.knockouts,
      rating: player.rating,
      winRate: player.wins + player.losses > 0 
        ? (player.wins / (player.wins + player.losses) * 100).toFixed(1)
        : 0,
    };
  }

  async collectOfflineIncome(playerId: string) {
    const player = await this.getProfile(playerId);
    const now = new Date();
    const lastActive = new Date(player.lastActive);
    const offlineTime = now.getTime() - lastActive.getTime();
    const offlineMinutes = Math.floor(offlineTime / 60000);
    
    // Максимум 8 часов оффлайн дохода
    const maxMinutes = 8 * 60;
    const effectiveMinutes = Math.min(offlineMinutes, maxMinutes);
    const offlineIncome = effectiveMinutes * 10; // 10 монет в минуту

    if (offlineIncome > 0) {
      player.money = Number(player.money) + offlineIncome;
      player.lastActive = now;
      await this.playerRepository.save(player);
    }

    return {
      offlineIncome,
      offlineMinutes: effectiveMinutes,
      newBalance: player.money,
    };
  }

  async addExperience(playerId: string, amount: number) {
    const player = await this.getProfile(playerId);
    player.experience += amount;

    // Проверка повышения уровня
    const leveledUp = [];
    while (player.experience >= player.experienceToNext) {
      player.experience -= player.experienceToNext;
      player.level++;
      player.experienceToNext = Math.floor(player.experienceToNext * 1.5);
      
      // Бонусы при повышении уровня
      player.power += 2;
      player.speed += 2;
      player.stamina += 2;
      player.defense += 2;
      player.maxEnergy += 1;
      player.energy = player.maxEnergy;
      
      leveledUp.push(player.level);
    }

    await this.playerRepository.save(player);
    return { player, leveledUp };
  }

  async regenerateEnergy(player: Player) {
    if (player.energy >= player.maxEnergy) {
      return player;
    }

    const now = new Date();
    const lastRegen = player.lastEnergyRegen || player.lastActive;
    const timeDiff = now.getTime() - new Date(lastRegen).getTime();
    const minutesPassed = Math.floor(timeDiff / 60000);

    if (minutesPassed > 0) {
      const energyToAdd = Math.min(minutesPassed, player.maxEnergy - player.energy);
      player.energy += energyToAdd;
      player.lastEnergyRegen = now;
      await this.playerRepository.save(player);
    }

    return player;
  }

  async deductEnergy(playerId: string, amount: number = 1) {
    const player = await this.getProfile(playerId);
    if (player.energy < amount) {
      throw new Error('Недостаточно энергии');
    }
    player.energy -= amount;
    await this.playerRepository.save(player);
    return player;
  }
}
