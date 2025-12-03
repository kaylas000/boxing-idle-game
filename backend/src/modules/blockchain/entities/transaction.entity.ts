import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column()
  type: 'mint' | 'burn' | 'transfer' | 'withdraw' | 'deposit' | 'stake' | 'unstake';

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number;

  @Column()
  token: 'BOX' | 'TON';

  @Column({ nullable: true })
  toAddress: string;

  @Column({ nullable: true })
  fromAddress: string;

  @Column({ nullable: true })
  txHash: string; // Blockchain transaction hash

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
