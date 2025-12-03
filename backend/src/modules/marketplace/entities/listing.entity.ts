import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { NFT } from '../../nft/entities/nft.entity';
import { Player } from '../../player/entities/player.entity';

@Entity('marketplace_listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => NFT)
  @JoinColumn()
  nft: NFT;

  @ManyToOne(() => Player)
  seller: Player;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  price: number;

  @Column()
  currency: 'BOX' | 'TON';

  @Column({ default: 'active' })
  status: 'active' | 'sold' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
