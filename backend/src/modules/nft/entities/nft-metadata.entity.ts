import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('nft_metadata')
export class NFTMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image: string; // URL or IPFS hash

  @Column()
  type: string;

  @Column()
  rarity: string;

  @Column({ type: 'jsonb' })
  attributes: {
    // Бонусы к характеристикам
    powerBonus?: number;
    speedBonus?: number;
    staminaBonus?: number;
    defenseBonus?: number;
    
    // Мультипликаторы
    moneyMultiplier?: number;
    expMultiplier?: number;
    
    // Специальные способности
    specialAbility?: string;
    
    // Визуальные атрибуты
    color?: string;
    style?: string;
    
    // Уникальность
    serialNumber?: number;
    edition?: string;
  };

  @CreateDateColumn()
  createdAt: Date;
}
