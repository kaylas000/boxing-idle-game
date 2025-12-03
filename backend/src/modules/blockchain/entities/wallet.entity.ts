import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Player)
  @JoinColumn()
  player: Player;

  @Column({ unique: true })
  address: string; // TON wallet address

  @Column({ type: 'text' })
  mnemonic: string; // Encrypted!

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  boxTokenBalance: number; // BOX tokens (in-game)

  @Column({ type: 'decimal', precision: 20, scale: 9, default: 0 })
  tonBalance: number; // TON balance

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
