import React from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, Send, RefreshCw, Smartphone, 
  Gift, Eye, EyeOff, ShoppingBag, ArrowDown, Utensils, Plane, Coffee, 
  ChevronRight, CreditCard, Bell, Sparkles, TrendingUp, Search,
  ArrowRight, ShieldCheck, Zap, BarChart3, Star, CheckCircle2, Activity
} from "lucide-react";


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

export default function DashboardHome({ profile, transactions, onNavigateTab, onSelectAction, prices }: DashboardHomeProps) {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };


  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-12 pb-24 px-1 md:px-0"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-primary dark:text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            System Live: v4.2.0-NGN
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
            Welcome back, <span className="gradient-text">{profile.name.split(" ")[0]}</span>.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-base md:text-lg">Your financial ecosystem is performing optimally.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[20px] pl-12 pr-6 py-3 text-sm focus:ring-2 focus:ring-primary/10 w-72 transition-all outline-none text-gray-900 dark:text-white"
            />
          </div>
          <button className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-[18px] md:rounded-[20px] hover:text-primary hover:bg-accent-blue dark:hover:bg-white/10 transition-all shadow-sm active-press">
            <Bell size={20} className="md:w-5 md:h-5" />
          </button>
        </div>
      </motion.div>

      {/* Primary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Main Balance Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-8 bento-card min-h-[340px] md:min-h-[400px] p-6 md:p-12 flex flex-col justify-between group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/40 dark:bg-primary/10 rounded-full blur-[60px] md:blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="space-y-6 md:space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-[16px] md:rounded-[20px] flex items-center justify-center shadow-inner">
                  <Wallet size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Total Liquidity</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">Institutional NGN Vault</p>
                </div>
              </div>
              <button 
                onClick={() => setHideBalance(!hideBalance)}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-accent-blue dark:hover:bg-white/5 rounded-[16px] md:rounded-[20px] transition-all active-press"
              >
                {hideBalance ? <EyeOff size={20} className="md:w-5 md:h-5" /> : <Eye size={20} className="md:w-5 md:h-5" />}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] md:text-[13px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={12} className="md:w-3.5 md:h-3.5" /> +2.48% Performance
              </p>
              <div className="flex items-baseline gap-2 md:gap-4 overflow-hidden">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-none truncate">
                  {hideBalance ? "••••••" : `₦${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </span>
                <span className="text-lg md:text-2xl text-gray-400 dark:text-gray-600 font-bold font-mono uppercase shrink-0">NGN</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-12">
            {[
              { id: "fund", label: "Fund", icon: ArrowDownLeft, bg: "bg-primary text-white shadow-primary/20" },
              { id: "withdraw", label: "Withdraw", icon: ArrowUpRight, bg: "bg-accent-blue dark:bg-white/10 text-primary dark:text-white border border-blue-200/50 dark:border-white/10 shadow-blue-500/10" },
              { id: "transfer", label: "Transfer", icon: Send, bg: "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-gray-200/50" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => onSelectAction(btn.id)}
                className={`${btn.bg} py-4 md:py-5 px-4 md:px-6 rounded-[18px] md:rounded-[24px] text-sm md:text-base font-black flex items-center justify-center gap-2 md:gap-3 active-press transition-all shadow-lg hover:-translate-y-1`}
              >
                <btn.icon size={18} className="md:w-5 md:h-5" /> {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Premium Card Display */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-4 bg-gray-900 dark:bg-black rounded-[35px] md:rounded-[45px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl group text-white min-h-[280px] md:min-h-auto"
        >
          <div className="absolute inset-0 shimmer opacity-10 pointer-events-none"></div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter italic">OBEY</span>
              <p className="text-[9px] md:text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Platinum Elite</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl rounded-[20px] md:rounded-[24px] flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors shadow-lg">
              <CreditCard size={24} className="md:w-7 md:h-7" />
            </div>
          </div>

          <div className="space-y-8 md:space-y-10 relative z-10">
            <div className="space-y-2">
              <p className="text-[9px] md:text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">Account Number</p>
              <p className="font-mono text-xl sm:text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.25em] font-bold text-white/90">
                8829 1044 22
              </p>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div>
                <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-black mb-1">MEMBER SINCE</p>
                <p className="text-xs md:text-sm font-bold uppercase tracking-tight">JUNE 2026</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-5 md:w-10 md:h-7 bg-red-500/60 rounded-md md:rounded-lg shadow-sm"></div>
                <div className="w-8 h-5 md:w-10 md:h-7 bg-amber-500/60 rounded-md md:rounded-lg -ml-4 shadow-sm"></div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { id: "buy-airtime", label: "Airtime", desc: "Network Node", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { id: "buy-data", label: "Data", desc: "Institutional Bundles", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { id: "buy-giftcard", label: "Buy Gifts", desc: "Digital Market", icon: Gift, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
          { id: "sell-giftcard", label: "Sell Card", desc: "Fast Liquidity", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" }
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => onSelectAction(action.id)}
            className="bento-card p-5 md:p-8 flex flex-col justify-between gap-4 md:gap-6 hover:border-primary/40 group active-press text-left"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 ${action.bg} ${action.color} rounded-[18px] md:rounded-[22px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
              <action.icon size={22} className="md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight">{action.label}</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Row: Ledger + Market */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity */}
        <motion.section 
          variants={itemVariants}
          className="lg:col-span-8 bento-card p-6 md:p-10"
        >
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Financial Ledger</h3>
              <p className="text-xs md:text-sm text-gray-400 font-medium">Real-time settlement history.</p>
            </div>
            <button 
              onClick={() => onNavigateTab(AppTab.HISTORY)}
              className="text-primary text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:gap-3 flex items-center gap-1.5 md:gap-2 transition-all border-b-2 border-primary/10 pb-1"
            >
              Full History <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-4 md:p-6 hover:bg-accent-blue/40 dark:hover:bg-white/5 transition-all rounded-[20px] md:rounded-[24px] group border border-transparent hover:border-blue-100 dark:hover:border-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shadow-sm shrink-0">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm md:text-lg font-black text-gray-900 dark:text-white tracking-tight truncate">{tx.title}</p>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                        {tx.category} • {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-base md:text-xl font-mono font-black ${tx.type === "Credit" ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}>
                      {tx.type === "Credit" ? "+" : "-"}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-1.5 md:mt-2 ${
                      tx.status === "Success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-600 shadow-inner">
                    <Activity size={32} />
                 </div>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No sequential ledger entries found.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Live Markets + Perks */}
        <motion.section variants={itemVariants} className="lg:col-span-4 space-y-8">
          
          {/* Markets */}
          <div className="bento-card p-8 md:p-10 space-y-6 md:space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Trading Nodes</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {[
                { name: "Bitcoin", symbol: "BTC", price: prices.BTC.toLocaleString(), change: "+2.4%", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                { name: "Ethereum", symbol: "ETH", price: prices.ETH.toLocaleString(), change: "-0.8%", icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                { name: "Solana", symbol: "SOL", price: prices.SOL.toLocaleString(), change: "+5.2%", icon: Activity, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" }
              ].map((coin) => (
                <div 
                  key={coin.symbol} 
                  onClick={() => onSelectAction("Crypto")}
                  className="flex items-center justify-between p-4 md:p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[20px] md:rounded-[22px] hover:border-primary/30 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${coin.bg} ${coin.color} rounded-[14px] md:rounded-[18px] flex items-center justify-center font-black group-hover:scale-110 transition-transform shrink-0 shadow-sm`}>
                      <coin.icon size={18} fill={coin.symbol === "BTC" ? "currentColor" : "none"} className="md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-black text-gray-900 dark:text-white tracking-tight">{coin.name}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm md:text-base font-black text-gray-900 dark:text-white font-mono tracking-tighter">₦{coin.price}</p>
                    <p className={`text-[9px] md:text-[10px] font-black font-mono ${coin.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>
                      {coin.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigateTab(AppTab.TRADE)}
              className="w-full py-4 md:py-5 bg-primary/5 hover:bg-primary/10 text-primary rounded-[18px] md:rounded-[22px] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all active-press border border-primary/10"
            >
              Open Trading Desk
            </button>
          </div>

          {/* Perks Card: Finsy Style */}
          <div className="bg-accent-yellow/80 dark:bg-accent-yellow/10 border border-yellow-200 dark:border-yellow-900/20 rounded-[35px] md:rounded-[45px] p-8 md:p-10 relative overflow-hidden group shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
             <div className="relative z-10 space-y-5 md:space-y-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-white/10 rounded-[18px] md:rounded-[24px] flex items-center justify-center text-yellow-600 dark:text-yellow-500 shadow-sm border border-yellow-100 dark:border-yellow-900/20">
                <Sparkles size={24} className="md:w-8 md:h-8" />
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">Master your <br /> wealth flow.</h4>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                Unlock exclusive institutional features and sub-zero spread trading.
              </p>
              <button className="text-gray-900 dark:text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-2 border-gray-900/10 dark:border-white/10 hover:border-gray-900 dark:hover:border-white transition-all pb-2">
                UPGRADE TO ELITE
              </button>
            </div>
          </div>
        </motion.section>

      </div>
    </motion.div>
  );
}
