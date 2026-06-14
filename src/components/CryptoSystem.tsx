import React, { useState, useEffect } from "react";
import { UserProfile, CryptoAsset } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, ArrowDownLeft, Check, RefreshCw, DollarSign,
  TrendingUp, TrendingDown, Coins, HelpCircle, ShieldAlert, Award,
  ChevronRight, BarChart3, Search, Zap, Star, ArrowRight, ShieldCheck,
  ShoppingCart, X, Loader2, Play, LayoutGrid, List, CheckCircle2, Lock, Activity
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";
import CryptoSearch from "./CryptoSearch";
import MarketMetadata from "./MarketMetadata";

interface CryptoSystemProps {
  profile: UserProfile;
  btcPrice: number;
  ethPrice: number;
  solPrice: number;
  suiPrice: number;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function CryptoSystem({ profile, btcPrice, ethPrice, solPrice, suiPrice, onTradeCompleted }: CryptoSystemProps) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<"PLATFORM" | "P2P">("PLATFORM");
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [fiatValue, setFiatValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [p2pListings, setP2PListings] = useState<any[]>([]);
  const [loadingP2P, setLoadingP2P] = useState(false);

  const assets = [
    { symbol: "BTC", name: "Bitcoin", balance: 0.00042, price: btcPrice, priceChangePercent: 2.4 },
    { symbol: "ETH", name: "Ethereum", balance: 0.0125, price: ethPrice, priceChangePercent: -1.2 },
    { symbol: "SOL", name: "Solana", balance: 1.5, price: solPrice, priceChangePercent: 5.8 },
    { symbol: "SUI", name: "Sui", balance: 120.4, price: suiPrice, priceChangePercent: 12.5 },
    { symbol: "USDC", name: "USD Coin", balance: 450.0, price: 1.00, priceChangePercent: 0.01 },
  ];

  const fetchP2PListings = async () => {
    setLoadingP2P(true);
    try {
      const response = await api.get('/crypto-market/market');
      setP2PListings(response.data);
    } catch (error) {
      console.error('P2P fetch failed:', error);
    } finally {
      setLoadingP2P(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'P2P') fetchP2PListings();
  }, [activeTab]);

  const executeTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fiatValue);
    if (isNaN(amount) || amount <= 0) return;

    if (tradeType === "buy" && amount > profile.balance) {
      notify("error", "Insufficient Liquidity", "Your vault node has reached its depth limit.");
      return;
    }

    setProcessing(true);
    try {
       // Platform trade simulation
       setTimeout(() => {
         const cryptoAmount = amount / (assets.find(a => a.symbol === selectedSymbol)?.price || 1);
         onTradeCompleted(amount, `${tradeType === 'buy' ? 'Acquired' : 'Liquidated'} ${selectedSymbol} via Platform Node`, tradeType === 'sell');
         setOrderReceipt({
            id: `CRY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            type: tradeType,
            symbol: selectedSymbol,
            fiatAmount: amount,
            cryptoAmount,
            status: "Settled"
         });
         setProcessing(false);
         notify("success", "Node Settled", `Institutional ${tradeType} order successfully executed on sequential ledger.`);
       }, 2000);
    } catch (err) {
       notify("error", "Execution Failed", "Node mesh synchronization timeout.");
       setProcessing(false);
    }
  };

  const handlePurchaseListing = async (listingId: string) => {
    setProcessing(true);
    try {
      const response = await api.post('/crypto-market/purchase', {
        buyerId: profile.email === 'felix@obey.finance' ? 'felix-id' : 'user-id',
        listingId
      });
      if (response.data.success) {
        setOrderReceipt(response.data.transaction);
        fetchP2PListings();
        notify("success", "Escrow Established", "Funds locked in high-fidelity vault node.");
      }
    } catch (error) {
      notify("error", "Acquisition Failure", "Insufficient vault liquidity or node expiration.");
    } finally {
      setProcessing(false);
    }
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
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase">Trading Terminal</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium leading-relaxed">Institutional market access with sub-second settlement.</p>
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
              <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {orderReceipt ? (
          <motion.div key="receipt" {...containerVariants} className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-14 text-center space-y-8 md:space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            
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

            <button onClick={() => setOrderReceipt(null)} className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press hover:bg-black transition-all">
              Return to Terminal
            </button>
          </motion.div>
        ) : activeTab === 'PLATFORM' ? (
          <motion.div key="platform" {...containerVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 items-start">
            
            <div className="xl:col-span-8 space-y-8 md:space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Market Search</h3>
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest">NODES ACTIVE</span>
                   </div>
                </div>
                <CryptoSearch onSelect={(asset) => setSelectedSymbol(asset.asset_id)} />
              </div>

              <MarketMetadata symbol={selectedSymbol} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {assets.slice(0, 3).map((asset) => (
                   <div key={asset.symbol} className="bg-white border border-gray-100 rounded-[30px] p-8 space-y-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setSelectedSymbol(asset.symbol)}>
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all border border-gray-100 shadow-sm">
                            {asset.symbol[0]}
                         </div>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black">
                            <TrendingUp size={12} /> Live
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xl font-black text-gray-900 tracking-tight">{asset.name}</p>
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">${asset.price.toLocaleString()}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                         <p className="text-[10px] font-bold text-gray-400">Bal: {asset.balance} {asset.symbol}</p>
                         <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="xl:col-span-4 bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-10 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden group/desk sticky top-32">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover/desk:scale-150 transition-transform duration-1000"></div>
              
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
                  className={`flex-1 py-3 md:py-4 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black uppercase transition-all ${
                    tradeType === "buy" ? "bg-white text-primary shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Buy {selectedSymbol}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-3 md:py-4 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black uppercase transition-all ${
                    tradeType === "sell" ? "bg-white text-red-500 shadow-lg shadow-black/5" : "text-gray-400"
                  }`}
                >
                  Sell {selectedSymbol}
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
                      className="w-full h-16 md:h-24 pl-14 md:pl-20 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] md:rounded-[32px] text-2xl md:text-4xl font-black text-gray-900 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100">
                  <div className="flex justify-between items-center text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                     <span>Estimated Amount</span>
                     <span className="text-gray-900 font-mono">
                       {(parseFloat(fiatValue) / (assets.find(a => a.symbol === selectedSymbol)?.price || 1) || 0).toFixed(6)} {selectedSymbol}
                     </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                     <span>Execution Fee</span>
                     <span className="text-emerald-500">SUB-ZERO</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing || !fiatValue}
                  className={`w-full h-16 md:h-20 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center active-press ${
                    tradeType === "buy" ? "bg-primary shadow-primary/20" : "bg-red-500 shadow-red-500/20"
                  } disabled:opacity-50`}
                >
                  {processing ? <RefreshCw className="animate-spin md:w-7 md:h-7" size={24} /> : (
                    <div className="flex items-center gap-3">
                       Confirm {tradeType} <ArrowRight size={20} />
                    </div>
                  )}
                </button>
              </form>

              <div className="p-6 bg-gray-900 rounded-[24px] md:rounded-[32px] flex gap-4 relative z-10 text-white shadow-xl">
                <div className="w-10 h-10 bg-white/10 rounded-[14px] flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="space-y-0.5">
                   <p className="text-xs font-black tracking-tight">Compliance Shield Active</p>
                   <p className="text-[9px] text-white/40 font-medium uppercase tracking-widest">Routed through institutional nodes.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="p2p" {...containerVariants} className="space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
               {p2pListings.map((listing) => (
                 <motion.div key={listing.id} whileHover={{ y: -5 }} className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 space-y-10 shadow-xl group transition-all">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-[#0b0e14] rounded-[18px] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                            {listing.assetSymbol[0]}
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{listing.amount} {listing.assetSymbol}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Listed by {listing.sellerName}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rate / Node</p>
                          <p className="text-xl font-black text-gray-900">${listing.rate?.toLocaleString()}</p>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex items-end justify-between gap-6">
                       <div>
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Total Magnitude</p>
                          <p className="text-4xl font-black font-space tracking-tight text-[#0b0e14] leading-none">${listing.priceInUSD?.toLocaleString()}</p>
                       </div>
                       <button onClick={() => handlePurchaseListing(listing.id)} className="h-16 px-10 bg-[#0b0e14] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl active-press">
                         Acquire Node <ArrowRight size={16} />
                       </button>
                    </div>
                 </motion.div>
               ))}

               {p2pListings.length === 0 && !loadingP2P && (
                 <div className="col-span-full py-40 text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                       <ShoppingCart size={40} />
                    </div>
                    <p className="text-base font-black text-gray-400 uppercase tracking-[0.3em]">No active institutional listings</p>
                 </div>
               )}

               {loadingP2P && (
                 <div className="col-span-full py-40 text-center">
                    <Loader2 size={48} className="text-primary animate-spin mx-auto" />
                 </div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
