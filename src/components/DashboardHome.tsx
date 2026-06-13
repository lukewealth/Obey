import React from "react";
import { AppTab, UserProfile, Transaction } from "../types";
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, Send, RefreshCw, Smartphone, 
  Gift, Eye, EyeOff, ShoppingBag, ArrowDown, Utensils, Plane, Coffee, 
  ChevronRight, CreditCard, Bell, Sparkles, TrendingUp
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

  return (
    <div className="space-y-8 pb-12">
      {/* Visual Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hi, {profile.name.split(" ")[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-light mt-0.5">
            Institutional treasury engine & digital cash flows running optimal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-[#00C6FF] rounded-lg text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            KYC LEVEL: {profile.kycStatus}
          </div>
        </div>
      </div>

      {/* Main Stats Rows - Bento Card arrangement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Wallet Balance box */}
        <div className="lg:col-span-8 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-6 sm:p-8 rounded-[20px] relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0057FF]/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
              <span>Total Available Balance</span>
              <button 
                onClick={() => setHideBalance(!hideBalance)}
                className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded transition-all"
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-mono font-bold text-white">
                {hideBalance ? "••••••" : `$${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              <span className="text-xs text-gray-550 text-gray-400 font-bold font-mono">USD</span>
            </div>

            <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-semibold">
              <TrendingUp size={12} />
              +2.45% from last month
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-8">
            <button
              onClick={() => onSelectAction("fund")}
              className="bg-[#0057FF] hover:bg-blue-600 text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active-press transition-colors shadow-lg shadow-blue-500/10 whitespace-nowrap"
            >
              <ArrowDownLeft size={16} /> Fund Wallet
            </button>
            <button
              onClick={() => onSelectAction("withdraw")}
              className="bg-white/5 hover:bg-white/10 border border-[#242F41] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active-press transition-all whitespace-nowrap"
            >
              <ArrowUpRight size={16} /> Withdraw
            </button>
            <button
              onClick={() => onSelectAction("transfer")}
              className="bg-white/5 hover:bg-white/10 border border-[#242F41] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active-press transition-all whitespace-nowrap"
            >
              <Send size={16} /> Transfer
            </button>
          </div>
        </div>

        {/* Plastic Premium Platinum Credit Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#161F30] to-[#0b1220] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[220px]">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <CreditCard size={180} />
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="font-extrabold italic text-sm text-gray-200 tracking-wider">OBEY Platinum</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Institutional Premium</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
              <span className="w-1.5 h-1.5 bg-[#00C6FF] rounded-full"></span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-lg tracking-widest text-[#f8faff] font-semibold">
              •••• •••• •••• 8824
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 font-black">Card Holder</p>
                <p className="text-xs font-bold text-white uppercase mt-0.5">{profile.name}</p>
              </div>
              <div className="flex gap-1">
                <div className="w-7 h-5 bg-red-500/40 rounded-sm"></div>
                <div className="w-7 h-5 bg-[#0057FF]/40 rounded-sm -ml-3"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Grid Module */}
      <section className="space-y-4 pt-2">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-gray-400">Quick Operations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onSelectAction("buy-airtime")}
            className="flex items-center gap-4 p-5 bg-[#161F30] border border-[#242F41] hover:border-blue-500/30 rounded-[20px] active-press transition-all text-left"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Buy Airtime</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Top-up credit instantly</p>
            </div>
          </button>

          <button 
            onClick={() => onSelectAction("buy-data")}
            className="flex items-center gap-4 p-5 bg-[#161F30] border border-[#242F41] hover:border-blue-500/30 rounded-[20px] active-press transition-all text-left"
          >
            <div className="w-10 h-10 bg-[#00C6FF]/10 rounded-xl flex items-center justify-center text-[#00C6FF] shrink-0">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Buy Data Pls</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Mobile data packages</p>
            </div>
          </button>

          <button 
            onClick={() => onSelectAction("buy-giftcard")}
            className="flex items-center gap-4 p-5 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF]/30 rounded-[20px] active-press transition-all text-left"
          >
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 shrink-0">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Buy Gift Card</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Marketplace checkout</p>
            </div>
          </button>

          <button 
            onClick={() => onSelectAction("sell-giftcard")}
            className="flex items-center gap-4 p-5 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF]/30 rounded-[20px] active-press transition-all text-left"
          >
            <div className="w-10 h-10 bg-[#12B76A]/10 rounded-xl flex items-center justify-center text-[#12B76A] shrink-0">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sell Gift Card</p>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Upload for cash payout</p>
            </div>
          </button>
        </div>
      </section>

      {/* Main activity list and overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* Recent Transactions Column */}
        <section className="lg:col-span-8 bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-white">Recent Ledger Transactions</h3>
            <button 
              onClick={() => onNavigateTab(AppTab.WALLET)}
              className="text-[#00C6FF] text-xs font-bold uppercase tracking-wider hover:underline"
            >
              See Ledger History
            </button>
          </div>

          <div className="space-y-4">
            {transactions.slice(0, 5).map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-4 bg-[#0B1220] hover:bg-[#242F41]/30 transition-all rounded-xl relative overflow-hidden border border-[#242F41] select-none"
              >
                {/* Horizontal left indicator strip representing status */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                    tx.category === "Transfer" || tx.category === "Crypto" ? "bg-blue-500" :
                    tx.type === "Credit" ? "bg-[#12B76A]" : "bg-[#F04438]"
                  }`}
                ></div>

                <div className="flex items-center gap-4 pl-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-300">
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{tx.title}</p>
                    <p className="text-[10px] text-gray-400 font-light mt-0.5">
                      {tx.category} • {tx.time} ({tx.date.split(",")[0]})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-mono font-bold ${tx.type === "Credit" ? "text-[#12B76A]" : "text-white"}`}>
                    {tx.type === "Credit" ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-[10px] font-bold ${tx.status === "Success" ? "text-emerald-500" : tx.status === "Processing" ? "text-[#F79009]" : "text-red-500"}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Small Market Overview panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Market overview</h3>
              <button 
                onClick={() => onNavigateTab(AppTab.TRADE)} 
                className="text-[#00C6FF] text-xs font-bold hover:underline"
              >
                Trade List
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-[#0B1220] rounded-2xl border border-[#242F41]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF9900]/10 flex items-center justify-center text-[#FF9900]">
                    B
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Bitcoin</p>
                    <p className="text-[9px] text-gray-400 font-mono">BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-white">$64,231.80</p>
                  <p className="text-[9px] font-mono text-emerald-500 font-bold">+2.45%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#0B1220] rounded-2xl border border-[#242F41]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    E
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Ethereum</p>
                    <p className="text-[9px] text-gray-400 font-mono">ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-white">$3,452.12</p>
                  <p className="text-[9px] font-mono text-red-500 font-bold">-0.82%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0057FF]/10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#00C6FF]">Support Desk</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Connect with our compliance or settlement staff directly through the 24/7 dedicated service desk.
              </p>
              <button 
                onClick={() => onNavigateTab(AppTab.PROFILE)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-[#242F41] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Access Settings
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
