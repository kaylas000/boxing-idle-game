import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, Clock, Trophy, Target } from 'lucide-react';
import api from '../lib/api';
import { useUserStore } from '../stores/userStore';

interface DailyQuest {
  id: number;
  playerId: string;
  questType: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  targetCount: number;
  currentProgress: number;
  rewards: {
    money: number;
    boxTokens: number;
    experience: number;
  };
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt: string;
  createdAt: string;
}

interface QuestsStats {
  totalCompleted: number;
  totalClaimed: number;
  totalEarnings: number;
  totalBoxEarnings: number;
  questsToday: DailyQuest[];
  streakDays: number;
}

const QUEST_ICONS: Record<string, string> = {
  WIN_FIGHTS: '🥊',
  TRAIN_TIMES: '💪',
  PVP_WIN: '⚔️',
  INVITE_FRIENDS: '👥',
  WATCH_AD: '📺',
  EARN_MONEY: '💵',
  UPGRADE_STATS: '📈',
  REACH_RATING: '⭐',
  WIN_STREAK: '🔥',
  DEFEAT_OPPONENTS: '💢',
  EQUIPMENT_UPGRADE: '🥊',
  GET_ACHIEVEMENT: '🏅',
};

const QUEST_TITLES: Record<string, string> = {
  WIN_FIGHTS: 'Win Fights',
  TRAIN_TIMES: 'Complete Trainings',
  PVP_WIN: 'Win PvP Matches',
  INVITE_FRIENDS: 'Invite Friends',
  WATCH_AD: 'Watch Advertisement',
  EARN_MONEY: 'Earn Money',
  UPGRADE_STATS: 'Upgrade Stats',
  REACH_RATING: 'Reach Rating',
  WIN_STREAK: 'Win Streak',
  DEFEAT_OPPONENTS: 'Defeat Opponents',
  EQUIPMENT_UPGRADE: 'Upgrade Equipment',
  GET_ACHIEVEMENT: 'Get Achievements',
};

const DIFFICULTY_COLORS = {
  EASY: 'from-green-500 to-emerald-600',
  MEDIUM: 'from-yellow-500 to-orange-600',
  HARD: 'from-red-500 to-pink-600',
};

const DIFFICULTY_LABELS = {
  EASY: '⭐',
  MEDIUM: '⭐⭐',
  HARD: '⭐⭐⭐',
};

export const QuestsPage: React.FC = () => {
  const { user } = useUserStore();
  const [selectedTab, setSelectedTab] = useState<'available' | 'completed'>('available');
  const [showStreakPopup, setShowStreakPopup] = useState(false);

  // Получить статистику квестов
  const { data: stats, isLoading: statsLoading, refetch } = useQuery<QuestsStats>({
    queryKey: ['quests-stats'],
    queryFn: async () => {
      const response = await api.get('/quests/stats');
      return response.data;
    },
    refetchInterval: 15000,
  });

  // Получить ежедневные квесты
  const { data: quests, isLoading: questsLoading } = useQuery<DailyQuest[]>({
    queryKey: ['daily-quests'],
    queryFn: async () => {
      const response = await api.get('/quests/daily');
      return response.data;
    },
    refetchInterval: 10000,
  });

  // Генерировать новые квесты если нет
  const generateQuests = useMutation({
    mutationFn: () => api.post('/quests/generate'),
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    // Если нет квестов, сгенерировать
    if (!questsLoading && (!quests || quests.length === 0)) {
      generateQuests.mutate();
    }

    // Показать streak popup при первой загрузке
    if (stats && stats.streakDays > 0) {
      setShowStreakPopup(true);
      setTimeout(() => setShowStreakPopup(false), 3000);
    }
  }, [questsLoading, stats]);

  const availableQuests = quests?.filter((q) => !q.isCompleted && !q.isClaimed) || [];
  const completedQuests = quests?.filter((q) => q.isCompleted && !q.isClaimed) || [];
  const claimedQuests = quests?.filter((q) => q.isClaimed) || [];

  const timeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  if (statsLoading || questsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-white text-xl">Loading quests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Daily Quests
        </h1>
        {stats && stats.streakDays > 0 && (
          <div className="bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full">
            <span className="text-red-400 font-bold text-sm">🔥 {stats.streakDays} day streak</span>
          </div>
        )}
      </div>

      {/* Streak Popup */}
      <AnimatePresence>
        {showStreakPopup && stats && stats.streakDays > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl shadow-lg z-40"
          >
            <p className="font-bold text-center">🔥 {stats.streakDays} day streak! Keep it up!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-4"
        >
          <p className="text-slate-400 text-xs font-semibold">COMPLETED TODAY</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalCompleted || 0}</p>
          <p className="text-xs text-slate-500 mt-1">/ {quests?.length || 0} total</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4"
        >
          <p className="text-slate-400 text-xs font-semibold">BOX EARNED</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            +{stats?.totalBoxEarnings || 0}
          </p>
        </motion.div>
      </div>

      {/* Money Stats */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mx-4 mt-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
      >
        <p className="text-slate-400 text-xs font-semibold">MONEY EARNED</p>
        <p className="text-2xl font-bold text-green-400 mt-2">
          +{(stats?.totalEarnings || 0).toLocaleString()}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="mx-4 mt-6 flex gap-2 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab('available')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
            selectedTab === 'available'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Available ({availableQuests.length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
            selectedTab === 'completed'
              ? 'bg-green-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 inline mr-2" />
          Completed ({completedQuests.length})
        </button>
      </div>

      {/* Quests List */}
      <div className="mx-4 mt-6 space-y-3">
        <AnimatePresence>
          {selectedTab === 'available'
            ? availableQuests.map((quest, index) => (
                <QuestCard key={quest.id} quest={quest} index={index} />
              ))
            : completedQuests.map((quest, index) => (
                <QuestCard key={quest.id} quest={quest} index={index} completed />
              ))}
        </AnimatePresence>

        {selectedTab === 'available' && availableQuests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">🎉 No available quests!</p>
            <p className="text-slate-500 text-sm mt-2">New quests come tomorrow</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mx-4 mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
        <p className="text-white font-semibold mb-2">💡 How it works</p>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>✓ Complete daily quests for rewards</li>
          <li>✓ Earn money and BOX tokens</li>
          <li>✓ Build your login streak</li>
          <li>✓ Higher difficulty = More rewards</li>
          <li>✓ Quests refresh every 24 hours</li>
        </ul>
      </div>
    </div>
  );
};

// Quest Card Component
const QuestCard: React.FC<{
  quest: DailyQuest;
  index: number;
  completed?: boolean;
}> = ({ quest, index, completed }) => {
  const progress = (quest.currentProgress / quest.targetCount) * 100;
  const difficultyColor =
    DIFFICULTY_COLORS[quest.difficulty as keyof typeof DIFFICULTY_COLORS];
  const isCompleted = quest.isCompleted && !completed;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-slate-700/50 border-slate-600 opacity-60'
          : isCompleted
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-3xl mt-1">
            {QUEST_ICONS[quest.questType] || '📝'}
          </span>
          <div className="flex-1">
            <p className="text-white font-semibold">
              {QUEST_TITLES[quest.questType] || 'Unknown Quest'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                {DIFFICULTY_LABELS[quest.difficulty]}
              </span>
              <span className="text-xs text-slate-400">
                <Clock className="w-3 h-3 inline mr-1" />
                expires in ~24h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!completed && (
        <>
          <div className="bg-slate-700/50 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full bg-gradient-to-r ${difficultyColor}`}
            />
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-slate-400">
              {quest.currentProgress} / {quest.targetCount}
            </p>
            <p className="text-xs font-semibold text-slate-300">
              {Math.min(Math.round(progress), 100)}%
            </p>
          </div>
        </>
      )}

      {/* Rewards */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded text-xs font-semibold text-green-400">
            💵 {quest.rewards.money.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded text-xs font-semibold text-yellow-400">
            🪙 {quest.rewards.boxTokens}
          </div>
          <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded text-xs font-semibold text-blue-400">
            ⭐ {quest.rewards.experience}
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-xs font-bold text-green-400">CLAIM!</span>
          </div>
        )}
        {completed && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-bold text-slate-500">Claimed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestsPage;
