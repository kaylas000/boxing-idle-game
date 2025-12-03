import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { playerAPI } from '@/lib/api';
import { User, Award, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  const { data: player } = useQuery({
    queryKey: ['player'],
    queryFn: () => playerAPI.getProfile().then(res => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => playerAPI.getStats().then(res => res.data),
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">👤 Профиль</h1>
        <p className="text-gray-400">Ваша статистика и достижения</p>
      </motion.div>

      {/* Профиль */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center"
      >
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-6xl">
          🥊
        </div>
        <h2 className="text-2xl font-bold mb-2">{player?.username || 'Новичок'}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
          <Award className="w-5 h-5" />
          <span>Уровень {player?.level || 1}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-yellow-500">
          <TrendingUp className="w-5 h-5" />
          <span className="font-bold">Рейтинг: {player?.rating || 1000}</span>
        </div>
      </motion.div>

      {/* Статистика боёв */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-red-500" />
          Статистика боёв
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="text-3xl font-bold text-green-500">{stats?.wins || 0}</div>
            <div className="text-sm text-gray-400">Побед</div>
          </div>
          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="text-3xl font-bold text-red-500">{stats?.losses || 0}</div>
            <div className="text-sm text-gray-400">Поражений</div>
          </div>
          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500">{stats?.knockouts || 0}</div>
            <div className="text-sm text-gray-400">Нокаутов</div>
          </div>
          <div className="text-center p-4 bg-dark-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-500">{stats?.winRate || 0}%</div>
            <div className="text-sm text-gray-400">Процент побед</div>
          </div>
        </div>
      </div>

      {/* Характеристики */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📊 Характеристики</h3>
        <div className="space-y-3">
          {[
            { label: 'Сила', value: stats?.power || 10, icon: '💪', color: 'bg-red-500' },
            { label: 'Скорость', value: stats?.speed || 10, icon: '⚡', color: 'bg-yellow-500' },
            { label: 'Выносливость', value: stats?.stamina || 10, icon: '❤️', color: 'bg-green-500' },
            { label: 'Защита', value: stats?.defense || 10, icon: '🛡️', color: 'bg-blue-500' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">
                  {stat.icon} {stat.label}
                </span>
                <span className="font-bold">{stat.value}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
