import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NftMetadata } from './nft-metadata.entity';

@Entity('nfts')
export class Nft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tokenId: string;

  @Column()
  ownerAddress: string;

  @Column()
  nftType: string; // fighter, equipment, trophy

  @ManyToOne(() => NftMetadata)
  @JoinColumn()
  metadata: NftMetadata;

  @Column({ default: false })
  isListed: boolean;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  listPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
