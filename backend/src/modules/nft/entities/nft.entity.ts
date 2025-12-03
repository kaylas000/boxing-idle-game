import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { NFTMetadata } from './nft-metadata.entity';

@Entity('nfts')
export class NFT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tokenId: string;

  @ManyToOne(() => Player)
  owner: Player;

  @ManyToOne(() => NFTMetadata)
  @JoinColumn()
  metadata: NFTMetadata;

  @Column()
  type: string; // boxer, equipment, gym, trainer, title_belt

  @Column()
  rarity: string; // common, rare, epic, legendary, mythic

  @Column({ default: false })
  equipped: boolean; // Экипирован ли NFT

  @Column({ default: false })
  onChain: boolean; // Выпущен ли в блокчейн

  @Column({ nullable: true })
  contractAddress: string; // Адрес NFT Collection контракта

  @Column({ nullable: true })
  blockchainTxHash: string; // Hash транзакции минта в блокчейне

  @Column({ type: 'timestamp' })
  mintedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
