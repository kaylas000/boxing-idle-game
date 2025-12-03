import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook для работы с TON Connect в Telegram Mini App
 * Автоматически связывает TON кошелёк с аккаунтом игрока
 */
export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress();
  const queryClient = useQueryClient();

  // Автоматическая привязка кошелька при подключении
  useEffect(() => {
    if (wallet && address) {
      linkWalletToAccount(address);
    }
  }, [wallet, address]);

  const linkWalletToAccount = async (tonAddress: string) => {
    try {
      await api.post('/ton/link-wallet', { tonAddress });
      
      // Обновить данные игрока
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      
      console.log('TON wallet linked:', tonAddress);
    } catch (error) {
      console.error('Failed to link wallet:', error);
    }
  };

  const connectWallet = async () => {
    try {
      await tonConnectUI.connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const sendTransaction = async (params: {
    to: string;
    amount: string;
    payload?: string;
  }) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 минут
        messages: [
          {
            address: params.to,
            amount: params.amount,
            payload: params.payload,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    wallet,
    address,
    isConnected: !!wallet,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    tonConnectUI,
  };
}
