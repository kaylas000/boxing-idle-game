import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

/**
 * TON Blockchain транзакции
 * Все операции с токенами и NFT записываются сюда
 */
@Entity('ton_transactions')
export class TonTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  player: Player;

  @Column()
  type: 'mint' | 'burn' | 'transfer' | 'nft_mint' | 'nft_transfer' | 'stake' | 'unstake';

  @Column({ nullable: true })
  amount: string; // Сумма в BOX (для token операций)

  @Column()
  token: 'BOX' | 'TON' | 'NFT';

  @Column({ nullable: true })
  toAddress: string; // TON адрес получателя

  @Column({ nullable: true })
  fromAddress: string; // TON адрес отправителя

  @Index()
  @Column({ unique: true })
  txHash: string; // Hash транзакции в TON blockchain

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Дополнительные данные (reason, NFT metadata...)

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date; // Когда подтверждена в blockchain
}
