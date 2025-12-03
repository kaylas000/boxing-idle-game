import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('player_achievements')
export class PlayerAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  player: Player;

  @Column()
  achievementId: string;

  @CreateDateColumn()
  unlockedAt: Date;
}
