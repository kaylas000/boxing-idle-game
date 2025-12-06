import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Zap, Trophy } from 'lucide-react';
import { MediaIntegration } from '../components/MediaIntegration';

export default function CommunityPage() {
  const stats = [
    {
      icon: Users,
      label: 'Общее сообщество',
      value: '50K+',
      color: 'text-blue-500',
    },
    {
      icon: Heart,
      label: 'Подписчиков Каналов',
      value: '40K+',
      color: 'text-red-500',
    },
    {
      icon: Zap,
      label: 'Топ-Листс',
      value: '500+',
      color: 'text-yellow-500',
    },
    {
      icon: Trophy,
      label: 'Турниры',
      value: '25+',
      color: 'text-green-500',
    },
  ];

  const features = [
    {
      title: '🌟 Официальные Партнёры',
      description: 'Официально сотрудничаем с реальными боксерскими клубами',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: '📺 Оригинальный Контент',
      description: 'Эксклюзивные видео из мира бокса на всех платформах',
      color: 'from-red-500 to-red-600',
    },
    {
      title: '🌞 Лив Тренировки',
      description: 'Примы тренировок с мастерами и градусными боями',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: '📚 Обучающие Материалы',
      description: 'Градусные траининги и технические лекции',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            🎉 Коммунити и Партнёры
          </span>
        </h1>
        <p className="text-gray-400">
          Подолжи заниматься вместе с чемпионами бокса
        </p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Фичеры */}
      <div>
        <h2 className="text-2xl font-bold mb-4">😟 Почему Мы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`card bg-gradient-to-br ${feature.color}`}
            >
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Медиа Интеграция */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MediaIntegration />
      </motion.div>

      {/* Join Community CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card bg-gradient-to-r from-red-500 to-red-600 text-center py-8"
      >
        <h3 className="text-3xl font-bold text-white mb-3">🥊 Присоединись К НАМ</h3>
        <p className="text-white/90 mb-6 text-lg">
          Тысячи боксёров уже зажимают перчатки в Boxing Champion!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://t.me/ring_boxing_club"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
          >
            Телеграм
          </a>
          <a
            href="https://youtube.com/@club-ring?si=m1m9cRkML3Yuo8tk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-all border border-white"
          >
            YouTube
          </a>
        </div>
      </motion.div>
    </div>
  );
}
