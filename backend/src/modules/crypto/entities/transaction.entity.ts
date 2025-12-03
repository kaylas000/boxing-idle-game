import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column()
  tokenType: 'BOX' | 'NFT' | 'NATIVE';

  @Column()
  type: 'transfer' | 'reward' | 'stake' | 'unstake' | 'purchase' | 'sale';

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Column({ nullable: true })
  blockchainTxHash: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
