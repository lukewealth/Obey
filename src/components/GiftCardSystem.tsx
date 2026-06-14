import React, { useState, useRef, useEffect } from "react";
import { UserProfile, GiftCardAsset, GiftCardTab } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, DollarSign, ArrowDownLeft, ArrowUpRight, Search, 
  HelpCircle, Shield, History, Tag, ChevronRight, Zap, 
  Star, Activity, ArrowRight, ShieldCheck, Upload, X, Check,
  RefreshCw, Loader2, Sparkles, AlertCircle, ShoppingCart, 
  LayoutGrid, List, CheckCircle2, User, Globe, Play, Gamepad2, Package, Apple as AppleIcon, Clock
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface GiftCardSystemProps {
  profile: UserProfile;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function GiftCardSystem({ profile, onTradeCompleted }: GiftCardSystemProps) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<GiftCardTab | 'P2P'>(GiftCardTab.BUY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string>("Apple");
  
  // Terminal State
  const [cardValue, setCardValue] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tradeReceipt, setTradeReceipt] = useState<any | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Real-Time Depth State
  const [lastSync, setLastSync] = useState(new Date());

  // Marketplace State
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingForm, setListingForm] = useState({ faceValue: "", price: "", rate: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const assets: (GiftCardAsset & { icon: any })[] = [
    { id: "1", name: "Apple", buyRate: 850, sellRate: 720, logo: "Apple", icon: AppleIcon, popularity: 98, trending: true },
    { id: "2", name: "Amazon", buyRate: 820, sellRate: 690, logo: "Amazon", icon: Package, popularity: 95, trending: true },
    { id: "3", name: "Google Play", buyRate: 840, sellRate: 710, logo: "Google", icon: Play, popularity: 92, trending: false },
    { id: "4", name: "Steam", buyRate: 860, sellRate: 740, logo: "Steam", icon: Gamepad2, popularity: 88, trending: true },
    { id: "5", name: "Razer Gold", buyRate: 880, sellRate: 760, logo: "Razer", icon: Zap, popularity: 85, trending: false }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchMarketListings = async () => {
    setLoadingMarket(true);
    try {
      const res = await api.get('/giftcards/market');
      setMarketListings(res.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'P2P') {
      fetchMarketListings();
    }
  }, [activeTab]);

  const handleSelectAssetForLock = (assetName: string) => {
    setSelectedAsset(assetName);
    setLockingStep("rate");
  };

  const [lockingStep, setLockingStep] = useState<"select" | "rate" | "confirm">("select");

  const handleLockForSell = async () => {
    if (!listingForm.faceValue || !listingForm.price) {
      notify("error", "Parameters Required", "Specify face value and target liquidity.");
      return;
    }
    setProcessing(true);
    try {
      const res = await api.post('/giftcards/list', {
        sellerId: profile.email === "felix@obey.finance" ? "felix-id" : "user-id",
        sellerName: profile.name,
        assetName: selectedAsset,
        faceValue: parseFloat(listingForm.faceValue),
        price: parseFloat(listingForm.price),
        claimCode: claimCode
      });
      if (res.data.success) {
        notify("success", "Asset Node Locked", "Digital node broadcasted and locked for sell.");
        setLockingStep("select");
        setActiveTab('P2P');
        fetchMarketListings();
      }
    } catch (error: any) {
      notify("error", "Broadcast Failed", "Network terminal failure.");
    } finally {
      setProcessing(false);
    }
  };

  const handleListCard = handleLockForSell;

  const handlePurchaseListing = async (listingId: string) => {
    setProcessing(true);
    try {
      const res = await api.post('/giftcards/purchase', {
        buyerId: profile.email === "felix@obey.finance" ? "felix-id" : "user-id",
        listingId
      });
      if (res.data.success) {
        notify("success", "Purchase Authorized", res.data.message);
        setTradeReceipt(res.data.transaction);
        fetchMarketListings();
      }
    } catch (error: any) {
      notify("error", "Purchase Failed", error.response?.data?.error || "Failed to acquire node.");
    } finally {
      setProcessing(false);
    }
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === GiftCardTab.SELL) {
      handleLockForSell();
      return;
    }

    if (!cardValue || parseFloat(cardValue) <= 0) {
      notify("error", "Invalid Magnitude", "Please specify a valid trade amount.");
      return;
    }

    setProcessing(true);
    try {
      const selectedAssetObj = assets.find(a => a.name === selectedAsset);
      const res = await api.post('/giftcards/purchase', {
        buyerId: profile.email === "felix@obey.finance" ? "felix-id" : "user-id",
        assetName: selectedAsset,
        amount: parseFloat(cardValue),
        rate: selectedAssetObj?.buyRate || 0
      });

      if (res.data.success) {
        notify("success", "Acquisition Authorized", "Digital node secured in escrow.");
        setTradeReceipt(res.data.transaction);
        onTradeCompleted(parseFloat(cardValue), `Acquisition of ${selectedAsset} Node`, false);
      }
    } catch (error: any) {
      notify("error", "Acquisition Failed", error.response?.data?.error || "Network terminal failure.");
    } finally {
      setProcessing(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -10 }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Header & Market Switch */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8"
      >
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-4">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <Globe size={24} />
             </div>
             <div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight uppercase italic">Asset Terminal</h2>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                   <p className="text-xs md:text-sm text-gray-400 font-medium">Trade global nodes with institutional depth.</p>
                   <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase shadow-sm">
                      <Clock size={10} className="animate-pulse" /> Sync: {lastSync.toLocaleTimeString()}
                   </div>
                </div>
             </div>
          </div>
        </div>

        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto shadow-sm">
          {[
            { id: GiftCardTab.BUY, label: "Platform Buy", icon: ArrowDownLeft },
            { id: GiftCardTab.SELL, label: "Platform Sell", icon: ArrowUpRight },
            { id: 'P2P', label: "P2P Marketplace", icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { 
                if (tab.id === 'P2P' && profile.kycLevel < 2) {
                  notify("error", "Access Gated", "Level 2 verification required for Marketplace Escrow.");
                  return;
                }
                setTradeReceipt(null); 
                setActiveTab(tab.id as any); 
              }}
              className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial relative ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : (tab.id === 'P2P' && profile.kycLevel < 2 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-900")
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'P2P' && profile.kycLevel < 2 && <Lock size={12} className="ml-1" />}
              {activeTab === tab.id && (
                <motion.div layoutId="market-tab" className="absolute inset-0 bg-primary rounded-[14px] md:rounded-[18px] -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
            </button>
          ))}
        </div>
      </motion.div>

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
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner"
              >
                <CheckCircle2 size={48} className="md:w-12 md:h-12" />
              </motion.div>
              <div className="space-y-1">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Order Logged</h2>
                <p className="text-sm md:text-base text-gray-500 font-medium">Your request is locked in the institutional escrow node.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[24px] md:rounded-[32px] p-6 md:p-10 space-y-6 md:space-y-8 text-left border border-gray-100 shadow-inner">
               <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Node Reference</span>
                <span className="text-base md:text-xl font-black text-gray-900 font-mono tracking-widest truncate select-all">{tradeReceipt.id}</span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Category</p>
                  <p className="text-base md:text-lg font-black text-gray-900">{tradeReceipt.brand || tradeReceipt.assetName || "GiftCard"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Settlement</p>
                  <p className="text-base md:text-lg font-black text-primary">₦{tradeReceipt.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                 <Shield className="text-emerald-500" size={18} />
                 <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed">
                   Funds are held in high-fidelity escrow until node delivery is verified by master audit.
                 </p>
              </div>
            </div>

            <button 
              onClick={() => setTradeReceipt(null)} 
              className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press hover:bg-black transition-all"
            >
              Back to Terminal
            </button>
          </motion.div>
        ) : activeTab === GiftCardTab.SELL ? (
          <motion.div 
            key="sell-lock-flow"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-10"
          >
            <div className="text-center space-y-2">
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase">Lock for Sale</h3>
               <p className="text-gray-500 font-medium max-w-lg mx-auto">Select a digital asset and define your liquidation parameters.</p>
            </div>

            <AnimatePresence mode="wait">
               {lockingStep === "select" && (
                 <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {assets.map((asset) => (
                      <motion.button
                        key={asset.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onClick={() => handleSelectAssetForLock(asset.name)}
                        className="bg-white border border-gray-100 p-8 rounded-[35px] flex flex-col items-center justify-center gap-6 shadow-xl hover:shadow-2xl transition-all"
                      >
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary text-3xl shrink-0"><asset.icon size={32} /></div>
                         <span className="font-black text-gray-900 uppercase text-xs tracking-widest">{asset.name}</span>
                      </motion.button>
                    ))}
                 </motion.div>
               )}

               {lockingStep === "rate" && (
                 <motion.div key="step-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-xl mx-auto bento-card p-8 md:p-12 space-y-8">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                       <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Tag size={24} /></div>
                       <h4 className="text-xl font-black text-gray-900 tracking-tight">{selectedAsset} Parameters</h4>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Asset Magnitude ($)</label>
                          <input 
                            type="number" 
                            value={listingForm.faceValue} 
                            onChange={(e) => setListingForm({...listingForm, faceValue: e.target.value})}
                            placeholder="0.00" 
                            className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Liquidation Rate (₦)</label>
                          <input 
                            type="number" 
                            value={listingForm.price} 
                            onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                            placeholder="Total price for the card" 
                            className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black text-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Claim Node Secret</label>
                          <input 
                            type="text" 
                            value={claimCode} 
                            onChange={(e) => setClaimCode(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX" 
                            className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all" 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setLockingStep("select")} className="h-16 bg-gray-50 text-gray-500 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-gray-100 active-press">Cancel</button>
                       <button onClick={handleLockForSell} className="h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 active-press">Lock Node</button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        ) : activeTab === 'P2P' ? (
          <motion.div 
            key="p2p-market"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            {/* Market Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="relative group w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search global marketplace..." 
                    className="w-full h-14 pl-12 pr-6 bg-white border border-gray-200 rounded-2xl font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
               </div>
               <button 
                onClick={() => setShowListingModal(true)}
                className="w-full md:w-auto px-10 h-14 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl active-press"
               >
                 <Tag size={18} /> Broadcast Listing
               </button>
            </div>

            {/* Listing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loadingMarket ? (
                 Array(6).fill(0).map((_, i) => (
                   <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[32px]"></div>
                 ))
               ) : marketListings.length > 0 ? (
                 marketListings.map((listing) => {
                   const asset = assets.find(a => a.name === listing.assetName);
                   const AssetIcon = asset?.icon || Gift;
                   return (
                    <motion.div 
                      key={listing.id}
                      whileHover={{ y: -5 }}
                      className="bg-white border border-gray-100 p-8 rounded-[35px] shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary shadow-inner group-hover:bg-primary/5 transition-colors">
                            <AssetIcon size={28} />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Face Value</p>
                            <p className="text-2xl font-black text-gray-900">${listing.faceValue}</p>
                          </div>
                      </div>

                      <div className="space-y-4 mb-8">
                          <h4 className="text-xl font-black text-gray-900 tracking-tight">{listing.assetName} Asset Node</h4>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg w-fit">
                            <User size={12} className="text-gray-400" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[100px]">{listing.sellerName}</span>
                          </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                          <div>
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Acquisition Cost</p>
                            <p className="text-2xl font-black text-primary font-mono tracking-tighter">₦{listing.price.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => handlePurchaseListing(listing.id)}
                            className="h-14 px-6 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active-press shadow-lg shadow-primary/20"
                          >
                            Buy <ArrowRight size={14} />
                          </button>
                      </div>
                    </motion.div>
                   );
                 })
               ) : (
                 <div className="col-span-full py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
                       <ShoppingCart size={40} />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No active listings in the global node</p>
                 </div>
               )}
            </div>

            {/* Listing Modal (Simulated overlay) */}
            <AnimatePresence>
               {showListingModal && (
                 <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
                 >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-white w-full max-w-xl rounded-[45px] p-8 md:p-12 space-y-8 relative overflow-hidden"
                    >
                       <button onClick={() => setShowListingModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
                       
                       <div className="space-y-1">
                          <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Broadcast Node</h3>
                          <p className="text-gray-500 font-medium">List your digital asset for global acquisition.</p>
                       </div>

                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Asset</label>
                                <select 
                                  value={selectedAsset}
                                  onChange={(e) => setSelectedAsset(e.target.value)}
                                  className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                                >
                                   {assets.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Face Value ($)</label>
                                <input 
                                  type="number"
                                  placeholder="0.00"
                                  value={listingForm.faceValue}
                                  onChange={(e) => setListingForm({...listingForm, faceValue: e.target.value})}
                                  className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Listing Price (₦)</label>
                             <input 
                               type="number"
                               placeholder="0.00"
                               value={listingForm.price}
                               onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                               className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-2xl font-black text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Node Secret (Claim Code)</label>
                             <input 
                               type="text"
                               placeholder="XXXX-XXXX-XXXX"
                               value={claimCode}
                               onChange={(e) => setClaimCode(e.target.value)}
                               className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl font-mono font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                             />
                          </div>
                       </div>

                       <button 
                        disabled={processing}
                        onClick={handleListCard}
                        className="w-full h-18 bg-primary hover:bg-black text-white rounded-[25px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active-press flex items-center justify-center gap-3"
                       >
                         {processing ? <Loader2 className="animate-spin" /> : <>Initiate Broadcast <ArrowRight size={20} /></>}
                       </button>
                    </motion.div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Asset Selection Grid */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                {assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((asset) => (
                  <motion.button
                    key={asset.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAsset(asset.name)}
                    className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-400 relative overflow-hidden ${
                      selectedAsset === asset.name
                        ? "border-primary bg-white shadow-xl shadow-primary/10"
                        : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                    }`}
                  >
                    {asset.trending && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    )}
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[22px] flex items-center justify-center text-xl md:text-3xl transition-all shrink-0 ${selectedAsset === asset.name ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-gray-50 border border-gray-100 text-gray-400'}`}>
                      <asset.icon size={32} />
                    </div>
                    <div className="text-center overflow-hidden w-full">
                       <p className="text-xs md:text-base font-black text-gray-900 tracking-tight truncate">{asset.name}</p>
                       <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Rate: {activeTab === GiftCardTab.BUY ? asset.buyRate : asset.sellRate}/$</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Market Activity Table Mini */}
              <div className="space-y-4 relative z-10 pt-4 md:pt-8 border-t border-gray-100">
                 <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                       <Activity size={16} className="text-primary" />
                       <h4 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] md:tracking-[0.3em]">Live Node Stream</h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest">FLOW ACTIVE</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    {[
                      { user: "Node-04x", asset: "Apple", val: 500, time: "2s ago", type: "Liquidated" },
                      { user: "Node-11z", asset: "Steam", val: 1200, time: "5s ago", type: "Acquired" }
                    ].map((act, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 md:p-5 bg-gray-50/50 rounded-[20px] md:rounded-[22px] border border-gray-100/50 hover:bg-white transition-all cursor-pointer group/row"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 shrink-0 group-hover/row:bg-primary group-hover/row:text-white transition-all">
                              <Star size={14} className="md:w-4 md:h-4" />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-[11px] md:text-sm font-black text-gray-900 truncate group-hover/row:text-primary transition-colors">{act.asset} Node</p>
                              <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">{act.type} • {act.time}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-xs md:text-sm font-black text-gray-900 font-mono tracking-tighter">${act.val.toLocaleString()}</p>
                           <div className="flex items-center gap-1 justify-end">
                              <ShieldCheck size={10} className="text-emerald-500" />
                              <span className="text-[8px] md:text-[9px] text-emerald-500 font-black uppercase tracking-widest">VERIFIED</span>
                           </div>
                        </div>
                      </motion.div>
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
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-[16px] md:rounded-[22px] flex items-center justify-center text-primary shadow-inner">
                  <Tag size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="space-y-0.5">
                   <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Execution Desk</h3>
                   <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                      <p className="text-[10px] md:text-[11px] uppercase font-black text-gray-400 tracking-[0.2em] md:tracking-[0.3em]">Institutional Node Hub</p>
                   </div>
                </div>
              </div>

              <form onSubmit={handleTrade} className="space-y-8 md:space-y-10 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Magnitude (USD)</span>
                    <span className="text-[9px] md:text-[11px] font-black text-primary uppercase">MIN: $10.00</span>
                  </div>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-125 transition-transform md:w-7 md:h-7" size={24} />
                    <input
                      type="number"
                      required
                      value={cardValue}
                      onChange={(e) => setCardValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-20 md:h-24 pl-16 md:pl-20 pr-6 md:pr-10 bg-gray-50 border border-gray-100 rounded-[28px] md:rounded-[35px] text-3xl md:text-5xl font-black text-gray-900 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 outline-none tracking-tighter transition-all"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === GiftCardTab.SELL ? (
                    <motion.div 
                      key="sell-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Node Secret (Claim Code)</label>
                        <input
                          type="text"
                          required
                          value={claimCode}
                          onChange={(e) => setClaimCode(e.target.value)}
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                          className="w-full h-14 md:h-16 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-mono font-bold focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none transition-all uppercase"
                        />
                      </div>
                    </motion.div>
                  ) : (
                     <motion.div 
                        key="buy-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 md:p-8 bg-accent-blue/40 rounded-[28px] md:rounded-[32px] border border-blue-100 space-y-4 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-3 opacity-20"><Sparkles size={24} /></div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">Acquisition Cost</span>
                           <span className="text-xl md:text-2xl font-black text-primary font-mono tracking-tighter leading-none pt-1">
                              ₦{((parseFloat(cardValue || "0") * (assets.find(a => a.name === selectedAsset)?.buyRate || 0)) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </span>
                        </div>
                        <div className="h-px bg-blue-100"></div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] md:text-[11px] font-black text-blue-400 uppercase tracking-widest">Protocol Fee</span>
                           <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                              <Zap size={10} className="text-emerald-600" />
                              <span className="text-[10px] md:text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none pt-0.5">SUB-ZERO</span>
                           </div>
                        </div>
                     </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={processing || !cardValue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-16 md:h-20 bg-primary hover:bg-black text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50 disabled:grayscale"
                >
                  {processing ? <Loader2 className="animate-spin" size={24} /> : (
                    <div className="flex items-center gap-3">
                       {activeTab === GiftCardTab.BUY ? 'Authorize Acquisition' : 'Initiate Liquidation'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </motion.button>
              </form>

              <div className="p-5 md:p-6 bg-gray-900 rounded-[28px] md:rounded-[32px] flex gap-4 md:gap-5 relative z-10 text-white shadow-xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-[14px] md:rounded-[20px] flex items-center justify-center text-primary shrink-0 shadow-lg">
                  <ShieldCheck size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-xs md:text-sm font-black tracking-tight">Institutional Escrow Active</p>
                   <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                     <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                     Verified by gateway protocols
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
