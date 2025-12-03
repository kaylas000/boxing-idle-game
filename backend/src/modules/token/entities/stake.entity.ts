import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { StakingPool } from './staking-pool.entity';

@Entity('stakes')
export class Stake {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  player: Player;

  @ManyToOne(() => StakingPool)
  pool: StakingPool;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  rewards: number; // Накопленные награды

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;
}
