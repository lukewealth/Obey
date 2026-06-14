import React, { useState, useEffect } from "react";
import { UserProfile, CryptoAsset } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, ArrowDownLeft, Check, RefreshCw, DollarSign, 
  TrendingUp, TrendingDown, Coins, HelpCircle, ShieldAlert, Award,
  ChevronRight, BarChart3, Search, Zap, Star, Activity, ArrowRight, ShieldCheck,
  ShoppingCart, X, Loader2, Play, LayoutGrid, List, CheckCircle2, Lock
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface CryptoSystemProps {
  profile: UserProfile;
  btcPrice: number;
  ethPrice: number;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function CryptoSystem({ profile, btcPrice, ethPrice, onTradeCompleted }: CryptoSystemProps) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<"PLATFORM" | "P2P">("PLATFORM");
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

  // P2P State
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingForm, setListingForm] = useState({ amount: "", price: "" });

  const activeAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  const fetchMarketListings = async () => {
    setLoadingMarket(true);
    try {
      const res = await api.get('/crypto-market/market');
      setMarketListings(res.data);
    } catch (error) {
      console.error("Crypto market fetch error:", error);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'P2P') fetchMarketListings();
  }, [activeTab]);

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

  const executeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fiatValue);
    if (!val || val <= 0) return;

    if (tradeType === "buy" && val > profile.balance) {
      notify("error", "Insufficient Reserves", "Vault balance too low.");
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

  const handleListCrypto = async () => {
    if (!listingForm.amount || !listingForm.price) {
      notify("error", "Parameters Required", "Specify amount and price node.");
      return;
    }
    setProcessing(true);
    try {
      const res = await api.post('/crypto-market/list', {
        sellerId: "user-id",
        sellerName: profile.name,
        assetSymbol: selectedSymbol,
        amount: parseFloat(listingForm.amount),
        priceInUSD: parseFloat(listingForm.price)
      });
      if (res.data.success) {
        notify("success", "Liquidity Locked", "Asset node broadcasted to marketplace.");
        setShowListingModal(false);
        fetchMarketListings();
      }
    } catch (error) {
      notify("error", "Broadcast Failed", "Network terminal failure.");
    } finally {
      setProcessing(false);
    }
  };

  const handlePurchaseListing = async (listingId: string) => {
    setProcessing(true);
    try {
      const res = await api.post('/crypto-market/purchase', {
        buyerId: "user-id",
        listingId
      });
      if (res.data.success) {
        notify("success", "Acquisition Authorized", "Funds locked in escrow node.");
        setOrderReceipt(res.data.transaction);
        fetchMarketListings();
      }
    } catch (error) {
      notify("error", "Acquisition Failed", "Insufficient reserves or node filled.");
    } finally {
      setProcessing(false);
    }
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

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left">Trading Terminal</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Institutional market access with sub-second settlement.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto shadow-sm self-center md:self-auto">
          {[
            { id: "PLATFORM", label: "Instant Swap", icon: Zap },
            { id: "P2P", label: "P2P Market", icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setOrderReceipt(null); setActiveTab(tab.id as any); }}
              className={`px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial relative ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
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
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} className="md:w-12 md:h-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Order Executed</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">Your digital assets have been settled into your vault node.</p>
            </div>

            <div className="bg-gray-50 rounded-[24px] md:rounded-[32px] p-6 md:p-10 space-y-6 md:space-y-8 text-left border border-gray-100">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Volume Settled</span>
                <span className={`text-xl md:text-3xl font-black ${orderReceipt.type === "buy" ? "text-emerald-600" : "text-red-500"}`}>
                   {orderReceipt.cryptoAmount?.toFixed(5) || orderReceipt.amount} {orderReceipt.symbol || orderReceipt.brand}
                </span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiat Value</p>
                  <p className="text-base md:text-lg font-black text-gray-900">${orderReceipt.fiatAmount?.toLocaleString() || orderReceipt.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Node Reference</p>
                  <p className="text-base md:text-lg font-black text-gray-900 font-mono tracking-tighter truncate max-w-[150px]">{orderReceipt.id}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setOrderReceipt(null)} className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press">
              Return to Terminal
            </button>
          </motion.div>
        ) : activeTab === "P2P" ? (
          <motion.div key="p2p-market" variants={containerVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="relative group w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Search crypto nodes..." className="w-full h-14 pl-12 pr-6 bg-white border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
               </div>
               <button onClick={() => setShowListingModal(true)} className="w-full md:w-auto px-10 h-14 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl active-press">
                 <Lock size={18} /> Sell to Marketplace
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loadingMarket ? Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]"></div>) : marketListings.length > 0 ? (
                 marketListings.map((listing) => (
                   <motion.div key={listing.id} whileHover={{ y: -5 }} className="bg-white border border-gray-100 p-8 rounded-[35px] shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-2xl shadow-inner group-hover:bg-primary/5 transition-colors">
                           {listing.assetSymbol === 'BTC' ? <Star /> : <Zap />}
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</p>
                           <p className="text-lg font-black text-gray-900">${listing.rate.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="space-y-1 mb-8">
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{listing.amount} {listing.assetSymbol}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listed by {listing.sellerName}</p>
                     </div>
                     <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div>
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Magnitude</p>
                           <p className="text-2xl font-black text-primary font-mono tracking-tighter">${listing.priceInUSD.toLocaleString()}</p>
                        </div>
                        <button onClick={() => handlePurchaseListing(listing.id)} className="h-14 px-6 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active-press shadow-lg shadow-primary/20">
                          Buy <ArrowRight size={14} />
                        </button>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="col-span-full py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto"><ShoppingCart size={40} /></div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No active liquidity nodes</p>
                 </div>
               )}
            </div>

            <AnimatePresence>
               {showListingModal && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-xl rounded-[45px] p-8 md:p-12 space-y-8 relative overflow-hidden">
                       <button onClick={() => setShowListingModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
                       <div className="space-y-1">
                          <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">List Liquidity</h3>
                          <p className="text-gray-500 font-medium">Define your asset node parameters.</p>
                       </div>
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Asset</label>
                                <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none">
                                   {assets.map(a => <option key={a.symbol} value={a.symbol}>{a.name}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Amount</label>
                                <input type="number" placeholder="0.00" value={listingForm.amount} onChange={(e) => setListingForm({...listingForm, amount: e.target.value})} className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Target Price ($)</label>
                             <input type="number" placeholder="0.00" value={listingForm.price} onChange={(e) => setListingForm({...listingForm, price: e.target.value})} className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-2xl font-black text-primary outline-none" />
                          </div>
                       </div>
                       <button onClick={handleListCrypto} className="w-full h-18 bg-primary hover:bg-black text-white rounded-[25px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active-press flex items-center justify-center gap-3">
                         {processing ? <Loader2 className="animate-spin" /> : <>Lock and Broadcast <ArrowRight size={20} /></>}
                       </button>
                    </motion.div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Asset List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bento-card p-6 md:p-10 space-y-8 md:space-y-10 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/30 rounded-full blur-[60px] md:blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Market Assets</h3>
                  <p className="text-xs md:text-sm text-gray-400 font-medium">Real-time depth and liquidity nodes.</p>
                </div>
                <div className="relative group w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Find assets..." 
                      className="bg-gray-50 border border-gray-100 rounded-[18px] pl-11 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 w-full sm:w-56 font-bold outline-none transition-all"
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
                      className={`p-4 md:p-6 rounded-[24px] md:rounded-[28px] border flex items-center justify-between cursor-pointer transition-all duration-400 gap-4 ${
                        isSelected
                          ? "border-primary bg-white shadow-xl shadow-primary/10"
                          : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-6 shrink-0">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[14px] md:rounded-[22px] ${isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'} flex items-center justify-center font-black text-xl md:text-2xl transition-colors shadow-sm`}>
                          {asset.symbol === 'BTC' ? <Star size={20} fill="currentColor" className="md:w-6 md:h-6" /> : asset.symbol === 'ETH' ? <Zap size={20} fill="currentColor" className="md:w-6 md:h-6" /> : <Coins size={20} className="md:w-6 md:h-6" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm md:text-lg font-black text-gray-900 tracking-tight truncate">{asset.name}</p>
                          <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-widest mt-0.5 truncate">{asset.symbol} • Balance: {asset.balance}</p>
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

                      <div className="text-right shrink-0">
                        <p className="text-sm md:text-lg font-black text-gray-900 font-mono tracking-tighter">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <div className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black mt-1 md:mt-1.5 ${
                          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        }`}>
                          {isPositive ? <TrendingUp size={10} className="md:w-3 md:h-3" /> : <TrendingDown size={10} className="md:w-3 md:h-3" />}
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
              className="lg:col-span-4 bento-card p-6 md:p-10 space-y-8 md:space-y-10 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-accent-yellow/30 rounded-full blur-[40px] md:blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-[14px] md:rounded-[20px] flex items-center justify-center text-primary">
                  <BarChart3 size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-[10px] md:text-[11px] uppercase font-black text-gray-400 tracking-[0.2em]">Execution Desk</h3>
              </div>

              <div className="flex bg-gray-100 p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 relative z-10">
                <button
                  type="button"
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-3 md:py-4 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black transition-all ${
                    tradeType === "buy" ? "bg-white text-primary shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Buy Asset
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-3 md:py-4 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black transition-all ${
                    tradeType === "sell" ? "bg-white text-red-500 shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Sell Asset
                </button>
              </div>

              <form onSubmit={executeTrade} className="space-y-8 md:space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Order Magnitude</span>
                    <span className="text-[10px] md:text-[11px] font-black text-primary">AVAIL: ${profile.balance.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-primary md:w-7 md:h-7" size={24} />
                    <input
                      type="number"
                      required
                      value={fiatValue}
                      onChange={(e) => setFiatValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-20 md:h-24 pl-16 md:pl-20 pr-6 md:pr-10 bg-gray-50 border border-gray-100 rounded-[28px] md:rounded-[35px] text-3xl md:text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none transition-all tracking-tighter"
                    />
                  </div>
                </div>

                {fiatValue && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 md:p-8 bg-accent-blue/40 rounded-[24px] md:rounded-[32px] border border-blue-100 space-y-4"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest shrink-0">Estimated Payout</span>
                      <span className="text-lg md:text-xl font-black text-primary font-mono tracking-tighter truncate">
                        {(parseFloat(fiatValue) / activeAsset.price).toFixed(6)} {activeAsset.symbol}
                      </span>
                    </div>
                    <div className="h-px bg-blue-100"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">Execution Fee</span>
                      <span className="text-[10px] md:text-sm font-black text-emerald-500 uppercase tracking-widest">SUB-ZERO</span>
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={processing || !fiatValue}
                  className={`w-full h-16 md:h-20 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center active-press ${
                    tradeType === "buy" ? "bg-primary shadow-primary/20" : "bg-red-50 shadow-red-500/20"
                  } disabled:opacity-50`}
                >
                  {processing ? <RefreshCw className="animate-spin md:w-7 md:h-7" size={24} /> : (
                    <div className="flex items-center gap-3">
                       Confirm {tradeType} <ArrowRight size={20} />
                    </div>
                  )}
                </button>
              </form>

              <div className="p-5 md:p-6 bg-gray-900 rounded-[24px] md:rounded-[32px] flex gap-4 md:gap-5 relative z-10 text-white shadow-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-[14px] md:rounded-[20px] flex items-center justify-center text-primary shrink-0 shadow-lg">
                  <ShieldCheck size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-xs md:text-sm font-black tracking-tight">Compliance Shield Active</p>
                   <p className="text-[9px] md:text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                     Orders are routed through institutional nodes.
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
