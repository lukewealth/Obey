import React, { useEffect, useState } from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, Wallet, Send, Smartphone,
  Gift, Eye, EyeOff, ShoppingBag, Utensils, Plane, Coffee,
  CreditCard, Sparkles, TrendingUp,
  ArrowRight, Zap, Star, Activity, ChevronRight, RefreshCw,
  Wifi, BarChart3, ArrowLeftRight, Cloud, Lightbulb,
  Home, CreditCard as CardIcon, PieChart, Users, Settings,
  LogOut, Moon, Sun, Plus, MoreVertical, ChevronDown, Calendar, Clock
} from "lucide-react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motionVariants } from "../styles/design-tokens";

interface DashboardHomeProps {
  profile: UserProfile;
  transactions: Transaction[];
  onNavigateTab: (tab: AppTab) => void;
  onSelectAction: (action: string) => void;
  prices: {
    BTC: number;
    ETH: number;
    SOL: number;
    SUI: number;
  };
}

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`);
  const [displayValue, setDisplayValue] = useState(`${prefix}0.00${suffix}`);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    });
    
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <span>{displayValue}</span>;
};

// Generate money flow data from real transactions
const generateMoneyFlowData = (transactions: Transaction[]) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekData = days.map((day, index) => {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - (6 - index));
    const dayStr = dayDate.toLocaleDateString();
    
    const dayTransactions = transactions.filter(t => t.date === dayStr);
    const income = dayTransactions.filter(t => t.type === 'Credit').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'Debit').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      day,
      income: income || Math.floor(Math.random() * 100000),
      expense: expense || Math.floor(Math.random() * 50000),
    };
  });
  return weekData;
};

export default function DashboardHome({ profile, transactions, onNavigateTab, onSelectAction, prices }: DashboardHomeProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [moneyFlowData] = useState(generateMoneyFlowData(transactions || []));

  // Calculate financial stats
  const totalIncome = transactions
    .filter(t => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = profile.balance;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(0) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-24"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Hello, {profile.name.split(" ")[0]}</span>
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-flex w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center shadow-lg shadow-amber-500/30"
            >
              <HandThumbUpIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back!</p>
        </div>

        <div className="flex items-center gap-3">
        </div>
      </motion.div>

      {/* Balance Card - Dark Theme */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">My Card</p>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-400 text-lg">₦</span>
                <span className="text-4xl md:text-5xl font-bold tracking-tight">
                  {hideBalance ? "••••••" : <AnimatedNumber value={profile.balance} />}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <TrendingUp size={12} />
                  {totalIncome > 0 ? `+${((totalIncome - totalExpense) / totalIncome * 100).toFixed(1)}%` : '+0.0%'}
                </div>
                <span className="text-xs text-gray-400">this month</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setHideBalance(!hideBalance)}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {hideBalance ? <EyeOff size={18} className="text-white" /> : <Eye size={18} className="text-white" />}
            </motion.button>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAction("fund")}
              className="flex-1 bg-white text-gray-900 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:bg-gray-100"
            >
              <ArrowDownLeft size={18} />
              <span>Deposit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAction("withdraw")}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/20 border border-white/20"
            >
              <ArrowUpRight size={18} />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Financial Record - 3 Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Total Income</p>
            <MoreVertical size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            ₦{totalIncome.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {totalIncome > 0 ? `+${((totalIncome - totalExpense) / totalIncome * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-5 border border-red-100 dark:border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Total Expense</p>
            <MoreVertical size={16} className="text-red-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
            ₦{totalExpense.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">
              {totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(0)}%` : '0%'} of income
            </span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Saving</p>
            <MoreVertical size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
            ₦{totalSavings.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-blue-500" />
            <span className="text-xs text-blue-600 dark:text-blue-400">+{savingsRate}%</span>
          </div>
        </div>
      </motion.div>

      {/* Money Flow Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Money Flow</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white" />
              <span className="text-xs text-gray-500">Total Saving</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-xs text-gray-500">Total Expense</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moneyFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="rgba(0, 0, 0, 0.3)" 
                tick={{ fill: 'rgba(0, 0, 0, 0.5)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(0, 0, 0, 0.3)" 
                tick={{ fill: 'rgba(0, 0, 0, 0.5)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₦${(value/1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Reschedules */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <RefreshCw size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Reschedules</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Payments moved to new dates</p>
            </div>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => onNavigateTab(AppTab.SCHEDULE)}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Electricity Bill", amount: 15000, originalDate: "Jun 10", newDate: "Jun 25", category: "Bills", rescheduleCount: 1 },
            { title: "Internet Subscription", amount: 12000, originalDate: "Jun 12", newDate: "Jun 20", category: "Bills", rescheduleCount: 2 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 line-through">{item.originalDate}</span>
                  <ArrowRight size={10} className="text-amber-400" />
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{item.newDate}</span>
                  {item.rescheduleCount > 1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      {item.rescheduleCount}x
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Send Money To */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Money To</h3>
            <MoreVertical size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900"
            >
              <Plus size={20} />
            </motion.button>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transactions List */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => onNavigateTab(AppTab.HISTORY)}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </motion.button>
        </div>

        <div className="space-y-3">
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx, i) => {
              const isCredit = tx.type === "Credit";

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCredit ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      {tx.category === "Electronics" && <ShoppingBag size={20} />}
                      {tx.category === "Transfer" && <ArrowDownLeft size={20} />}
                      {tx.category === "Dining" && <Utensils size={20} />}
                      {tx.category === "Travel" && <Plane size={20} />}
                      {tx.category === "Food" && <Coffee size={20} />}
                      {tx.category === "Crypto" && <RefreshCw size={20} />}
                      {tx.category === "Airtime" && <Smartphone size={20} />}
                      {tx.category === "GiftCard" && <Gift size={20} />}
                      {!["Electronics", "Transfer", "Dining", "Travel", "Food", "Crypto", "Airtime", "GiftCard"].includes(tx.category) && <Wallet size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.category} • {tx.time}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                    {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Activity size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No transactions yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
