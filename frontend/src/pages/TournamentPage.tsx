import { motion } from 'framer-motion';
import { Trophy, Users, Coins, Calendar } from 'lucide-react';

const mockTournaments = [
  {
    id: 1,
    name: 'Чемпионат новичков',
    participants: 12,
    maxParticipants: 16,
    entryFee: 5000,
    prizePool: 100000,
    startTime: 'Через 2ч',
    status: 'registration',
    minRating: 1000,
    maxRating: 1500,
  },
  {
    id: 2,
    name: 'Турнир Профессионалов',
    participants: 8,
    maxParticipants: 8,
    entryFee: 20000,
    prizePool: 500000,
    startTime: 'Через 4ч',
    status: 'registration',
    minRating: 2000,
    maxRating: 3000,
  },
  {
    id: 3,
    name: 'Чемпионат Легенд',
    participants: 16,
    maxParticipants: 16,
    entryFee: 0,
    prizePool: 1000000,
    startTime: 'В процессе',
    status: 'active',
    minRating: 3000,
    maxRating: 10000,
  },
];

const statusColors = {
  registration: 'border-blue-500',
  active: 'border-green-500',
  completed: 'border-gray-500',
};

const statusLabels = {
  registration: 'Регистрация',
  active: 'Активен',
  completed: 'Завершён',
};

export default function TournamentPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🏆 Турниры</h1>
        <p className="text-gray-400">Участвуйте в турнирах и выигрывайте крупные призы!</p>
      </motion.div>

      {/* Активные турниры */}
      <div className="space-y-4">
        {mockTournaments.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card border-2 ${statusColors[tournament.status as keyof typeof statusColors]}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{tournament.name}</h3>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
                     style={{ 
                       backgroundColor: tournament.status === 'registration' ? 'rgba(59, 130, 246, 0.2)' : 
                                       tournament.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 
                                       'rgba(107, 114, 128, 0.2)'
                     }}>
                  {statusLabels[tournament.status as keyof typeof statusLabels]}
                </div>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                <div className="text-sm text-gray-400">Участники</div>
                <div className="font-bold">{tournament.participants}/{tournament.maxParticipants}</div>
              </div>

              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <Coins className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                <div className="text-sm text-gray-400">Взнос</div>
                <div className="font-bold">{tournament.entryFee.toLocaleString()}</div>
              </div>

              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-green-500" />
                <div className="text-sm text-gray-400">Призовой фонд</div>
                <div className="font-bold">{tournament.prizePool.toLocaleString()}</div>
              </div>

              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <Calendar className="w-6 h-6 mx-auto mb-1 text-red-500" />
                <div className="text-sm text-gray-400">Старт</div>
                <div className="font-bold text-sm">{tournament.startTime}</div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-dark-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Рейтинг для участия:</div>
              <div className="font-bold">
                {tournament.minRating.toLocaleString()} - {tournament.maxRating.toLocaleString()}
              </div>
            </div>

            {tournament.status === 'registration' && (
              <button className="btn btn-primary w-full">
                🎫 Зарегистрироваться
              </button>
            )}

            {tournament.status === 'active' && (
              <button className="btn btn-success w-full">
                👁️ Смотреть сетку
              </button>
            )}

            {tournament.status === 'completed' && (
              <button className="btn btn-secondary w-full">
                📊 Результаты
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Ближайшие награды */}
      <div className="card bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-2 border-yellow-500">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Призовые места
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl mb-2">🥇</div>
            <div className="font-bold text-lg">1 место</div>
            <div className="text-yellow-500 font-bold">50,000 💰</div>
          </div>
          <div>
            <div className="text-4xl mb-2">🥈</div>
            <div className="font-bold text-lg">2 место</div>
            <div className="text-gray-400 font-bold">30,000 💰</div>
          </div>
          <div>
            <div className="text-4xl mb-2">🥉</div>
            <div className="font-bold text-lg">3 место</div>
            <div className="text-orange-600 font-bold">20,000 💰</div>
          </div>
        </div>
      </div>
    </div>
  );
}
