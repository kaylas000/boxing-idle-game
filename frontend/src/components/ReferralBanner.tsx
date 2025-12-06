import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Gift } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
}

export const ReferralBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const { data: referralData } = useQuery<ReferralData>({
    queryKey: ['referral-quick-data'],
    queryFn: async () => {
      const response = await api.get('/referral/my-code');
      return response.data;
    },
    refetchInterval: 60000,
  });

  if (!referralData) return null;

  const handleCopy = () => {
    if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareText = `🥊 Join Boxing Champion! My referral code: ${referralData?.referralCode}\n\n🎮 Realistic boxing gameplay\n💰 Earn real BOX tokens\n🏆 Compete globally`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Boxing Champion',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <>
      {/* Collapsed Banner */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 text-white cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <p className="font-semibold text-sm">
                Earn +{referralData?.totalEarnings.toLocaleString() || 0} from{' '}
                {referralData?.totalReferrals || 0} referrals
              </p>
            </div>
            <span className="text-xl">→</span>
          </div>
        </motion.div>
      )}

      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Gift className="w-6 h-6 text-yellow-500" />
                  Invite Friends
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Referral Code */}
              <div className="bg-slate-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-400 mb-2">YOUR CODE</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xl font-bold text-blue-400 flex-1">
                    {referralData?.referralCode}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors"
                  >
                    {copiedCode ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">REFERRALS</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {referralData?.totalReferrals || 0}
                  </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs">EARNED</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    +{(referralData?.totalEarnings || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share with Friends
              </button>

              {/* Info */}
              <p className="text-xs text-slate-400 mt-3 text-center">
                Get 5,000 money + 50 BOX per referral
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReferralBanner;
