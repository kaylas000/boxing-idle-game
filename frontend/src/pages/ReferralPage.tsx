import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Copy, Share2, Trophy, Gift } from 'lucide-react';
import api from '../lib/api';
import { useUserStore } from '../stores/userStore';

interface ReferralStats {
  totalReferrals: number;
  referralsByLevel: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  totalEarnings: number;
  totalBoxTokens: number;
  milestones: Milestone[];
  topReferrals: any[];
}

interface Milestone {
  id: number;
  referralCount: number;
  milestone: number;
  rewards: {
    money?: number;
    boxTokens?: number;
    nftRarity?: string;
    revenueSharePercent?: number;
  };
  claimed: boolean;
  createdAt: string;
}

interface LeaderboardEntry {
  playerId: string;
  referralCount: number;
  totalEarnings: number;
  totalBoxTokens: number;
}

export const ReferralPage: React.FC = () => {
  const { user } = useUserStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Получить реферальные статистики
  const { data: stats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      const response = await api.get('/referral/stats');
      return response.data;
    },
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });

  // Получить реферальный код
  const { data: codeData } = useQuery({
    queryKey: ['referral-code'],
    queryFn: async () => {
      const response = await api.get('/referral/my-code');
      return response.data;
    },
  });

  // Получить лидерборд
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['referral-leaderboard'],
    queryFn: async () => {
      const response = await api.get('/referral/leaderboard?limit=50');
      return response.data;
    },
    refetchInterval: 60000,
  });

  // Получить награду за милстоун
  const claimMilestone = useMutation({
    mutationFn: (milestoneId: number) =>
      api.post(`/referral/milestone/${milestoneId}/claim`),
    onSuccess: () => {
      // Обновить статистику
      window.location.reload();
    },
  });

  const handleCopyCode = () => {
    if (codeData?.referralCode) {
      navigator.clipboard.writeText(codeData.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareText = `🤲 Вступи в Boxing Champion! Моя реферальный код: ${codeData?.referralCode}\n\n🤑 Графика и геймплей как в реальных боксёрских боях\n💰 Заработай реальные BOX токены`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Boxing Champion',
          text: shareText,
          url: `https://t.me/boxing_champion?ref=${codeData?.referralCode}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Навигация */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Referrals
        </h1>
      </div>

      {/* Ваш реферальный код */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="text-center mb-4">
          <p className="text-sm text-blue-100 mb-2">YOUR REFERRAL CODE</p>
          <div className="bg-black/30 rounded-lg p-4 flex items-center justify-center gap-3">
            <code className="text-2xl font-bold tracking-widest">
              {codeData?.referralCode || 'LOADING'}
            </code>
            <button
              onClick={handleCopyCode}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copiedCode && (
            <p className="text-sm text-green-300 mt-2">✅ Copied to clipboard!</p>
          )}
        </div>

        {/* Кнопка деления */}
        <button
          onClick={handleShare}
          className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share with Friends
        </button>

        <p className="text-xs text-blue-100 mt-3 text-center">
          🎁 Get 5,000 money + 50 BOX when friend joins
        </p>
      </motion.div>

      {/* Статистика */}
      <div className="mx-4 mt-6 space-y-4">
        {/* Общие статистики */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <p className="text-slate-400 text-sm">Total Referrals</p>
            <p className="text-3xl font-bold text-white mt-2">
              {stats?.totalReferrals || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4"
          >
            <p className="text-slate-400 text-sm">Total Earned</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              +
              {(stats?.totalEarnings || 0).toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* BOX токены */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4"
        >
          <p className="text-slate-400 text-sm">BOX Tokens Earned</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            +{(stats?.totalBoxTokens || 0).toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Милстоуны */}
      <div className="mx-4 mt-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-500" />
          Milestone Rewards
        </h2>

        <div className="space-y-3">
          {stats?.milestones.map((milestone) => {
            const progress = (stats.totalReferrals / milestone.milestone) * 100;
            const isCompleted = stats.totalReferrals >= milestone.milestone;

            return (
              <motion.div
                key={milestone.id}
                whileHover={isCompleted ? { scale: 1.02 } : {}}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-green-500/10 border-green-500/30 cursor-pointer'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-white">
                    🎯 {milestone.milestone} Referrals
                  </p>
                  {isCompleted && !milestone.claimed && (
                    <button
                      onClick={() => claimMilestone.mutate(milestone.id)}
                      disabled={claimMilestone.isPending}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {claimMilestone.isPending ? 'Claiming...' : 'CLAIM'}
                    </button>
                  )}
                  {milestone.claimed && (
                    <span className="text-green-400 text-sm font-bold">✓ Claimed</span>
                  )}
                </div>

                {/* Прогресс-бар */}
                <div className="bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  {stats.totalReferrals} / {milestone.milestone}
                </p>

                {/* Награды */}
                <div className="flex flex-wrap gap-2">
                  {milestone.rewards.money && (
                    <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-green-400 font-semibold">
                      💵 {milestone.rewards.money.toLocaleString()}
                    </div>
                  )}
                  {milestone.rewards.boxTokens && (
                    <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-yellow-400 font-semibold">
                      🧱 {milestone.rewards.boxTokens.toLocaleString()} BOX
                    </div>
                  )}
                  {milestone.rewards.nftRarity && (
                    <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-purple-400 font-semibold">
                      🖼️ {milestone.rewards.nftRarity.toUpperCase()} NFT
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Табс - уровни рефералов vs Лидерборд */}
      <div className="mx-4 mt-8">
        <div className="flex gap-2 mb-4 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setShowLeaderboard(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              !showLeaderboard
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Referral Levels
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              showLeaderboard
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Referrers
          </button>
        </div>

        {!showLeaderboard ? (
          /* Уровни рефералов */
          <div className="space-y-2">
            {[
              { level: 1, earned: stats?.totalEarnings || 0, count: stats?.referralsByLevel.level1 },
              { level: 2, earned: stats?.totalEarnings || 0, count: stats?.referralsByLevel.level2 },
              { level: 3, earned: stats?.totalEarnings || 0, count: stats?.referralsByLevel.level3 },
              { level: 4, earned: stats?.totalEarnings || 0, count: stats?.referralsByLevel.level4 },
              { level: 5, earned: stats?.totalEarnings || 0, count: stats?.referralsByLevel.level5 },
            ].map((item) => (
              <div key={item.level} className="bg-slate-800 p-3 rounded-lg flex justify-between">
                <p className="text-white font-semibold">Level {item.level}: {item.count || 0} users</p>
                <p className="text-green-400 font-bold">+{(item.earned / 5).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Лидерборд */
          <div className="space-y-2">
            {leaderboard?.slice(0, 20).map((entry, index) => (
              <motion.div
                key={entry.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 p-3 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-yellow-500 w-8 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <div>
                    <p className="text-white font-semibold">
                      {entry.referralCount} referrals
                    </p>
                    <p className="text-xs text-slate-400">
                      🧱 {entry.totalBoxTokens.toLocaleString()} BOX
                    </p>
                  </div>
                </div>
                <p className="text-green-400 font-bold">
                  +{entry.totalEarnings.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Типы для максимизации */}
      <div className="mx-4 mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
        <p className="text-white font-semibold mb-2">💡 Pro Tips</p>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Share your code in Telegram groups</li>
          <li>• Reach milestones for massive rewards!</li>
          <li>• Top 5 levels earn the most profit</li>
          <li>• Each friend brings passive income</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralPage;
