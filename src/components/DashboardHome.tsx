import React, { useEffect, useState } from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, Wallet, Send, Smartphone,
  Gift, Eye, EyeOff, ShoppingBag, Utensils, Plane, Coffee,
  CreditCard, Bell, Sparkles, TrendingUp, Search,
  ArrowRight, Zap, Star, Activity, ChevronRight, RefreshCw
} from "lucide-react";
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

const SkeletonPulse = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "primary",
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void; 
  variant?: "primary" | "secondary" | "outline";
  delay?: number;
}) => {
  const variants = {
    primary: "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 py-4 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${variants[variant]}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </motion.button>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick, 
  color,
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  description: string; 
  onClick: () => void; 
  color: string;
  delay?: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 text-left group hover:border-primary/30 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className="text-white" />
      </div>
      <h4 className="font-bold text-white text-base mb-1">{label}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
    
    <ChevronRight size={16} className="absolute top-5 right-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </motion.button>
);

const TransactionRow = ({ tx, index }: { tx: Transaction; index: number }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Electronics": return <ShoppingBag size={18} />;
      case "Transfer": return <ArrowDownLeft size={18} />;
      case "Dining": return <Utensils size={18} />;
      case "Travel": return <Plane size={18} />;
      case "Food": return <Coffee size={18} />;
      case "Crypto": return <RefreshCw size={18} />;
      case "Airtime": return <Smartphone size={18} />;
      case "GiftCard": return <Gift size={18} />;
      default: return <Wallet size={18} />;
    }
  };

  const isCredit = tx.type === "Credit";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
          isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-400'
        } group-hover:scale-110 transition-transform duration-200`}>
          {getCategoryIcon(tx.category)}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{tx.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{tx.category} • {tx.time}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-mono font-bold text-sm ${isCredit ? 'text-emerald-400' : 'text-white'}`}>
          {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
        </p>
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mt-1 ${
          tx.status === "Success" ? 'bg-emerald-500/10 text-emerald-400' :
          tx.status === "Processing" ? 'bg-amber-500/10 text-amber-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          <div className={`w-1 h-1 rounded-full ${
            tx.status === "Success" ? 'bg-emerald-400' :
            tx.status === "Processing" ? 'bg-amber-400 animate-pulse' :
            'bg-red-400'
          }`} />
          {tx.status}
        </div>
      </div>
    </motion.div>
  );
};

const CryptoCard = ({ name, symbol, price, change, icon: Icon, color, delay }: {
  name: string;
  symbol: string;
  price: string;
  change: string;
  icon: any;
  color: string;
  delay: number;
}) => {
  const isPositive = change.startsWith("+");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={18} className="text-white" fill={symbol === "BTC" ? "currentColor" : "none"} />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-xs text-gray-400">{symbol}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-mono font-bold text-sm text-white">₦{price}</p>
        <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </p>
      </div>
    </motion.div>
  );
};

export default function DashboardHome({ profile, transactions, onNavigateTab, onSelectAction, prices }: DashboardHomeProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3"
          >
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            System Online
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, <span className="text-primary">{profile.name.split(" ")[0]}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your financial ecosystem is performing optimally.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-56 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative"
          >
            <Bell size={18} className="text-gray-400" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] border border-white/10 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Balance</p>
                <p className="text-sm text-white font-semibold">NGN Wallet</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setHideBalance(!hideBalance)}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {hideBalance ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
            </motion.button>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 text-lg font-medium">₦</span>
              <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {hideBalance ? "••••••" : <AnimatedNumber value={profile.balance} />}
              </span>
              <span className="text-gray-400 text-sm font-medium ml-1">NGN</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <TrendingUp size={12} />
                +2.48%
              </div>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="flex gap-3">
            <ActionButton icon={ArrowDownLeft} label="Fund" onClick={() => onSelectAction("fund")} variant="primary" delay={0.1} />
            <ActionButton icon={ArrowUpRight} label="Withdraw" onClick={() => onSelectAction("withdraw")} variant="secondary" delay={0.2} />
            <ActionButton icon={Send} label="Transfer" onClick={() => onSelectAction("transfer")} variant="outline" delay={0.3} />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={Smartphone}
          label="Airtime"
          description="Top up instantly"
          onClick={() => onSelectAction("buy-airtime")}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          delay={0.1}
        />
        <QuickActionCard
          icon={Zap}
          label="Data"
          description="Internet bundles"
          onClick={() => onSelectAction("buy-data")}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
          delay={0.2}
        />
        <QuickActionCard
          icon={Gift}
          label="Gift Cards"
          description="Buy & sell"
          onClick={() => onSelectAction("buy-giftcard")}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
          delay={0.3}
        />
        <QuickActionCard
          icon={TrendingUp}
          label="Trade"
          description="Crypto market"
          onClick={() => onNavigateTab(AppTab.TRADE)}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
          delay={0.4}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transactions */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 rounded-2xl bg-white/[0.02] border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Your latest transactions</p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => onNavigateTab(AppTab.HISTORY)}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="space-y-1">
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Activity size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-400 text-sm">No transactions yet</p>
                <p className="text-gray-500 text-xs mt-1">Your activity will appear here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Markets */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Markets</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live prices</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            <CryptoCard
              name="Bitcoin"
              symbol="BTC"
              price={prices.BTC.toLocaleString()}
              change="+2.4%"
              icon={Star}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={0.1}
            />
            <CryptoCard
              name="Ethereum"
              symbol="ETH"
              price={prices.ETH.toLocaleString()}
              change="-0.8%"
              icon={Zap}
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
              delay={0.2}
            />
            <CryptoCard
              name="Solana"
              symbol="SOL"
              price={prices.SOL.toLocaleString()}
              change="+5.2%"
              icon={Activity}
              color="bg-gradient-to-br from-purple-500 to-pink-600"
              delay={0.3}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab(AppTab.TRADE)}
            className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Open Trading Desk
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
