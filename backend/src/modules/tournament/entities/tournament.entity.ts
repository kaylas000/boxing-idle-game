import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TournamentParticipant } from './tournament-participant.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  maxParticipants: number;

  @Column({ type: 'int' })
  entryFee: number;

  @Column({ type: 'int' })
  prizePool: number;

  @Column()
  status: 'registration' | 'active' | 'completed';

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'json', nullable: true })
  bracket: any;

  @OneToMany(() => TournamentParticipant, (participant) => participant.tournament)
  participants: TournamentParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
