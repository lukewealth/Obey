import React, { useState, useRef } from "react";
import { UserProfile, GiftCardAsset, GiftCardTab } from "../types";
import { 
  Gift, DollarSign, ArrowDownLeft, ArrowUpRight, Check, Upload, Trash, 
  HelpCircle, ShieldAlert, ArrowRight, ChevronRight, Calculator, FileText, Image, RefreshCw, Smartphone
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

  // Rate calculator tool states
  const [calcBrand, setCalcBrand] = useState("steam");
  const [calcQty, setCalcQty] = useState("100");
  const [calcType, setCalcType] = useState<"buy" | "sell">("sell");

  // File Upload states (Usability guidelines)
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | { name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settlement loading stages
  const [stage, setStage] = useState<"idle" | "uploading" | "validating" | "completed">("idle");
  const [checkoutSheet, setCheckoutSheet] = useState(false);

  const giftCards: GiftCardAsset[] = [
    { id: "itunes", brand: "Apple iTunes", region: "USA", buyRate: 1480, sellRate: 1520, trend: "+1.2%", logoUrl: "A", description: "Apple store and application services redemption." },
    { id: "steam", brand: "Steam Wallet", region: "USA / UK", buyRate: 1515, sellRate: 1560, trend: "+2.4%", logoUrl: "S", description: "Gaming platform asset code top-up." },
    { id: "amazon", brand: "Amazon Gift Card", region: "USA / GER", buyRate: 1350, sellRate: 1420, trend: "-0.5%", logoUrl: "Z", description: "E-Commerce portal product purchases." },
    { id: "razer", brand: "Razer Gold", region: "Global", buyRate: 1530, sellRate: 1585, trend: "+4.1%", logoUrl: "R", description: "Virtual gaming pin ecosystem credits." },
  ];

  const activeCardDetails = giftCards.find((c) => c.id === selectedCard) || giftCards[0];

  // Drag and Drop implementation (Usability mandate)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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

  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Checkout flows & Multi-stage execution
  const triggerSellPipeline = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(cardValue);
    if (!val || val <= 0) return;

    // Start multistage visual settlement
    setStage("uploading");
    setTimeout(() => {
      setStage("validating");
      setTimeout(() => {
        setStage("completed");
        
        // Payout to Balance is calculated in NGN but converted, or paid directly in USD equivalent
        // Rate is ₦/$, so selling $100 means receiving $ value 100 * (sellRate/1500) or direct payout.
        // Let's assume the user card value is USD, and selling card directly credits their USD wallet.
        onTradeCompleted(val, `Sold $${val} ${activeCardDetails.brand} Gift Card`, true);
      }, 1600);
    }, 1500);
  };

  const triggerBuyPipeline = () => {
    const val = parseFloat(cardValue);
    if (!val || val <= 0 || val > profile.balance) return;

    setStage("uploading"); // Reusing uploading as 'Processing order' in UI
    setTimeout(() => {
      setStage("completed");
      onTradeCompleted(val, `Bought $${val} ${activeCardDetails.brand} Card Code`, false);
      setCheckoutSheet(false);
    }, 2000);
  };

  const resetTradeScreen = () => {
    setStage("idle");
    setCardValue("");
    setClaimCode("");
    setUploadedFile(null);
  };

  // Calculator Rate utility helper
  const calculateResultValue = () => {
    const qty = parseFloat(calcQty) || 0;
    const item = giftCards.find((c) => c.id === calcBrand) || giftCards[0];
    const rate = calcType === "sell" ? item.sellRate : item.buyRate;
    return `₦${(qty * rate).toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Toggles and Quick Rates Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-[#161F30] border border-[#242F41] p-1 rounded-2xl w-fit">
          <button
            onClick={() => { resetTradeScreen(); setActiveTab(GiftCardTab.BUY); }}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === GiftCardTab.BUY ? "bg-[#0057FF] text-white shadow-xl" : "text-slate-400 hover:text-white"
            }`}
          >
            Buy Gift Cards
          </button>
          <button
            onClick={() => { resetTradeScreen(); setActiveTab(GiftCardTab.SELL); }}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === GiftCardTab.SELL ? "bg-[#0057FF] text-white shadow-xl" : "text-slate-400 hover:text-white"
            }`}
          >
            Sell / Redeem Cards
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-emerald-500 animate-pulse w-2 h-2 rounded-full"></span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Quotes updated: Less than 1m ago</span>
        </div>
      </div>

      {stage === "idle" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Trade Form Frame */}
          <div className="lg:col-span-8 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-black text-white">
              {activeTab === GiftCardTab.BUY ? "Buy Store Card Codes" : "Sell Gift Cards for Cash"}
            </h3>
            <p className="text-xs text-slate-400">
              {activeTab === GiftCardTab.BUY 
                ? "Select a card brand, specify value, and receive instant digital code tokens directly."
                : "Convert regional gift tokens into available wallet cash reserves with background validation checks."}
            </p>

            {/* List Selection Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Gift Merchant</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {giftCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`p-4 rounded-2xl border bg-[#0B1220] transition-all duration-200 cursor-pointer relative ${
                      selectedCard === card.id
                        ? "border-[#0057FF] bg-[#0057FF]/5 shadow-lg"
                        : "border-[#242F41] hover:border-[#0057FF]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0057FF]/10 text-[#00C6FF] flex items-center justify-center font-black text-sm mb-2">
                      {card.logoUrl}
                    </div>
                    <p className="text-xs font-bold text-white leading-none">{card.brand}</p>
                    <p className="text-[9px] text-emerald-500 font-mono font-bold mt-1">₦{activeTab === GiftCardTab.BUY ? card.buyRate : card.sellRate}/$</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Card descriptions */}
            <p className="text-xs text-slate-400 bg-[#0B1220] border border-[#242F41] p-4 rounded-xl leading-relaxed">
              {activeCardDetails.description} Region: {activeCardDetails.region} • Settle Time: Under 3 minutes.
            </p>

            <form onSubmit={activeTab === GiftCardTab.SELL ? triggerSellPipeline : (e) => { e.preventDefault(); setCheckoutSheet(true); }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Value amount input */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Face Card Value ($ / £ / €)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <DollarSign size={16} />
                    </span>
                    <input
                      type="number"
                      required
                      value={cardValue}
                      onChange={(e) => setCardValue(e.target.value)}
                      placeholder="e.g. 100"
                      className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none text-white font-mono"
                    />
                  </div>
                </div>

                {/* Claim Pin input */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">{activeTab === GiftCardTab.BUY ? "Pin (Delivered Post-Buy)" : "Claim Pin Code (Optional)"}</label>
                  <input
                    type="text"
                    disabled={activeTab === GiftCardTab.BUY}
                    value={activeTab === GiftCardTab.BUY ? "GEN-AUTO-RED-XX" : claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    placeholder="e.g. ABC 992 104"
                    className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none text-white disabled:opacity-50 font-mono"
                  />
                </div>
              </div>

              {/* Advanced Drag & Drop file attachment UI for SELLING cards */}
              {activeTab === GiftCardTab.SELL && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">Attach Card Front Image / Invoice Receipt</label>
                  
                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-[#242F41] rounded-2xl relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#00C6FF]">
                          <Image size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-xs">{uploadedFile.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeUploadedFile}
                        className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg active-press shrink-0"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        dragActive 
                          ? "border-[#0057FF] bg-[#0057FF]/5" 
                          : "border-[#242F41] bg-[#0B1220]/40 hover:bg-[#0B1220]"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="text-slate-400 mb-3" size={32} />
                      <p className="text-xs font-bold text-white">Drag front image here or <span className="text-[#00C6FF] hover:underline">browse</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 font-light">Supports JPG, PNG formats up to 5MB</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!cardValue || (activeTab === GiftCardTab.SELL && !uploadedFile)}
                className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg shadow-blue-500/10 disabled:opacity-50"
              >
                {activeTab === GiftCardTab.BUY ? "Process Purchase Order" : "Submit Card Code to Settlement"}
              </button>

            </form>
          </div>

          {/* Quick Calculator Rates Desk */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 shadow-xl text-left space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="text-[#00C6FF]" size={18} />
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Calculated Rates Estimator</h4>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Brand</span>
                  <select 
                    value={calcBrand}
                    onChange={(e) => setCalcBrand(e.target.value)}
                    className="block w-full h-10 px-3 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] rounded-lg text-xs text-white"
                  >
                    {giftCards.map(c => <option key={c.id} value={c.id} className="bg-[#0b1220]">{c.brand}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Quantity (USD)</span>
                  <input 
                    type="number"
                    value={calcQty}
                    onChange={(e) => setCalcQty(e.target.value)}
                    className="block w-full h-10 px-3 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] rounded-lg text-xs font-mono text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => setCalcType("sell")}
                    className={`py-1.5 rounded text-[10px] font-bold ${calcType === "sell" ? "bg-[#12B76A] text-white" : "bg-white/5 text-slate-400"}`}
                  >
                    You Sell Product
                  </button>
                  <button 
                    onClick={() => setCalcType("buy")}
                    className={`py-1.5 rounded text-[10px] font-bold ${calcType === "buy" ? "bg-[#0057FF] text-white" : "bg-white/5 text-slate-400"}`}
                  >
                    You Buy Product
                  </button>
                </div>

                <div className="border-t border-[#242F41] my-4"></div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-semibold">Estimated Payout</span>
                  <span className="text-xl font-mono font-bold text-emerald-400 leading-none">
                    {calculateResultValue()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#161F30] border border-[#242F41] p-5 rounded-[20px] flex items-start gap-3">
              <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
              <div>
                <p className="text-[11px] font-bold text-white">Trade notice</p>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  Always capture the physical copy clearly, including all corner edges and PIN numbers, to prevent processing degradation.
                </p>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* MULTISTAGE LOAD PIPELINE OVERLAY */}
      {stage !== "idle" && stage !== "completed" && (
        <div className="max-w-xl mx-auto bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-6 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[300px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0057FF]"></div>
          
          <RefreshCw className="animate-spin text-[#0057FF]" size={42} />
          
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white">
              {stage === "uploading" ? "Broadcasting Card Asset" : "Auditing Security Codes"}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {stage === "uploading" 
                ? "Sinking file images securely into our encrypted multi-sig storage array..."
                : "Validating claims pin numbers dynamically against provider gateways..."}
            </p>
          </div>
        </div>
      )}

      {/* FINALIZED STAGE COMPLETED RECEIVED SCREEN */}
      {stage === "completed" && (
        <div className="max-w-xl mx-auto bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          
          <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-[#12B76A] mb-2 animate-bounce">
            <Check size={32} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-[#12B76A] uppercase tracking-widest font-black">MARKET TRANS METRICS</p>
            <h3 className="text-2xl font-black text-white">Settlement complete</h3>
            <p className="text-xs text-slate-400 font-light max-w-xs mx-auto mt-1">
              {activeTab === "BUY" 
                ? "Card purchased successfully! Digital Pin allocated: GEN-AUTO-RED-XX" 
                : "Merchant assets approved and settled! USD cash has been routed directly to your available wallet balances."}
            </p>
          </div>

          <button onClick={resetTradeScreen} className="w-full bg-[#0057FF] hover:bg-blue-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white active-press mt-4">
            Done
          </button>
        </div>
      )}

      {/* CHECKOUT MODAL SHEET FOR PURCHASING CARDS */}
      {checkoutSheet && (
        <div className="fixed inset-0 bg-[#0b1220]/80 backdrop-blur-md z-40 flex items-center justify-center p-6 bg-opacity-70">
          <div className="w-full max-w-sm bg-[#161F30] border border-[#242F41] shadow-2xl rounded-[20px] p-6 space-y-5">
            <h3 className="text-base font-black text-white">Checkout Purchase Code</h3>
            
            <div className="bg-[#0B1220] border border-[#242F41] p-4 rounded-xl space-y-3.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant Brand</span>
                <span className="text-white font-bold">{activeCardDetails.brand}</span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="flex justify-between">
                <span className="text-slate-400">Face Value</span>
                <span className="text-white font-mono font-bold">${parseFloat(cardValue).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Charged Rate</span>
                <span className="text-[#00C6FF] font-black uppercase text-[10px]">₦{activeCardDetails.buyRate.toLocaleString()}/$</span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery mode</span>
                <span className="text-emerald-400 font-bold uppercase text-[9px]">Instant Settle</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs text-slate-400 font-semibold">Settle Wallet Value</span>
              <span className="text-xl font-mono font-bold text-white">${parseFloat(cardValue).toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutSheet(false)}
                className="py-3.5 bg-white/5 border border-[#242F41] rounded-xl text-xs font-bold text-slate-300 uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={triggerBuyPipeline}
                disabled={parseFloat(cardValue) > profile.balance}
                className="py-3.5 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
              >
                Pay & Deliver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
