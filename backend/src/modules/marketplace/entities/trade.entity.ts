import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Listing } from './listing.entity';
import { Player } from '../../player/entities/player.entity';

@Entity('marketplace_trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Listing)
  listing: Listing;

  @ManyToOne(() => Player)
  buyer: Player;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  price: number;

  @Column()
  currency: 'BOX' | 'TON';

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  fee: number; // Комиссия маркетплейса (5%)

  @CreateDateColumn()
  createdAt: Date;
}
