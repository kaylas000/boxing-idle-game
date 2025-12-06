import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

interface QuestsQuickData {
  totalCompleted: number;
  totalAvailable: number;
  totalBoxEarnings: number;
}

interface QuestsBadgeProps {
  className?: string;
}

export const QuestsBadge: React.FC<QuestsBadgeProps> = ({ className = '' }) => {
  const { data: questsData } = useQuery<QuestsQuickData>({
    queryKey: ['quests-quick-data'],
    queryFn: async () => {
      const response = await api.get('/quests/stats');
      return {
        totalCompleted: response.data.totalCompleted,
        totalAvailable: response.data.questsToday?.length || 0,
        totalBoxEarnings: response.data.totalBoxEarnings,
      };
    },
    refetchInterval: 15000,
  });

  const hasCompletedQuests = (questsData?.totalCompleted || 0) > 0;
  const completionPercent = questsData?.totalAvailable
    ? Math.round((questsData.totalCompleted / questsData.totalAvailable) * 100)
    : 0;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Main Icon */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {hasCompletedQuests && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-yellow-500/20 rounded-full"
          />
        )}
        <Zap className="w-6 h-6 text-yellow-500" />
      </div>

      {/* Badge with completed count */}
      {hasCompletedQuests && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
        >
          {questsData?.totalCompleted}
        </motion.div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <p className="font-semibold">{completionPercent}% Complete</p>
        <p className="text-yellow-400">🧱 +{questsData?.totalBoxEarnings || 0} BOX</p>
      </div>
    </div>
  );
};

export default QuestsBadge;
