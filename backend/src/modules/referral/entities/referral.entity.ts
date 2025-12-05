import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('referrals')
@Index(['referrerId', 'level'])
@Index(['referredId'])
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'referrer_id' })
  referrerId: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrer_id' })
  referrer: Player;

  @Column({ name: 'referred_id' })
  referredId: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referred_id' })
  referred: Player;

  @Column({ type: 'int', default: 1 })
  level: number; // Уровень реферала (1-5)

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  earnedRewards: number; // Всего заработано с этого реферала

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  earnedBoxTokens: number; // BOX токены заработанные

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('referral_rewards')
@Index(['referrerId', 'createdAt'])
export class ReferralReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'referrer_id' })
  referrerId: number;

  @Column({ name: 'referred_id' })
  referredId: number;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  boxTokens: number;

  @Column({ type: 'varchar', length: 50 })
  rewardType: string; // 'fight_win', 'purchase', 'achievement', etc.

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@Entity('referral_milestones')
export class ReferralMilestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id' })
  playerId: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({ type: 'int' })
  referralCount: number; // Количество привлеченных рефералов

  @Column({ type: 'int' })
  milestone: number; // 10, 50, 100, 500, 1000, 5000

  @Column({ type: 'json' })
  rewards: {
    money?: number;
    boxTokens?: number;
    nftRarity?: string;
    revenueSharePercent?: number;
  };

  @Column({ default: false })
  claimed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  claimedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
