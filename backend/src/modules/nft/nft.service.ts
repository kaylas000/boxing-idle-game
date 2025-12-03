import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nft } from './entities/nft.entity';
import { NftMetadata } from './entities/nft-metadata.entity';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,
    @InjectRepository(NftMetadata)
    private metadataRepository: Repository<NftMetadata>,
    private cryptoService: CryptoService,
  ) {}

  async getPlayerNfts(playerId: string) {
    const wallet = await this.cryptoService.getOrCreateWallet(playerId);

    const nfts = await this.nftRepository.find({
      where: { ownerAddress: wallet.address },
      relations: ['metadata'],
      order: { createdAt: 'DESC' },
    });

    return {
      total: nfts.length,
      nfts: nfts.map(nft => ({
        tokenId: nft.tokenId,
        name: nft.metadata.name,
        image: nft.metadata.image,
        rarity: nft.metadata.rarity,
        attributes: nft.metadata.attributes,
        type: nft.nftType,
      })),
    };
  }

  async getNftById(tokenId: string) {
    const nft = await this.nftRepository.findOne({
      where: { tokenId },
      relations: ['metadata'],
    });

    if (!nft) {
      throw new NotFoundException('NFT не найден');
    }

    return nft;
  }

  async mintNft(playerId: string, mintDto: any) {
    const wallet = await this.cryptoService.getOrCreateWallet(playerId);

    // Создать метаданные
    const metadata = this.metadataRepository.create({
      name: mintDto.name,
      description: mintDto.description,
      image: mintDto.image || this.generateDefaultImage(mintDto.type),
      rarity: mintDto.rarity || 'common',
      attributes: mintDto.attributes || this.generateDefaultAttributes(mintDto.type),
    });

    await this.metadataRepository.save(metadata);

    // Создать NFT
    const tokenId = this.generateTokenId();
    const nft = this.nftRepository.create({
      tokenId,
      ownerAddress: wallet.address,
      nftType: mintDto.type,
      metadata,
    });

    await this.nftRepository.save(nft);

    return {
      success: true,
      tokenId,
      nft: {
        tokenId: nft.tokenId,
        name: metadata.name,
        image: metadata.image,
        rarity: metadata.rarity,
      },
    };
  }

  async transferNft(senderId: string, tokenId: string, recipientAddress: string) {
    const senderWallet = await this.cryptoService.getOrCreateWallet(senderId);

    const nft = await this.nftRepository.findOne({
      where: { tokenId, ownerAddress: senderWallet.address },
    });

    if (!nft) {
      throw new BadRequestException('NFT не найден или не принадлежит вам');
    }

    // Передать NFT
    nft.ownerAddress = recipientAddress;
    await this.nftRepository.save(nft);

    return {
      success: true,
      message: 'NFT успешно передан',
    };
  }

  async getNftMetadata(tokenId: string) {
    const nft = await this.nftRepository.findOne({
      where: { tokenId },
      relations: ['metadata'],
    });

    if (!nft) {
      throw new NotFoundException('NFT не найден');
    }

    return {
      name: nft.metadata.name,
      description: nft.metadata.description,
      image: nft.metadata.image,
      attributes: nft.metadata.attributes,
      rarity: nft.metadata.rarity,
    };
  }

  async getNftsByType(type: string, page: number, limit: number) {
    const [nfts, total] = await this.nftRepository.findAndCount({
      where: { nftType: type },
      relations: ['metadata'],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    return {
      nfts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateTokenId(): string {
    return `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDefaultImage(type: string): string {
    const images = {
      fighter: '🥊',
      gloves: '🥊',
      equipment: '⚡',
      trophy: '🏆',
    };
    return images[type] || '🎴';
  }

  private generateDefaultAttributes(type: string): any[] {
    if (type === 'fighter') {
      return [
        { trait_type: 'Power', value: Math.floor(Math.random() * 100) },
        { trait_type: 'Speed', value: Math.floor(Math.random() * 100) },
        { trait_type: 'Stamina', value: Math.floor(Math.random() * 100) },
        { trait_type: 'Defense', value: Math.floor(Math.random() * 100) },
      ];
    }
    return [];
  }
}
