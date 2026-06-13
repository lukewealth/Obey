import React, { useState, useRef, useEffect } from "react";
import { UserProfile, GiftCardAsset, GiftCardTab } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, DollarSign, ArrowDownLeft, ArrowUpRight, Check, Upload, Trash, 
  HelpCircle, ShieldAlert, ArrowRight, ChevronRight, Calculator, 
  FileText, Image, RefreshCw, Smartphone, Search, Zap, Star, Activity,
  ShieldCheck, Globe, ShoppingCart, Gamepad2, Info
} from "lucide-react";
import api from "../services/api";

interface GiftCardSystemProps {
  profile: UserProfile;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function GiftCardSystem({ profile, onTradeCompleted }: GiftCardSystemProps) {
  const [activeTab, setActiveTab] = useState<GiftCardTab>(GiftCardTab.BUY);
  const [selectedCard, setSelectedCard] = useState<string>("itunes");
  const [cardValue, setCardValue] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [rates, setRates] = useState<GiftCardAsset[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  // Rate calculator
  const [calcBrand, setCalcBrand] = useState("itunes");
  const [calcQty, setCalcQty] = useState("100");
  const [calcType, setCalcType] = useState<"buy" | "sell">("sell");

  // File Upload
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | { name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [stage, setStage] = useState<"idle" | "processing" | "completed">("idle");
  const [checkoutSheet, setCheckoutSheet] = useState(false);
  const [marketActivity, setMarketActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchRates();
    fetchActivity();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await api.get('/giftcards/rates');
      setRates(response.data);
      setLoadingRates(false);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      setLoadingRates(false);
    }
  };

  const fetchActivity = async () => {
    // Mock activity for now, could be fetched from backend
    setMarketActivity([
      { id: 1, brand: "Apple USD", type: "Purchase", volume: 500.00, status: "Completed", time: "2m ago" },
      { id: 2, brand: "Amazon GBP", type: "Sale", volume: 250.00, status: "Processing", time: "15m ago" },
      { id: 3, brand: "Steam Global", type: "Purchase", volume: 100.00, status: "Completed", time: "1h ago" },
    ]);
  };

  const activeCardDetails = rates.find((c) => c.id === selectedCard) || rates[0];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({ name: file.name, size: file.size });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({ name: file.name, size: file.size });
    }
  };

  const triggerTrade = async (type: 'buy' | 'sell') => {
    const val = parseFloat(cardValue);
    if (!val || val <= 0) return;

    setStage("processing");
    try {
      const totalAmount = type === 'buy' ? val : val * (activeCardDetails.sellRate / 1000); // Sample rate math
      
      const response = await api.post('/giftcards/trade', {
        userId: profile.email === "felix@obey.finance" ? "felix-id" : "user-id", // Should use real ID
        type,
        brand: activeCardDetails.brand,
        amount: val,
        totalAmount,
        details: `${type === 'buy' ? 'Purchased' : 'Sold'} ${activeCardDetails.brand} Gift Card`
      });

      if (response.data.success) {
        setTimeout(() => {
          setStage("completed");
          onTradeCompleted(totalAmount, response.data.transaction.title, type === 'sell');
          setCheckoutSheet(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Trade failed:', error);
      setStage("idle");
    }
  };

  const resetTradeScreen = () => {
    setStage("idle");
    setCardValue("");
    setClaimCode("");
    setUploadedFile(null);
  };

  const tabVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  if (loadingRates) return (
    <div className="flex items-center justify-center h-96">
      <RefreshCw className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gift Card Marketplace</h2>
          <p className="text-gray-500 font-medium">Institutional-grade liquidity for premium digital assets.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[22px] border border-gray-200 w-full md:w-fit overflow-hidden">
          {[
            { id: GiftCardTab.BUY, label: "Buy Assets", icon: ShoppingCart },
            { id: GiftCardTab.SELL, label: "Liquidate / Sell", icon: RefreshCw }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { resetTradeScreen(); setActiveTab(tab.id); }}
              className={`px-8 py-3.5 rounded-[18px] text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
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
        {stage === "idle" ? (
          <motion.div 
            key="idle"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-12"
          >
            {/* Top Assets Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-xl font-black tracking-tight">Top Assets</h3>
                 <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All Nodes</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rates.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`p-8 rounded-[35px] border transition-all duration-500 group relative overflow-hidden text-left ${
                      selectedCard === card.id
                        ? "border-primary bg-white shadow-[0_30px_60px_-15px_rgba(0,87,255,0.15)]"
                        : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <ShoppingCart size={80} />
                    </div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${selectedCard === card.id ? 'bg-primary text-white' : 'bg-gray-900 text-white'} flex items-center justify-center font-black text-2xl transition-all group-hover:scale-110 shadow-lg`}>
                        {card.logoUrl === 'A' ? <Star size={24} fill="currentColor" /> : card.logoUrl}
                      </div>
                      <div className="bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        <span className="text-emerald-600 text-[10px] font-black">{card.trend}</span>
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-1 uppercase">{card.brand}</h4>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em] mb-6">{card.region}</p>
                    
                    <div className="flex justify-between items-end relative z-10">
                       <div className="space-y-1">
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Global Rate</p>
                          <p className="text-xl font-black text-primary font-mono">${(card.buyRate / 1600).toFixed(2)}<span className="text-xs text-gray-400">/$1</span></p>
                       </div>
                       <div className={`w-10 h-10 rounded-full ${selectedCard === card.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'} flex items-center justify-center transition-all`}>
                          <ArrowRight size={18} />
                       </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
               {/* Transaction Terminal */}
               <div className="lg:col-span-8 bento-card p-10 space-y-10">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                     <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        {activeTab === GiftCardTab.BUY ? <ShoppingCart size={24} /> : <ArrowUpRight size={24} />}
                     </div>
                     <div>
                        <h3 className="text-xl font-black tracking-tight">{activeTab === GiftCardTab.BUY ? 'Acquisition Terminal' : 'Redemption Gateway'}</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Merchant: {activeCardDetails.brand}</p>
                     </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); activeTab === GiftCardTab.BUY ? setCheckoutSheet(true) : triggerTrade('sell'); }} className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Magnitude (USD)</label>
                           <div className="relative">
                              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
                              <input
                                 type="number"
                                 required
                                 value={cardValue}
                                 onChange={(e) => setCardValue(e.target.value)}
                                 placeholder="0.00"
                                 className="w-full h-16 pl-16 pr-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-black focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">{activeTab === GiftCardTab.BUY ? 'Settlement Protocol' : 'Card / Pin Secret'}</label>
                           <input
                              type="text"
                              required={activeTab === GiftCardTab.SELL}
                              value={activeTab === GiftCardTab.BUY ? "AUTO-SETTLEMENT" : claimCode}
                              onChange={(e) => setClaimCode(e.target.value)}
                              disabled={activeTab === GiftCardTab.BUY}
                              placeholder="XXXX-XXXX-XXXX"
                              className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-mono font-black focus:ring-2 focus:ring-primary/10 outline-none transition-all uppercase tracking-widest disabled:opacity-40 shadow-inner"
                           />
                        </div>
                     </div>

                     {activeTab === GiftCardTab.SELL && (
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Asset Proof (Physical Node)</label>
                           <div 
                              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-[40px] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20'}`}
                           >
                              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                              {uploadedFile ? (
                                 <div className="flex items-center gap-4 bg-white p-6 rounded-[24px] shadow-xl border border-gray-100 animate-in zoom-in-95">
                                    <Image className="text-primary" size={32} />
                                    <div className="text-left">
                                       <p className="text-sm font-black truncate max-w-[200px] uppercase">{(uploadedFile as any).name}</p>
                                       <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Asset Ready</p>
                                    </div>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"><Trash size={18} /></button>
                                 </div>
                              ) : (
                                 <>
                                    <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-gray-200 shadow-sm mb-6">
                                       <Upload size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Upload Asset Proof</h4>
                                    <p className="text-sm text-gray-400 font-medium mt-2 max-w-xs mx-auto">High-fidelity capture of your physical asset for sub-second audit.</p>
                                 </>
                              )}
                           </div>
                        </div>
                     )}

                     <button
                        type="submit"
                        disabled={!cardValue || (activeTab === GiftCardTab.SELL && (!uploadedFile || !claimCode))}
                        className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-base uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,87,255,0.4)] transition-all flex items-center justify-center active-press disabled:opacity-50 disabled:shadow-none"
                     >
                        <div className="flex items-center gap-3">
                           {activeTab === GiftCardTab.BUY ? 'Confirm Acquisition' : 'Initiate Liquidaton'} <ArrowRight size={20} />
                        </div>
                     </button>
                  </form>
               </div>

               {/* Right Side Column */}
               <div className="lg:col-span-4 space-y-8">
                  {/* Liquidity Score Card */}
                  <div className="bg-primary rounded-[45px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                     <div className="relative z-10 space-y-8">
                        <div>
                           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">Liquidity Score</h4>
                           <div className="flex items-center gap-4">
                              <span className="text-6xl font-black font-space">98.4</span>
                              <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Optimal</div>
                           </div>
                        </div>
                        <p className="text-white/60 font-medium text-sm leading-relaxed">Market depth for primary assets is currently at peak level. Dynamic settlement enabled.</p>
                        <button className="w-full py-5 bg-white text-primary rounded-[22px] text-xs font-black uppercase tracking-[0.2em] shadow-xl active-press hover:scale-[1.02] transition-all">GENERATE REPORT</button>
                     </div>
                  </div>

                  {/* Calculator Bento */}
                  <div className="bento-card p-10 space-y-10 group overflow-hidden">
                     <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 bg-accent-blue rounded-2xl flex items-center justify-center text-primary shadow-sm"><Calculator size={24} /></div>
                        <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.4em]">Exchange Desk</h4>
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Asset Merchant</label>
                           <select 
                              value={calcBrand} onChange={(e) => setCalcBrand(e.target.value)}
                              className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[18px] text-sm font-black outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                           >
                              {rates.map(r => <option key={r.id} value={r.id}>{r.brand} (GLOBAL)</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Value (USD)</label>
                           <input 
                              type="number" value={calcQty} onChange={(e) => setCalcQty(e.target.value)}
                              className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[18px] text-lg font-black outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                           />
                        </div>
                        <div className="flex bg-gray-100 p-1.5 rounded-[18px]">
                           <button onClick={() => setCalcType('sell')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${calcType === 'sell' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400'}`}>Liquidate</button>
                           <button onClick={() => setCalcType('buy')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${calcType === 'buy' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Acquire</button>
                        </div>
                        <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Settlement</span>
                              <p className="text-[11px] font-bold text-gray-900 uppercase">Primary Vault</p>
                           </div>
                           <span className="text-3xl font-black text-gray-900 font-mono tracking-tighter">₦{(parseFloat(calcQty) * (calcType === 'sell' ? activeCardDetails.sellRate : activeCardDetails.buyRate)).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Market Activity Table */}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black tracking-tight">Market Activity</h3>
                  <button className="text-outline text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Filters</button>
               </div>
               <div className="bento-card overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-gray-50/50">
                              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Node</th>
                              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Volume</th>
                              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Time</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {marketActivity.map((act) => (
                              <tr key={act.id} className="hover:bg-accent-blue/20 transition-all cursor-pointer group">
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-[10px] font-black group-hover:scale-110 transition-transform shadow-sm">
                                          {act.brand[0]}
                                       </div>
                                       <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{act.brand}</span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-6">
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${act.type === 'Purchase' ? 'text-primary' : 'text-indigo-600'}`}>{act.type}</span>
                                 </td>
                                 <td className="px-10 py-6 font-mono font-black text-gray-900">${act.volume.toFixed(2)}</td>
                                 <td className="px-10 py-6">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${act.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                       <div className={`w-1 h-1 rounded-full ${act.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                       {act.status}
                                    </div>
                                 </td>
                                 <td className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{act.time}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : stage === "processing" ? (
          <motion.div key="processing" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto bento-card p-20 text-center space-y-12 overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-50 overflow-hidden">
                <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-primary shadow-[0_0_15px_rgba(0,87,255,0.5)]" />
             </div>
             <div className="w-24 h-24 bg-accent-blue rounded-[35px] flex items-center justify-center mx-auto shadow-inner relative group">
                <RefreshCw className="animate-spin text-primary" size={48} />
             </div>
             <div className="space-y-4">
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Sequential Audit</h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">Dynamic validation of digital asset parameters across global merchant nodes. Authorizing liquidity settlement...</p>
             </div>
             <div className="flex justify-center gap-3">
                {[1, 2, 3].map(i => (
                  <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
                ))}
             </div>
          </motion.div>
        ) : (
          <motion.div key="completed" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto bento-card p-20 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <Check size={48} />
            </div>
            <div className="space-y-3">
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-tight">Settlement Complete</h2>
               <p className="text-gray-500 font-medium text-lg leading-relaxed">Digital asset nodes successfully audited. Liquidity has been settled to your primary USD vault.</p>
            </div>
            <div className="pt-8 grid grid-cols-2 gap-6">
               <button onClick={resetTradeScreen} className="bg-gray-900 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] active-press hover:bg-black transition-all shadow-xl">Market Home</button>
               <button className="bg-primary/5 text-primary border border-primary/10 py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] active-press hover:bg-primary/10 transition-all flex items-center justify-center gap-2">View Receipt <FileText size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Sheet */}
      <AnimatePresence>
        {checkoutSheet && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              className="w-full max-w-xl bg-white border border-gray-100 rounded-[55px] p-14 shadow-[0_120px_200px_-40px_rgba(0,0,0,0.4)] space-y-12 relative overflow-hidden"
            >
              <div className="space-y-3 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                   {activeCardDetails.logoUrl === 'A' ? <Star size={32} className="text-primary fill-primary" /> : <span className="text-3xl font-black text-gray-900">{activeCardDetails.logoUrl}</span>}
                </div>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Invoice Summary</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Authorization Protocol Required</p>
              </div>

              <div className="bg-gray-50 rounded-[40px] p-10 space-y-8 border border-gray-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Merchant Node</span>
                  <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">{activeCardDetails.brand}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Region</span>
                  <span className="text-sm font-black text-gray-900 uppercase">{activeCardDetails.region}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Platform Fee</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                     <Zap size={14} className="fill-emerald-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest">SUB-ZERO</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end px-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Settlement Magnitude</p>
                   <p className="text-sm font-black text-primary uppercase tracking-[0.1em] flex items-center gap-2"><ShieldCheck size={14} /> SUI Mainnet Node</p>
                </div>
                <div className="text-right">
                  <p className="text-7xl font-black text-gray-900 tracking-tighter leading-none font-space">
                    ${parseFloat(cardValue || "0").toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <button
                  type="button" onClick={() => setCheckoutSheet(false)}
                  className="py-6 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-[28px] text-xs font-black uppercase tracking-[0.3em] transition-all active-press"
                >
                  Terminate
                </button>
                <button
                  type="button" onClick={() => triggerTrade('buy')}
                  disabled={parseFloat(cardValue) > profile.balance}
                  className="py-6 bg-primary hover:bg-primary/90 text-white rounded-[28px] text-xs font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,87,255,0.4)] transition-all flex items-center justify-center active-press"
                >
                  Authorize Node
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
