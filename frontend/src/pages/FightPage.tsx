import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fightAPI } from '@/lib/api';
import { Target, Swords } from 'lucide-react';

export default function FightPage() {
  const queryClient = useQueryClient();
  const [opponent, setOpponent] = useState<any>(null);
  const [fightResult, setFightResult] = useState<any>(null);

  const generateMutation = useMutation({
    mutationFn: () => fightAPI.generateOpponent(),
    onSuccess: (response) => {
      setOpponent(response.data);
      setFightResult(null);
    },
  });

  const fightMutation = useMutation({
    mutationFn: () => fightAPI.start(),
    onSuccess: (response) => {
      setFightResult(response.data);
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">⚔️ Арена Боёв</h1>
        <p className="text-gray-400">Найдите противника и выйдите на ринг!</p>
      </motion.div>

      {!opponent && !fightResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center"
        >
          <Target className="w-24 h-24 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-4">Найти противника</h2>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="btn btn-primary"
          >
            🎯 Поиск противника
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {opponent && !fightResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                🥊 {opponent.name}
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="stat-card">
                  <span className="text-gray-400">💪 Сила:</span>
                  <span className="ml-2 font-bold">{opponent.power}</span>
                </div>
                <div className="stat-card">
                  <span className="text-gray-400">⚡ Скорость:</span>
                  <span className="ml-2 font-bold">{opponent.speed}</span>
                </div>
                <div className="stat-card">
                  <span className="text-gray-400">❤️ Выносливость:</span>
                  <span className="ml-2 font-bold">{opponent.stamina}</span>
                </div>
                <div className="stat-card">
                  <span className="text-gray-400">🛡️ Защита:</span>
                  <span className="ml-2 font-bold">{opponent.defense}</span>
                </div>
              </div>
              <div className="text-center mb-4">
                <span className="text-gray-400">🏆 Рейтинг: </span>
                <span className="text-xl font-bold">{opponent.rating}</span>
              </div>
            </div>

            <button
              onClick={() => fightMutation.mutate()}
              disabled={fightMutation.isPending}
              className="w-full btn btn-primary text-xl py-4"
            >
              <Swords className="inline w-6 h-6 mr-2" />
              Начать бой!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fightResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`card text-center ${
              fightResult.result === 'win' ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="text-6xl mb-4">
              {fightResult.result === 'win' ? '🏆' : '😢'}
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${
              fightResult.result === 'win' ? 'text-green-500' : 'text-red-500'
            }`}>
              {fightResult.result === 'win' ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
              {fightResult.knockout && ' НОКАУТОМ!'}
            </h2>
            <div className="space-y-2 mb-6">
              {fightResult.reward > 0 && (
                <p className="text-lg">💰 +{fightResult.reward}</p>
              )}
              {fightResult.fameReward > 0 && (
                <p className="text-lg">⭐ +{fightResult.fameReward}</p>
              )}
              <p className="text-lg">
                🏆 {fightResult.ratingChange > 0 ? '+' : ''}{fightResult.ratingChange}
              </p>
            </div>
            <button
              onClick={() => {
                setOpponent(null);
                setFightResult(null);
              }}
              className="btn btn-primary"
            >
              Новый бой
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
