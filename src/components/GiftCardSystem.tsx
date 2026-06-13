import React, { useState, useRef } from "react";
import { UserProfile, GiftCardAsset, GiftCardTab } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, DollarSign, ArrowDownLeft, ArrowUpRight, Check, Upload, Trash, 
  HelpCircle, ShieldAlert, ArrowRight, ChevronRight, Calculator, 
  FileText, Image, RefreshCw, Smartphone, Search, Zap, Star, Activity,
  ShieldCheck
} from "lucide-react";

interface GiftCardSystemProps {
  profile: UserProfile;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function GiftCardSystem({ profile, onTradeCompleted }: GiftCardSystemProps) {
  const [activeTab, setActiveTab] = useState<GiftCardTab>(GiftCardTab.BUY);
  const [selectedCard, setSelectedCard] = useState<string>("itunes");
  const [cardValue, setCardValue] = useState("");
  const [claimCode, setClaimCode] = useState("");

  // Rate calculator
  const [calcBrand, setCalcBrand] = useState("steam");
  const [calcQty, setCalcQty] = useState("100");
  const [calcType, setCalcType] = useState<"buy" | "sell">("sell");

  // File Upload
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | { name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [stage, setStage] = useState<"idle" | "processing" | "completed">("idle");
  const [checkoutSheet, setCheckoutSheet] = useState(false);

  const giftCards: GiftCardAsset[] = [
    { id: "itunes", brand: "Apple", region: "Global", buyRate: 1480, sellRate: 1520, trend: "+1.2%", logoUrl: "A", description: "Universal app store and media credits." },
    { id: "steam", brand: "Steam", region: "USA/UK", buyRate: 1515, sellRate: 1560, trend: "+2.4%", logoUrl: "S", description: "Gaming platform asset codes." },
    { id: "amazon", brand: "Amazon", region: "USA/GER", buyRate: 1350, sellRate: 1420, trend: "-0.5%", logoUrl: "Z", description: "E-commerce retail credits." },
    { id: "razer", brand: "Razer Gold", region: "Global", buyRate: 1530, sellRate: 1585, trend: "+4.1%", logoUrl: "R", description: "Gaming and virtual pin credits." },
  ];

  const activeCardDetails = giftCards.find((c) => c.id === selectedCard) || giftCards[0];

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

  const triggerSellPipeline = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(cardValue);
    if (!val || val <= 0) return;

    setStage("processing");
    setTimeout(() => {
      setStage("completed");
      onTradeCompleted(val, `Redeemed $${val} ${activeCardDetails.brand} Card`, true);
    }, 3000);
  };

  const triggerBuyPipeline = () => {
    const val = parseFloat(cardValue);
    if (!val || val <= 0 || val > profile.balance) return;

    setStage("processing");
    setTimeout(() => {
      setStage("completed");
      onTradeCompleted(val, `Purchased $${val} ${activeCardDetails.brand} Code`, false);
      setCheckoutSheet(false);
    }, 2500);
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

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gift Card Market</h2>
          <p className="text-gray-500 font-medium">Liquidate digital assets or acquire premium brand codes.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto">
          {[
            { id: GiftCardTab.BUY, label: "Buy Codes", icon: Smartphone },
            { id: GiftCardTab.SELL, label: "Sell / Redeem", icon: RefreshCw }
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Action Card */}
            <div className="lg:col-span-8 bento-card p-10 space-y-12 group overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/30 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
               
               <div className="flex justify-between items-center border-b border-gray-100 pb-10 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {activeTab === GiftCardTab.BUY ? "Acquisition Terminal" : "Liquidity Gateway"}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Select merchant and configure asset magnitude.</p>
                </div>
                <div className="w-14 h-14 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary">
                   <Gift size={28} />
                </div>
              </div>

              {/* Brand Grid */}
              <div className="space-y-5 relative z-10">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Premium Merchants</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {giftCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card.id)}
                      className={`p-8 rounded-[32px] border transition-all duration-400 group/p flex flex-col items-center text-center ${
                        selectedCard === card.id
                          ? "border-primary bg-white shadow-xl shadow-primary/10"
                          : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-[22px] ${selectedCard === card.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400'} flex items-center justify-center font-black text-2xl mb-4 transition-all group-hover/p:scale-110`}>
                        {card.logoUrl === 'A' ? <Star size={24} fill="currentColor" /> : card.logoUrl}
                      </div>
                      <p className="text-sm font-black text-gray-900 tracking-tight uppercase">{card.brand}</p>
                      <p className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest">Optimized</p>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={activeTab === GiftCardTab.SELL ? triggerSellPipeline : (e) => { e.preventDefault(); setCheckoutSheet(true); }} className="space-y-10 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                          className="w-full h-16 pl-16 pr-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-black focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">
                        {activeTab === GiftCardTab.BUY ? "Protocol Mode" : "Authorization Secret"}
                      </label>
                      <input
                        type="text"
                        disabled={activeTab === GiftCardTab.BUY}
                        value={activeTab === GiftCardTab.BUY ? "AUTO-SETTLEMENT" : claimCode}
                        onChange={(e) => setClaimCode(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-mono font-black focus:ring-2 focus:ring-primary/10 outline-none disabled:opacity-40 transition-all uppercase tracking-widest"
                      />
                    </div>
                 </div>

                 {activeTab === GiftCardTab.SELL && (
                  <div className="space-y-5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Asset Node (Physical Copy)</label>
                    <AnimatePresence mode="wait">
                      {uploadedFile ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-between p-8 bg-accent-blue/30 border border-blue-100 rounded-[32px]"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-[22px] flex items-center justify-center text-primary shadow-sm">
                              <Image size={28} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-black text-gray-900 truncate max-w-xs">{uploadedFile.name}</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Node ready for audit</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="w-14 h-14 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-all active-press flex items-center justify-center"
                          >
                            <Trash size={24} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-[45px] p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-400 ${
                            dragActive 
                              ? "border-primary bg-accent-blue/40" 
                              : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-primary/20"
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-gray-300 shadow-sm mb-6">
                            <Upload size={40} />
                          </div>
                          <h4 className="text-xl font-black text-gray-900 tracking-tight">Broadcast Card Asset</h4>
                          <p className="text-sm text-gray-400 font-medium mt-2">Drag high-fidelity capture or <span className="text-primary font-bold">browse device node</span></p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                 )}

                 <button
                  type="submit"
                  disabled={!cardValue || (activeTab === GiftCardTab.SELL && !uploadedFile)}
                  className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                     {activeTab === GiftCardTab.BUY ? "Process Acquisition" : "Initiate Audit"} <ArrowRight size={20} />
                  </div>
                </button>
              </form>
            </div>

            {/* Info Bento Column */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bento-card p-10 space-y-10 group overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-yellow/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 bg-accent-blue rounded-[20px] flex items-center justify-center text-primary">
                      <Calculator size={24} />
                    </div>
                    <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Market Index</h4>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Asset Merchant</label>
                      <select 
                        value={calcBrand}
                        onChange={(e) => setCalcBrand(e.target.value)}
                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[18px] text-sm font-black outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      >
                        {giftCards.map(c => <option key={c.id} value={c.id}>{c.brand} (USA/GLOBAL)</option>)}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Magnitude (USD)</label>
                      <input 
                        type="number"
                        value={calcQty}
                        onChange={(e) => setCalcQty(e.target.value)}
                        className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[18px] text-lg font-black outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-[18px]">
                      <button 
                        onClick={() => setCalcType("sell")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${calcType === "sell" ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400"}`}
                      >
                        Redeem
                      </button>
                      <button 
                        onClick={() => setCalcType("buy")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${calcType === "buy" ? "bg-primary text-white shadow-lg" : "text-gray-400"}`}
                      >
                        Acquire
                      </button>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex justify-between items-end px-2">
                      <div className="space-y-1">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Settlement</span>
                         <p className="text-xs font-bold text-gray-900 uppercase">Primary Vault</p>
                      </div>
                      <span className="text-3xl font-black text-gray-900 font-mono tracking-tighter">
                        ₦{(parseFloat(calcQty) * (calcType === "sell" ? activeCardDetails.sellRate : activeCardDetails.buyRate)).toLocaleString()}
                      </span>
                    </div>
                  </div>
               </div>

               <div className="bg-primary rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/30 group">
                  <div className="absolute inset-0 shimmer opacity-10"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10 space-y-6">
                    <ShieldCheck size={32} className="text-white/80" />
                    <h5 className="text-2xl font-black tracking-tight leading-tight">Verification <br /> Protocol.</h5>
                    <p className="text-white/60 font-medium text-sm leading-relaxed">
                       Physical assets are audited across global nodes for sub-second settlement and risk mitigation.
                    </p>
                    <button className="text-white text-xs font-black uppercase tracking-[0.2em] border-b-2 border-white/20 hover:border-white transition-all pb-1.5">
                       VIEW STANDARDS
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : stage === "processing" ? (
          <motion.div 
            key="processing"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[50px] p-20 text-center shadow-2xl space-y-10 relative overflow-hidden"
          >
            <div className="w-24 h-24 bg-accent-blue rounded-[32px] flex items-center justify-center mx-auto shadow-inner group">
              <RefreshCw className="animate-spin text-primary" size={48} />
            </div>
            <div className="space-y-3">
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Identity Audit</h3>
               <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">Dynamic validation of digital assets across merchant gateway protocols.</p>
            </div>
            <div className="flex justify-center gap-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="completed"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[50px] p-16 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check size={48} />
            </div>
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Settlement Complete</h2>
               <p className="text-gray-500 font-medium">Digital assets have been successfully audited and settled.</p>
            </div>
            <button onClick={resetTradeScreen} className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl active-press">
              Return to Market
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buy Overlay: Apple Pro Inspired */}
      <AnimatePresence>
        {checkoutSheet && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-xl bg-white border border-gray-100 rounded-[50px] p-12 shadow-[0_100px_200px_-20px_rgba(0,0,0,0.2)] space-y-10 relative overflow-hidden"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Invoice Review</h3>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Verify and Authorize Settlement</p>
              </div>

              <div className="bg-gray-50/50 rounded-[40px] p-10 space-y-8 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Brand Protocol</span>
                  <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">{activeCardDetails.brand}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Region Node</span>
                  <span className="text-sm font-black text-gray-900">{activeCardDetails.region}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Service Fee</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                     <Activity size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">SUB-ZERO</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end px-4">
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Authorized Magnitude</p>
                   <p className="text-sm font-black text-primary uppercase tracking-widest">Primary USD Vault</p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
                    ${parseFloat(cardValue).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutSheet(false)}
                  className="py-6 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all active-press"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={triggerBuyPipeline}
                  disabled={parseFloat(cardValue) > profile.balance}
                  className="py-6 bg-primary hover:bg-primary/90 text-white rounded-[22px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all flex items-center justify-center active-press"
                >
                  Authorize Settlement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
