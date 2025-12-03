import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { Player } from '../player/entities/player.entity';
import { createHmac } from 'crypto';

// Товары в магазине
export const PRODUCTS = [
  {
    id: 'starter_pack',
    name: 'Стартовый пакет',
    description: '10,000 монет + 5 карт',
    price: 50, // Telegram Stars
    rewards: {
      money: 10000,
      cards: 5,
    },
  },
  {
    id: 'pro_pack',
    name: 'Профессиональный пакет',
    description: '50,000 монет + 10 карт + 1 легендарная',
    price: 200,
    rewards: {
      money: 50000,
      cards: 10,
      legendary: 1,
    },
  },
  {
    id: 'champion_pack',
    name: 'Пакет Чемпиона',
    description: '200,000 монет + 20 карт + 5 легендарных',
    price: 500,
    rewards: {
      money: 200000,
      cards: 20,
      legendary: 5,
    },
  },
  {
    id: 'energy_refill',
    name: 'Полное восстановление энергии',
    description: 'Мгновенно восстановить 100 энергии',
    price: 10,
    rewards: {
      energy: 100,
    },
  },
  {
    id: 'premium_month',
    name: 'Премиум на месяц',
    description: 'x2 к наградам за бои, эксклюзивные карты',
    price: 300,
    rewards: {
      premium: 30, // days
    },
  },
];

@Injectable()
export class IapService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async getProducts() {
    return PRODUCTS;
  }

  async createPayment(playerId: string, productId: string) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new BadRequestException('Товар не найден');
    }

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Игрок не найден');
    }

    // Создать invoice для Telegram Stars
    const invoice = {
      title: product.name,
      description: product.description,
      payload: JSON.stringify({
        playerId,
        productId,
        timestamp: Date.now(),
      }),
      provider_token: '', // Пусто для Telegram Stars
      currency: 'XTR', // Telegram Stars
      prices: [
        {
          label: product.name,
          amount: product.price,
        },
      ],
    };

    return {
      invoice,
      product,
    };
  }

  async processPayment(data: any) {
    // Верификация Telegram payment
    const isValid = this.verifyTelegramPayment(data);
    if (!isValid) {
      throw new BadRequestException('Неверная подпись платежа');
    }

    const payload = JSON.parse(data.invoice_payload);
    const { playerId, productId } = payload;

    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new BadRequestException('Товар не найден');
    }

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Игрок не найден');
    }

    // Применить награды
    if (product.rewards.money) {
      player.money = Number(player.money) + product.rewards.money;
    }
    if (product.rewards.energy) {
      player.energy = Math.min(100, player.energy + product.rewards.energy);
    }
    if (product.rewards.premium) {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + product.rewards.premium);
      (player as any).premiumUntil = premiumUntil;
    }

    await this.playerRepository.save(player);

    // Сохранить покупку
    const purchase = this.purchaseRepository.create({
      player,
      productId,
      amount: product.price,
      currency: 'XTR',
      transactionId: data.telegram_payment_charge_id,
      status: 'completed',
    });

    await this.purchaseRepository.save(purchase);

    return {
      success: true,
      rewards: product.rewards,
      player,
    };
  }

  private verifyTelegramPayment(data: any): boolean {
    // В production здесь будет верификация подписи Telegram
    // Используя BOT_TOKEN
    return true;
  }

  async getPurchaseHistory(playerId: string, page: number = 1, limit: number = 20) {
    const [purchases, total] = await this.purchaseRepository.findAndCount({
      where: { player: { id: playerId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      purchases,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
