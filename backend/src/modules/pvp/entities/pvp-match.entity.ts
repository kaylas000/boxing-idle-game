import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('pvp_matches')
export class PvpMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  player1: Player;

  @ManyToOne(() => Player)
  player2: Player;

  @Column({ nullable: true })
  winnerId: string;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @Column({ type: 'int', default: 0 })
  rounds: number;

  @Column({ type: 'json', nullable: true })
  fightLog: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
