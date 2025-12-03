import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('fight_history')
export class FightHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, (player) => player.fightHistory)
  player: Player;

  @Column()
  opponentName: string;

  @Column({ type: 'int' })
  opponentRating: number;

  @Column()
  result: 'win' | 'loss';

  @Column({ default: false })
  isKnockout: boolean;

  @Column({ type: 'int', default: 0 })
  reward: number;

  @Column({ type: 'int', default: 0 })
  fameReward: number;

  @Column({ type: 'int', default: 0 })
  ratingChange: number;

  @CreateDateColumn()
  createdAt: Date;
}
