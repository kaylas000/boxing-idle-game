import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @Column({ type: 'json' })
  bonus: Record<string, number>;

  @Column({ type: 'int' })
  price: number;

  @Column({ nullable: true })
  description: string;
}
