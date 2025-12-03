import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star, Lock, Clock } from 'lucide-react';
import { achievementsAPI } from '@/lib/api';

const rarityColors: Record<string, string> = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-yellow-600',
};

const rarityLabels: Record<string, string> = {
  common: 'Обычное',
  rare: 'Редкое',
  epic: 'Эпическое',
  legendary: 'Легендарное',
};

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementsAPI.getAll().then(res => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['achievement-stats'],
    queryFn: () => achievementsAPI.getStats().then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const unlocked = achievements?.filter((a: any) => a.unlocked) || [];
  const locked = achievements?.filter((a: any) => !a.unlocked) || [];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🏆 Достижения</h1>
        <p className="text-gray-400">Разблокируйте все достижения и получайте награды!</p>
      </motion.div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center"
          >
            <Trophy className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.unlocked}/{stats.total}</div>
            <div className="text-sm text-gray-400">Разблокировано</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-gray-400">{stats.byRarity.common}</div>
            <div className="text-sm text-gray-400">Обычные</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-blue-500">{stats.byRarity.rare}</div>
            <div className="text-sm text-gray-400">Редкие</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-purple-500">{stats.byRarity.epic}</div>
            <div className="text-sm text-gray-400">Эпические</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-yellow-500">{stats.byRarity.legendary}</div>
            <div className="text-sm text-gray-400">Легендарные</div>
          </motion.div>
        </div>
      )}

      {/* Прогресс-бар */}
      {stats && (
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Общий прогресс</span>
            <span className="text-2xl font-bold text-blue-500">{stats.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>
      )}

      {/* Разблокированные достижения */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Разблокированные ({unlocked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlocked.map((achievement: any, index: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card border-2 bg-gradient-to-br ${rarityColors[achievement.rarity]}/10`}
                style={{ borderColor: `var(--color-${achievement.rarity})` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{achievement.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                        {rarityLabels[achievement.rarity]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                    
                    {/* Награды */}
                    <div className="flex gap-2 mb-2">
                      {achievement.rewards.money && (
                        <div className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-sm font-semibold">
                          💰 +{achievement.rewards.money.toLocaleString()}
                        </div>
                      )}
                      {achievement.rewards.fame && (
                        <div className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-sm font-semibold">
                          ⭐ +{achievement.rewards.fame}
                        </div>
                      )}
                    </div>
                    
                    {/* Дата разблокировки */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Разблокировано: {new Date(achievement.unlockedAt).toLocaleDateString('ru')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Заблокированные достижения */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-500" />
            Заблокированные ({locked.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locked.map((achievement: any, index: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card border-2 border-gray-700 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl grayscale opacity-50">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-400">{achievement.name}</h3>
                      <Lock className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                    
                    {/* Награды (затемнённые) */}
                    <div className="flex gap-2">
                      {achievement.rewards.money && (
                        <div className="px-2 py-1 bg-gray-700/50 text-gray-500 rounded text-sm font-semibold">
                          💰 +{achievement.rewards.money.toLocaleString()}
                        </div>
                      )}
                      {achievement.rewards.fame && (
                        <div className="px-2 py-1 bg-gray-700/50 text-gray-500 rounded text-sm font-semibold">
                          ⭐ +{achievement.rewards.fame}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
