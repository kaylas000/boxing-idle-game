import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import * as ethers from 'ethers';

@Injectable()
export class CryptoService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
  ) {
    // Инициализация провайдера (TON/Ethereum)
    const rpcUrl = this.configService.get('BLOCKCHAIN_RPC_URL');
    if (rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
  }

  async getOrCreateWallet(playerId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({
      where: { player: { id: playerId } },
    });

    if (!wallet) {
      // Создать новый кошелёк
      const ethWallet = ethers.Wallet.createRandom();
      
      wallet = this.walletRepository.create({
        player: { id: playerId } as any,
        address: ethWallet.address,
        privateKey: ethWallet.privateKey, // В продакшене шифровать!
        mnemonic: ethWallet.mnemonic?.phrase,
        boxTokenBalance: 0,
        nftTokenBalance: 0,
      });

      await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  async createWallet(playerId: string, createWalletDto: any): Promise<Wallet> {
    const existingWallet = await this.walletRepository.findOne({
      where: { player: { id: playerId } },
    });

    if (existingWallet) {
      throw new BadRequestException('Кошелёк уже существует');
    }

    // Импорт существующего кошелька или создание нового
    let ethWallet: ethers.HDNodeWallet;

    if (createWalletDto.privateKey) {
      ethWallet = new ethers.Wallet(createWalletDto.privateKey);
    } else if (createWalletDto.mnemonic) {
      ethWallet = ethers.Wallet.fromPhrase(createWalletDto.mnemonic);
    } else {
      ethWallet = ethers.Wallet.createRandom();
    }

    const wallet = this.walletRepository.create({
      player: { id: playerId } as any,
      address: ethWallet.address,
      privateKey: ethWallet.privateKey,
      mnemonic: ethWallet.mnemonic?.phrase,
      boxTokenBalance: 0,
      nftTokenBalance: 0,
    });

    return this.walletRepository.save(wallet);
  }

  async getBalances(playerId: string) {
    const wallet = await this.getOrCreateWallet(playerId);

    // Получить балансы из блокчейна
    let onChainBalance = '0';
    if (this.provider) {
      try {
        const balance = await this.provider.getBalance(wallet.address);
        onChainBalance = ethers.formatEther(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }

    return {
      address: wallet.address,
      boxTokens: wallet.boxTokenBalance,
      nftTokens: wallet.nftTokenBalance,
      nativeBalance: onChainBalance,
    };
  }

  async transferTokens(
    senderId: string,
    recipientAddress: string,
    amount: number,
    tokenType: 'BOX' | 'NFT',
  ) {
    const senderWallet = await this.getOrCreateWallet(senderId);

    // Проверка баланса
    const balance =
      tokenType === 'BOX'
        ? senderWallet.boxTokenBalance
        : senderWallet.nftTokenBalance;

    if (balance < amount) {
      throw new BadRequestException('Недостаточно токенов');
    }

    // Найти получателя
    const recipientWallet = await this.walletRepository.findOne({
      where: { address: recipientAddress },
    });

    if (!recipientWallet) {
      throw new BadRequestException('Получатель не найден');
    }

    // Выполнить трансфер
    if (tokenType === 'BOX') {
      senderWallet.boxTokenBalance -= amount;
      recipientWallet.boxTokenBalance += amount;
    } else {
      senderWallet.nftTokenBalance -= amount;
      recipientWallet.nftTokenBalance += amount;
    }

    await this.walletRepository.save([senderWallet, recipientWallet]);

    // Записать транзакцию
    const transaction = this.transactionRepository.create({
      fromAddress: senderWallet.address,
      toAddress: recipientAddress,
      amount,
      tokenType,
      status: 'completed',
      type: 'transfer',
    });

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      transactionHash: transaction.id,
      newBalance:
        tokenType === 'BOX'
          ? senderWallet.boxTokenBalance
          : senderWallet.nftTokenBalance,
    };
  }

  async claimRewards(playerId: string, rewardType: string) {
    const wallet = await this.getOrCreateWallet(playerId);

    // Логика начисления наград
    let rewardAmount = 0;
    let tokenType: 'BOX' | 'NFT' = 'BOX';

    switch (rewardType) {
      case 'daily':
        rewardAmount = 100;
        break;
      case 'win':
        rewardAmount = 50;
        break;
      case 'level_up':
        rewardAmount = 200;
        break;
      default:
        throw new BadRequestException('Неизвестный тип награды');
    }

    wallet.boxTokenBalance += rewardAmount;
    await this.walletRepository.save(wallet);

    // Записать транзакцию
    const transaction = this.transactionRepository.create({
      fromAddress: 'system',
      toAddress: wallet.address,
      amount: rewardAmount,
      tokenType,
      status: 'completed',
      type: 'reward',
    });

    await this.transactionRepository.save(transaction);

    return {
      success: true,
      rewardAmount,
      newBalance: wallet.boxTokenBalance,
    };
  }

  async getTransactionHistory(playerId: string) {
    const wallet = await this.getOrCreateWallet(playerId);

    const transactions = await this.transactionRepository.find({
      where: [
        { fromAddress: wallet.address },
        { toAddress: wallet.address },
      ],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return transactions;
  }

  async estimateGasPrice() {
    if (!this.provider) {
      return { gasPrice: '0', gasPriceGwei: '0' };
    }

    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice?.toString() || '0',
        gasPriceGwei: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      };
    } catch (error) {
      console.error('Error fetching gas price:', error);
      return { gasPrice: '0', gasPriceGwei: '0' };
    }
  }

  async mintTokens(playerId: string, amount: number, tokenType: 'BOX' | 'NFT') {
    const wallet = await this.getOrCreateWallet(playerId);

    if (tokenType === 'BOX') {
      wallet.boxTokenBalance += amount;
    } else {
      wallet.nftTokenBalance += amount;
    }

    await this.walletRepository.save(wallet);

    return {
      success: true,
      newBalance:
        tokenType === 'BOX'
          ? wallet.boxTokenBalance
          : wallet.nftTokenBalance,
    };
  }
}
