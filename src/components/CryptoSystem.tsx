import React, { useState, useEffect } from "react";
import { UserProfile, CryptoAsset } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, ArrowDownLeft, Check, RefreshCw, DollarSign, 
  TrendingUp, TrendingDown, Coins, HelpCircle, ShieldAlert, Award,
  ChevronRight, BarChart3, Search, Zap, Star, Activity, ArrowRight
} from "lucide-react";

interface CryptoSystemProps {
  profile: UserProfile;
  btcPrice: number;
  ethPrice: number;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function CryptoSystem({ profile, btcPrice, ethPrice, onTradeCompleted }: CryptoSystemProps) {
  const [assets, setAssets] = useState<CryptoAsset[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: btcPrice, prevPrice: btcPrice, priceChangePercent: 2.45, logo: '₿', balance: 0.045, history: [62000, 62150, 62400, 62300, 63100, 64231] },
    { symbol: 'ETH', name: 'Ethereum', price: ethPrice, prevPrice: ethPrice, priceChangePercent: 1.82, logo: 'E', balance: 0.85, history: [3380, 3400, 3390, 3420, 3460, 3452] },
    { symbol: 'SOL', name: 'Solana', price: 145.67, prevPrice: 145.67, priceChangePercent: -0.42, logo: 'S', balance: 12.4, history: [148, 147, 146.5, 146, 145.2, 145.67] },
    { symbol: 'SUI', name: 'Sui Network', price: 3.25, prevPrice: 3.25, priceChangePercent: 8.42, logo: 'S', balance: 1240, history: [2.8, 2.9, 3.1, 3.0, 3.2, 3.25] }
  ]);

  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [fiatValue, setFiatValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  const activeAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          if (asset.symbol === 'USDC') return asset;
          const pct = (Math.random() * 0.3 - 0.15) / 100;
          const nextPrice = asset.price * (1 + pct);
          const newHistory = [...asset.history.slice(1), nextPrice];
          const diffPct = ((nextPrice - asset.history[0]) / asset.history[0]) * 100;

          return {
            ...asset,
            prevPrice: asset.price,
            price: nextPrice,
            priceChangePercent: parseFloat(diffPct.toFixed(2)),
            history: newHistory
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setAssets(prev => prev.map(a => {
      if (a.symbol === 'BTC') return { ...a, price: btcPrice };
      if (a.symbol === 'ETH') return { ...a, price: ethPrice };
      return a;
    }));
  }, [btcPrice, ethPrice]);

  const executeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fiatValue);
    if (!val || val <= 0) return;

    if (tradeType === "buy" && val > profile.balance) {
      alert("Insufficient capital reserves.");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const isSell = tradeType === "sell";
      const cryptoQty = val / activeAsset.price;
      
      onTradeCompleted(val, `${isSell ? 'Sold' : 'Bought'} ${cryptoQty.toFixed(5)} ${activeAsset.symbol}`, isSell);

      setOrderReceipt({
        type: tradeType,
        symbol: activeAsset.symbol,
        fiatAmount: val,
        cryptoAmount: cryptoQty,
        executionPrice: activeAsset.price,
        date: new Date().toLocaleTimeString()
      });

      setFiatValue("");
    }, 1500);
  };

  const generateSparklineSvg = (history: number[]) => {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 160;
    const height = 40;
    
    return history.map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  const tabVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trading Terminal</h2>
          <p className="text-gray-500 font-medium">Institutional market access with sub-second settlement.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-100 rounded-full text-emerald-600">
           <Activity size={16} className="animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Global liquidity node active</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {orderReceipt ? (
          <motion.div 
            key="receipt"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[45px] p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
            
            <div className="space-y-4">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check size={48} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Order Executed</h2>
              <p className="text-gray-500 font-medium leading-relaxed">Your digital assets have been settled into your vault node.</p>
            </div>

            <div className="bg-gray-50 rounded-[32px] p-10 space-y-8 text-left border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Volume Settled</span>
                <span className={`text-3xl font-black ${orderReceipt.type === "buy" ? "text-emerald-600" : "text-red-500"}`}>
                  {orderReceipt.type === "buy" ? "+" : "-"}{orderReceipt.cryptoAmount.toFixed(5)} {orderReceipt.symbol}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiat Value</p>
                  <p className="text-lg font-black text-gray-900">${orderReceipt.fiatAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Rate</p>
                  <p className="text-lg font-black text-gray-900 font-mono tracking-tighter">${orderReceipt.executionPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setOrderReceipt(null)} className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 active-press">
              Return to Terminal
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Asset List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bento-card p-10 space-y-10 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/30 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Market Assets</h3>
                  <p className="text-sm text-gray-400 font-medium">Real-time depth and liquidity nodes.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Find assets..." 
                      className="bg-gray-50 border border-gray-100 rounded-[18px] pl-11 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 w-56 font-bold outline-none transition-all"
                    />
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {assets.map((asset) => {
                  const isPositive = asset.priceChangePercent >= 0;
                  const isSelected = asset.symbol === selectedSymbol;

                  return (
                    <motion.div
                      key={asset.symbol}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedSymbol(asset.symbol)}
                      className={`p-6 rounded-[28px] border flex items-center justify-between cursor-pointer transition-all duration-400 ${
                        isSelected
                          ? "border-primary bg-white shadow-xl shadow-primary/10"
                          : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-[22px] ${isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'} flex items-center justify-center font-black text-2xl transition-colors shadow-sm`}>
                          {asset.logo === '₿' ? <Star size={24} fill="currentColor" /> : asset.logo === 'E' ? <Zap size={24} fill="currentColor" /> : asset.logo}
                        </div>
                        <div>
                          <p className="text-lg font-black text-gray-900 tracking-tight">{asset.name}</p>
                          <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{asset.symbol} • Balance: {asset.balance}</p>
                        </div>
                      </div>

                      <div className="hidden xl:block">
                        <svg width="160" height="40" className="overflow-visible">
                          <motion.polyline
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            fill="none"
                            stroke={isPositive ? "#10B981" : "#EF4444"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={generateSparklineSvg(asset.history)}
                            className="drop-shadow-sm"
                          />
                        </svg>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900 font-mono tracking-tighter">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black mt-1.5 ${
                          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        }`}>
                          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPositive ? "+" : ""}{asset.priceChangePercent}%
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Execution Desk */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-4 bento-card p-10 space-y-10 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent-yellow/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-[11px] uppercase font-black text-gray-400 tracking-[0.2em]">Execution Desk</h3>
              </div>

              <div className="flex bg-gray-100 p-1.5 rounded-[22px] border border-gray-200 relative z-10">
                <button
                  type="button"
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-4 rounded-[18px] text-[13px] font-black transition-all ${
                    tradeType === "buy" ? "bg-white text-primary shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Buy Asset
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-4 rounded-[18px] text-[13px] font-black transition-all ${
                    tradeType === "sell" ? "bg-white text-red-500 shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Sell Asset
                </button>
              </div>

              <form onSubmit={executeTrade} className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Order Magnitude (USD)</span>
                    <span className="text-[11px] font-black text-primary">AVAIL: ${profile.balance.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={28} />
                    <input
                      type="number"
                      required
                      value={fiatValue}
                      onChange={(e) => setFiatValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none transition-all tracking-tighter"
                    />
                  </div>
                </div>

                {fiatValue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-accent-blue/40 rounded-[32px] border border-blue-100 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Estimated Payout</span>
                      <span className="text-xl font-black text-primary font-mono tracking-tighter">
                        {(parseFloat(fiatValue) / activeAsset.price).toFixed(6)} {activeAsset.symbol}
                      </span>
                    </div>
                    <div className="h-px bg-blue-100"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Execution Fee</span>
                      <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">SUB-ZERO</span>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={processing || !fiatValue}
                  className={`w-full h-20 text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center active-press ${
                    tradeType === "buy" ? "bg-primary shadow-primary/20" : "bg-red-500 shadow-red-500/20"
                  } disabled:opacity-50`}
                >
                  {processing ? <RefreshCw className="animate-spin" size={28} /> : (
                    <div className="flex items-center gap-3">
                       Confirm {tradeType} <ArrowRight size={20} />
                    </div>
                  )}
                </button>
              </form>

              <div className="p-6 bg-gray-900 rounded-[32px] flex gap-5 relative z-10 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-[20px] flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-black tracking-tight">Compliance Shield Active</p>
                   <p className="text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                     Orders are routed through institutional liquidity nodes.
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
