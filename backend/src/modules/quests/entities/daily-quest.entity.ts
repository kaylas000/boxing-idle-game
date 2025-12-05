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

export enum QuestType {
  WIN_FIGHTS = 'win_fights',
  TRAIN_TIMES = 'train_times',
  PVP_WIN = 'pvp_win',
  EARN_MONEY = 'earn_money',
  SHARE_GAME = 'share_game',
  INVITE_FRIENDS = 'invite_friends',
  WATCH_AD = 'watch_ad',
  TOURNAMENT_PARTICIPATE = 'tournament_participate',
  UPGRADE_STATS = 'upgrade_stats',
  BUY_CARDS = 'buy_cards',
  COMPLETE_ACHIEVEMENTS = 'complete_achievements',
  LOGIN_STREAK = 'login_streak',
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

@Entity('daily_quests')
@Index(['playerId', 'expiresAt'])
@Index(['playerId', 'completed'])
export class DailyQuest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id' })
  playerId: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @Column({
    type: 'enum',
    enum: QuestType,
  })
  type: QuestType;

  @Column({
    type: 'enum',
    enum: QuestDifficulty,
    default: QuestDifficulty.EASY,
  })
  difficulty: QuestDifficulty;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  targetValue: number; // Целевое значение (например, 5 побед)

  @Column({ type: 'int', default: 0 })
  currentValue: number; // Текущий прогресс

  @Column({ type: 'json' })
  rewards: {
    money?: number;
    boxTokens?: number;
    fame?: number;
    energy?: number;
    nftPack?: string;
    experiencePoints?: number;
  };

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date; // 24 часа с момента создания

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('quest_templates')
export class QuestTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestType,
  })
  type: QuestType;

  @Column({
    type: 'enum',
    enum: QuestDifficulty,
  })
  difficulty: QuestDifficulty;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  targetValue: number;

  @Column({ type: 'json' })
  rewards: {
    money?: number;
    boxTokens?: number;
    fame?: number;
    energy?: number;
    nftPack?: string;
    experiencePoints?: number;
  };

  @Column({ type: 'int', default: 1 })
  weight: number; // Вес для случайного выбора

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('player_quest_history')
@Index(['playerId', 'completedAt'])
export class PlayerQuestHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id' })
  playerId: number;

  @Column({
    type: 'enum',
    enum: QuestType,
  })
  questType: QuestType;

  @Column({ type: 'json' })
  rewards: any;

  @Column({ type: 'timestamp' })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
