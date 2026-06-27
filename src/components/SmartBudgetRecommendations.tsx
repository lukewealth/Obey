import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

interface SmartBudgetRecommendationsProps {
  userId: string;
  balance: number;
  transactions: any[];
}

export default function SmartBudgetRecommendations({ userId, balance, transactions }: SmartBudgetRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [userId, transactions]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/insights', {
        userId,
        transactions: transactions.slice(0, 30),
        balance,
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <h2 className="text-2xl font-bold">Generating Smart Budget...</h2>
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  const { savingsScore, spendingTrend, recommendations: recs, categories } = recommendations;

  const budgetRules = [
    { category: 'Needs', percentage: 50, color: 'bg-blue-500' },
    { category: 'Wants', percentage: 30, color: 'bg-purple-500' },
    { category: 'Savings', percentage: 20, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-10 h-10" />
            <div>
              <h2 className="text-2xl font-bold">Smart Budget Plan</h2>
              <p className="text-white/80 text-sm">AI-optimized for your spending patterns</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <Target className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">Savings Score</div>
              <div className="text-2xl font-bold">{savingsScore}/100</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">Spending Trend</div>
              <div className="text-2xl font-bold">
                {spendingTrend > 0 ? '+' : ''}{spendingTrend}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
            >
              <Sparkles className="w-6 h-6 mb-2" />
              <div className="text-white/80 text-xs mb-1">AI Confidence</div>
              <div className="text-2xl font-bold">85%</div>
            </motion.div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recommended Budget Allocation
            </h3>
            <div className="space-y-3">
              {budgetRules.map((rule) => {
                const amount = (balance * rule.percentage) / 100;
                return (
                  <motion.div
                    key={rule.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{rule.category}</span>
                      <span className="font-bold">₦{amount.toLocaleString()} ({rule.percentage}%)</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`${rule.color} h-full rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${rule.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {recs && recs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold">Smart Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recs.slice(0, 5).map((rec: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl"
              >
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {categories && Object.keys(categories).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">Category Analysis</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categories)
              .sort((a: any, b: any) => b[1].amount - a[1].amount)
              .slice(0, 5)
              .map(([category, data]: [string, any], i: number) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{category}</span>
                    <span className="text-gray-600">
                      ₦{data.amount.toLocaleString()} ({data.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ duration: 1, delay: 1 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
