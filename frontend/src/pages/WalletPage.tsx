import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wallet, Send, Download, TrendingUp, History } from 'lucide-react';
import { walletAPI } from '@/lib/api';
import { useState } from 'react';

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletAPI.getWallet().then(res => res.data),
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletAPI.getTransactions().then(res => res.data),
  });

  const withdrawMutation = useMutation({
    mutationFn: () => walletAPI.withdraw(withdrawAddress, Number(withdrawAmount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setWithdrawAmount('');
      setWithdrawAddress('');
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const boxUsdPrice = 0.05; // $0.05 за BOX token (примерная цена)

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">👛 Кошелёк</h1>
        <p className="text-gray-400">Управление BOX токенами и NFT активами</p>
      </motion.div>

      {/* Баланс */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">BOX Token Balance</div>
              <div className="text-4xl font-bold">{wallet?.boxTokenBalance?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-400 mt-1">
                ≈ ${((wallet?.boxTokenBalance || 0) * boxUsdPrice).toFixed(2)} USD
              </div>
            </div>
            <Wallet className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+12.5% за 24ч</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">TON Balance</div>
              <div className="text-4xl font-bold">{wallet?.tonBalance?.toFixed(4) || '0.0000'}</div>
              <div className="text-sm text-gray-400 mt-1">
                TON Blockchain
              </div>
            </div>
            <img src="https://ton.org/download/ton_symbol.png" className="w-12 h-12" alt="TON" />
          </div>
          
          <div className="text-sm text-gray-400">
            Wallet: {wallet?.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : 'N/A'}
          </div>
        </motion.div>
      </div>

      {/* Действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Вывод токенов */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Send className="w-6 h-6" />
            Вывод BOX токенов
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="form-label">TON адрес получателя</label>
              <input
                type="text"
                placeholder="EQD..."
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="form-control"
              />
            </div>
            
            <div>
              <label className="form-label">Количество BOX</label>
              <input
                type="number"
                placeholder="100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="form-control"
              />
              <div className="text-xs text-gray-400 mt-1">
                Минимум: 100 BOX | Комиссия: 5%
              </div>
            </div>

            <button
              onClick={() => withdrawMutation.mutate()}
              disabled={!withdrawAmount || !withdrawAddress || withdrawMutation.isPending}
              className="btn btn-primary w-full"
            >
              {withdrawMutation.isPending ? 'Отправка...' : 'Вывести токены'}
            </button>
          </div>
        </div>

        {/* Staking Info */}
        <div className="card bg-gradient-to-br from-green-900/30 to-blue-900/30 border-2 border-green-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Staking
          </h3>
          
          <p className="text-gray-400 mb-4">
            Stake ваши BOX токены и получайте пассивный доход до 50% APY!
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">30 дней:</span>
              <span className="font-bold text-green-500">15% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">90 дней:</span>
              <span className="font-bold text-green-500">30% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">180 дней:</span>
              <span className="font-bold text-yellow-500">50% APY</span>
            </div>
          </div>

          <button className="btn btn-success w-full">
            🔒 Stake Tokens
          </button>
        </div>
      </div>

      {/* История транзакций */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="w-6 h-6" />
          История транзакций
        </h3>
        
        <div className="space-y-2">
          {transactions?.transactions?.slice(0, 10).map((tx: any) => (
            <div key={tx.id} className="bg-dark-700 p-3 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold">
                  {tx.type === 'mint' && '✨ Начислено'}
                  {tx.type === 'transfer' && '➡️ Отправлено'}
                  {tx.type === 'withdraw' && '📤 Вывод'}
                  {tx.type === 'stake' && '🔒 Staking'}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(tx.createdAt).toLocaleString('ru')}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-bold text-lg ${
                  tx.type === 'mint' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {tx.type === 'mint' ? '+' : '-'}{tx.amount} {tx.token}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  tx.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                  tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
