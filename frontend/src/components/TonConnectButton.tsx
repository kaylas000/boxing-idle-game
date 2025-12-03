import { TonConnectButton as TonConnectButtonSDK } from '@tonconnect/ui-react';
import { useTonConnect } from '@/hooks/useTonConnect';

/**
 * Кнопка подключения TON кошелька
 * Автоматически интегрируется с Telegram Wallet
 */
export function TonConnectButton() {
  const { address, isConnected } = useTonConnect();

  return (
    <div className="flex flex-col items-center gap-2">
      <TonConnectButtonSDK />
      
      {isConnected && address && (
        <div className="text-xs text-gray-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
}
