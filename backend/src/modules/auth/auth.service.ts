import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private jwtService: JwtService,
  ) {}

  async telegramAuth(telegramAuthDto: TelegramAuthDto) {
    // Проверка подлинности данных Telegram
    const isValid = this.verifyTelegramAuth(telegramAuthDto);
    if (!isValid) {
      throw new UnauthorizedException('Неверные данные Telegram');
    }

    // Поиск или создание игрока
    let player = await this.playerRepository.findOne({
      where: { telegramId: telegramAuthDto.id.toString() },
    });

    if (!player) {
      player = this.playerRepository.create({
        telegramId: telegramAuthDto.id.toString(),
        username: telegramAuthDto.username,
        firstName: telegramAuthDto.first_name,
        lastName: telegramAuthDto.last_name,
      });
      await this.playerRepository.save(player);
    }

    // Генерация JWT токена
    const token = this.jwtService.sign({ sub: player.id });

    return {
      access_token: token,
      player: {
        id: player.id,
        username: player.username,
        level: player.level,
        rating: player.rating,
      },
    };
  }

  async createGuestAccount() {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const player = this.playerRepository.create({
      telegramId: guestId,
      username: `Guest_${Math.random().toString(36).substr(2, 6)}`,
      isGuest: true,
    });
    
    await this.playerRepository.save(player);
    const token = this.jwtService.sign({ sub: player.id });

    return {
      access_token: token,
      player: {
        id: player.id,
        username: player.username,
        isGuest: true,
      },
    };
  }

  private verifyTelegramAuth(data: TelegramAuthDto): boolean {
    // Упрощенная проверка для примера
    // В продакшене нужна полная проверка через crypto
    return true;
  }

  async validatePlayer(playerId: string): Promise<Player> {
    return this.playerRepository.findOne({ where: { id: playerId } });
  }
}
