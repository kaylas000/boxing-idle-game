import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Users, Heart, Share2, Bell } from 'lucide-react';

interface MediaLink {
  id: string;
  platform: 'youtube' | 'rutube' | 'telegram' | 'dzen' | 'website';
  label: string;
  url: string;
  icon: string;
  description: string;
  subscribers?: number;
  color: string;
}

export const MediaIntegration: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const mediaLinks: MediaLink[] = [
    {
      id: 'club-ring-website',
      platform: 'website',
      label: 'Сайт СК "РИНГ"',
      url: 'https://club-ring.ru',
      icon: '🥊',
      description: 'Боксёрский клуб РИНГ в Пензе - Профессиональные тренировки',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'youtube-channel',
      platform: 'youtube',
      label: 'YouTube канал',
      url: 'https://youtube.com/@club-ring?si=m1m9cRkML3Yuo8tk',
      icon: '📺',
      description: '🔥 Нарезки нокаутов\n🔥 Легендарные раунды\n🔥 Классические и свежие бои',
      subscribers: 15000,
      color: 'from-red-600 to-red-700',
    },
    {
      id: 'rutube-channel',
      platform: 'rutube',
      label: 'RuTube канал',
      url: 'https://rutube.ru/channel/23770571',
      icon: '🎬',
      description: 'Лучшие моменты из мира бокса - Подборки без воды',
      subscribers: 8000,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'telegram-channel',
      platform: 'telegram',
      label: 'Telegram канал',
      url: 'https://t.me/ring_boxing_club',
      icon: '✈️',
      description: 'Подпишись и смотри первым!\n#бокс #нокауты #тайсон',
      subscribers: 12000,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'dzen-channel',
      platform: 'dzen',
      label: 'Дзен канал',
      url: 'https://dzen.ru/ring_boxin_club?share_to=link',
      icon: '🎯',
      description: 'Хардкор контент о боксе - Свежие подборки',
      subscribers: 5000,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  const trainers = [
    {
      name: 'Рыжонкин Андрей Владимирович',
      title: 'Мастер спорта, тренер по боксу',
      phone: '+7 (937) 429-11-11',
      specialization: 'Ударная техника, Футворк, функциональная подготовка',
    },
  ];

  const schedule = [
    { day: 'Вторник', time: '20:00 - 21:30' },
    { day: 'Четверг', time: '20:00 - 21:30' },
    { day: 'Суббота', time: '20:00 - 21:30' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            🥊 СК "РИНГ" - Официальный Партнёр
          </span>
        </h2>
        <p className="text-gray-400">
          Боксёрский клуб РИНГ в Пензе - Профессиональные тренировки и контент
        </p>
      </motion.div>

      {/* Социальные сети */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-400" />
          Смотри контент на всех платформах
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {mediaLinks.map((media, index) => (
            <motion.a
              key={media.id}
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative group overflow-hidden rounded-lg p-4 bg-gradient-to-br ${media.color} shadow-lg cursor-pointer`}
              onClick={() => setSelectedMedia(media.id)}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />

              {/* Content */}
              <div className="relative z-10 space-y-3">
                <div className="text-4xl mb-2">{media.icon}</div>
                <h3 className="font-bold text-white text-sm">{media.label}</h3>
                {media.subscribers && (
                  <div className="flex items-center gap-1 text-xs text-white/90">
                    <Users className="w-3 h-3" />
                    {(media.subscribers / 1000).toFixed(0)}k подписчиков
                  </div>
                )}
                <div className="flex items-center gap-1 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs">Открыть</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Информация о тренере */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Главный тренер
        </h3>

        {trainers.map((trainer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg p-4 border border-red-500/20"
          >
            <div className="mb-3">
              <h4 className="text-lg font-bold text-white">{trainer.name}</h4>
              <p className="text-sm text-red-400 font-semibold">{trainer.title}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-gray-400">Специализация:</span> {trainer.specialization}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Телефон:</span>{' '}
                <a href={`tel:${trainer.phone}`} className="text-blue-400 hover:text-blue-300">
                  {trainer.phone}
                </a>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Расписание тренировок */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          Расписание Тренировок
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {schedule.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20 text-center"
            >
              <div className="font-bold text-yellow-400">{item.day}</div>
              <div className="text-sm text-gray-300 mt-1">{item.time}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-sm text-gray-300">
            <span className="text-blue-400 font-semibold">📍 Адрес:</span> г. Пенза, ул. Кураева, 11
          </p>
          <p className="text-sm text-gray-300 mt-2">
            <span className="text-blue-400 font-semibold">📞 Телефон:</span> +7 (937) 429-11-11
          </p>
        </div>
      </div>

      {/* Преимущества клуба */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Что мы Предлагаем
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            '💪 Ударная техника',
            '🎯 Футворк',
            '⚡ Функциональная подготовка',
            '👥 Групповые тренировки',
            '🧑‍🏫 Индивидуальные тренировки',
            '🛡️ Спарринги',
            '🎓 Анализ боев',
            '📊 Мотивация и обучение',
            '🏪 Магазин экипировки',
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20 text-center text-sm font-semibold text-green-300"
            >
              {benefit}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Кнопка */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card bg-gradient-to-r from-red-500 to-red-600 text-center"
      >
        <h4 className="text-2xl font-bold mb-3">🥊 Присоединись к Боксёрской Семье</h4>
        <p className="text-white/90 mb-4">
          Тренируйся в реальном боксёрском клубе и одновременно играй в Boxing Champion!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://t.me/ring_boxing_club"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            Telegram Канал
          </a>
          <a
            href="https://club-ring.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all border border-white"
          >
            Сайт Клуба
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default MediaIntegration;
