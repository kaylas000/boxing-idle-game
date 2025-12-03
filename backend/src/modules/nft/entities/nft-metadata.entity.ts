import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('nft_metadata')
export class NftMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image: string;

  @Column({ default: 'common' })
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @Column({ type: 'json' })
  attributes: any[];

  @CreateDateColumn()
  createdAt: Date;
}
