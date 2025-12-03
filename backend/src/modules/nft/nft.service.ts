import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NFT } from './entities/nft.entity';
import { NFTMetadata } from './entities/nft-metadata.entity';
import { Player } from '../player/entities/player.entity';
import { BlockchainService } from '../blockchain/blockchain.service';

/**
 * Типы NFT в игре
 */
export const NFT_TYPES = {
  BOXER: 'boxer',           // Уникальный боксёр с характеристиками
  EQUIPMENT: 'equipment',   // Перчатки, шорты, обувь
  GYM: 'gym',              // Зал для тренировок
  TRAINER: 'trainer',       // Тренер с бонусами
  TITLE_BELT: 'title_belt', // Пояс чемпиона
};

export const NFT_RARITIES = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHIC: 'mythic',
};

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NFT)
    private nftRepository: Repository<NFT>,
    @InjectRepository(NFTMetadata)
    private metadataRepository: Repository<NFTMetadata>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private blockchainService: BlockchainService,
  ) {}

  /**
   * Создать (mint) новый NFT
   */
  async mintNFT(
    playerId: string,
    type: string,
    rarity: string,
    attributes: any,
  ) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Игрок не найден');
    }

    // Генерация уникального tokenId
    const tokenId = this.generateTokenId();

    // Создание метаданных NFT
    const metadata = this.metadataRepository.create({
      name: this.generateNFTName(type, rarity),
      description: this.generateNFTDescription(type, rarity, attributes),
      image: this.generateNFTImage(type, rarity),
      attributes,
      rarity,
      type,
    });

    await this.metadataRepository.save(metadata);

    // Создание NFT
    const nft = this.nftRepository.create({
      tokenId,
      owner: player,
      metadata,
      type,
      rarity,
      mintedAt: new Date(),
      onChain: false, // Сначала off-chain, потом можно выпустить on-chain
    });

    await this.nftRepository.save(nft);

    return nft;
  }

  /**
   * Выпустить NFT on-chain (в TON blockchain)
   */
  async publishToBlockchain(nftId: string, playerId: string) {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId, owner: { id: playerId } },
      relations: ['metadata', 'owner'],
    });

    if (!nft) {
      throw new BadRequestException('NFT не найден');
    }

    if (nft.onChain) {
      throw new BadRequestException('NFT уже в блокчейне');
    }

    // Стоимость публикации: 1 TON для gas fees
    const wallet = await this.blockchainService.getOrCreateWallet(playerId);
    
    // В production: вызов смарт-контракта NFT Collection
    // const txHash = await this.mintNFTOnChain(wallet, nft);
    const txHash = 'mock_tx_hash_' + Date.now();

    nft.onChain = true;
    nft.contractAddress = NFT_COLLECTION_CONTRACT;
    nft.blockchainTxHash = txHash;
    await this.nftRepository.save(nft);

    return {
      nft,
      txHash,
      explorerUrl: `https://tonscan.org/tx/${txHash}`,
    };
  }

  /**
   * Получить все NFT игрока
   */
  async getPlayerNFTs(playerId: string) {
    const nfts = await this.nftRepository.find({
      where: { owner: { id: playerId } },
      relations: ['metadata'],
      order: { mintedAt: 'DESC' },
    });

    return nfts;
  }

  /**
   * Применить бонусы от экипированных NFT
   */
  async getEquippedBonuses(playerId: string) {
    const nfts = await this.nftRepository.find({
      where: { 
        owner: { id: playerId },
        equipped: true,
      },
      relations: ['metadata'],
    });

    const bonuses = {
      power: 0,
      speed: 0,
      stamina: 0,
      defense: 0,
      moneyMultiplier: 1.0,
      expMultiplier: 1.0,
    };

    nfts.forEach((nft) => {
      const attrs = nft.metadata.attributes;
      bonuses.power += attrs.powerBonus || 0;
      bonuses.speed += attrs.speedBonus || 0;
      bonuses.stamina += attrs.staminaBonus || 0;
      bonuses.defense += attrs.defenseBonus || 0;
      bonuses.moneyMultiplier *= attrs.moneyMultiplier || 1.0;
      bonuses.expMultiplier *= attrs.expMultiplier || 1.0;
    });

    return bonuses;
  }

  /**
   * Экипировать/снять NFT
   */
  async toggleEquip(nftId: string, playerId: string) {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId, owner: { id: playerId } },
    });

    if (!nft) {
      throw new BadRequestException('NFT не найден');
    }

    nft.equipped = !nft.equipped;
    await this.nftRepository.save(nft);

    return nft;
  }

  // Helper methods
  private generateTokenId(): string {
    return `BOX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNFTName(type: string, rarity: string): string {
    const rarityPrefix = {
      common: '',
      rare: 'Редкий',
      epic: 'Эпический',
      legendary: 'Легендарный',
      mythic: 'Мифический',
    };

    const typeNames = {
      boxer: 'Боксёр',
      equipment: 'Экипировка',
      gym: 'Зал',
      trainer: 'Тренер',
      title_belt: 'Пояс Чемпиона',
    };

    return `${rarityPrefix[rarity]} ${typeNames[type]} #${Math.floor(Math.random() * 10000)}`;
  }

  private generateNFTDescription(type: string, rarity: string, attributes: any): string {
    return `Уникальный NFT типа ${type} редкости ${rarity}. ${JSON.stringify(attributes)}`;
  }

  private generateNFTImage(type: string, rarity: string): string {
    // В production: генерация или загрузка изображений на IPFS
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${type}_${rarity}_${Date.now()}`;
  }
}
