import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, Check, DollarSign, ArrowDownLeft, ArrowUpRight, Send, 
  HelpCircle, Shield, Download, Share2, RefreshCw, Landmark,
  CreditCard, History, LayoutDashboard, ChevronRight, Zap, Star, Wallet, TrendingUp,
  Activity, ShieldCheck, ArrowRight, Loader2, Sparkles, X, Eye, EyeOff, UserCheck,
  Coins, Lock, Fingerprint, Banknote, Building, FileText
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface WalletSystemProps {
  profile: UserProfile;
  transactions: Transaction[];
  onFundWallet: (amount: number, details: string) => void;
  onWithdrawWallet: (amount: number, details: string) => Promise<boolean> | boolean;
  onTransfer: (amount: number, recipient: string) => Promise<boolean> | boolean;
}

export default function WalletSystem({ profile, transactions, onFundWallet, onWithdrawWallet, onTransfer }: WalletSystemProps) {
  const { notify } = useNotification();
  const [activeSubTab, setActiveSubState] = useState<"overview" | "fund" | "withdraw" | "transfer">("overview");
  
  // Step state for flows
  const [currentStep, setCurrentStep] = useState(1);

  // Funding state
  const [fundMethod, setFundMethod] = useState<"bank" | "card" | "crypto">("bank");
  const [fundAmount, setFundAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentProcessing, setPaymentStatus] = useState(false);
  const [fundReceipt, setFundReceipt] = useState<Transaction | null>(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Transfer state
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientIdentifier, setRecipientIdentifier] = useState("");
  const [transferProcessing, setTransferProcessing] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [confirmedRecipient, setConfirmedRecipient] = useState<string | null>(null);

  // Copy helper
  const [copiedText, setCopiedText] = useState(false);
  const triggerCopyAccount = () => {
    navigator.clipboard.writeText("8829104422");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(fundAmount);
    if (!amountVal || amountVal <= 0) return;

    if (currentStep === 1) {
       setCurrentStep(2);
       return;
    }

    setPaymentStatus(true);
    try {
      if (fundMethod === "card") {
        const [month, year] = expiry.split("/");
        const response = await api.post('/payments/topup-card', {
          userId: profile.id || profile.email,
          amount: amountVal,
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryMonth: month,
          expiryYear: year,
          cvv: cvc
        });

        if (response.data.success) {
          onFundWallet(amountVal, "Interswitch Card Top-Up");
          setFundReceipt(response.data.transaction);
          setCurrentStep(3);
          notify("success", "Settlement Successful", `₦${amountVal.toLocaleString()} added to treasury.`);
        }
      } else {
        // Bank transfer simulation
        setTimeout(() => {
          onFundWallet(amountVal, "Virtual Vault Funding");
          setFundReceipt({
            id: `OBY-FUND-${Math.floor(Math.random() * 899999) + 100000}X`,
            title: "Wallet Funding",
            category: "Transfer",
            type: "Credit",
            amount: amountVal,
            fee: 0,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: "Success"
          } as Transaction);
          setCurrentStep(3);
          notify("success", "Ledger Updated", "Institutional wire recognized.");
        }, 1500);
      }
    } catch (error) {
      notify("error", "Settlement Failure", "Node clearance error.");
    } finally {
      setPaymentStatus(false);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (!amountVal || amountVal <= 0 || amountVal > profile.balance) return;

    if (currentStep === 1) {
       setCurrentStep(2);
       return;
    }
    
    setWithdrawProcessing(true);
    try {
      const response = await api.post('/payments/withdraw', {
        userId: profile.id || profile.email,
        amount: amountVal,
        bankName,
        accountNumber
      });

      if (response.data.success) {
        await onWithdrawWallet(amountVal, `Withdrawal to ${bankName}`);
        setWithdrawSuccess(true);
        setCurrentStep(3);
        notify("info", "Liquidity Dispatched", `₦${amountVal.toLocaleString()} routed to external node.`);
      }
    } catch (error) {
      notify("error", "Dispatch Failure", "Cross-chain payout error.");
    } finally {
      setWithdrawProcessing(false);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(transferAmount);
    if (!amountVal || amountVal <= 0 || amountVal > profile.balance) return;
    
    if (currentStep === 1) {
       setCurrentStep(2);
       return;
    }

    setTransferProcessing(true);
    try {
      const response = await api.post('/payments/transfer', {
        senderId: profile.id || profile.email,
        recipientIdentifier,
        amount: amountVal
      });

      if (response.data.success) {
        setConfirmedRecipient(response.data.recipientName);
        await onTransfer(amountVal, recipientIdentifier);
        setTransferSuccess(true);
        setCurrentStep(3);
        notify("success", "Peer Transfer Settled", `Node alignment complete with ${response.data.recipientName}.`);
      }
    } catch (error: any) {
      notify("error", "Protocol Blocked", error.response?.data?.error || "Transfer failed.");
    } finally {
      setTransferProcessing(false);
    }
  };

  const resetAllSubFlows = () => {
    setFundReceipt(null);
    setWithdrawSuccess(false);
    setTransferSuccess(false);
    setActiveSubState("overview");
    setCurrentStep(1);
    setFundAmount("");
    setWithdrawAmount("");
    setTransferAmount("");
    setRecipientIdentifier("");
    setConfirmedRecipient(null);
  };

  const tabVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  const renderStepper = () => (
     <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-12 relative px-4">
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-100 -z-10" />
        {[1, 2, 3].map(step => (
           <div key={step} className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep >= step ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-gray-100 text-gray-400'
              }`}>
                 {currentStep > step ? <Check size={18} /> : step}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= step ? 'text-primary' : 'text-gray-400'}`}>
                 {step === 1 ? "Details" : step === 2 ? "Confirm" : "Settled"}
              </span>
           </div>
        ))}
     </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Header & Tab Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left uppercase italic">Treasury Operations</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Institutional liquidity and mesh settlement controls.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto shadow-sm">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "fund", label: "Fund Node", icon: ArrowDownLeft },
            { id: "withdraw", label: "Cashout", icon: ArrowUpRight },
            { id: "transfer", label: "Transfer", icon: Send }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { resetAllSubFlows(); setActiveSubState(tab.id as any); }}
              className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial relative ${
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start"
          >
            {/* Primary Stats */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <div className="bento-card p-6 md:p-12 min-h-[300px] md:min-h-[320px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/40 rounded-full blur-[60px] md:blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[2s]"></div>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-[16px] md:rounded-[20px] flex items-center justify-center shadow-inner">
                      <Wallet size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Institutional NGN Liquidity</p>
                      <p className="text-xs md:text-sm font-bold text-gray-900">Total Authorized Reserves</p>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2 md:gap-4 overflow-hidden">
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-none truncate">
                      ₦{profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-lg md:text-2xl text-gray-400 font-bold font-mono shrink-0 uppercase tracking-widest">NGN</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-12">
                   {[
                    { id: "fund", label: "Fund", icon: ArrowDownLeft, bg: "bg-primary text-white shadow-primary/20" },
                    { id: "withdraw", label: "Cashout", icon: ArrowUpRight, bg: "bg-accent-blue text-primary border border-blue-200/50 shadow-blue-500/10" },
                    { id: "transfer", label: "Send", icon: Send, bg: "bg-white text-gray-700 border border-gray-200 shadow-gray-200/50" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setActiveSubState(btn.id as any)}
                      className={`${btn.bg} py-4 md:py-5 px-2 md:px-4 rounded-[16px] md:rounded-[22px] text-[11px] md:text-sm font-black flex items-center justify-center gap-2 md:gap-3 active-press transition-all shadow-lg hover:-translate-y-1`}
                    >
                      <btn.icon size={18} className="md:w-5 md:h-5" /> {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Account Card */}
              <div className="bento-card p-6 md:p-10 space-y-8 md:space-y-10 relative overflow-hidden group">
                 <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent-yellow/30 rounded-full blur-[80px]"></div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-[18px] md:rounded-[22px] flex items-center justify-center text-gray-400 border border-gray-100 group-hover:border-primary/20 group-hover:text-primary transition-all shrink-0 shadow-sm">
                        <Building size={24} className="md:w-7 md:h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase italic">Settlement Account</h3>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Virtual clearing node for inbound liquidity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-100 self-start sm:self-auto shadow-sm">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       Mesh Active
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
                    <div className="p-5 md:p-6 bg-gray-50/50 rounded-[20px] md:rounded-[24px] border border-gray-100 space-y-2 shadow-inner group/bank">
                       <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearing Bank</p>
                       <p className="text-base md:text-lg font-black text-gray-900 group-hover/bank:text-primary transition-colors">OBEY Global Settlement</p>
                    </div>
                    <div className="p-5 md:p-6 bg-accent-blue/40 rounded-[20px] md:rounded-[24px] border border-blue-100 space-y-2 group/acc shadow-inner">
                       <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Number</p>
                       <div className="flex items-center justify-between">
                          <p className="text-xl md:text-2xl font-mono font-black text-primary tracking-widest leading-none pt-1">8829104422</p>
                          <button 
                            onClick={triggerCopyAccount}
                            className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary active-press shrink-0"
                          >
                            {copiedText ? <Check size={16} className="text-emerald-500 md:w-5 md:h-5" /> : <Copy size={16} className="md:w-5 md:h-5" />}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 md:p-5 bg-white/40 backdrop-blur-md rounded-[20px] md:rounded-[24px] border border-white flex items-center gap-4 md:gap-5 shadow-sm">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-[14px] md:rounded-[22px] flex items-center justify-center shrink-0 shadow-inner">
                       <ShieldCheck size={20} className="md:w-6 md:h-6" />
                    </div>
                    <p className="text-[11px] md:text-xs text-gray-500 font-medium leading-relaxed">
                       All inbound transfers to this node are instantly credited to your treasury. Settlement is verified on the <span className="text-primary font-black uppercase">OBEY Sentinel Mesh</span>.
                    </p>
                 </div>
              </div>
            </div>

            {/* Recent Activity Side Bento */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
               <div className="bento-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Live Audit Feed</h4>
                     <Activity size={16} className="text-primary" />
                  </div>
                  <div className="space-y-5">
                     {transactions.slice(0, 3).map(tx => (
                        <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                 {tx.type === 'Credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-[11px] font-black text-gray-900 truncate uppercase italic">{tx.title}</p>
                                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{tx.date}</p>
                              </div>
                           </div>
                           <p className={`text-[11px] font-mono font-black ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {tx.type === 'Credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                           </p>
                        </div>
                     ))}
                     <button 
                      onClick={() => notify("log", "Audit Log", "Loading sequential ledger...")}
                      className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        View Full Ledger
                     </button>
                  </div>
               </div>

               <div className="bg-[#0b0e14] rounded-[35px] md:rounded-[45px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 shimmer opacity-10"></div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10 space-y-4 md:space-y-6 text-center sm:text-left">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-[20px] md:rounded-[24px] flex items-center justify-center text-white border border-white/10 backdrop-blur-md mx-auto sm:mx-0 shadow-lg">
                       <ShieldCheck size={28} className="text-white md:w-8 md:h-8" />
                    </div>
                    <h5 className="text-xl md:text-2xl font-black tracking-tight leading-tight uppercase italic">Institutional Guard</h5>
                    <p className="text-white/60 font-medium text-xs md:text-sm leading-relaxed">
                       Your assets are protected by multi-signature cold storage and institutional-grade cyber-insurance policies.
                    </p>
                    <button className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-b-2 border-white/20 hover:border-white transition-all pb-1.5">
                       Download Audit Certificate
                    </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {["fund", "withdraw", "transfer"].includes(activeSubTab) && (
           <motion.div 
            key={activeSubTab}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto w-full"
          >
             {/* Stepper Logic for Flow control */}
             {renderStepper()}

             {/* Funding Flow */}
             {activeSubTab === "fund" && (
                currentStep === 3 ? (
                  <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Check size={32} className="md:w-12 md:h-12" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Settlement Verified</h2>
                      <p className="text-sm md:text-base text-gray-500 font-medium">Funds successfully integrated into treasury node.</p>
                    </div>
                    <div className="bg-gray-50 rounded-[24px] p-8 space-y-6 text-left border border-gray-100 shadow-inner">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Magnitude</span>
                          <span className="text-2xl font-black text-gray-900">₦{fundReceipt?.amount.toLocaleString()}</span>
                       </div>
                       <div className="h-px bg-gray-200"></div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Operation ID</p>
                             <p className="text-xs font-mono font-black text-primary truncate">{fundReceipt?.id}</p>
                          </div>
                          <div className="space-y-1 text-right">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Execution Node</p>
                             <p className="text-xs font-black text-gray-900">OBEY-SUI-MAIN</p>
                          </div>
                       </div>
                    </div>
                    <button onClick={resetAllSubFlows} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press">Return to Treasury</button>
                  </div>
                ) : (
                  <div className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Node Liquidity</h3>
                       <p className="text-sm md:text-lg text-gray-500 font-medium">Choose a funding protocol to inject capital.</p>
                    </div>

                    {currentStep === 1 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {[
                              { id: "bank", label: "Bank Node (ACH)", desc: "1-3 Days • No Fees", icon: Building, color: "text-primary", bg: "bg-primary/5" },
                              { id: "card", label: "Insta-Card", desc: "Instant • 2.5% Surcharge", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
                              { id: "crypto", label: "Crypto Mesh", desc: "Sub-Second • Network Fees", icon: Coins, color: "text-amber-500", bg: "bg-amber-50" }
                           ].map(m => (
                             <button 
                              key={m.id} 
                              onClick={() => setFundMethod(m.id as any)}
                              className={`p-6 rounded-[24px] border-2 transition-all flex items-center gap-4 text-left group ${fundMethod === m.id ? 'border-primary bg-white shadow-xl shadow-primary/5' : 'border-gray-100 bg-gray-50/50 hover:border-primary/20'}`}
                             >
                                <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}><m.icon size={24} /></div>
                                <div>
                                   <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{m.label}</p>
                                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{m.desc}</p>
                                </div>
                                {fundMethod === m.id && <div className="ml-auto w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md" />}
                             </button>
                           ))}
                        </div>

                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center block">Funding Magnitude (NGN)</label>
                           <div className="relative">
                              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-3xl md:text-5xl">₦</span>
                              <input
                                type="number"
                                required
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-4xl md:text-6xl font-black text-gray-900 focus:ring-4 focus:ring-primary/5 outline-none tracking-tighter transition-all shadow-inner"
                              />
                           </div>
                        </div>

                        <button 
                          onClick={() => setCurrentStep(2)}
                          disabled={!fundAmount}
                          className="w-full h-18 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 active-press flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           Continue to Configuration <ArrowRight size={20} />
                        </button>
                      </>
                    ) : (
                      <div className="space-y-8 animate-fade-in">
                         {fundMethod === "bank" ? (
                            <div className="p-8 bg-accent-blue/30 border border-blue-100 rounded-[32px] space-y-6">
                               <div className="flex items-center gap-4 text-primary font-black text-xl uppercase italic">
                                  <Building size={28} /> Direct Wire
                               </div>
                               <div className="space-y-4 pt-4 border-t border-blue-100">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Target Account Node</span>
                                     <span className="font-mono text-xl font-black text-primary select-all tracking-[0.1em]">8829104422</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Clearing Gateway</span>
                                     <span className="text-sm font-black text-primary">OBEY Settlement Hub</span>
                                  </div>
                               </div>
                            </div>
                         ) : fundMethod === "card" ? (
                            <div className="space-y-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Institutional Card ID</label>
                                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="•••• •••• •••• 8824" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-xl font-mono font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner" />
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Expiry Node</label>
                                     <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="06/28" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg text-center font-bold outline-none transition-all" />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">CVC Token</label>
                                     <input type="password" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="•••" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg text-center font-bold outline-none transition-all" />
                                  </div>
                               </div>
                            </div>
                         ) : (
                            <div className="p-8 bg-amber-50 border border-amber-100 rounded-[32px] space-y-6 text-center">
                               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-amber-500 mx-auto shadow-sm"><Coins size={40} /></div>
                               <div className="space-y-2">
                                  <h4 className="text-xl font-black text-amber-900 uppercase">USDT Node Settlement</h4>
                                  <p className="text-xs text-amber-700 font-medium">Network fees apply based on Sui/Ethereum congestion.</p>
                               </div>
                               <div className="p-4 bg-white rounded-2xl border border-amber-100 font-mono text-[10px] text-amber-600 break-all select-all">
                                  0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                               </div>
                            </div>
                         )}

                         <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={80} /></div>
                            <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Invoice Summary</h4>
                            <div className="space-y-4 border-t border-white/10 pt-6">
                               <div className="flex justify-between items-center text-xs font-black text-white/50 uppercase">
                                  <span>Amount to Inject</span>
                                  <span className="text-white text-base">₦{parseFloat(fundAmount).toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between items-center text-xs font-black text-white/50 uppercase">
                                  <span>Protocol Surcharge</span>
                                  <span className="text-emerald-500 uppercase tracking-widest">Verified Free</span>
                               </div>
                               <div className="h-px bg-white/10 pt-2" />
                               <div className="flex justify-between items-end">
                                  <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total Authorized</span>
                                  <span className="text-3xl font-black font-space tracking-tighter">₦{parseFloat(fundAmount).toLocaleString()}</span>
                                </div>
                            </div>
                         </div>

                         <div className="flex gap-4">
                            <button onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Return to Specs</button>
                            <button onClick={handleFundSubmit} disabled={paymentProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                               {paymentProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Finalize Settlement <ShieldCheck size={18} /></>}
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
                )
             )}

             {/* Withdrawal Flow */}
             {activeSubTab === "withdraw" && (
                currentStep === 3 ? (
                  <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Check size={32} className="md:w-12 md:h-12" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Liquidity Dispatched</h2>
                       <p className="text-sm md:text-lg text-gray-500 font-medium">Funds have been routed to your external clearing node.</p>
                    </div>
                    <button onClick={resetAllSubFlows} className="w-full h-16 bg-[#0b0e14] text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press hover:bg-black transition-all">
                      Return to Treasury
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleWithdrawalSubmit} className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Withdrawal Dispatch</h3>
                       <p className="text-sm md:text-lg text-gray-500 font-medium">Send assets to your external bank clearing account.</p>
                    </div>

                    {currentStep === 1 ? (
                       <div className="space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Destination Account</label>
                             <div className="p-6 bg-gray-50 border border-gray-100 rounded-[28px] flex items-center justify-between cursor-pointer hover:bg-white hover:border-primary/20 transition-all shadow-inner group">
                                <div className="flex items-center gap-6">
                                   <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Building size={28} /></div>
                                   <div>
                                      <p className="text-base font-black text-gray-900">Chase Corporate Premium</p>
                                      <p className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-[0.2em]">ENDING IN •••• 9821</p>
                                   </div>
                                </div>
                                <ChevronRight className="text-gray-300" />
                             </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Magnitude (NGN)</label>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Limit: ₦250,000</span>
                             </div>
                             <div className="relative">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 font-black text-3xl md:text-5xl">₦</span>
                                <input
                                  type="number"
                                  required
                                  value={withdrawAmount}
                                  onChange={(e) => setWithdrawAmount(e.target.value)}
                                  placeholder="0.00"
                                  className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-4xl md:text-6xl font-black text-gray-900 focus:ring-4 focus:ring-primary/5 outline-none tracking-tighter transition-all shadow-inner"
                                />
                             </div>
                          </div>

                          <button 
                            onClick={() => setCurrentStep(2)}
                            disabled={!withdrawAmount}
                            className="w-full h-18 bg-[#0b0e14] text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                             Review Withdrawal <ArrowRight size={20} />
                          </button>
                       </div>
                    ) : (
                       <div className="space-y-8 animate-fade-in">
                          <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10"><Banknote size={80} /></div>
                             <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Settlement Summary</h4>
                             <div className="space-y-5 border-t border-white/10 pt-8">
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Base magnitude</span>
                                   <span className="text-white text-base">₦{parseFloat(withdrawAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Processing node fee</span>
                                   <span className="text-white text-base">₦12.50</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Network duration</span>
                                   <span className="text-emerald-500">INSTANT (SEPA)</span>
                                </div>
                                <div className="h-px bg-white/10 pt-2" />
                                <div className="flex justify-between items-end">
                                   <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total authorized</span>
                                   <span className="text-3xl font-black font-space tracking-tighter">₦{(parseFloat(withdrawAmount) + 12.50).toLocaleString()}</span>
                                 </div>
                             </div>
                          </div>

                          <div className="flex gap-4">
                             <button onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Return to Specs</button>
                             <button onClick={handleWithdrawalSubmit} disabled={withdrawProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                                {withdrawProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Confirm Dispatch <ShieldCheck size={18} /></>}
                             </button>
                          </div>
                       </div>
                    )}
                  </form>
                )
             )}

             {/* Transfer Flow */}
             {activeSubTab === "transfer" && (
                transferSuccess ? (
                  <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Send size={32} className="md:w-12 md:h-12" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Peer Transfer Sent</h2>
                       <p className="text-sm md:text-lg text-gray-500 font-medium">Liquidity has been moved to <span className="font-black text-primary">{confirmedRecipient || "target node"}</span> instantly.</p>
                    </div>
                    <button onClick={resetAllSubFlows} className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press">
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTransferSubmit} className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                    <div className="space-y-2 text-center md:text-left">
                       <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Peer Transfer</h3>
                       <p className="text-sm md:text-lg text-gray-500 font-medium">Internal settlement between high-fidelity nodes.</p>
                    </div>

                    {currentStep === 1 ? (
                       <>
                        <div className="space-y-3">
                           <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Target Node (Obey ID or Email)</label>
                           <div className="relative group">
                              <input
                                type="text"
                                required
                                value={recipientIdentifier}
                                onChange={(e) => setRecipientIdentifier(e.target.value)}
                                placeholder="OBEY-XXXXX or hello@obey.finance"
                                className="w-full h-16 md:h-20 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[22px] md:rounded-[28px] text-lg md:text-xl font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                              />
                              <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-accent-blue rounded-lg md:rounded-xl flex items-center justify-center text-primary shadow-sm group-focus-within:bg-primary group-focus-within:text-white transition-all">
                                 <UserCheck size={16} className="md:w-5 md:h-5" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-center px-4">
                              <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Magnitude (NGN)</label>
                              <span className="text-[9px] md:text-[11px] font-black text-primary">AVAIL: ₦{profile.balance.toLocaleString()}</span>
                           </div>
                           <div className="relative">
                              <span className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-primary font-black text-2xl md:text-4xl">₦</span>
                              <input
                                type="number"
                                required
                                max={profile.balance}
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-20 md:h-24 pl-16 md:pl-20 pr-6 md:pr-10 bg-gray-50 border border-gray-100 rounded-[28px] md:rounded-[35px] text-3xl md:text-5xl font-black text-gray-900 focus:ring-4 focus:ring-primary/5 outline-none tracking-tighter transition-all shadow-inner"
                              />
                           </div>
                        </div>

                        <button 
                          onClick={() => setCurrentStep(2)}
                          disabled={!transferAmount || !recipientIdentifier}
                          className="w-full h-18 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           Review Dispatch <ArrowRight size={20} />
                        </button>
                       </>
                    ) : (
                       <div className="space-y-8 animate-fade-in">
                          <div className="bg-[#0b0e14] text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10"><Send size={80} /></div>
                             <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Transfer Review</h4>
                             <div className="space-y-5 border-t border-white/10 pt-8">
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Target node</span>
                                   <span className="text-white text-base">{recipientIdentifier}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Transfer magnitude</span>
                                   <span className="text-white text-base">₦{parseFloat(transferAmount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                   <span>Network alignment</span>
                                   <span className="text-emerald-500 font-black">INSTANT PEER</span>
                                </div>
                                <div className="h-px bg-white/10 pt-2" />
                                <div className="flex justify-between items-end">
                                   <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total magnitude</span>
                                   <span className="text-3xl font-black font-space tracking-tighter">₦{parseFloat(transferAmount).toLocaleString()}</span>
                                 </div>
                             </div>
                          </div>

                          <div className="flex gap-4">
                             <button onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Return to Specs</button>
                             <button onClick={handleTransferSubmit} disabled={transferProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                                {transferProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Authorize Peer Sync <ShieldCheck size={18} /></>}
                             </button>
                          </div>
                       </div>
                    )}
                  </form>
                )
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
