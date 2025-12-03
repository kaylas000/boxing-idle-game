import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Player } from '../../player/entities/player.entity';

@Entity('tournament_participants')
export class TournamentParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants)
  tournament: Tournament;

  @ManyToOne(() => Player)
  player: Player;

  @Column({ default: 'active' })
  status: 'active' | 'eliminated' | 'winner';

  @Column({ type: 'int', nullable: true })
  placement: number;

  @Column({ type: 'int', default: 0 })
  prize: number;

  @CreateDateColumn()
  createdAt: Date;
}
