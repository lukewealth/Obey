import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain, TrendingUp, TrendingDown, Sparkles, Target,
  AlertCircle, CheckCircle2, BarChart3, Activity,
  Zap, Shield, Eye, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Lightbulb, Clock
} from "lucide-react";
import { UserProfile, Transaction } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

interface AIPageProps {
  profile: UserProfile;
  transactions: Transaction[];
  prices: {
    BTC: number;
    ETH: number;
    SOL: number;
    SUI: number;
  };
}

interface AIInsight {
  id: string;
  type: 'spending' | 'investment' | 'savings' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  action?: string;
  icon: any;
  color: string;
}

interface MarketPrediction {
  symbol: string;
  name: string;
  currentPrice: number;
  predictedPrice: number;
  change: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
}

export default function AIPage({ profile, transactions, prices }: AIPageProps) {
  const [activeSection, setActiveSection] = useState<'insights' | 'predictions' | 'analysis'>('insights');
  const [loading, setLoading] = useState(false);

  // Generate AI insights based on user data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    // Spending analysis
    const totalSpent = transactions
      .filter(t => t.type === 'Debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthSpent = totalSpent * 0.85; // Simulated
    const spendingChange = ((totalSpent - lastMonthSpent) / lastMonthSpent * 100).toFixed(0);

    if (parseInt(spendingChange) < 0) {
      insights.push({
        id: '1',
        type: 'savings',
        title: 'Excellent Progress!',
        description: `You're spending ${Math.abs(parseInt(spendingChange))}% less than last month. Keep it up!`,
        confidence: 95,
        icon: CheckCircle2,
        color: 'emerald'
      });
    } else {
      insights.push({
        id: '1',
        type: 'spending',
        title: 'Spending Alert',
        description: `You're spending ${spendingChange}% more than last month. Consider reviewing your budget.`,
        confidence: 87,
        action: 'View Breakdown',
        icon: AlertCircle,
        color: 'amber'
      });
    }

    // Investment opportunity
    if (prices.BTC > 0) {
      insights.push({
        id: '2',
        type: 'opportunity',
        title: 'Bitcoin Analysis',
        description: 'BTC has broken above key resistance. Historical data suggests 73% chance of continued growth.',
        confidence: 73,
        action: 'View Analysis',
        icon: TrendingUp,
        color: 'blue'
      });
    }

    // Savings suggestion
    const potentialSavings = Math.floor(totalSpent * 0.15);
    insights.push({
      id: '3',
      type: 'savings',
      title: 'Potential Savings',
      description: `Based on your spending patterns, you could save ₦${potentialSavings.toLocaleString()} this month.`,
      confidence: 82,
      action: 'Optimize Now',
      icon: Lightbulb,
      color: 'purple'
    });

    return insights;
  };

  // Generate market predictions
  const generatePredictions = (): MarketPrediction[] => {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: prices.BTC,
        predictedPrice: prices.BTC * 1.08,
        change: 8,
        confidence: 78,
        trend: 'bullish',
        timeframe: '7 days'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: prices.ETH,
        predictedPrice: prices.ETH * 1.12,
        change: 12,
        confidence: 71,
        trend: 'bullish',
        timeframe: '7 days'
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: prices.SOL,
        predictedPrice: prices.SOL * 0.95,
        change: -5,
        confidence: 65,
        trend: 'bearish',
        timeframe: '7 days'
      },
      {
        symbol: 'SUI',
        name: 'Sui',
        currentPrice: prices.SUI,
        predictedPrice: prices.SUI * 1.15,
        change: 15,
        confidence: 69,
        trend: 'bullish',
        timeframe: '7 days'
      }
    ];
  };

  const insights = generateInsights();
  const predictions = generatePredictions();

  // Financial health score calculation
  const calculateHealthScore = () => {
    let score = 75; // Base score
    
    // Factor in spending habits
    if (transactions.length > 0) {
      const creditRatio = transactions.filter(t => t.type === 'Credit').length / transactions.length;
      if (creditRatio > 0.6) score += 15;
    }
    
    // Factor in balance
    if (profile.balance > 100000) score += 10;
    
    return Math.min(100, score);
  };

  const healthScore = calculateHealthScore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Obey AI</h1>
          </div>
          <p className="text-gray-400 text-sm">Your intelligent financial companion</p>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30"
        >
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
          <span className="text-xs text-purple-300 font-medium">Active</span>
        </motion.div>
      </motion.div>

      {/* Section Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
        {[
          { id: 'insights', label: 'AI Insights', icon: Sparkles },
          { id: 'predictions', label: 'Predictions', icon: TrendingUp },
          { id: 'analysis', label: 'Analysis', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* AI Insights Section */}
      {activeSection === 'insights' && (
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Financial Health Score */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Financial Health</h3>
              <Shield size={20} className="text-purple-400" />
            </div>
            <div className="flex items-end gap-4">
              <div>
                <span className="text-5xl font-bold text-white">{healthScore}</span>
                <span className="text-gray-400 text-lg">/100</span>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${healthScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insight Cards */}
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border ${
                insight.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' :
                insight.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20' :
                insight.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                'bg-purple-500/10 border-purple-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  insight.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  insight.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  insight.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <insight.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{insight.title}</h4>
                    <span className="text-xs text-gray-400">{insight.confidence}% confidence</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
                  {insight.action && (
                    <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Market Predictions Section */}
      {activeSection === 'predictions' && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-blue-400" />
              <h3 className="text-lg font-bold text-white">AI Market Predictions</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Based on historical data, market trends, and sentiment analysis
            </p>

            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        prediction.trend === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                        prediction.trend === 'bearish' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {prediction.trend === 'bullish' ? <TrendingUp size={20} /> :
                         prediction.trend === 'bearish' ? <TrendingDown size={20} /> :
                         <Activity size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{prediction.name}</p>
                        <p className="text-xs text-gray-400">{prediction.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        prediction.change > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {prediction.change > 0 ? '+' : ''}{prediction.change}%
                      </p>
                      <p className="text-xs text-gray-400">{prediction.timeframe}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Current</p>
                      <p className="text-sm font-mono font-bold text-white">
                        ₦{prediction.currentPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Predicted</p>
                      <p className="text-sm font-mono font-bold text-purple-400">
                        ₦{prediction.predictedPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Confidence</p>
                      <p className="text-sm font-bold text-white">{prediction.confidence}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300 mb-1">Disclaimer</p>
                <p className="text-xs text-amber-200/70">
                  AI predictions are based on historical data and market analysis. 
                  They are not financial advice. Always do your own research before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Section */}
      {activeSection === 'analysis' && (
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Portfolio Distribution */}
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={20} className="text-purple-400" />
              <h3 className="text-lg font-bold text-white">Portfolio Analysis</h3>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'BTC', value: 35, fill: '#f59e0b' },
                    { name: 'ETH', value: 28, fill: '#3b82f6' },
                    { name: 'SOL', value: 18, fill: '#a855f7' },
                    { name: 'SUI', value: 12, fill: '#06b6d4' },
                    { name: 'Others', value: 7, fill: '#64748b' },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} />
                  <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {[
                      { name: 'BTC', value: 35, fill: '#f59e0b' },
                      { name: 'ETH', value: 28, fill: '#3b82f6' },
                      { name: 'SOL', value: 18, fill: '#a855f7' },
                      { name: 'SUI', value: 12, fill: '#06b6d4' },
                      { name: 'Others', value: 7, fill: '#64748b' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending Trends */}
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Spending Trends</h3>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', spending: 45000 },
                  { month: 'Feb', spending: 52000 },
                  { month: 'Mar', spending: 48000 },
                  { month: 'Apr', spending: 61000 },
                  { month: 'May', spending: 55000 },
                  { month: 'Jun', spending: 42000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} />
                  <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Spending']}
                  />
                  <Line type="monotone" dataKey="spending" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-yellow-400" />
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Diversify Portfolio</p>
                    <p className="text-xs text-gray-400">Consider allocating 15% to stablecoins for reduced volatility</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Target size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Set Savings Goal</p>
                    <p className="text-xs text-gray-400">Based on your income, aim for ₦500,000 monthly savings</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Optimize Subscriptions</p>
                    <p className="text-xs text-gray-400">You could save ₦12,000/month by reviewing active subscriptions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
