import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('market_listings')
export class MarketListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenId: string;

  @Column()
  sellerAddress: string;

  @Column({ nullable: true })
  buyerAddress: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @Column({ default: 'BOX' })
  currency: string;

  @Column({ default: 'active' })
  status: 'active' | 'sold' | 'cancelled';

  @Column({ type: 'timestamp', nullable: true })
  soldAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
