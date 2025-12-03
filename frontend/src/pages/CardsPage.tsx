import { motion } from 'framer-motion';

const mockCards = [
  { id: 1, name: 'Кожаные перчатки', icon: '🥊', rarity: 'common', price: 1000, owned: false },
  { id: 2, name: 'Легкая обувь', icon: '👟', rarity: 'common', price: 1000, owned: false },
  { id: 3, name: 'Тренер Джо', icon: '👨‍🏫', rarity: 'rare', price: 3000, owned: false },
  { id: 4, name: 'Зал "Легенда"', icon: '🏋️', rarity: 'epic', price: 10000, owned: false },
  { id: 5, name: 'Легендарные перчатки', icon: '✨', rarity: 'legendary', price: 50000, owned: false },
];

const rarityColors = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
};

export default function CardsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🎴 Коллекция Карт</h1>
        <p className="text-gray-400">Собирайте карты для постоянных бонусов!</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`card hover:scale-105 transition-transform cursor-pointer border-2 ${rarityColors[card.rarity as keyof typeof rarityColors]}`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{card.icon}</div>
              <h3 className="font-bold mb-2">{card.name}</h3>
              <p className={`text-sm uppercase tracking-wide mb-3 ${
                card.rarity === 'legendary' ? 'text-yellow-500' :
                card.rarity === 'epic' ? 'text-purple-500' :
                card.rarity === 'rare' ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {card.rarity}
              </p>
              {!card.owned && (
                <button className="btn btn-primary w-full text-sm py-2">
                  💰 {card.price}
                </button>
              )}
              {card.owned && (
                <div className="text-green-500 font-semibold">✓ В коллекции</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
