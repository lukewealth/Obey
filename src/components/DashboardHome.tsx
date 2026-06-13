import React from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, Send, RefreshCw, Smartphone, 
  Gift, Eye, EyeOff, ShoppingBag, ArrowDown, Utensils, Plane, Coffee, 
  ChevronRight, CreditCard, Bell, Sparkles, TrendingUp, Search,
  ArrowRight, ShieldCheck, Zap, BarChart3, Star, CheckCircle2
} from "lucide-react";

interface DashboardHomeProps {
  profile: UserProfile;
  transactions: Transaction[];
  onNavigateTab: (tab: AppTab) => void;
  onSelectAction: (action: string) => void;
}

export default function DashboardHome({ profile, transactions, onNavigateTab, onSelectAction }: DashboardHomeProps) {
  const [hideBalance, setHideBalance] = React.useState(false);

  // Helper icons for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Electronics":
        return <ShoppingBag size={18} />;
      case "Transfer":
        return <ArrowDownLeft size={18} />;
      case "Dining":
        return <Utensils size={18} />;
      case "Travel":
        return <Plane size={18} />;
      case "Food":
        return <Coffee size={18} />;
      case "Crypto":
        return <RefreshCw size={18} />;
      case "Airtime":
        return <Smartphone size={18} />;
      case "GiftCard":
        return <Gift size={18} />;
      default:
        return <Wallet size={18} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-24"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/50 border border-blue-100 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            System Live: v2.4.0
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Welcome back, <span className="gradient-text">{profile.name.split(" ")[0]}</span>.
          </h1>
          <p className="text-gray-500 font-medium text-lg">Your financial ecosystem is performing optimally.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-[20px] pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-primary/10 w-72 transition-all outline-none"
            />
          </div>
          <button className="p-3.5 bg-white border border-gray-200 text-gray-600 rounded-[20px] hover:text-primary hover:bg-accent-blue transition-all shadow-sm active-press">
            <Bell size={22} />
          </button>
        </div>
      </motion.div>

      {/* Primary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Balance Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 bento-card min-h-[400px] flex flex-col justify-between group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/40 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-[20px] flex items-center justify-center">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Liquidity</p>
                  <p className="text-sm font-bold text-gray-900">SUI Mainnet Wallet</p>
                </div>
              </div>
              <button 
                onClick={() => setHideBalance(!hideBalance)}
                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-accent-blue rounded-[20px] transition-all active-press"
              >
                {hideBalance ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[13px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> +2.48% Performance
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">
                  {hideBalance ? "••••••" : `$${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </span>
                <span className="text-2xl text-gray-400 font-bold font-mono uppercase">USD</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { id: "fund", label: "Fund", icon: ArrowDownLeft, bg: "bg-primary text-white shadow-primary/20" },
              { id: "withdraw", label: "Withdraw", icon: ArrowUpRight, bg: "bg-accent-blue text-primary border border-blue-200/50 shadow-blue-500/10" },
              { id: "transfer", label: "Transfer", icon: Send, bg: "bg-white text-gray-700 border border-gray-200 shadow-gray-200/50" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => onSelectAction(btn.id)}
                className={`${btn.bg} py-5 px-6 rounded-[24px] text-base font-black flex items-center justify-center gap-3 active-press transition-all shadow-xl hover:-translate-y-1`}
              >
                <btn.icon size={22} /> {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Premium Card Display */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 bg-gray-900 rounded-[45px] p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl group text-white"
        >
          <div className="absolute inset-0 shimmer opacity-10 pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <span className="text-2xl font-black tracking-tighter italic">OBEY</span>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Platinum Elite</p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors">
              <CreditCard size={28} />
            </div>
          </div>

          <div className="space-y-10 relative z-10">
            <div className="space-y-2">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">Account Number</p>
              <p className="font-mono text-3xl tracking-[0.25em] font-bold text-white/90">
                8829 1044 22
              </p>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-black mb-1">MEMBER SINCE</p>
                <p className="text-sm font-bold uppercase tracking-tight">JUNE 2026</p>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-7 bg-red-500/60 rounded-lg"></div>
                <div className="w-10 h-7 bg-amber-500/60 rounded-lg -ml-4"></div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Middle Row: Quick Actions + Ecosystem Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Actions Grid */}
        <motion.section variants={itemVariants} className="lg:col-span-7 grid grid-cols-2 gap-6">
          {[
            { id: "buy-airtime", label: "Airtime", desc: "Global Top-up", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50" },
            { id: "buy-data", label: "Network", desc: "Data Bundles", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
            { id: "buy-giftcard", label: "Gifts", desc: "Digital Market", icon: Gift, color: "text-purple-500", bg: "bg-purple-50" },
            { id: "sell-giftcard", label: "Sell Card", desc: "Fast Liquidity", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" }
          ].map((action) => (
            <button 
              key={action.id}
              onClick={() => onSelectAction(action.id)}
              className="bento-card p-8 flex flex-col justify-between gap-6 hover:border-primary/40 group active-press"
            >
              <div className={`w-14 h-14 ${action.bg} ${action.color} rounded-[22px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon size={28} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 tracking-tight">{action.label}</p>
                <p className="text-sm text-gray-400 font-medium mt-1">{action.desc}</p>
              </div>
            </button>
          ))}
        </motion.section>

        {/* Reference Image: Dashboard Improvement Widget */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 bento-card p-0 overflow-hidden relative group cursor-pointer"
        >
          <img 
            src="/Dasboard improvement.jpg" 
            alt="Dashboard Performance" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest">
              Live Preview
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
              Institutional Console v4.0 <br />
              <span className="text-white/60">Coming Summer 2026.</span>
            </h3>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest pt-2">
              Learn More <ArrowRight size={14} />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Row: Ledger + Market */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity */}
        <motion.section 
          variants={itemVariants}
          className="lg:col-span-8 bento-card p-10"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Financial Ledger</h3>
              <p className="text-sm text-gray-400 font-medium">Real-time settlement history.</p>
            </div>
            <button 
              onClick={() => onNavigateTab(AppTab.WALLET)}
              className="text-primary text-[11px] font-black uppercase tracking-widest hover:gap-3 flex items-center gap-2 transition-all border-b-2 border-primary/10 pb-1"
            >
              Full History <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-6 hover:bg-accent-blue/40 transition-all rounded-[24px] group border border-transparent hover:border-blue-100 cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[20px] bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shadow-sm">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 tracking-tight">{tx.title}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                      {tx.category} • {tx.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xl font-mono font-black ${tx.type === "Credit" ? "text-emerald-600" : "text-gray-900"}`}>
                    {tx.type === "Credit" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mt-2 ${
                    tx.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Live Markets + Perks */}
        <motion.section variants={itemVariants} className="lg:col-span-4 space-y-8">
          
          {/* Markets */}
          <div className="bento-card p-10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Trading Nodes</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Bitcoin", symbol: "BTC", price: "64,231.80", change: "+2.4%", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                { name: "Ethereum", symbol: "ETH", price: "3,452.12", change: "-0.8%", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50" },
                { name: "Solana", symbol: "SOL", price: "145.67", change: "+5.2%", icon: Zap, color: "text-purple-500", bg: "bg-purple-50" }
              ].map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[22px] hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${coin.bg} ${coin.color} rounded-[18px] flex items-center justify-center font-black group-hover:scale-110 transition-transform`}>
                      <coin.icon size={20} fill={coin.symbol === "BTC" ? "currentColor" : "none"} />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900 tracking-tight">{coin.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-gray-900 font-mono tracking-tighter">${coin.price}</p>
                    <p className={`text-[10px] font-black font-mono ${coin.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                      {coin.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigateTab(AppTab.TRADE)}
              className="w-full py-5 bg-primary/5 hover:bg-primary/10 text-primary rounded-[22px] text-xs font-black uppercase tracking-[0.2em] transition-all active-press"
            >
              Open Trading Desk
            </button>
          </div>

          {/* Perks Card: Finsy Style */}
          <div className="bg-accent-yellow/80 border border-yellow-200 rounded-[45px] p-10 relative overflow-hidden group shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
             <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-yellow-600 shadow-sm">
                <Sparkles size={32} />
              </div>
              <h4 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Master your <br /> wealth flow.</h4>
              <p className="text-gray-600 font-medium leading-relaxed">
                Unlock exclusive institutional features and sub-zero spread trading.
              </p>
              <button className="text-gray-900 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-gray-900/10 hover:border-gray-900 transition-all pb-2">
                UPGRADE TO ELITE
              </button>
            </div>
          </div>
        </motion.section>

      </div>
    </motion.div>
  );
}
