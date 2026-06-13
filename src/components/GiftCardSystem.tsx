import React, { useState, useRef, useEffect } from "react";
import { UserProfile, GiftCardAsset, GiftCardTab } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, DollarSign, ArrowDownLeft, ArrowUpRight, Search, 
  HelpCircle, Shield, History, Tag, ChevronRight, Zap, 
  Star, Activity, ArrowRight, ShieldCheck, Upload, X, Check
} from "lucide-react";
import api from "../services/api";

interface GiftCardSystemProps {
  profile: UserProfile;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function GiftCardSystem({ profile, onTradeCompleted }: GiftCardSystemProps) {
  const [activeTab, setActiveTab] = useState<GiftCardTab>(GiftCardTab.BUY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string>("Apple");
  
  // Terminal State
  const [cardValue, setCardValue] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tradeReceipt, setTradeReceipt] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const assets: GiftCardAsset[] = [
    { id: "1", name: "Apple", buyRate: 850, sellRate: 720, logo: "🍎", popularity: 98, trending: true },
    { id: "2", name: "Amazon", buyRate: 820, sellRate: 690, logo: "📦", popularity: 95, trending: true },
    { id: "3", name: "Google Play", buyRate: 840, sellRate: 710, logo: "🤖", popularity: 92, trending: false },
    { id: "4", name: "Steam", buyRate: 860, sellRate: 740, logo: "🎮", popularity: 88, trending: true },
    { id: "5", name: "Razer Gold", buyRate: 880, sellRate: 760, logo: "🐍", popularity: 85, trending: false }
  ];

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCardDetails = assets.find(a => a.name === selectedAsset) || assets[0];

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(cardValue);
    if (!val || val <= 0) return;

    if (activeTab === GiftCardTab.BUY && val > profile.balance) {
      alert("Insufficient liquidity reserves.");
      return;
    }

    setProcessing(true);
    try {
      const type = activeTab === GiftCardTab.BUY ? "BUY" : "SELL";
      const totalAmount = activeTab === GiftCardTab.BUY ? val : (val * activeCardDetails.sellRate / 1000); 
      
      const response = await api.post('/giftcards/trade', {
        userId: profile.email === "felix@obey.finance" ? "felix-id" : "user-id",
        type,
        assetName: selectedAsset,
        faceValue: val,
        totalAmount,
        claimCode: activeTab === GiftCardTab.SELL ? claimCode : null
      });

      if (response.data.success) {
        onTradeCompleted(totalAmount, `${type} ${selectedAsset} Card ($${val})`, type === "SELL");
        setTradeReceipt({
          ...response.data.transaction,
          asset: selectedAsset,
          faceValue: val,
          type
        });
      }
    } catch (error) {
      console.error('Giftcard Trade Error:', error);
      alert("System terminal error. Please verify node connection.");
    } finally {
      setProcessing(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Header & Market Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left">Card Marketplace</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Liquidate or acquire digital assets via institutional nodes.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto">
          {[
            { id: GiftCardTab.BUY, label: "Acquire Assets", icon: ArrowDownLeft },
            { id: GiftCardTab.SELL, label: "Liquidate Assets", icon: ArrowUpRight }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setTradeReceipt(null); setActiveTab(tab.id); }}
              className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial ${
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
        {tradeReceipt ? (
          <motion.div 
            key="receipt"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check size={32} className="md:w-12 md:h-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Transaction Logged</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium">Your {tradeReceipt.type.toLowerCase()} order for {tradeReceipt.asset} is being finalized by carrier nodes.</p>
            </div>

            <div className="bg-gray-50 rounded-[24px] md:rounded-[32px] p-6 md:p-10 space-y-6 md:space-y-8 text-left border border-gray-100">
               <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Node Reference</span>
                <span className="text-base md:text-xl font-black text-gray-900 font-mono tracking-widest truncate">{tradeReceipt.id}</span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Value</p>
                  <p className="text-base md:text-lg font-black text-gray-900">${tradeReceipt.faceValue.toFixed(2)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Payout</p>
                  <p className="text-base md:text-lg font-black text-primary">${tradeReceipt.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setTradeReceipt(null)} className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press">
              Open Terminal
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Asset Selection Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 bento-card p-6 md:p-10 space-y-8 md:space-y-12 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/30 rounded-full blur-[60px] md:blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Select Protocol</h3>
                  <p className="text-xs md:text-sm text-gray-400 font-medium">Supported institutional digital assets.</p>
                </div>
                <div className="relative group w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search nodes..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-[18px] pl-11 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 w-full sm:w-56 font-bold outline-none transition-all"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 relative z-10">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset.name)}
                    className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-400 ${
                      selectedAsset === asset.name
                        ? "border-primary bg-white shadow-xl shadow-primary/10"
                        : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[22px] flex items-center justify-center text-xl md:text-3xl transition-colors shrink-0 ${selectedAsset === asset.name ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-50 border border-gray-100'}`}>
                      {asset.logo}
                    </div>
                    <div className="text-center overflow-hidden w-full">
                       <p className="text-xs md:text-base font-black text-gray-900 tracking-tight truncate">{asset.name}</p>
                       <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Rate: {activeTab === GiftCardTab.BUY ? asset.buyRate : asset.sellRate}/$</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Market Activity Table Mini */}
              <div className="space-y-4 relative z-10 pt-4 md:pt-8 border-t border-gray-100">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] md:tracking-[0.3em]">Market Activity</h4>
                    <div className="flex items-center gap-1.5">
                       <Activity size={12} className="text-emerald-500" />
                       <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">LIVE FLOW</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    {[
                      { user: "User-04x", asset: "Apple", val: 500, time: "2s ago", type: "Liquidated" },
                      { user: "User-11z", asset: "Steam", val: 1200, time: "5s ago", type: "Acquired" }
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between p-4 md:p-5 bg-gray-50/50 rounded-[20px] md:rounded-[22px] border border-gray-100/50">
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 shrink-0">
                              <Star size={14} className="md:w-4 md:h-4" />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-[11px] md:text-sm font-black text-gray-900 truncate">{act.asset} Card Node</p>
                              <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">{act.type} • {act.time}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-xs md:text-sm font-black text-gray-900 font-mono tracking-tighter">${act.val.toLocaleString()}</p>
                           <p className="text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest">VERIFIED</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>

            {/* Execution Desk */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 bento-card p-6 md:p-10 space-y-8 md:space-y-12 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-yellow/30 rounded-full blur-[60px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-3 md:gap-4 relative z-10 border-b border-gray-100 pb-8 md:pb-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-[16px] md:rounded-[22px] flex items-center justify-center text-primary">
                  <Tag size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="space-y-0.5">
                   <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Execution Desk</h3>
                   <p className="text-[10px] md:text-[11px] uppercase font-black text-gray-400 tracking-[0.2em] md:tracking-[0.3em]">Institutional Hub</p>
                </div>
              </div>

              <form onSubmit={handleTrade} className="space-y-8 md:space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Magnitude (USD)</span>
                    <span className="text-[9px] md:text-[11px] font-black text-primary uppercase">MIN: $10.00</span>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-primary" size={24} className="md:w-7 md:h-7" />
                    <input
                      type="number"
                      required
                      value={cardValue}
                      onChange={(e) => setCardValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-20 md:h-24 pl-16 md:pl-20 pr-6 md:pr-10 bg-gray-50 border border-gray-100 rounded-[28px] md:rounded-[35px] text-3xl md:text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none tracking-tighter transition-all"
                    />
                  </div>
                </div>

                {activeTab === GiftCardTab.SELL ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Node Secret (Claim Code)</label>
                      <input
                        type="text"
                        required
                        value={claimCode}
                        onChange={(e) => setClaimCode(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="w-full h-14 md:h-16 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-mono font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all uppercase"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Visual Proof (Optional)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 md:h-32 border-2 border-dashed border-gray-200 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group/upload"
                      >
                         {uploadedFile ? (
                           <div className="flex items-center gap-3 text-primary font-bold">
                              <Check size={20} /> {uploadedFile.name.substring(0, 15)}...
                           </div>
                         ) : (
                           <>
                             <Upload size={24} className="text-gray-400 group-hover/upload:text-primary transition-colors" />
                             <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Upload Asset Meta</span>
                           </>
                         )}
                         <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  </div>
                ) : (
                   <div className="p-6 md:p-8 bg-accent-blue/40 rounded-[28px] md:rounded-[32px] border border-blue-100 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">Acquisition Cost</span>
                         <span className="text-xl md:text-2xl font-black text-primary font-mono tracking-tighter leading-none pt-1">
                            ${((parseFloat(cardValue || "0") * activeCardDetails.buyRate) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </span>
                      </div>
                      <div className="h-px bg-blue-100"></div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">Protocol Fee</span>
                         <span className="text-[11px] md:text-xs font-black text-emerald-500 uppercase tracking-widest">SUB-ZERO NODE</span>
                      </div>
                   </div>
                )}

                <button
                  type="submit"
                  disabled={processing || !cardValue}
                  className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50"
                >
                  {processing ? <RefreshCw className="animate-spin" size={24} /> : (
                    <div className="flex items-center gap-3">
                       {activeTab === GiftCardTab.BUY ? 'Acquire Node' : 'Confirm Liquidation'} <ArrowRight size={20} />
                    </div>
                  )}
                </button>
              </form>

              <div className="p-5 md:p-6 bg-gray-900 rounded-[28px] md:rounded-[32px] flex gap-4 md:gap-5 relative z-10 text-white">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-[14px] md:rounded-[20px] flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-xs md:text-sm font-black tracking-tight">Institutional Escrow Active</p>
                   <p className="text-[9px] md:text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                     Assets are verified by carrier protocols.
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
