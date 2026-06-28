import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, TrendingDown, BarChart3,
  DollarSign, Activity, Clock, Shield, Zap,
  BuyIcon, SellIcon, AlertCircle, CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserProfile } from "../types";

interface AssetDetailProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  onClose: () => void;
  onBuy: (amount: number) => void;
  onSell: (amount: number) => void;
  profile: UserProfile;
}

export default function AssetDetail({ symbol, name, price, change, onClose, onBuy, onSell, profile }: AssetDetailProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'stats' | 'trade'>('chart');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Generate mock historical data
  const generateHistoricalData = () => {
    const data = [];
    let basePrice = price * 0.9;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      basePrice = basePrice * (1 + (Math.random() - 0.5) * 0.05);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: basePrice,
        volume: Math.floor(Math.random() * 1000000000) + 500000000
      });
    }
    
    return data;
  };

  const historicalData = generateHistoricalData();

  const stats = {
    marketCap: price * 19500000, // Mock calculation
    volume24h: price * 28500,
    circulatingSupply: 19500000,
    allTimeHigh: price * 1.5,
    allTimeLow: price * 0.3,
    rank: symbol === 'BTC' ? 1 : symbol === 'ETH' ? 2 : 3
  };

  const handleTrade = () => {
    const tradeAmount = parseFloat(amount);
    if (!tradeAmount || tradeAmount <= 0) return;

    if (tradeType === 'buy') {
      onBuy(tradeAmount);
    } else {
      onSell(tradeAmount);
    }
    
    setShowConfirm(false);
    setAmount('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <h2 className="text-lg font-bold text-white">{name} Details</h2>
            <div className="w-10" />
          </div>

          {/* Asset Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h1>
                <p className="text-gray-400">{symbol}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="font-bold">{change >= 0 ? '+' : ''}{change}%</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-gray-400 text-2xl"></span>
              <span className="text-5xl md:text-6xl font-bold text-white font-mono">
                {price.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-400">Current Price</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
            {[
              { id: 'chart', label: 'Chart', icon: BarChart3 },
              { id: 'stats', label: 'Statistics', icon: Activity },
              { id: 'trade', label: 'Trade', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart Tab */}
          {activeTab === 'chart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Price Chart */}
              <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Price History (30 Days)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255, 255, 255, 0.5)" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        interval={5}
                      />
                      <YAxis 
                        stroke="rgba(255, 255, 255, 0.5)" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Price']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#a855f7" 
                        strokeWidth={3}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume Chart */}
              <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Trading Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255, 255, 255, 0.5)" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        interval={5}
                      />
                      <YAxis 
                        stroke="rgba(255, 255, 255, 0.5)" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                        tickFormatter={(value) => `${(value/1000000000).toFixed(1)}B`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '12px',
                        }}
                        formatter={(value: number) => [`₦${(value/1000000000).toFixed(2)}B`, 'Volume']}
                      />
                      <Bar dataKey="volume" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Market Cap', value: `₦${(stats.marketCap/1000000000).toFixed(2)}B`, icon: DollarSign },
                { label: '24h Volume', value: `₦${(stats.volume24h/1000000).toFixed(2)}M`, icon: Activity },
                { label: 'Circulating Supply', value: `${(stats.circulatingSupply/1000000).toFixed(2)}M`, icon: BarChart3 },
                { label: 'All Time High', value: `₦${stats.allTimeHigh.toLocaleString()}`, icon: TrendingUp },
                { label: 'All Time Low', value: `₦${stats.allTimeLow.toLocaleString()}`, icon: TrendingDown },
                { label: 'Market Rank', value: `#${stats.rank}`, icon: Shield },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-6 bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <stat.icon size={16} className="text-purple-400" />
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold text-white font-mono">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Trade Tab */}
          {activeTab === 'trade' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Trade Type Selector */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    tradeType === 'buy'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400'
                  }`}
                >
                  Buy {symbol}
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    tradeType === 'sell'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-gray-400'
                  }`}
                >
                  Sell {symbol}
                </button>
              </div>

              {/* Amount Input */}
              <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                <label className="text-sm text-gray-400 mb-2 block">Amount (NGN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-2xl font-mono font-bold text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                {amount && (
                  <p className="text-sm text-gray-400 mt-3">
                    ≈ {((parseFloat(amount) || 0) / price).toFixed(6)} {symbol}
                  </p>
                )}
              </div>

              {/* Available Balance */}
              <div className="rounded-2xl p-4 bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Available Balance</span>
                  <span className="text-sm font-bold text-white">₦{profile.balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Trade Button */}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!amount || parseFloat(amount) <= 0}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  tradeType === 'buy'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {symbol}
              </button>

              {/* Security Notice */}
              <div className="rounded-2xl p-4 bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">Secure Transaction</p>
                    <p className="text-xs text-blue-200/70">
                      All transactions are encrypted and processed through our secure vault system.
                      Admin notification will be sent for verification.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  tradeType === 'buy' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {tradeType === 'buy' ? 
                    <TrendingUp size={32} className="text-emerald-400" /> :
                    <TrendingDown size={32} className="text-red-400" />
                  }
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
                </h3>
                <p className="text-gray-400">
                  You are about to {tradeType} {((parseFloat(amount) || 0) / price).toFixed(6)} {symbol}
                </p>
              </div>

              <div className="rounded-2xl p-4 bg-white/5 border border-white/10 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-bold text-white">₦{parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Price</span>
                  <span className="text-sm font-bold text-white">₦{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-sm text-gray-400">You'll {tradeType === 'buy' ? 'receive' : 'get'}</span>
                  <span className="text-sm font-bold text-purple-400">
                    {((parseFloat(amount) || 0) / price).toFixed(6)} {symbol}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTrade}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                    tradeType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
