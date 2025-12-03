import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketListing } from './entities/market-listing.entity';
import { Sale } from './entities/sale.entity';
import { NftService } from '../nft/nft.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketListing)
    private listingRepository: Repository<MarketListing>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private nftService: NftService,
    private cryptoService: CryptoService,
  ) {}

  async getListings(page: number, limit: number, sort: string) {
    const queryBuilder = this.listingRepository
      .createQueryBuilder('listing')
      .where('listing.status = :status', { status: 'active' });

    // Сортировка
    switch (sort) {
      case 'price_low':
        queryBuilder.orderBy('listing.price', 'ASC');
        break;
      case 'price_high':
        queryBuilder.orderBy('listing.price', 'DESC');
        break;
      case 'recent':
      default:
        queryBuilder.orderBy('listing.createdAt', 'DESC');
    }

    const [listings, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyListings(playerId: string) {
    const wallet = await this.cryptoService.getOrCreateWallet(playerId);

    const listings = await this.listingRepository.find({
      where: { sellerAddress: wallet.address },
      order: { createdAt: 'DESC' },
    });

    return listings;
  }

  async createListing(playerId: string, listingDto: any) {
    const wallet = await this.cryptoService.getOrCreateWallet(playerId);

    // Проверить владение NFT
    const nft = await this.nftService.getNftById(listingDto.tokenId);
    if (nft.ownerAddress !== wallet.address) {
      throw new BadRequestException('Вы не являетесь владельцем этого NFT');
    }

    // Создать листинг
    const listing = this.listingRepository.create({
      tokenId: listingDto.tokenId,
      sellerAddress: wallet.address,
      price: listingDto.price,
      currency: listingDto.currency || 'BOX',
      status: 'active',
    });

    await this.listingRepository.save(listing);

    return {
      success: true,
      listing,
    };
  }

  async buyNft(buyerId: string, listingId: string) {
    const buyerWallet = await this.cryptoService.getOrCreateWallet(buyerId);

    const listing = await this.listingRepository.findOne({
      where: { id: listingId, status: 'active' },
    });

    if (!listing) {
      throw new NotFoundException('Листинг не найден');
    }

    if (listing.sellerAddress === buyerWallet.address) {
      throw new BadRequestException('Нельзя купить свой NFT');
    }

    // Проверить баланс
    const balances = await this.cryptoService.getBalances(buyerId);
    if (balances.boxTokens < listing.price) {
      throw new BadRequestException('Недостаточно токенов');
    }

    // Перевести токены
    await this.cryptoService.transferTokens(
      buyerId,
      listing.sellerAddress,
      listing.price,
      'BOX',
    );

    // Передать NFT
    await this.nftService.transferNft(
      buyerId,
      listing.tokenId,
      buyerWallet.address,
    );

    // Обновить листинг
    listing.status = 'sold';
    listing.buyerAddress = buyerWallet.address;
    listing.soldAt = new Date();
    await this.listingRepository.save(listing);

    // Создать запись о продаже
    const sale = this.saleRepository.create({
      tokenId: listing.tokenId,
      sellerAddress: listing.sellerAddress,
      buyerAddress: buyerWallet.address,
      price: listing.price,
      currency: listing.currency,
    });

    await this.saleRepository.save(sale);

    return {
      success: true,
      message: 'NFT успешно куплен',
      sale,
    };
  }

  async cancelListing(playerId: string, listingId: string) {
    const wallet = await this.cryptoService.getOrCreateWallet(playerId);

    const listing = await this.listingRepository.findOne({
      where: { id: listingId, sellerAddress: wallet.address },
    });

    if (!listing) {
      throw new NotFoundException('Листинг не найден');
    }

    listing.status = 'cancelled';
    await this.listingRepository.save(listing);

    return {
      success: true,
      message: 'Листинг отменён',
    };
  }

  async getMarketStats() {
    const [totalListings, activeListing, totalSales] = await Promise.all([
      this.listingRepository.count(),
      this.listingRepository.count({ where: { status: 'active' } }),
      this.saleRepository.count(),
    ]);

    // Общий объем торгов
    const volumeResult = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.price)', 'total')
      .getRawOne();

    return {
      totalListings,
      activeListings: activeListing,
      totalSales,
      totalVolume: volumeResult?.total || 0,
    };
  }

  async getSalesHistory(page: number, limit: number) {
    const [sales, total] = await this.saleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      sales,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
