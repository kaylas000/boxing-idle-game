import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FightHistory } from '../../fight/entities/fight-history.entity';
import { PlayerCard } from '../../cards/entities/player-card.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  isGuest: boolean;

  // Игровые ресурсы
  @Column({ type: 'bigint', default: 1000 })
  money: number;

  @Column({ type: 'int', default: 0 })
  fame: number;

  @Column({ type: 'int', default: 10 })
  energy: number;

  @Column({ type: 'int', default: 10 })
  maxEnergy: number;

  @Column({ type: 'int', default: 1000 })
  rating: number;

  // Прогресс
  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'int', default: 0 })
  experience: number;

  @Column({ type: 'int', default: 100 })
  experienceToNext: number;

  // Характеристики
  @Column({ type: 'int', default: 10 })
  power: number;

  @Column({ type: 'int', default: 10 })
  speed: number;

  @Column({ type: 'int', default: 10 })
  stamina: number;

  @Column({ type: 'int', default: 10 })
  defense: number;

  // Статистика
  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  knockouts: number;

  // Улучшения
  @Column({ type: 'json', default: '{}' })
  upgrades: Record<string, number>;

  // Временные метки
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastEnergyRegen: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Отношения
  @OneToMany(() => FightHistory, (fight) => fight.player)
  fightHistory: FightHistory[];

  @OneToMany(() => PlayerCard, (card) => card.player)
  cards: PlayerCard[];
}
