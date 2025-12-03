import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StakingPool } from './entities/staking-pool.entity';
import { Stake } from './entities/stake.entity';
import { Player } from '../player/entities/player.entity';
import { Wallet } from '../blockchain/entities/wallet.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

/**
 * BOX Token Economy
 * 
 * Emission: 100,000,000 BOX total supply
 * Distribution:
 * - 40% Play-to-Earn rewards
 * - 20% Staking rewards  
 * - 15% Team & development
 * - 15% Liquidity & exchanges
 * - 10% Marketing & partnerships
 */

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(StakingPool)
    private stakingPoolRepository: Repository<StakingPool>,
    @InjectRepository(Stake)
    private stakeRepository: Repository<Stake>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private blockchainService: BlockchainService,
  ) {}

  /**
   * Stake BOX токены
   */
  async stakeTokens(
    playerId: string,
    poolId: string,
    amount: number,
  ) {
    const wallet = await this.blockchainService.getOrCreateWallet(playerId);

    if (wallet.boxTokenBalance < amount) {
      throw new BadRequestException('Недостаточно BOX токенов');
    }

    const pool = await this.stakingPoolRepository.findOne({
      where: { id: poolId, active: true },
    });

    if (!pool) {
      throw new BadRequestException('Пул не найден');
    }

    // Минимальная сумма стейкинга
    if (amount < pool.minStake) {
      throw new BadRequestException(`Минимальная сумма: ${pool.minStake} BOX`);
    }

    // Заблокировать токены
    wallet.boxTokenBalance -= amount;
    await this.walletRepository.save(wallet);

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    // Создать stake
    const stake = this.stakeRepository.create({
      player,
      pool,
      amount,
      startDate: new Date(),
      status: 'active',
    });

    await this.stakeRepository.save(stake);

    return {
      stake,
      newBalance: wallet.boxTokenBalance,
    };
  }

  /**
   * Unstake токены
   */
  async unstakeTokens(stakeId: string, playerId: string) {
    const stake = await this.stakeRepository.findOne({
      where: { id: stakeId, player: { id: playerId } },
      relations: ['pool', 'player'],
    });

    if (!stake) {
      throw new BadRequestException('Stake не найден');
    }

    if (stake.status !== 'active') {
      throw new BadRequestException('Stake уже закрыт');
    }

    // Проверка lock period
    const lockPeriodEnd = new Date(stake.startDate.getTime() + stake.pool.lockPeriod * 1000);
    if (new Date() < lockPeriodEnd) {
      throw new BadRequestException('Токены ещё заблокированы');
    }

    // Расчёт наград
    const rewards = await this.calculateRewards(stake);

    const wallet = await this.blockchainService.getOrCreateWallet(playerId);

    // Вернуть токены + награды
    wallet.boxTokenBalance += stake.amount + rewards;
    await this.walletRepository.save(wallet);

    stake.status = 'completed';
    stake.endDate = new Date();
    stake.rewards = rewards;
    await this.stakeRepository.save(stake);

    return {
      stake,
      rewards,
      newBalance: wallet.boxTokenBalance,
    };
  }

  /**
   * Расчёт наград за стейкинг
   */
  private async calculateRewards(stake: Stake): Promise<number> {
    const now = new Date();
    const startTime = stake.startDate.getTime();
    const duration = (now.getTime() - startTime) / 1000; // секунды
    const durationDays = duration / 86400;

    // APY формула: rewards = principal * (APY / 365) * days
    const apy = stake.pool.apy / 100; // Конвертация из процентов
    const rewards = stake.amount * (apy / 365) * durationDays;

    return Math.floor(rewards);
  }

  /**
   * Получить активные стейки игрока
   */
  async getPlayerStakes(playerId: string) {
    const stakes = await this.stakeRepository.find({
      where: { player: { id: playerId } },
      relations: ['pool'],
      order: { startDate: 'DESC' },
    });

    // Добавить pending rewards
    const stakesWithRewards = await Promise.all(
      stakes.map(async (stake) => {
        let pendingRewards = 0;
        if (stake.status === 'active') {
          pendingRewards = await this.calculateRewards(stake);
        }
        return {
          ...stake,
          pendingRewards,
        };
      }),
    );

    return stakesWithRewards;
  }

  /**
   * Получить доступные пулы для стейкинга
   */
  async getStakingPools() {
    const pools = await this.stakingPoolRepository.find({
      where: { active: true },
      order: { apy: 'DESC' },
    });

    return pools;
  }

  /**
   * Cron: распределение наград за стейкинг
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async distributeStakingRewards() {
    const activeStakes = await this.stakeRepository.find({
      where: { status: 'active' },
      relations: ['player', 'pool'],
    });

    for (const stake of activeStakes) {
      // Ежедневные награды
      const dailyReward = (stake.amount * (stake.pool.apy / 100)) / 365;
      
      // Начислить на баланс (но не снимать со stake)
      await this.blockchainService.mintBoxTokens(
        stake.player.id,
        dailyReward,
        'staking_reward',
      );
    }

    console.log(`Distributed staking rewards to ${activeStakes.length} stakes`);
  }
}
