import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Swords, Trophy, Clock } from 'lucide-react';

export default function PvPPage() {
  const [searching, setSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const handleJoinMatchmaking = () => {
    setSearching(true);
    
    // Имитация поиска (2-5 секунд)
    setTimeout(() => {
      setSearching(false);
      setMatchFound(true);
    }, 2000 + Math.random() * 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">⚔️ PvP Арена</h1>
        <p className="text-gray-400">Битесь с реальными игроками!</p>
      </motion.div>

      {/* Статистика PvP */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center"
        >
          <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">1,250</div>
          <div className="text-sm text-gray-400">Рейтинг PvP</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <Swords className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm text-gray-400">PvP побед</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <Users className="w-12 h-12 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">#142</div>
          <div className="text-sm text-gray-400">Место в топе</div>
        </motion.div>
      </div>

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
            Найдите соперника вашего уровня и битесь за рейтинг!
          </p>
          <button
            onClick={handleJoinMatchmaking}
            className="btn btn-primary text-xl py-4"
          >
            <Swords className="inline w-6 h-6 mr-2" />
            Найти матч
          </button>
        </motion.div>
      )}

      {/* Поиск... */}
      {searching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center"
        >
          <div className="animate-spin w-24 h-24 mx-auto mb-4 border-4 border-red-500 border-t-transparent rounded-full" />
          <h2 className="text-2xl font-bold mb-4">Поиск противника...</h2>
          <p className="text-gray-400">Игроков онлайн: 1,247</p>
          <button
            onClick={() => setSearching(false)}
            className="btn btn-secondary mt-4"
          >
            Отменить
          </button>
        </motion.div>
      )}

      {/* Матч найден */}
      {matchFound && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-2 border-green-500"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-3xl font-bold mb-4 text-green-500">МАТЧ НАЙДЕН!</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div className="text-xl font-bold mb-2">Вы</div>
                <div className="text-gray-400">Rating: 1,250</div>
              </div>
              <div>
                <div className="text-xl font-bold mb-2 text-red-500">ThunderFist</div>
                <div className="text-gray-400">Rating: 1,280</div>
              </div>
            </div>

            <button className="btn btn-primary text-xl py-4 w-full">
              Готов к бою!
            </button>
          </div>
        </motion.div>
      )}

      {/* История PvP */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">📜 Последние матчи</h3>
        <div className="space-y-3">
          {[
            { opponent: 'IronFist', result: 'win', rating: '+25', time: '5м назад' },
            { opponent: 'SpeedDemon', result: 'loss', rating: '-20', time: '1ч назад' },
            { opponent: 'TitanPunch', result: 'win', rating: '+30', time: '3ч назад' },
          ].map((match, i) => (
            <div key={i} className="bg-dark-700 p-4 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold">{match.opponent}</div>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {match.time}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${
                  match.result === 'win' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {match.result === 'win' ? '✓ Победа' : '✗ Поражение'}
                </div>
                <div className="text-sm">{match.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
