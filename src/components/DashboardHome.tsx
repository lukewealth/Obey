import React, { useEffect, useState } from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, Wallet, Send, Smartphone,
  Gift, Eye, EyeOff, ShoppingBag, Utensils, Plane, Coffee,
  CreditCard, Bell, Sparkles, TrendingUp, Search,
  ArrowRight, Zap, Star, Activity, ChevronRight, RefreshCw,
  Wifi, BarChart3, ArrowLeftRight, QrCode, Cloud
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
    secondary: "text-white",
    outline: "text-white",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${variants[variant]}`}
      style={variant !== 'primary' ? {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      } : undefined}
    >
      <Icon size={18} />
      <span>{label}</span>
    </motion.button>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  label, 
  onClick, 
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void; 
  delay?: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 group"
    style={{
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}
  >
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
      <Icon size={20} />
    </div>
    <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
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
      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group relative pl-6"
    >
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${isCredit ? 'bg-emerald-500' : 'bg-primary'}`} />
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
  
  const sparklineData = isPositive 
    ? "M0 15 L10 12 L20 18 L30 10 L40 14 L50 8 L60 12 L70 5 L80 9 L90 2 L100 6"
    : "M0 5 L10 8 L20 4 L30 12 L40 8 L50 15 L60 10 L70 18 L80 14 L90 20 L100 16";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-all duration-200 cursor-pointer group"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-full ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md`}
        >
          <Icon size={18} className="text-white" fill={symbol === "BTC" ? "currentColor" : "none"} />
        </motion.div>
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-xs text-gray-500">{symbol}</p>
        </div>
      </div>
      
      <div className="flex-1 px-4 hidden sm:block">
        <svg className={`w-full h-8 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 20">
          <path d={sparklineData} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      <div className="text-right">
        <p className="font-mono font-bold text-sm text-white">₦{price}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {change}
        </motion.p>
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
            />
            Online
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {profile.name.split(" ")[0]}
          </h1>
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
            onClick={() => window.location.reload()}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative"
          >
            <Cloud size={18} className="text-gray-400" />
          </motion.button>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #0b0e14 0%, #1a1f2e 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-400 text-lg font-mono font-medium">₦</span>
                <span className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                  {hideBalance ? "••••••" : <AnimatedNumber value={profile.balance} />}
                </span>
                <span className="text-gray-400 text-sm font-medium ml-1">NGN</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <TrendingUp size={12} />
                  +2.48%
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <ArrowDownLeft size={18} />
              <span>Fund</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectAction("withdraw")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <ArrowUpRight size={18} />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <QuickActionCard
          icon={Send}
          label="Send"
          onClick={() => onSelectAction("transfer")}
          delay={0.1}
        />
        <QuickActionCard
          icon={ArrowLeftRight}
          label="Swap"
          onClick={() => onNavigateTab(AppTab.TRADE)}
          delay={0.2}
        />
        <QuickActionCard
          icon={Smartphone}
          label="Airtime"
          onClick={() => onSelectAction("buy-airtime")}
          delay={0.3}
        />
        <QuickActionCard
          icon={Gift}
          label="Gift Cards"
          onClick={() => onSelectAction("buy-giftcard")}
          delay={0.4}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transactions */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 rounded-2xl p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Transactions</h3>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => onNavigateTab(AppTab.HISTORY)}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              See all
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
                <p className="text-gray-400 text-sm font-medium">No transactions yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Markets */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 rounded-2xl p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Markets</h3>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </motion.div>
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
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab(AppTab.TRADE)}
            className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 relative overflow-hidden group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Trade
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
