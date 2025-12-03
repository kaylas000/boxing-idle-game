import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { Card } from './card.entity';

@Entity('player_cards')
export class PlayerCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, (player) => player.cards)
  player: Player;

  @ManyToOne(() => Card)
  card: Card;

  @CreateDateColumn()
  acquiredAt: Date;
}
