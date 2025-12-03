import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { Trade } from './entities/trade.entity';
import { NFT } from '../nft/entities/nft.entity';
import { Player } from '../player/entities/player.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    @InjectRepository(Trade)
    private tradeRepository: Repository<Trade>,
    @InjectRepository(NFT)
    private nftRepository: Repository<NFT>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private blockchainService: BlockchainService,
  ) {}

  /**
   * Создать листинг NFT на маркетплейсе
   */
  async createListing(
    nftId: string,
    sellerId: string,
    price: number,
    currency: 'BOX' | 'TON',
  ) {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId, owner: { id: sellerId } },
      relations: ['metadata', 'owner'],
    });

    if (!nft) {
      throw new BadRequestException('NFT не найден или не принадлежит вам');
    }

    if (nft.equipped) {
      throw new BadRequestException('Снимите NFT перед продажей');
    }

    const listing = this.listingRepository.create({
      nft,
      seller: nft.owner,
      price,
      currency,
      status: 'active',
    });

    await this.listingRepository.save(listing);

    return listing;
  }

  /**
   * Купить NFT с маркетплейса
   */
  async buyListing(listingId: string, buyerId: string) {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, status: 'active' },
      relations: ['nft', 'seller', 'nft.metadata'],
    });

    if (!listing) {
      throw new BadRequestException('Листинг не найден');
    }

    const buyer = await this.playerRepository.findOne({
      where: { id: buyerId },
    });

    if (!buyer) {
      throw new BadRequestException('Покупатель не найден');
    }

    if (buyer.id === listing.seller.id) {
      throw new BadRequestException('Нельзя купить свой собственный NFT');
    }

    // Проверка баланса
    const buyerWallet = await this.blockchainService.getOrCreateWallet(buyerId);

    if (listing.currency === 'BOX') {
      if (buyerWallet.boxTokenBalance < listing.price) {
        throw new BadRequestException('Недостаточно BOX токенов');
      }
    } else if (listing.currency === 'TON') {
      if (buyerWallet.tonBalance < listing.price) {
        throw new BadRequestException('Недостаточно TON');
      }
    }

    // Комиссия маркетплейса 5%
    const fee = listing.price * 0.05;
    const sellerAmount = listing.price - fee;

    // Перевод токенов
    if (listing.currency === 'BOX') {
      buyerWallet.boxTokenBalance -= listing.price;
      
      const sellerWallet = await this.blockchainService.getOrCreateWallet(listing.seller.id);
      sellerWallet.boxTokenBalance += sellerAmount;
      
      // Сохранить (в транзакции)
    }

    // Перенос владения NFT
    listing.nft.owner = buyer;
    await this.nftRepository.save(listing.nft);

    // Закрыть листинг
    listing.status = 'sold';
    await this.listingRepository.save(listing);

    // Создать запись сделки
    const trade = this.tradeRepository.create({
      listing,
      buyer,
      price: listing.price,
      currency: listing.currency,
      fee,
    });

    await this.tradeRepository.save(trade);

    return {
      trade,
      nft: listing.nft,
    };
  }

  /**
   * Получить активные листинги на маркетплейсе
   */
  async getActiveListings(
    type?: string,
    rarity?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
    limit: number = 20,
  ) {
    const query = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.nft', 'nft')
      .leftJoinAndSelect('nft.metadata', 'metadata')
      .leftJoinAndSelect('listing.seller', 'seller')
      .where('listing.status = :status', { status: 'active' });

    if (type) {
      query.andWhere('nft.type = :type', { type });
    }

    if (rarity) {
      query.andWhere('nft.rarity = :rarity', { rarity });
    }

    if (minPrice) {
      query.andWhere('listing.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice });
    }

    const [listings, total] = await query
      .orderBy('listing.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Отменить листинг
   */
  async cancelListing(listingId: string, sellerId: string) {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, seller: { id: sellerId }, status: 'active' },
    });

    if (!listing) {
      throw new BadRequestException('Листинг не найден');
    }

    listing.status = 'cancelled';
    await this.listingRepository.save(listing);

    return listing;
  }
}
