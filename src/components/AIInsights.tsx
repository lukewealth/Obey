import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, AlertCircle, Lightbulb, Sparkles, 
  BarChart3, Target, Zap, ArrowUpRight, ArrowDownRight,
  Loader2, RefreshCw
} from 'lucide-react';
import { microInteractions, AnimatedCard } from './MicroInteractions';
import api from '../services/api';

interface AIInsightsProps {
  userId: string;
  transactions: any[];
  balance: number;
}

export default function AIInsights({ userId, transactions, balance }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    generateInsights();
  }, [userId, transactions]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/insights', {
        userId,
        transactions: transactions.slice(0, 20),
        balance,
      });
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl font-bold">AI is thinking...</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="bg-white/20 rounded-xl h-4"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-10 h-10" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">AI Financial Insights</h2>
                <p className="text-white/80 text-sm">Powered by advanced analytics</p>
              </div>
            </div>
            <motion.button
              onClick={generateInsights}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">Spending Trend</div>
              <div className="text-xl font-bold flex items-center gap-1">
                {insights.spendingTrend > 0 ? (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    +{insights.spendingTrend}%
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4" />
                    {insights.spendingTrend}%
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <Target className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">Savings Score</div>
              <div className="text-xl font-bold">{insights.savingsScore}/100</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <Zap className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">Risk Level</div>
              <div className="text-xl font-bold">{insights.riskLevel}</div>
            </motion.div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold">Smart Recommendations</h3>
            </div>
            <div className="space-y-2">
              {insights.recommendations.slice(0, 3).map((rec: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {insights.categories && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">Spending Categories</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(insights.categories).map(([category, data]: [string, any], i: number) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category}</span>
                  <span className="text-gray-600">₦{data.amount.toLocaleString()}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {insights.anomalies && insights.anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">Unusual Activity</h3>
          </div>
          <div className="space-y-3">
            {insights.anomalies.map((anomaly: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="bg-white rounded-xl p-4 border border-orange-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{anomaly.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{anomaly.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
