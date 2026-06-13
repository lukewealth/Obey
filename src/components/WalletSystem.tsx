import React, { useState } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, Check, DollarSign, ArrowDownLeft, ArrowUpRight, Send, 
  HelpCircle, Shield, Download, Share2, RefreshCw, Landmark,
  CreditCard, History, LayoutDashboard, ChevronRight, Zap, Star, Wallet, TrendingUp
} from "lucide-react";

interface WalletSystemProps {
  profile: UserProfile;
  transactions: Transaction[];
  onFundWallet: (amount: number, details: string) => void;
  onWithdrawWallet: (amount: number, details: string) => Promise<boolean> | boolean;
  onTransfer: (amount: number, recipient: string) => Promise<boolean> | boolean;
}

export default function WalletSystem({ profile, transactions, onFundWallet, onWithdrawWallet, onTransfer }: WalletSystemProps) {
  const [activeSubTab, setActiveSubState] = useState<"overview" | "fund" | "withdraw" | "transfer">("overview");
  
  // Funding state
  const [fundMethod, setFundMethod] = useState<"bank" | "card">("bank");
  const [fundAmount, setFundAmount] = useState("");
  const [paymentProcessing, setPaymentStatus] = useState(false);
  const [fundReceipt, setFundReceipt] = useState<Transaction | null>(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Transfer state
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferProcessing, setTransferProcessing] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Copy helper
  const [copiedText, setCopiedText] = useState(false);
  const triggerCopyAccount = () => {
    navigator.clipboard.writeText("8829104422");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(fundAmount);
    if (!amountVal || amountVal <= 0) return;

    setPaymentStatus(true);
    setTimeout(() => {
      setPaymentStatus(false);
      const desc = fundMethod === "bank" ? "Virtual Vault Funding" : "Credit Card Top-Up";
      onFundWallet(amountVal, desc);
      const now = new Date();
      setFundReceipt({
        id: `OBY-${Math.floor(Math.random() * 899999) + 100000}X`,
        title: "Wallet Funding",
        category: "Transfer",
        type: "Credit",
        amount: amountVal,
        fee: 0,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        status: "Success"
      });
    }, 1500);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (!amountVal || amountVal <= 0 || amountVal > profile.balance) return;
    setWithdrawProcessing(true);
    setTimeout(async () => {
      const isSuccess = await onWithdrawWallet(amountVal, `Withdrawal to ${bankName || "Clearing Account"}`);
      setWithdrawProcessing(false);
      if (isSuccess) setWithdrawSuccess(true);
    }, 1500);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(transferAmount);
    if (!amountVal || amountVal <= 0 || amountVal > profile.balance) return;
    setTransferProcessing(true);
    setTimeout(async () => {
      const isSuccess = await onTransfer(amountVal, recipientEmail);
      setTransferProcessing(false);
      if (isSuccess) setTransferSuccess(true);
    }, 1500);
  };

  const resetAllSubFlows = () => {
    setFundReceipt(null);
    setWithdrawSuccess(false);
    setTransferSuccess(false);
    setActiveSubState("overview");
  };

  const tabVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <div className="space-y-12">
      {/* Header & Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Treasury Operations</h2>
          <p className="text-gray-500 font-medium">Manage your institutional liquidity nodes.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "fund", label: "Fund", icon: ArrowDownLeft },
            { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
            { id: "transfer", label: "Transfer", icon: Send }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { resetAllSubFlows(); setActiveSubState(tab.id as any); }}
              className={`px-6 py-3 rounded-[18px] text-[13px] font-black tracking-tight transition-all flex items-center gap-2 whitespace-nowrap ${
                activeSubTab === tab.id 
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
        {activeSubTab === "overview" && (
          <motion.div 
            key="overview"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Primary Stats */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bento-card p-12 min-h-[320px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/40 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[2s]"></div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-[20px] flex items-center justify-center">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Treasury Balance</p>
                      <p className="text-sm font-bold text-gray-900">Primary USD Liquidity Node</p>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">
                      ${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-2xl text-gray-400 font-bold font-mono">USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                   {[
                    { id: "fund", label: "Fund", icon: ArrowDownLeft, bg: "bg-primary text-white shadow-primary/20" },
                    { id: "withdraw", label: "Withdraw", icon: ArrowUpRight, bg: "bg-accent-blue text-primary border border-blue-200/50 shadow-blue-500/10" },
                    { id: "transfer", label: "Transfer", icon: Send, bg: "bg-white text-gray-700 border border-gray-200 shadow-gray-200/50" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setActiveSubState(btn.id as any)}
                      className={`${btn.bg} py-5 px-4 rounded-[22px] text-sm font-black flex items-center justify-center gap-3 active-press transition-all shadow-xl hover:-translate-y-1`}
                    >
                      <btn.icon size={20} /> {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Account Card: Finsy/Wallet Obey Inspired */}
              <div className="bento-card p-10 space-y-10 relative overflow-hidden group">
                 <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent-yellow/30 rounded-full blur-[80px]"></div>
                 
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-[22px] flex items-center justify-center text-gray-400 border border-gray-100 group-hover:border-primary/20 group-hover:text-primary transition-all">
                        <Landmark size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Virtual Clearing Node</h3>
                        <p className="text-sm text-gray-400 font-medium">Auto-settlement account ID</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       Operational
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="p-6 bg-gray-50/50 rounded-[24px] border border-gray-100 space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearing Bank</p>
                       <p className="text-lg font-black text-gray-900">OBEY Global Settlement</p>
                    </div>
                    <div className="p-6 bg-accent-blue/40 rounded-[24px] border border-blue-100 space-y-2 group/acc">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Number</p>
                       <div className="flex items-center justify-between">
                          <p className="text-2xl font-mono font-black text-primary tracking-widest leading-none pt-1">8829104422</p>
                          <button 
                            onClick={triggerCopyAccount}
                            className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary active-press"
                          >
                            {copiedText ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="p-5 bg-white/40 backdrop-blur-md rounded-[24px] border border-white flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                       <Shield size={24} />
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                       All inbound transfers to this node are instantly credited to your treasury. Settlement latency is typically <span className="text-primary font-black">&lt;2.4s</span>.
                    </p>
                 </div>
              </div>
            </div>

            {/* Side Content */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bento-card p-10 space-y-10">
                  <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Node Allocation</h4>
                  <div className="space-y-8">
                    {[
                      { label: "Fiat Reserves", val: 65, color: "bg-primary", text: "text-primary" },
                      { label: "Digital Assets", val: 35, color: "bg-secondary", text: "text-secondary" }
                    ].map((node) => (
                      <div key={node.label} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-sm font-black text-gray-900">{node.label}</p>
                          <p className={`text-sm font-mono font-black ${node.text}`}>{node.val}%</p>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${node.val}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${node.color} h-full rounded-full shadow-lg shadow-black/5`}
                           ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Index</span>
                     <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[13px]">
                        <TrendingUp size={14} /> +12.4%
                     </div>
                  </div>
               </div>

               <div className="bg-primary rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/30 group">
                  <div className="absolute inset-0 shimmer opacity-10"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10 space-y-6">
                    <Shield size={32} className="text-white/80" />
                    <h5 className="text-2xl font-black tracking-tight leading-tight">Institutional <br /> Protection.</h5>
                    <p className="text-white/60 font-medium text-sm leading-relaxed">
                       Your assets are backed by multi-signature cold storage and bank-grade insurance policies.
                    </p>
                    <button className="text-white text-xs font-black uppercase tracking-[0.2em] border-b-2 border-white/20 hover:border-white transition-all pb-1.5">
                       VIEW POLICY
                    </button>
                  </div>
               </div>

               <div className="bg-accent-yellow border border-yellow-200 rounded-[45px] p-10 relative overflow-hidden group shadow-xl shadow-yellow-500/5">
                  <div className="relative z-10 space-y-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm">
                       <Zap size={24} fill="currentColor" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Elite Perks</h4>
                    <p className="text-sm text-gray-600 font-medium">
                       Enjoy zero-fee internal transfers and premium utility rates.
                    </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* Action Flows: Fund, Withdraw, Transfer */}
        {["fund", "withdraw", "transfer"].includes(activeSubTab) && (
           <motion.div 
            key={activeSubTab}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto w-full"
          >
             {/* Funding Flow */}
             {activeSubTab === "fund" && (
                fundReceipt ? (
                  <div className="bg-white border border-gray-100 rounded-[45px] p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Check size={48} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Settlement Successful</h2>
                      <p className="text-gray-500 font-medium">Your treasury balance has been updated.</p>
                    </div>
                    <div className="bg-gray-50 rounded-[32px] p-8 space-y-6 text-left border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount</span>
                        <span className="text-3xl font-black text-gray-900">${fundReceipt.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Reference</p>
                          <p className="text-sm font-bold text-gray-900 font-mono uppercase">{fundReceipt.id}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Node</p>
                          <p className="text-sm font-bold text-gray-900">SUI Mainnet</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <button className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 active-press">
                        Download Report
                      </button>
                      <button onClick={resetAllSubFlows} className="text-sm font-black text-gray-400 hover:text-gray-900 tracking-widest uppercase py-2">
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bento-card p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-3xl font-black text-gray-900 tracking-tight">Node Funding</h3>
                       <p className="text-gray-500 font-medium">Inject liquidity into your USD treasury.</p>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-[22px] border border-gray-200/50">
                      <button
                        onClick={() => setFundMethod("bank")}
                        className={`flex-1 py-4 rounded-[18px] text-sm font-black transition-all ${
                          fundMethod === "bank" ? "bg-white text-primary shadow-sm" : "text-gray-400"
                        }`}
                      >
                        Bank Node
                      </button>
                      <button
                        onClick={() => setFundMethod("card")}
                        className={`flex-1 py-4 rounded-[18px] text-sm font-black transition-all ${
                          fundMethod === "card" ? "bg-white text-primary shadow-sm" : "text-gray-400"
                        }`}
                      >
                        Institutional Card
                      </button>
                    </div>

                    <form onSubmit={handleFundSubmit} className="space-y-8">
                       {fundMethod === "bank" ? (
                          <div className="bg-accent-blue/30 border border-blue-100 p-8 rounded-[32px] space-y-6">
                             <div className="flex items-center gap-4">
                                <Landmark size={24} className="text-primary" />
                                <span className="text-lg font-black text-primary tracking-tight">Direct Settlement</span>
                             </div>
                             <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                Funds wired to your clearing account are automatically recognized and credited. Sub-second clearance for institutional nodes.
                             </p>
                             <div className="pt-4 flex justify-between items-center border-t border-blue-100">
                                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Account ID</span>
                                <span className="font-mono text-lg font-black text-primary tracking-[0.1em]">8829104422</span>
                             </div>
                          </div>
                       ) : (
                          <div className="space-y-6">
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Account Holder</label>
                                <input type="text" required placeholder="Felix Anderson" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Card Identifier</label>
                                <input type="text" required placeholder="•••• •••• •••• 8824" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-mono font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Expiry</label>
                                   <input type="text" required placeholder="06/28" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-center text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">CVC Node</label>
                                   <input type="password" required placeholder="•••" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-center text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                                </div>
                             </div>
                          </div>
                       )}

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4 text-center block">Funding Magnitude (USD)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={28} />
                            <input
                              type="number"
                              required
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none tracking-tighter transition-all"
                            />
                          </div>
                       </div>

                       <button
                        type="submit"
                        disabled={paymentProcessing || !fundAmount}
                        className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press"
                      >
                        {paymentProcessing ? <RefreshCw className="animate-spin" size={28} /> : "Authorize Settlement"}
                      </button>
                    </form>
                  </div>
                )
             )}

             {/* Withdrawal Flow */}
             {activeSubTab === "withdraw" && (
                withdrawSuccess ? (
                  <div className="bg-white border border-gray-100 rounded-[45px] p-12 text-center shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <ArrowUpRight size={48} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Liquidity Dispatched</h2>
                       <p className="text-gray-500 font-medium">Funds have been routed to your bank node.</p>
                    </div>
                    <button onClick={resetAllSubFlows} className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl active-press">
                      Return to Treasury
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleWithdrawalSubmit} className="bento-card p-12 shadow-2xl space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-3xl font-black text-gray-900 tracking-tight">Withdrawal Dispatch</h3>
                       <p className="text-gray-500 font-medium">Send assets to your external clearing account.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Destination Bank</label>
                          <input type="text" required value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Chase, Wells Fargo, etc." className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Account ID</label>
                             <input type="text" required placeholder="•••• •••• ••••" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-mono font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Routing Node</label>
                             <input type="text" required placeholder="012345678" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-mono font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Magniture (USD)</label>
                          <span className="text-[11px] font-black text-primary">AVAIL: ${profile.balance.toLocaleString()}</span>
                       </div>
                       <div className="relative">
                          <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={28} />
                          <input
                            type="number"
                            required
                            max={profile.balance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none tracking-tighter transition-all"
                          />
                       </div>
                    </div>

                    <button
                      type="submit"
                      disabled={withdrawProcessing || !withdrawAmount}
                      className="w-full h-20 bg-gray-900 hover:bg-black text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center active-press"
                    >
                      {withdrawProcessing ? <RefreshCw className="animate-spin" size={28} /> : "Initiate Cashout"}
                    </button>
                  </form>
                )
             )}

             {/* Transfer Flow */}
             {activeSubTab === "transfer" && (
                transferSuccess ? (
                  <div className="bg-white border border-gray-100 rounded-[45px] p-12 text-center shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <Send size={48} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Peer Transfer Sent</h2>
                       <p className="text-gray-500 font-medium">Liquidity has been moved to the target node.</p>
                    </div>
                    <button onClick={resetAllSubFlows} className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl active-press">
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTransferSubmit} className="bento-card p-12 shadow-2xl space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-3xl font-black text-gray-900 tracking-tight">Peer Transfer</h3>
                       <p className="text-gray-500 font-medium">Internal settlement between OBEY nodes.</p>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Target Node (Email)</label>
                       <div className="relative">
                          <input
                            type="email"
                            required
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="hello@obey.finance"
                            className="w-full h-20 px-8 bg-gray-50 border border-gray-100 rounded-[28px] text-xl font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center text-primary">
                             <Check size={20} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Magniture (USD)</label>
                          <span className="text-[11px] font-black text-primary">LIMIT: $50,000.00</span>
                       </div>
                       <div className="relative">
                          <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 text-primary" size={28} />
                          <input
                            type="number"
                            required
                            max={profile.balance}
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-5xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none tracking-tighter transition-all"
                          />
                       </div>
                    </div>

                    <button
                      type="submit"
                      disabled={transferProcessing || !transferAmount}
                      className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press"
                    >
                      {transferProcessing ? <RefreshCw className="animate-spin" size={28} /> : "Confirm Dispatch"}
                    </button>
                  </form>
                )
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
