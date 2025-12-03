import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, username: 'ChampionBox', level: 50, rating: 5000, wins: 250 },
  { rank: 2, username: 'IronFist', level: 45, rating: 4500, wins: 220 },
  { rank: 3, username: 'ThunderPunch', level: 42, rating: 4200, wins: 200 },
  { rank: 4, username: 'SteelDefense', level: 40, rating: 4000, wins: 195 },
  { rank: 5, username: 'SpeedDemon', level: 38, rating: 3800, wins: 180 },
  { rank: 6, username: 'PowerHouse', level: 35, rating: 3500, wins: 170 },
  { rank: 7, username: 'QuickJab', level: 32, rating: 3200, wins: 160 },
  { rank: 8, username: 'HeavyWeight', level: 30, rating: 3000, wins: 150 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
  return <Award className="w-6 h-6 text-gray-600" />;
};

export default function LeaderboardPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🏆 Таблица Лидеров</h1>
        <p className="text-gray-400">Лучшие боксёры в мире</p>
      </motion.div>

      <div className="space-y-3">
        {mockLeaderboard.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card flex items-center gap-4 ${
              player.rank <= 3 ? 'border-2 border-yellow-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-center w-12">
              {getRankIcon(player.rank)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{player.username}</h3>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Ур. {player.level}</span>
                <span>🏆 {player.rating}</span>
                <span>✓ {player.wins}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-500">#{player.rank}</div>
          </motion.div>
        ))}
      </div>

      {/* Ваша позиция */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-500"
      >
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Ваша позиция</p>
          <p className="text-3xl font-bold text-red-500">#342</p>
          <p className="text-sm text-gray-400 mt-2">Продолжайте побеждать!</p>
        </div>
      </motion.div>
    </div>
  );
}
