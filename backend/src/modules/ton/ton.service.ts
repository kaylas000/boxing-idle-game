import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TonClient, WalletContractV4, Address, beginCell, toNano } from '@ton/ton';
import { mnemonicToPrivateKey, mnemonicNew } from '@ton/crypto';
import { Player } from '../player/entities/player.entity';
import { TonTransaction } from './entities/ton-transaction.entity';

/**
 * TON Blockchain Integration Service
 * 
 * Все операции с токенами и NFT происходят напрямую в TON blockchain
 */

@Injectable()
export class TonService {
  private readonly logger = new Logger(TonService.name);
  private tonClient: TonClient;
  
  // Smart contract addresses (после деплоя)
  private readonly BOX_TOKEN_ADDRESS = process.env.BOX_TOKEN_ADDRESS || 'EQD...';
  private readonly NFT_COLLECTION_ADDRESS = process.env.NFT_COLLECTION_ADDRESS || 'EQD...';
  private readonly GAME_MASTER_WALLET = process.env.GAME_MASTER_WALLET || 'EQD...';

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(TonTransaction)
    private transactionRepository: Repository<TonTransaction>,
  ) {
    // Подключение к TON mainnet или testnet
    const endpoint = process.env.TON_NETWORK === 'mainnet'
      ? 'https://toncenter.com/api/v2/jsonRPC'
      : 'https://testnet.toncenter.com/api/v2/jsonRPC';

    this.tonClient = new TonClient({
      endpoint,
      apiKey: process.env.TONCENTER_API_KEY,
    });

    this.logger.log(`TON Service initialized on ${process.env.TON_NETWORK || 'testnet'}`);
  }

  /**
   * Связать TON кошелёк с аккаунтом игрока
   * Кошелёк игрока = его реальный TON Wallet в Telegram
   */
  async linkWallet(playerId: string, tonAddress: string) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // Проверка валидности TON адреса
    try {
      Address.parse(tonAddress);
    } catch (error) {
      throw new BadRequestException('Invalid TON address');
    }

    player.tonWalletAddress = tonAddress;
    await this.playerRepository.save(player);

    this.logger.log(`Player ${playerId} linked wallet ${tonAddress}`);

    return {
      success: true,
      walletAddress: tonAddress,
    };
  }

  /**
   * Получить баланс BOX токенов напрямую из blockchain
   */
  async getBoxTokenBalance(tonAddress: string): Promise<string> {
    try {
      const address = Address.parse(tonAddress);
      
      // Вызов get-метода Jetton Wallet
      const result = await this.tonClient.runMethod(
        address,
        'get_wallet_data'
      );

      const balance = result.stack.readBigNumber();
      
      // Конвертация из nano (9 decimals)
      return (Number(balance) / 1_000_000_000).toFixed(2);
    } catch (error) {
      this.logger.error(`Failed to get balance for ${tonAddress}:`, error);
      return '0';
    }
  }

  /**
   * Начислить BOX токены игроку (mint on-chain)
   * Используется для игровых наград
   */
  async mintBoxTokens(
    playerId: string,
    amount: number,
    reason: string,
  ) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player || !player.tonWalletAddress) {
      throw new BadRequestException('Player has no linked wallet');
    }

    try {
      // Подготовка транзакции mint через Game Master Wallet
      const gameMasterWallet = await this.getGameMasterWallet();
      
      const mintAmount = BigInt(Math.floor(amount * 1_000_000_000)); // в nano

      // Формирование сообщения для mint
      const mintMessage = beginCell()
        .storeUint(0x178d4519, 32) // op::mint
        .storeUint(Date.now(), 64)  // query_id
        .storeAddress(Address.parse(player.tonWalletAddress))
        .storeCoins(mintAmount)
        .endCell();

      // Отправка транзакции в TON
      const txHash = await this.sendTransaction(
        gameMasterWallet,
        this.BOX_TOKEN_ADDRESS,
        toNano('0.05'), // gas fee
        mintMessage,
      );

      // Сохранение записи о транзакции
      const transaction = this.transactionRepository.create({
        player,
        type: 'mint',
        amount: amount.toString(),
        token: 'BOX',
        toAddress: player.tonWalletAddress,
        txHash,
        status: 'pending',
        metadata: { reason },
      });

      await this.transactionRepository.save(transaction);

      this.logger.log(`Minted ${amount} BOX to ${player.tonWalletAddress}, tx: ${txHash}`);

      return {
        success: true,
        amount,
        txHash,
        explorerUrl: this.getExplorerUrl(txHash),
      };
    } catch (error) {
      this.logger.error(`Failed to mint tokens:`, error);
      throw new BadRequestException('Failed to mint tokens');
    }
  }

  /**
   * Создать (mint) NFT on-chain
   */
  async mintNFT(
    playerId: string,
    metadata: any,
  ) {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player || !player.tonWalletAddress) {
      throw new BadRequestException('Player has no linked wallet');
    }

    try {
      const gameMasterWallet = await this.getGameMasterWallet();

      // Формирование NFT content (согласно TEP-64)
      const nftContent = beginCell()
        .storeUint(0x01, 8) // on-chain content flag
        .storeStringTail(JSON.stringify(metadata))
        .endCell();

      // Формирование сообщения mint NFT
      const mintMessage = beginCell()
        .storeUint(1, 32) // op::mint
        .storeUint(Date.now(), 64) // query_id
        .storeAddress(Address.parse(player.tonWalletAddress))
        .storeRef(nftContent)
        .endCell();

      // Отправка транзакции
      const txHash = await this.sendTransaction(
        gameMasterWallet,
        this.NFT_COLLECTION_ADDRESS,
        toNano('0.05'),
        mintMessage,
      );

      const transaction = this.transactionRepository.create({
        player,
        type: 'nft_mint',
        token: 'NFT',
        toAddress: player.tonWalletAddress,
        txHash,
        status: 'pending',
        metadata,
      });

      await this.transactionRepository.save(transaction);

      this.logger.log(`Minted NFT to ${player.tonWalletAddress}, tx: ${txHash}`);

      return {
        success: true,
        txHash,
        explorerUrl: this.getExplorerUrl(txHash),
      };
    } catch (error) {
      this.logger.error(`Failed to mint NFT:`, error);
      throw new BadRequestException('Failed to mint NFT');
    }
  }

  /**
   * Получить все NFT игрока из blockchain
   */
  async getPlayerNFTs(tonAddress: string) {
    try {
      const address = Address.parse(tonAddress);

      // Запрос к NFT Collection для получения NFT адресов владельца
      const result = await this.tonClient.runMethod(
        Address.parse(this.NFT_COLLECTION_ADDRESS),
        'get_nft_address_by_index',
        [{ type: 'int', value: BigInt(0) }] // можно итерировать по индексам
      );

      // Получение данных каждого NFT
      // TODO: реализовать полную логику получения всех NFT

      return {
        nfts: [],
        total: 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get NFTs for ${tonAddress}:`, error);
      return { nfts: [], total: 0 };
    }
  }

  /**
   * Проверить статус транзакции в blockchain
   */
  async checkTransactionStatus(txHash: string) {
    try {
      // Запрос транзакции через TON API
      const response = await fetch(
        `https://toncenter.com/api/v2/getTransactions?` +
        `address=${this.GAME_MASTER_WALLET}&limit=100&hash=${txHash}`,
        {
          headers: {
            'X-API-Key': process.env.TONCENTER_API_KEY || '',
          },
        }
      );

      const data = await response.json();

      if (data.result && data.result.length > 0) {
        const tx = data.result[0];
        return {
          confirmed: true,
          success: tx.out_msgs?.length > 0,
          timestamp: tx.utime,
        };
      }

      return {
        confirmed: false,
        success: false,
      };
    } catch (error) {
      this.logger.error(`Failed to check tx ${txHash}:`, error);
      return { confirmed: false, success: false };
    }
  }

  /**
   * Обновить статусы pending транзакций
   */
  async updatePendingTransactions() {
    const pendingTxs = await this.transactionRepository.find({
      where: { status: 'pending' },
      take: 100,
    });

    for (const tx of pendingTxs) {
      const status = await this.checkTransactionStatus(tx.txHash);
      
      if (status.confirmed) {
        tx.status = status.success ? 'completed' : 'failed';
        await this.transactionRepository.save(tx);
        
        this.logger.log(`Transaction ${tx.txHash} ${tx.status}`);
      }
    }
  }

  /**
   * Получить Game Master Wallet (для mint операций)
   */
  private async getGameMasterWallet() {
    // В production: использовать защищённое хранилище для мнемоники
    const mnemonic = process.env.GAME_MASTER_MNEMONIC?.split(' ') || [];
    
    if (mnemonic.length !== 24) {
      throw new Error('Invalid Game Master mnemonic');
    }

    const keyPair = await mnemonicToPrivateKey(mnemonic);
    
    return WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });
  }

  /**
   * Отправить транзакцию в TON
   */
  private async sendTransaction(
    wallet: any,
    toAddress: string,
    amount: bigint,
    payload: any,
  ): Promise<string> {
    // Здесь должна быть реальная отправка через TON SDK
    // Возвращаем mock hash для примера
    const mockHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return mockHash;
  }

  /**
   * Получить URL для TON Explorer
   */
  private getExplorerUrl(txHash: string): string {
    const network = process.env.TON_NETWORK === 'mainnet' ? '' : 'testnet.';
    return `https://${network}tonscan.org/tx/${txHash}`;
  }

  /**
   * Проверить, есть ли у игрока достаточно BOX токенов
   */
  async hasEnoughTokens(tonAddress: string, requiredAmount: number): Promise<boolean> {
    const balance = await this.getBoxTokenBalance(tonAddress);
    return parseFloat(balance) >= requiredAmount;
  }
}
