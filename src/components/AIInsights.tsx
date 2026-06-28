import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb, Sparkles, 
  BarChart3, Target, Zap, ArrowUpRight, ArrowDownRight,
  Loader2, RefreshCw, ChevronRight, Activity, DollarSign, PieChart
} from 'lucide-react';
import api from '../services/api';
import { designTokens, motionVariants } from '../styles/design-tokens';

interface AIInsightsProps {
  userId: string;
  transactions: any[];
  balance: number;
}

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-3xl bg-white/5 dark:bg-white/5 border border-white/10 p-6">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <div className="space-y-4">
      <div className="h-4 bg-white/10 rounded-full w-1/3" />
      <div className="h-8 bg-white/10 rounded-full w-2/3" />
      <div className="h-4 bg-white/10 rounded-full w-1/2" />
    </div>
  </div>
);

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend,
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="relative overflow-hidden rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 p-5 backdrop-blur-xl group cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
          <Icon size={18} className="text-primary" />
        </div>
        {change && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 300 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
              trend === 'down' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-500/10 text-gray-400'
            }`}
          >
            {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
            {change}
          </motion.div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
          className="text-2xl font-bold text-white tracking-tight"
        >
          {value}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

const RecommendationCard = ({ text, index }: { text: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
    whileHover={{ x: 4 }}
    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
      <Sparkles size={14} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-200 leading-relaxed">{text}</p>
    </div>
    <ChevronRight size={16} className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
  </motion.div>
);

const CategoryBar = ({ category, amount, percentage, delay }: { 
  category: string; 
  amount: number; 
  percentage: number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="space-y-2"
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-300">{category}</span>
      <span className="text-sm font-mono text-gray-400">₦{amount.toLocaleString()}</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
      />
    </div>
  </motion.div>
);

export default function AIInsights({ userId, transactions, balance }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [userId, transactions.length]);

  const generateInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.post('/ai/insights', {
        userId,
        transactions: transactions.slice(0, 20),
        balance,
      });
      setInsights(response.data);
    } catch (err) {
      console.error('Failed to generate insights:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (error || !insights) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-8 text-center"
      >
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to generate insights</h3>
        <p className="text-gray-400 mb-6">Our AI is having trouble connecting. Please try again.</p>
        <button
          onClick={generateInsights}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </motion.div>
    );
  }

  const spendingTrend = insights.spendingTrend || 0;
  const savingsScore = insights.savingsScore || 0;
  const riskLevel = insights.riskLevel || 'Low';

  return (
    <motion.div
      variants={motionVariants.staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={motionVariants.slideUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Insights</h2>
            <p className="text-sm text-gray-400">Powered by advanced analytics</p>
          </div>
        </div>
        <motion.button
          onClick={generateInsights}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={16} className="text-gray-400" />
        </motion.button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="Spending Trend"
          value={`${spendingTrend > 0 ? '+' : ''}${spendingTrend}%`}
          change={`${Math.abs(spendingTrend)}%`}
          trend={spendingTrend > 0 ? 'up' : 'down'}
          delay={0.1}
        />
        <MetricCard
          icon={Target}
          label="Savings Score"
          value={`${savingsScore}/100`}
          change={savingsScore > 70 ? 'Good' : 'Fair'}
          trend={savingsScore > 70 ? 'up' : 'neutral'}
          delay={0.2}
        />
        <MetricCard
          icon={Zap}
          label="Risk Level"
          value={riskLevel}
          change={riskLevel === 'Low' ? 'Safe' : 'Monitor'}
          trend={riskLevel === 'Low' ? 'up' : 'down'}
          delay={0.3}
        />
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold text-white">Smart Recommendations</h3>
          </div>
          <div className="space-y-3">
            {insights.recommendations.slice(0, 3).map((rec: string, i: number) => (
              <RecommendationCard key={i} text={rec} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Spending Categories */}
      {insights.categories && Object.keys(insights.categories).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-white">Spending Breakdown</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(insights.categories).map(([category, data]: [string, any], i: number) => (
              <CategoryBar
                key={category}
                category={category}
                amount={data.amount}
                percentage={data.percentage}
                delay={0.6 + i * 0.1}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Anomalies */}
      {insights.anomalies && insights.anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-orange-400" />
            <h3 className="text-lg font-bold text-white">Unusual Activity</h3>
          </div>
          <div className="space-y-3">
            {insights.anomalies.map((anomaly: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-orange-500/20"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-white">{anomaly.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{anomaly.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
