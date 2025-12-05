import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  DailyQuest,
  QuestTemplate,
  PlayerQuestHistory,
  QuestType,
  QuestDifficulty,
} from './entities/daily-quest.entity';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class QuestsService {
  // Шаблоны квестов
  private readonly QUEST_TEMPLATES = [
    // EASY
    {
      type: QuestType.WIN_FIGHTS,
      difficulty: QuestDifficulty.EASY,
      title: 'Победитель ринга',
      description: 'Победите в {target} боях',
      targetValue: 3,
      rewards: { money: 5000, boxTokens: 10, experiencePoints: 50 },
      weight: 10,
    },
    {
      type: QuestType.TRAIN_TIMES,
      difficulty: QuestDifficulty.EASY,
      title: 'Тренировка',
      description: 'Проведите {target} тренировок',
      targetValue: 5,
      rewards: { money: 3000, experiencePoints: 30 },
      weight: 10,
    },
    {
      type: QuestType.WATCH_AD,
      difficulty: QuestDifficulty.EASY,
      title: 'Поддержите игру',
      description: 'Посмотрите {target} рекламных видео',
      targetValue: 3,
      rewards: { money: 2000, energy: 30 },
      weight: 8,
    },
    {
      type: QuestType.SHARE_GAME,
      difficulty: QuestDifficulty.EASY,
      title: 'Расскажи друзьям',
      description: 'Поделитесь игрой {target} раз',
      targetValue: 1,
      rewards: { money: 5000, boxTokens: 25 },
      weight: 5,
    },
    // MEDIUM
    {
      type: QuestType.WIN_FIGHTS,
      difficulty: QuestDifficulty.MEDIUM,
      title: 'Непобедимый',
      description: 'Победите в {target} боях',
      targetValue: 8,
      rewards: { money: 15000, boxTokens: 40, experiencePoints: 150 },
      weight: 8,
    },
    {
      type: QuestType.PVP_WIN,
      difficulty: QuestDifficulty.MEDIUM,
      title: 'PvP чемпион',
      description: 'Победите в {target} PvP матчах',
      targetValue: 3,
      rewards: { money: 20000, boxTokens: 75, fame: 50 },
      weight: 6,
    },
    {
      type: QuestType.INVITE_FRIENDS,
      difficulty: QuestDifficulty.MEDIUM,
      title: 'Пригласи друзей',
      description: 'Пригласите {target} друзей',
      targetValue: 3,
      rewards: { money: 30000, boxTokens: 100, nftPack: 'rare' },
      weight: 7,
    },
    {
      type: QuestType.EARN_MONEY,
      difficulty: QuestDifficulty.MEDIUM,
      title: 'Золотая лихорадка',
      description: 'Заработайте {target} денег',
      targetValue: 50000,
      rewards: { money: 10000, boxTokens: 50 },
      weight: 5,
    },
    // HARD
    {
      type: QuestType.WIN_FIGHTS,
      difficulty: QuestDifficulty.HARD,
      title: 'Легенда ринга',
      description: 'Победите в {target} боях',
      targetValue: 15,
      rewards: { money: 50000, boxTokens: 150, experiencePoints: 500, nftPack: 'epic' },
      weight: 4,
    },
    {
      type: QuestType.PVP_WIN,
      difficulty: QuestDifficulty.HARD,
      title: 'Гладиатор',
      description: 'Победите в {target} PvP матчах',
      targetValue: 10,
      rewards: { money: 75000, boxTokens: 250, fame: 200 },
      weight: 3,
    },
    {
      type: QuestType.TOURNAMENT_PARTICIPATE,
      difficulty: QuestDifficulty.HARD,
      title: 'Турнирный боец',
      description: 'Участвуйте в {target} турнирах',
      targetValue: 2,
      rewards: { money: 100000, boxTokens: 300, nftPack: 'epic' },
      weight: 2,
    },
    {
      type: QuestType.INVITE_FRIENDS,
      difficulty: QuestDifficulty.HARD,
      title: 'Влиятельная личность',
      description: 'Пригласите {target} друзей',
      targetValue: 10,
      rewards: { money: 150000, boxTokens: 500, nftPack: 'legendary' },
      weight: 1,
    },
  ];

  constructor(
    @InjectRepository(DailyQuest)
    private readonly questRepository: Repository<DailyQuest>,
    @InjectRepository(QuestTemplate)
    private readonly templateRepository: Repository<QuestTemplate>,
    @InjectRepository(PlayerQuestHistory)
    private readonly historyRepository: Repository<PlayerQuestHistory>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  /**
   * Генерация ежедневных квестов для игрока
   */
  async generateDailyQuests(playerId: number): Promise<DailyQuest[]> {
    // Удалить старые незавершенные квесты
    await this.questRepository.delete({
      playerId,
      completed: false,
      expiresAt: LessThan(new Date()),
    });

    // Проверить, есть ли активные квесты
    const activeQuests = await this.questRepository.find({
      where: {
        playerId,
        completed: false,
        expiresAt: LessThan(new Date()),
      },
    });

    if (activeQuests.length >= 3) {
      return activeQuests; // Уже есть 3 активных квеста
    }

    // Генерировать 3 квеста (легкий, средний, сложный)
    const quests: DailyQuest[] = [];
    const difficulties = [QuestDifficulty.EASY, QuestDifficulty.MEDIUM, QuestDifficulty.HARD];

    for (const difficulty of difficulties) {
      const template = this.selectRandomTemplate(difficulty);
      if (!template) continue;

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const quest = this.questRepository.create({
        playerId,
        type: template.type,
        difficulty: template.difficulty,
        title: template.title,
        description: template.description.replace('{target}', template.targetValue.toString()),
        targetValue: template.targetValue,
        currentValue: 0,
        rewards: template.rewards,
        expiresAt,
      });

      quests.push(await this.questRepository.save(quest));
    }

    return quests;
  }

  /**
   * Выбор случайного шаблона по сложности
   */
  private selectRandomTemplate(difficulty: QuestDifficulty): any {
    const templates = this.QUEST_TEMPLATES.filter((t) => t.difficulty === difficulty);
    const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;

    for (const template of templates) {
      random -= template.weight;
      if (random <= 0) return template;
    }

    return templates[0];
  }

  /**
   * Обновление прогресса квеста
   */
  async updateQuestProgress(
    playerId: number,
    questType: QuestType,
    increment: number = 1,
  ): Promise<void> {
    const quests = await this.questRepository.find({
      where: {
        playerId,
        type: questType,
        completed: false,
      },
    });

    for (const quest of quests) {
      quest.currentValue += increment;

      // Проверить завершение
      if (quest.currentValue >= quest.targetValue && !quest.completed) {
        quest.completed = true;
        quest.completedAt = new Date();
        await this.completeQuest(quest);
      }

      await this.questRepository.save(quest);
    }
  }

  /**
   * Завершение квеста и выдача наград
   */
  private async completeQuest(quest: DailyQuest): Promise<void> {
    const { playerId, rewards } = quest;

    // Выдать награды
    if (rewards.money) {
      await this.playerRepository.increment({ id: playerId }, 'money', rewards.money);
    }
    if (rewards.boxTokens) {
      await this.playerRepository.increment({ id: playerId }, 'boxTokens', rewards.boxTokens);
    }
    if (rewards.fame) {
      await this.playerRepository.increment({ id: playerId }, 'fame', rewards.fame);
    }
    if (rewards.energy) {
      await this.playerRepository.increment({ id: playerId }, 'energy', rewards.energy);
    }

    // Сохранить в историю
    await this.historyRepository.save({
      playerId,
      questType: quest.type,
      rewards,
      completedAt: new Date(),
    });
  }

  /**
   * Получить активные квесты игрока
   */
  async getActiveQuests(playerId: number): Promise<DailyQuest[]> {
    const now = new Date();
    return this.questRepository.find({
      where: {
        playerId,
        expiresAt: LessThan(now),
      },
      order: {
        difficulty: 'ASC',
      },
    });
  }

  /**
   * Получить статистику квестов
   */
  async getQuestStats(playerId: number) {
    const totalCompleted = await this.historyRepository.count({
      where: { playerId },
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyCompleted = await this.historyRepository.count({
      where: {
        playerId,
        completedAt: LessThan(last7Days),
      },
    });

    const history = await this.historyRepository.find({
      where: { playerId },
      order: { completedAt: 'DESC' },
      take: 20,
    });

    return {
      totalCompleted,
      weeklyCompleted,
      recentQuests: history,
    };
  }

  /**
   * Cron job: очистка просроченных квестов
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredQuests() {
    await this.questRepository.delete({
      completed: false,
      expiresAt: LessThan(new Date()),
    });
  }
}
