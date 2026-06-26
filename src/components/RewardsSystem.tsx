import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Gift, TrendingUp, Users, Zap, Award, Crown, 
  Target, Flame, Sparkles, ArrowRight, CheckCircle, Lock
} from 'lucide-react';
import { microInteractions, NumberCounter, AnimatedCard } from './MicroInteractions';
import api from '../services/api';

interface RewardsData {
  points: number;
  level: number;
  tier: string;
  totalEarned: number;
  totalRedeemed: number;
  streak: number;
  achievements: any[];
  badges: any[];
  referralCode: string;
  referrals: number;
  multiplier: number;
}

export default function RewardsSystem({ userId }: { userId: string }) {
  const [rewards, setRewards] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'referrals' | 'redeem'>('overview');

  useEffect(() => {
    fetchRewards();
  }, [userId]);

  const fetchRewards = async () => {
    try {
      const response = await api.get(`/rewards/${userId}`);
      setRewards(response.data);
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const tierColors = {
    Bronze: 'from-amber-600 to-amber-800',
    Silver: 'from-gray-400 to-gray-600',
    Gold: 'from-yellow-400 to-yellow-600',
    Platinum: 'from-blue-300 to-blue-500',
    Diamond: 'from-purple-400 to-pink-500'
  };

  const tierIcons = {
    Bronze: Award,
    Silver: Star,
    Gold: Trophy,
    Platinum: Crown,
    Diamond: Sparkles
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!rewards) return null;

  const TierIcon = tierIcons[rewards.tier as keyof typeof tierIcons] || Award;
  const nextTierPoints = rewards.tier === 'Bronze' ? 500 : 
                         rewards.tier === 'Silver' ? 2000 :
                         rewards.tier === 'Gold' ? 5000 :
                         rewards.tier === 'Platinum' ? 10000 : 0;
  const progressToNext = nextTierPoints > 0 ? (rewards.points / nextTierPoints) * 100 : 100;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${tierColors[rewards.tier as keyof typeof tierColors]} rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="flex items-center gap-3 mb-2"
              >
                <TierIcon className="w-12 h-12" />
                <div>
                  <h2 className="text-3xl font-bold">{rewards.tier} Tier</h2>
                  <p className="text-white/80">Level {rewards.level}</p>
                </div>
              </motion.div>
            </div>

            {rewards.multiplier > 1 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">{rewards.multiplier}x</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="text-white/80 text-sm mb-1">Points</div>
              <div className="text-2xl font-bold">
                <NumberCounter value={rewards.points} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="text-white/80 text-sm mb-1">Streak</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <Flame className="w-6 h-6" />
                {rewards.streak}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="text-white/80 text-sm mb-1">Referrals</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <Users className="w-6 h-6" />
                {rewards.referrals}
              </div>
            </motion.div>
          </div>

          {nextTierPoints > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {rewards.tier === 'Bronze' ? 'Silver' : 
                                   rewards.tier === 'Silver' ? 'Gold' :
                                   rewards.tier === 'Gold' ? 'Platinum' : 'Diamond'}</span>
                <span>{rewards.points} / {nextTierPoints}</span>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-white h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg">
        {(['overview', 'achievements', 'referrals', 'redeem'] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 gap-4"
          >
            <AnimatedCard className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
              <TrendingUp className="w-10 h-10 text-green-500 mb-3" />
              <div className="text-gray-600 text-sm mb-1">Total Earned</div>
              <div className="text-2xl font-bold text-gray-900">
                <NumberCounter value={rewards.totalEarned} />
              </div>
            </AnimatedCard>

            <AnimatedCard className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
              <Gift className="w-10 h-10 text-blue-500 mb-3" />
              <div className="text-gray-600 text-sm mb-1">Total Redeemed</div>
              <div className="text-2xl font-bold text-gray-900">
                <NumberCounter value={rewards.totalRedeemed} />
              </div>
            </AnimatedCard>

            <AnimatedCard className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg col-span-2">
              <Target className="w-10 h-10 text-purple-500 mb-3" />
              <div className="text-gray-600 text-sm mb-1">Recent Achievements</div>
              <div className="space-y-2 mt-3">
                {rewards.achievements.slice(-3).reverse().map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{achievement.name}</div>
                      <div className="text-sm text-gray-500">{achievement.description}</div>
                    </div>
                    <div className="text-sm font-bold text-blue-600">+{achievement.points}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">All Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {rewards.achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100"
                >
                  <Award className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="font-bold text-gray-900">{achievement.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{achievement.description}</div>
                  <div className="text-xs text-blue-600 font-bold mt-2">+{achievement.points} points</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'referrals' && (
          <motion.div
            key="referrals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">Refer & Earn</h3>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-4">
              <Users className="w-12 h-12 mb-3" />
              <h4 className="text-lg font-bold mb-2">Your Referral Code</h4>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 font-mono text-xl text-center mb-3">
                {rewards.referralCode || 'Generating...'}
              </div>
              <p className="text-white/80 text-sm">
                Share this code and earn 500 points for each friend who joins!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm mb-1">Total Referrals</div>
                <div className="text-2xl font-bold">{rewards.referrals}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-600 text-sm mb-1">Points Earned</div>
                <div className="text-2xl font-bold">{rewards.referrals * 500}</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'redeem' && (
          <motion.div
            key="redeem"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">Redeem Points</h3>
            <div className="space-y-3">
              {[
                { points: 500, reward: '₦500 Airtime', icon: '📱' },
                { points: 1000, reward: '₦1,000 Data Bundle', icon: '🌐' },
                { points: 2000, reward: '₦2,000 Gift Card', icon: '🎁' },
                { points: 5000, reward: '₦5,000 Cash Back', icon: '💰' },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-lg transition-all"
                  disabled={rewards.points < item.points}
                >
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900">{item.reward}</div>
                    <div className="text-sm text-gray-600">{item.points} points</div>
                  </div>
                  {rewards.points >= item.points ? (
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
