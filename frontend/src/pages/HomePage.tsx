import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { playerAPI } from '@/lib/api';
import { Coins, Star, Zap, Trophy } from 'lucide-react';
import { ReferralBanner } from '../components/ReferralBanner';

export default function HomePage() {
  const { data: player, isLoading } = useQuery({
    queryKey: ['player'],
    queryFn: () => playerAPI.getProfile().then(res => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => playerAPI.getStats().then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  const resources = [
    { icon: Coins, label: 'Деньги', value: player?.money || 0, color: 'text-yellow-500' },
    { icon: Star, label: 'Слава', value: player?.fame || 0, color: 'text-blue-500' },
    { icon: Zap, label: 'Энергия', value: `${player?.energy || 0}/${player?.maxEnergy || 10}`, color: 'text-green-500' },
    { icon: Trophy, label: 'Рейтинг', value: player?.rating || 1000, color: 'text-red-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* NEW: Referral Banner - Added December 6, 2025 */}
      <ReferralBanner />

      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            🥊 Boxing Champion
          </span>
        </h1>
        <p className="text-gray-400">Управляйте карьерой боксёра!</p>
      </motion.div>

      {/* Ресурсы */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={resource.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${resource.color}`} />
                <div>
                  <div className="text-sm text-gray-400">{resource.label}</div>
                  <div className="text-xl font-bold">{resource.value.toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Боец */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card text-center"
      >
        <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-8xl animate-pulse-slow shadow-2xl">
          🥊
        </div>
        <h2 className="text-2xl font-bold mb-2">{player?.username || 'Новичок'}</h2>
        <p className="text-gray-400 mb-4">Уровень {player?.level || 1}</p>
        
        {/* Прогресс бар */}
        <div className="w-full bg-dark-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((player?.experience || 0) / (player?.experienceToNext || 100)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-400">
          {player?.experience || 0} / {player?.experienceToNext || 100} XP
        </p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <div className="text-sm text-gray-400">💪 Сила</div>
          <div className="text-2xl font-bold">{stats?.power || 10}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-400">⚡ Скорость</div>
          <div className="text-2xl font-bold">{stats?.speed || 10}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-400">❤️ Выносливость</div>
          <div className="text-2xl font-bold">{stats?.stamina || 10}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-400">🛡️ Защита</div>
          <div className="text-2xl font-bold">{stats?.defense || 10}</div>
        </div>
      </div>

      {/* Статистика боёв */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📊 Статистика</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-500">{stats?.wins || 0}</div>
            <div className="text-sm text-gray-400">Побед</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-500">{stats?.losses || 0}</div>
            <div className="text-sm text-gray-400">Поражений</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-500">{stats?.knockouts || 0}</div>
            <div className="text-sm text-gray-400">Нокауты</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-gray-400">Процент побед: </span>
          <span className="text-xl font-bold text-green-500">{stats?.winRate || 0}%</span>
        </div>
      </div>
    </div>
  );
}
