import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Player)
  @JoinColumn()
  player: Player;

  @Column({ unique: true })
  address: string;

  @Column({ select: false }) // Не возвращать в API по умолчанию
  privateKey: string;

  @Column({ nullable: true, select: false })
  mnemonic: string;

  // Балансы токенов
  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  boxTokenBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  nftTokenBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  stakedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastStakeTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
