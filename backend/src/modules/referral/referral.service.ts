import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral, ReferralReward, ReferralMilestone } from './entities/referral.entity';
import { Player } from '../player/entities/player.entity';
import * as crypto from 'crypto';

@Injectable()
export class ReferralService {
  // Многоуровневая система наград
  private readonly REWARD_LEVELS = [
    { level: 1, moneyPercent: 20, boxTokensPercent: 15 },
    { level: 2, moneyPercent: 10, boxTokensPercent: 8 },
    { level: 3, moneyPercent: 5, boxTokensPercent: 4 },
    { level: 4, moneyPercent: 2, boxTokensPercent: 2 },
    { level: 5, moneyPercent: 1, boxTokensPercent: 1 },
  ];

  // Награды за массовое привлечение
  private readonly MILESTONES = [
    { count: 10, rewards: { money: 10000, boxTokens: 50, nftRarity: 'rare' } },
    { count: 50, rewards: { money: 60000, boxTokens: 300 } },
    { count: 100, rewards: { money: 150000, boxTokens: 1000, nftRarity: 'epic' } },
    { count: 500, rewards: { money: 1000000, boxTokens: 8000 } },
    { count: 1000, rewards: { money: 2500000, boxTokens: 20000, nftRarity: 'legendary' } },
    { count: 5000, rewards: { boxTokens: 100000, nftRarity: 'mythic', revenueSharePercent: 0.1 } },
  ];

  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
    @InjectRepository(ReferralReward)
    private readonly rewardRepository: Repository<ReferralReward>,
    @InjectRepository(ReferralMilestone)
    private readonly milestoneRepository: Repository<ReferralMilestone>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  /**
   * Генерация уникального реферального кода
   */
  generateReferralCode(playerId: number): string {
    const hash = crypto.createHash('md5').update(`${playerId}-${Date.now()}`).digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }

  /**
   * Использование реферального кода при регистрации
   */
  async useReferralCode(referredId: number, referralCode: string): Promise<void> {
    // Найти реферера по коду
    const referrer = await this.playerRepository.findOne({
      where: { referralCode },
    });

    if (!referrer) {
      throw new NotFoundException('Реферальный код не найден');
    }

    if (referrer.id === referredId) {
      throw new BadRequestException('Нельзя использовать свой реферальный код');
    }

    // Проверить, не использовал ли уже этот игрок код
    const existingReferral = await this.referralRepository.findOne({
      where: { referredId },
    });

    if (existingReferral) {
      throw new BadRequestException('Вы уже использовали реферальный код');
    }

    // Создать запись о реферале уровня 1
    await this.referralRepository.save({
      referrerId: referrer.id,
      referredId,
      level: 1,
    });

    // Создать многоуровневую структуру
    await this.createMultiLevelReferrals(referrer.id, referredId);

    // Дать бонус за использование кода
    await this.giveWelcomeBonus(referrer.id, referredId);

    // Проверить достижение милстоунов
    await this.checkMilestones(referrer.id);
  }

  /**
   * Создание многоуровневой структуры рефералов
   */
  private async createMultiLevelReferrals(referrerId: number, referredId: number): Promise<void> {
    let currentReferrerId = referrerId;

    // Создать связи до 5 уровня
    for (let level = 2; level <= 5; level++) {
      // Найти реферера текущего уровня
      const parentReferral = await this.referralRepository.findOne({
        where: { referredId: currentReferrerId, level: 1 },
      });

      if (!parentReferral) break; // Цепочка прервалась

      // Создать связь следующего уровня
      await this.referralRepository.save({
        referrerId: parentReferral.referrerId,
        referredId,
        level,
      });

      currentReferrerId = parentReferral.referrerId;
    }
  }

  /**
   * Бонус за использование реферального кода
   */
  private async giveWelcomeBonus(referrerId: number, referredId: number): Promise<void> {
    const WELCOME_BONUS = { money: 5000, boxTokens: 25 };
    const REFERRER_BONUS = { money: 5000, boxTokens: 50 };

    // Бонус новому игроку
    await this.playerRepository.increment(
      { id: referredId },
      'money',
      WELCOME_BONUS.money,
    );
    await this.playerRepository.increment(
      { id: referredId },
      'boxTokens',
      WELCOME_BONUS.boxTokens,
    );

    // Бонус рефереру
    await this.playerRepository.increment(
      { id: referrerId },
      'money',
      REFERRER_BONUS.money,
    );
    await this.playerRepository.increment(
      { id: referrerId },
      'boxTokens',
      REFERRER_BONUS.boxTokens,
    );
  }

  /**
   * Начисление реферальных наград (вызывать при заработке игроком)
   */
  async processReferralReward(
    userId: number,
    moneyAmount: number,
    boxTokensAmount: number = 0,
    rewardType: string = 'general',
  ): Promise<void> {
    // Найти всех рефереров этого игрока
    const referrals = await this.referralRepository.find({
      where: { referredId: userId, isActive: true },
      order: { level: 'ASC' },
    });

    for (const referral of referrals) {
      const rewardConfig = this.REWARD_LEVELS.find((r) => r.level === referral.level);
      if (!rewardConfig) continue;

      // Рассчитать награду
      const moneyReward = Math.floor((moneyAmount * rewardConfig.moneyPercent) / 100);
      const boxTokensReward = Math.floor(
        (boxTokensAmount * rewardConfig.boxTokensPercent) / 100,
      );

      if (moneyReward <= 0 && boxTokensReward <= 0) continue;

      // Начислить награду рефереру
      if (moneyReward > 0) {
        await this.playerRepository.increment(
          { id: referral.referrerId },
          'money',
          moneyReward,
        );
      }

      if (boxTokensReward > 0) {
        await this.playerRepository.increment(
          { id: referral.referrerId },
          'boxTokens',
          boxTokensReward,
        );
      }

      // Записать начисление
      await this.rewardRepository.save({
        referrerId: referral.referrerId,
        referredId: userId,
        level: referral.level,
        amount: moneyReward,
        boxTokens: boxTokensReward,
        rewardType,
      });

      // Обновить общую статистику
      await this.referralRepository.increment(
        { id: referral.id },
        'earnedRewards',
        moneyReward,
      );
      await this.referralRepository.increment(
        { id: referral.id },
        'earnedBoxTokens',
        boxTokensReward,
      );
    }
  }

  /**
   * Проверка и создание милстоунов
   */
  private async checkMilestones(playerId: number): Promise<void> {
    // Подсчитать количество рефералов 1 уровня
    const referralCount = await this.referralRepository.count({
      where: { referrerId: playerId, level: 1 },
    });

    // Проверить каждый милстоун
    for (const milestone of this.MILESTONES) {
      if (referralCount >= milestone.count) {
        // Проверить, не создан ли уже этот милстоун
        const existing = await this.milestoneRepository.findOne({
          where: { playerId, milestone: milestone.count },
        });

        if (!existing) {
          await this.milestoneRepository.save({
            playerId,
            referralCount,
            milestone: milestone.count,
            rewards: milestone.rewards,
            claimed: false,
          });
        }
      }
    }
  }

  /**
   * Получить награду за милстоун
   */
  async claimMilestoneReward(playerId: number, milestoneId: number): Promise<any> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id: milestoneId, playerId },
    });

    if (!milestone) {
      throw new NotFoundException('Милстоун не найден');
    }

    if (milestone.claimed) {
      throw new BadRequestException('Награда уже получена');
    }

    // Выдать награды
    if (milestone.rewards.money) {
      await this.playerRepository.increment({ id: playerId }, 'money', milestone.rewards.money);
    }
    if (milestone.rewards.boxTokens) {
      await this.playerRepository.increment(
        { id: playerId },
        'boxTokens',
        milestone.rewards.boxTokens,
      );
    }

    // Отметить как полученную
    milestone.claimed = true;
    milestone.claimedAt = new Date();
    await this.milestoneRepository.save(milestone);

    return milestone.rewards;
  }

  /**
   * Статистика рефералов
   */
  async getReferralStats(playerId: number) {
    const referrals = await this.referralRepository.find({
      where: { referrerId: playerId },
      relations: ['referred'],
    });

    const totalEarnings = referrals.reduce(
      (sum, ref) => sum + Number(ref.earnedRewards),
      0,
    );
    const totalBoxTokens = referrals.reduce(
      (sum, ref) => sum + Number(ref.earnedBoxTokens),
      0,
    );

    const referralsByLevel = {
      level1: referrals.filter((r) => r.level === 1).length,
      level2: referrals.filter((r) => r.level === 2).length,
      level3: referrals.filter((r) => r.level === 3).length,
      level4: referrals.filter((r) => r.level === 4).length,
      level5: referrals.filter((r) => r.level === 5).length,
    };

    const milestones = await this.milestoneRepository.find({
      where: { playerId },
      order: { milestone: 'ASC' },
    });

    return {
      totalReferrals: referralsByLevel.level1,
      referralsByLevel,
      totalEarnings,
      totalBoxTokens,
      milestones,
      topReferrals: referrals
        .filter((r) => r.level === 1)
        .sort((a, b) => Number(b.earnedRewards) - Number(a.earnedRewards))
        .slice(0, 10),
    };
  }

  /**
   * Лидерборд рефереров
   */
  async getLeaderboard(limit: number = 100) {
    const leaderboard = await this.referralRepository
      .createQueryBuilder('referral')
      .select('referral.referrerId', 'playerId')
      .addSelect('COUNT(DISTINCT referral.referredId)', 'referralCount')
      .addSelect('SUM(referral.earnedRewards)', 'totalEarnings')
      .addSelect('SUM(referral.earnedBoxTokens)', 'totalBoxTokens')
      .where('referral.level = :level', { level: 1 })
      .groupBy('referral.referrerId')
      .orderBy('referralCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return leaderboard;
  }
}
