import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenId: string;

  @Column()
  sellerAddress: string;

  @Column()
  buyerAddress: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @Column({ default: 'BOX' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
