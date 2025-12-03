import { motion, AnimatePresence } from 'framer-motion';
import { Users, Swords, Trophy, Clock, Loader } from 'lucide-react';
import { usePvP } from '@/hooks/usePvP';
import { useQuery } from '@tanstack/react-query';
import { pvpAPI } from '@/lib/api';

export default function PvPPage() {
  const {
    player,
    searching,
    matchFound,
    opponent,
    matchId,
    startSearch,
    cancelSearch,
    resetMatch,
  } = usePvP();

  const { data: history } = useQuery({
    queryKey: ['pvp-history'],
    queryFn: () => pvpAPI.getHistory().then(res => res.data),
  });

  const handleStartSearch = () => {
    startSearch();
  };

  const handleCancelSearch = () => {
    cancelSearch();
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">⚔️ PvP Арена</h1>
        <p className="text-gray-400">Битесь с реальными игроками онлайн!</p>
      </motion.div>

      {/* Статистика PvP */}
      {player && (
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center"
          >
            <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{player.rating || 1000}</div>
            <div className="text-sm text-gray-400">Рейтинг PvP</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <Swords className="w-12 h-12 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{player.wins || 0}</div>
            <div className="text-sm text-gray-400">PvP побед</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <Users className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">Online</div>
            <div className="text-sm text-gray-400">Live матчи</div>
          </motion.div>
        </div>
      )}

      {/* Поиск матча */}
      {!searching && !matchFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <Users className="w-24 h-24 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-4">Реальные противники</h2>
          <p className="text-gray-400 mb-6">
            Найдите соперника вашего уровня и бейтесь за рейтинг в реальном времени!
          </p>
          <button
            onClick={handleStartSearch}
            className="btn btn-primary text-xl py-4"
          >
            <Swords className="inline w-6 h-6 mr-2" />
            Найти матч (Live)
          </button>
        </motion.div>
      )}

      {/* Поиск... */}
      <AnimatePresence>
        {searching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card text-center"
          >
            <Loader className="w-24 h-24 mx-auto mb-4 text-blue-500 animate-spin" />
            <h2 className="text-2xl font-bold mb-4">Поиск противника...</h2>
            <p className="text-gray-400 mb-2">Подбираем соперника вашего уровня</p>
            <p className="text-sm text-gray-500 mb-6">Рейтинг: {player?.rating || 1000} (±200)</p>
            <button
              onClick={handleCancelSearch}
              className="btn btn-secondary"
            >
              Отменить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Матч найден */}
      <AnimatePresence>
        {matchFound && opponent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card border-2 border-green-500"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <h2 className="text-3xl font-bold mb-4 text-green-500">МАТЧ НАЙДЕН!</h2>
              
              <div className="grid grid-cols-2 gap-8 mb-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-xl font-bold mb-2 text-blue-500">Вы</div>
                  <div className="text-gray-400 mb-1">{player?.username || 'Игрок'}</div>
                  <div className="text-sm text-gray-500">Rating: {player?.rating || 1000}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold mb-2 text-red-500">{opponent.username || 'Противник'}</div>
                  <div className="text-gray-400 mb-1">Уровень {opponent.level || 1}</div>
                  <div className="text-sm text-gray-500">Rating: {opponent.rating || 1000}</div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  className="btn btn-primary text-xl py-4 w-full max-w-md"
                  onClick={() => {
                    // Здесь запуск боя
                    alert('Функционал боя будет реализован!');
                  }}
                >
                  Готов к бою!
                </button>
                <button
                  onClick={resetMatch}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* История PvP */}
      {history && history.matches && history.matches.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📜 Последние матчи</h3>
          <div className="space-y-3">
            {history.matches.slice(0, 5).map((match: any, i: number) => (
              <div key={i} className="bg-dark-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {match.player1.id === player?.id ? match.player2.username : match.player1.username}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(match.createdAt).toLocaleDateString('ru')}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${
                    match.winnerId === player?.id ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {match.winnerId === player?.id ? '✓ Победа' : '✗ Поражение'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
