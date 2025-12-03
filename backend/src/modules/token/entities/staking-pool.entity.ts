import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staking_pools')
export class StakingPool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  apy: number; // Annual Percentage Yield (например, 12.50 = 12.5%)

  @Column({ type: 'int' })
  lockPeriod: number; // Период блокировки в секундах

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  minStake: number; // Минимальная сумма для стейкинга

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  maxStake: number; // Максимальная сумма (опционально)

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  totalStaked: number; // Общая сумма в пуле

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
