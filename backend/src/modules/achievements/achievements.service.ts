import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { PlayerAchievement } from './entities/player-achievement.entity';
import { Player } from '../player/entities/player.entity';

// Список достижений
export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    name: 'Первая победа',
    description: 'Одержите вашу первую победу',
    icon: '🥊',
    rarity: 'common',
    rewards: { money: 1000, fame: 10 },
    condition: (player: any) => player.wins >= 1,
  },
  {
    id: 'win_streak_5',
    name: 'Серия побед x5',
    description: 'Одержите 5 побед подряд',
    icon: '🔥',
    rarity: 'rare',
    rewards: { money: 5000, fame: 50 },
    condition: (player: any) => player.winStreak >= 5,
  },
  {
    id: 'knockout_king',
    name: 'Король нокаутов',
    description: 'Одержите 10 побед нокаутом',
    icon: '💥',
    rarity: 'epic',
    rewards: { money: 10000, fame: 100 },
    condition: (player: any) => player.knockouts >= 10,
  },
  {
    id: 'level_10',
    name: 'Опытный боец',
    description: 'Достигните 10 уровня',
    icon: '⬆️',
    rarity: 'rare',
    rewards: { money: 5000 },
    condition: (player: any) => player.level >= 10,
  },
  {
    id: 'level_50',
    name: 'Легенда',
    description: 'Достигните 50 уровня',
    icon: '🏆',
    rarity: 'legendary',
    rewards: { money: 50000, fame: 500 },
    condition: (player: any) => player.level >= 50,
  },
  {
    id: 'millionaire',
    name: 'Миллионер',
    description: 'Накопите 1,000,000 монет',
    icon: '💰',
    rarity: 'epic',
    rewards: { fame: 200 },
    condition: (player: any) => Number(player.money) >= 1000000,
  },
  {
    id: 'card_collector',
    name: 'Коллекционер',
    description: 'Соберите все карты',
    icon: '🎴',
    rarity: 'legendary',
    rewards: { money: 100000, fame: 1000 },
    condition: (player: any) => false, // TODO: проверка коллекции
  },
  {
    id: 'tournament_winner',
    name: 'Победитель турнира',
    description: 'Победите в турнире',
    icon: '🏆',
    rarity: 'epic',
    rewards: { money: 20000, fame: 300 },
    condition: (player: any) => false, // TODO: проверка турниров
  },
  {
    id: 'pvp_champion',
    name: 'Чемпион PvP',
    description: 'Одержите 100 PvP побед',
    icon: '⚔️',
    rarity: 'legendary',
    rewards: { money: 50000, fame: 500 },
    condition: (player: any) => player.pvpWins >= 100,
  },
  {
    id: 'training_master',
    name: 'Мастер тренировок',
    description: 'Проведите 500 тренировок',
    icon: '🏋️',
    rarity: 'rare',
    rewards: { money: 10000, fame: 100 },
    condition: (player: any) => player.trainingsCompleted >= 500,
  },
];

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(PlayerAchievement)
    private playerAchievementRepository: Repository<PlayerAchievement>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getPlayerAchievements(playerId: string) {
    const unlocked = await this.playerAchievementRepository.find({
      where: { player: { id: playerId } },
    });

    const unlockedIds = new Set(unlocked.map((a) => a.achievementId));

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: unlocked.find((a) => a.achievementId === achievement.id)?.unlockedAt,
    }));
  }

  async checkAchievements(playerId: string) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) return [];

    const unlocked = await this.playerAchievementRepository.find({
      where: { player: { id: playerId } },
    });

    const unlockedIds = new Set(unlocked.map((a) => a.achievementId));
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!unlockedIds.has(achievement.id) && achievement.condition(player)) {
        // Разблокировать!
        const playerAchievement = this.playerAchievementRepository.create({
          player,
          achievementId: achievement.id,
        });

        await this.playerAchievementRepository.save(playerAchievement);

        // Применить награды
        if (achievement.rewards.money) {
          player.money = Number(player.money) + achievement.rewards.money;
        }
        if (achievement.rewards.fame) {
          player.fame += achievement.rewards.fame;
        }

        await this.playerRepository.save(player);

        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  async getAchievementStats(playerId: string) {
    const unlocked = await this.playerAchievementRepository.count({
      where: { player: { id: playerId } },
    });

    const total = ACHIEVEMENTS.length;
    const progress = (unlocked / total) * 100;

    const byRarity = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    const unlockedAchievements = await this.playerAchievementRepository.find({
      where: { player: { id: playerId } },
    });

    unlockedAchievements.forEach((pa) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === pa.achievementId);
      if (achievement) {
        byRarity[achievement.rarity as keyof typeof byRarity]++;
      }
    });

    return {
      unlocked,
      total,
      progress: Math.round(progress),
      byRarity,
    };
  }
}
