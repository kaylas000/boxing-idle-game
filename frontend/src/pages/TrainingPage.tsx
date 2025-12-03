import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { trainingAPI } from '@/lib/api';
import { Clock, Coins } from 'lucide-react';

export default function TrainingPage() {
  const queryClient = useQueryClient();
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

  const { data: trainings } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => trainingAPI.getAvailable().then(res => res.data),
  });

  const startMutation = useMutation({
    mutationFn: (trainingId: string) => trainingAPI.start(trainingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setSelectedTraining(null);
    },
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">🏋️ Тренировки</h1>
        <p className="text-gray-400">Улучшайте характеристики своего бойца</p>
      </motion.div>

      <div className="grid gap-4">
        {trainings?.map((training: any, index: number) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:border-red-500 transition-all cursor-pointer"
            onClick={() => setSelectedTraining(training.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {training.icon} {training.name}
                </h3>
                <p className="text-green-500 font-semibold mb-3">{training.description}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {training.duration}с
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {training.cost}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startMutation.mutate(training.id);
                }}
                disabled={startMutation.isPending}
                className="btn btn-primary"
              >
                Начать
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
