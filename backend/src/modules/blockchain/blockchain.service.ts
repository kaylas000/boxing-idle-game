import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { Player } from '../player/entities/player.entity';
import { TonClient, WalletContractV4, Address } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

// BOX Token Contract Address (после деплоя)
const BOX_TOKEN_CONTRACT = process.env.BOX_TOKEN_CONTRACT || 'EQD...';
const NFT_COLLECTION_CONTRACT = process.env.NFT_COLLECTION_CONTRACT || 'EQD...';

@Injectable()
export class BlockchainService {
  private tonClient: TonClient;

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {
    // Инициализация TON клиента
    this.tonClient = new TonClient({
      endpoint: process.env.TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TON_API_KEY,
    });
  }

  /**
   * Создать или получить кошелёк игрока
   */
  async getOrCreateWallet(playerId: string) {
    let wallet = await this.walletRepository.findOne({
      where: { player: { id: playerId } },
    });

    if (!wallet) {
      // Генерация нового TON кошелька
      const mnemonic = await this.generateMnemonic();
      const keyPair = await mnemonicToPrivateKey(mnemonic);
      const workchain = 0;
      const walletContract = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
      const address = walletContract.address.toString();

      const player = await this.playerRepository.findOne({
        where: { id: playerId },
      });

      wallet = this.walletRepository.create({
        player,
        address,
        mnemonic: this.encryptMnemonic(mnemonic), // Шифрование в production!
        boxTokenBalance: 0,
        tonBalance: 0,
      });

      await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  /**
   * Получить баланс BOX токенов
   */
  async getBoxTokenBalance(playerId: string): Promise<number> {
    const wallet = await this.getOrCreateWallet(playerId);
    
    // В production: запрос к смарт-контракту BOX token
    // const balance = await this.queryTokenBalance(wallet.address);
    
    return wallet.boxTokenBalance;
  }

  /**
   * Начислить BOX токены (in-game earnings)
   */
  async mintBoxTokens(playerId: string, amount: number, reason: string) {
    const wallet = await this.getOrCreateWallet(playerId);
    
    wallet.boxTokenBalance += amount;
    await this.walletRepository.save(wallet);

    // Записать транзакцию
    const transaction = this.transactionRepository.create({
      wallet,
      type: 'mint',
      amount,
      token: 'BOX',
      status: 'completed',
      metadata: { reason },
    });

    await this.transactionRepository.save(transaction);

    return {
      newBalance: wallet.boxTokenBalance,
      transaction,
    };
  }

  /**
   * Перевод BOX токенов между игроками
   */
  async transferBoxTokens(
    fromPlayerId: string,
    toAddress: string,
    amount: number,
  ) {
    const fromWallet = await this.getOrCreateWallet(fromPlayerId);

    if (fromWallet.boxTokenBalance < amount) {
      throw new BadRequestException('Недостаточно BOX токенов');
    }

    // В production: вызов смарт-контракта
    // await this.executeTokenTransfer(fromWallet.address, toAddress, amount);

    fromWallet.boxTokenBalance -= amount;
    await this.walletRepository.save(fromWallet);

    // Записать транзакцию
    const transaction = this.transactionRepository.create({
      wallet: fromWallet,
      type: 'transfer',
      amount,
      token: 'BOX',
      toAddress,
      status: 'completed',
    });

    await this.transactionRepository.save(transaction);

    return transaction;
  }

  /**
   * Вывод BOX токенов на внешний кошелёк
   */
  async withdrawBoxTokens(
    playerId: string,
    toAddress: string,
    amount: number,
  ) {
    const wallet = await this.getOrCreateWallet(playerId);

    // Минимальная сумма для вывода
    if (amount < 100) {
      throw new BadRequestException('Минимальная сумма вывода: 100 BOX');
    }

    if (wallet.boxTokenBalance < amount) {
      throw new BadRequestException('Недостаточно токенов');
    }

    // Комиссия 5%
    const fee = amount * 0.05;
    const netAmount = amount - fee;

    // В production: отправка на TON blockchain
    // const txHash = await this.sendTokensToBlockchain(wallet, toAddress, netAmount);

    wallet.boxTokenBalance -= amount;
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      wallet,
      type: 'withdraw',
      amount: netAmount,
      token: 'BOX',
      toAddress,
      status: 'pending', // Будет 'completed' после подтверждения в blockchain
      metadata: { fee },
    });

    await this.transactionRepository.save(transaction);

    return {
      transaction,
      fee,
      netAmount,
    };
  }

  /**
   * Получить историю транзакций
   */
  async getTransactionHistory(playerId: string, page: number = 1, limit: number = 20) {
    const wallet = await this.getOrCreateWallet(playerId);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { wallet: { id: wallet.id } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async generateMnemonic(): Promise<string[]> {
    // Генерация 24-словной мнемоники для TON
    // В production использовать @ton/crypto
    return [
      'word1', 'word2', /* ... 24 слова */
    ];
  }

  private encryptMnemonic(mnemonic: string[]): string {
    // В production: шифрование AES-256
    return JSON.stringify(mnemonic);
  }
}
