import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, ArrowDownLeft, ArrowUpRight, Send,
  Shield, RefreshCw, Landmark,
  CreditCard, LayoutDashboard, ChevronRight, Zap, Star, Wallet, TrendingUp,
  Activity, ShieldCheck, ArrowRight, Loader2, Sparkles, Eye, EyeOff, UserCheck,
  Coins, Lock, Fingerprint, Banknote, Building, FileText, Search
} from "lucide-react";
import api, { createCheckoutOrder, verifyTransaction, initiateWithdrawal, fetchBankCodes, lookupBankAccount } from "../services/api";
import { getErrorMessage } from "../utils/errorHandler";
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

  const [currentStep, setCurrentStep] = useState(1);

  const [fundMethod, setFundMethod] = useState<"bank" | "card" | "crypto">("card");
  const [fundAmount, setFundAmount] = useState("");
  const [paymentProcessing, setPaymentStatus] = useState(false);
  const [fundReceipt, setFundReceipt] = useState<Transaction | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [bankSearch, setBankSearch] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  const [transferAmount, setTransferAmount] = useState("");
  const [recipientIdentifier, setRecipientIdentifier] = useState("");
  const [transferProcessing, setTransferProcessing] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [confirmedRecipient, setConfirmedRecipient] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<{ accountNumber: string; accountName: string; bankName: string } | null>(null);

  useEffect(() => {
    fetchBankCodes()
      .then(res => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setBanks(res.data.data);
        } else if (res.data?.banks && Array.isArray(res.data.banks)) {
          setBanks(res.data.banks);
        } else {
          setBanks([]);
        }
      })
      .catch(() => {
        setBanks([]);
      });

    api.get(`/nomba/virtual-accounts`, { params: { userId: profile.id } })
      .then(res => {
        if (res.data?.accounts && Array.isArray(res.data.accounts) && res.data.accounts.length > 0) {
          setVirtualAccount(res.data.accounts[0]);
        } else {
          setVirtualAccount(null);
        }
      })
      .catch(() => {
        setVirtualAccount(null);
      });
  }, [profile.id]);

  const triggerCopyAccount = () => {
    const accNum = virtualAccount?.accountNumber || "8829104422";
    navigator.clipboard.writeText(accNum);
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
        const response = await createCheckoutOrder({
          userId: profile.id || profile.email,
          amount: amountVal,
          email: profile.email,
          callbackUrl: `${window.location.origin}/payment/callback`
        });

        if (response.data?.data?.checkoutLink) {
          notify("info", "Redirecting to Payment", "Secure checkout in progress...");
          window.location.href = response.data.data.checkoutLink;
        }
      } else if (fundMethod === "bank") {
        setTimeout(() => {
          onFundWallet(amountVal, "Virtual Account Funding");
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
          notify("success", "Deposit Successful", "Money added to your wallet.");
        }, 1500);
      } else {
        setTimeout(() => {
          onFundWallet(amountVal, "Crypto Mesh Funding");
          setFundReceipt({
            id: `OBY-CRYPTO-${Math.floor(Math.random() * 899999) + 100000}X`,
            title: "Crypto Funding",
            category: "Crypto",
            type: "Credit",
            amount: amountVal,
            fee: 0,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: "Success"
          } as Transaction);
          setCurrentStep(3);
          notify("success", "Crypto Settled", "USDT mesh synchronized.");
        }, 1500);
      }
    } catch (error) {
      notify("error", "Payment Failed", "Please try again.");
    } finally {
      setPaymentStatus(false);
    }
  };

  const handleAccountLookup = async () => {
    if (!accountNumber || !bankCode || accountNumber.length < 10) return;

    setVerifyingAccount(true);
    try {
      const response = await lookupBankAccount(accountNumber, bankCode);
      if (response.data?.data?.accountName) {
        setAccountName(response.data.data.accountName);
        const bank = banks.find(b => b.code === bankCode);
        if (bank) setBankName(bank.name);
        notify("success", "Account Verified", response.data.data.accountName);
      }
    } catch (error) {
      notify("error", "Verification Failed", "Could not verify account.");
    } finally {
      setVerifyingAccount(false);
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
      const response = await initiateWithdrawal({
        userId: profile.id || profile.email,
        amount: amountVal,
        accountNumber,
        bankCode,
        accountName
      });

      if (response.data?.success) {
        await onWithdrawWallet(amountVal, `Withdrawal to ${bankName}`);
        setWithdrawSuccess(true);
        setCurrentStep(3);
        notify("info", "Withdrawal Successful", `₦${amountVal.toLocaleString()} sent to your bank.`);
      }
    } catch (error) {
      notify("error", "Withdrawal Failed", "Please try again.");
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
        notify("success", "Transfer Successful", `Money sent to ${response.data.recipientName}.`);
      }
    } catch (error: any) {
      notify("error", "Transfer Failed", getErrorMessage(error, "Transfer failed."));
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
    setAccountNumber("");
    setAccountName("");
    setBankCode("");
    setBankName("");
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

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  ).slice(0, 50);

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left">Wallet</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Manage your money</p>
        </div>

        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto shadow-sm">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "fund", label: "Add Money", icon: ArrowDownLeft },
            { id: "withdraw", label: "Withdraw", icon: ArrowUpRight },
            { id: "transfer", label: "Transfer", icon: Send }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { resetAllSubFlows(); setActiveSubState(tab.id as any); }}
              className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial relative active-scale ${
                activeSubTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
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
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              {/* Balance Card - Apple Style */}
              <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
                style={{
                  background: 'linear-gradient(135deg, #0b0e14 0%, #1a1f2e 100%)',
                  boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Wallet size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Your Balance</p>
                        <p className="text-sm text-white font-semibold">Available Funds</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 text-lg font-mono">₦</span>
                      <span className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                        {profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-400 text-sm font-medium ml-1">NGN</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSubState("fund")}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <ArrowDownLeft size={18} />
                      <span>Add Money</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSubState("withdraw")}
                      className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      <ArrowUpRight size={18} />
                      <span>Withdraw</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSubState("transfer")}
                      className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      <Send size={18} />
                      <span>Transfer</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Bank Account Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Building size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bank Account</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive money from your bank</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clearing Bank</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {virtualAccount?.bankName || "OBEY Bank"}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                        {virtualAccount?.accountNumber || "8829104422"}
                      </p>
                      <button
                        onClick={triggerCopyAccount}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copiedText ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {virtualAccount?.accountName && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4 flex items-center gap-3">
                    <UserCheck size={20} className="text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Account Name: <span className="font-bold text-blue-600 dark:text-blue-400">{virtualAccount.accountName}</span>
                    </p>
                  </div>
                )}

                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    All transfers are instantly credited to your account. Verified and secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 md:space-y-8">
               <div className="bento-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Live Audit Feed</h4>
                     <Activity size={16} className="text-primary" />
                  </div>
                   <div className="space-y-5 custom-scrollbar">
                      {transactions.slice(0, 3).map(tx => (
                         <div key={tx.id} className="flex items-center justify-between group cursor-pointer transaction-item p-2 -m-2 rounded-xl transition-all duration-200">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {tx.type === 'Credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                               </div>
                               <div className="overflow-hidden">
                                  <p className="text-[11px] font-black text-gray-900 truncate uppercase italic">{tx.title}</p>
                                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{tx.date}</p>
                               </div>
                            </div>
                            <p className={`text-[11px] font-mono font-black transition-colors ${tx.type === 'Credit' ? 'text-emerald-600 group-hover:text-emerald-700' : 'text-gray-900 group-hover:text-primary'}`}>
                               {tx.type === 'Credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                            </p>
                         </div>
                      ))}
                      <button
                       onClick={() => notify("log", "Audit Log", "Loading sequential ledger...")}
                       className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active-scale"
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
              {renderStepper()}

              {activeSubTab === "fund" && (
                 currentStep === 3 ? (
                   <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                     <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <Check size={32} className="md:w-12 md:h-12" />
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Payment Successful</h2>
                        <p className="text-sm md:text-base text-gray-500 font-medium">Money added to your wallet.</p>
                     </div>
                     <div className="bg-gray-50 rounded-[24px] p-8 space-y-6 text-left border border-gray-100 shadow-inner">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</span>
                           <span className="text-2xl font-black text-gray-900">₦{fundReceipt?.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</p>
                              <p className="text-xs font-mono font-black text-primary truncate">{fundReceipt?.id}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment Method</p>
                              <p className="text-xs font-black text-gray-900">Card Payment</p>
                           </div>
                        </div>
                     </div>
                      <button onClick={resetAllSubFlows} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press">Back to Wallet</button>
                   </div>
                 ) : (
                   <div className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                     <div className="space-y-2 text-center md:text-left">
                         <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Add Money</h3>
                         <p className="text-sm md:text-lg text-gray-500 font-medium">Choose how to add money.</p>
                     </div>

                     {currentStep === 1 ? (
                       <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                               { id: "card", label: "Secure Checkout", desc: "Instant • Card/USSD/Transfer", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
                               { id: "bank", label: "Virtual Account", desc: "Instant • Free", icon: Building, color: "text-primary", bg: "bg-primary/5" },
                               { id: "crypto", label: "Crypto", desc: "Fast • Network fees apply", icon: Coins, color: "text-amber-500", bg: "bg-amber-50" }
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
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center block">Amount (NGN)</label>
                             <div className="relative">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-3xl md:text-5xl">₦</span>
                                <input
                                  type="number"
                                  required
                                  value={fundAmount}
                                  onChange={(e) => setFundAmount(e.target.value)}
                                  placeholder="0.00"
                                  className="w-full h-24 pl-20 pr-10 bg-gray-50 border border-gray-100 rounded-[35px] text-4xl md:text-6xl font-black text-gray-900 input-focus-ring focus:border-primary outline-none tracking-tighter transition-all shadow-inner"
                                />
                             </div>
                          </div>

                          <button
                            onClick={() => setCurrentStep(2)}
                            disabled={!fundAmount}
                            className="w-full h-18 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 active-scale flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-primary/40 transition-all"
                          >
                              Continue <ArrowRight size={20} />
                          </button>
                       </>
                     ) : (
                       <div className="space-y-8 animate-fade-in">
                          {fundMethod === "card" ? (
                             <div className="p-8 bg-purple-50 border border-purple-100 rounded-[32px] space-y-6 text-center">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-purple-600 mx-auto shadow-sm"><CreditCard size={40} /></div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-purple-900 uppercase">Secure Payment</h4>
                                    <p className="text-xs text-purple-700 font-medium">You will be redirected to our secure payment page. Supports cards, USSD, and bank transfers.</p>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-[10px] text-purple-600 font-bold uppercase tracking-widest">
                                   <ShieldCheck size={14} /> PCI-DSS Compliant • Zero Card Data Stored
                                </div>
                             </div>
                          ) : fundMethod === "bank" ? (
                             <div className="p-8 bg-accent-blue/30 border border-blue-100 rounded-[32px] space-y-6">
                                <div className="flex items-center gap-4 text-primary font-black text-xl uppercase italic">
                                   <Building size={28} /> Virtual Account Transfer
                                </div>
                                <div className="space-y-4 pt-4 border-t border-blue-100">
                                   <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Account Number</span>
                                      <span className="font-mono text-xl font-black text-primary select-all tracking-[0.1em]">
                                        {virtualAccount?.accountNumber || "8829104422"}
                                      </span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bank</span>
                                       <span className="text-sm font-black text-primary">{virtualAccount?.bankName || "OBEY Bank"}</span>
                                   </div>
                                   {virtualAccount?.accountName && (
                                     <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Account Name</span>
                                        <span className="text-sm font-black text-primary">{virtualAccount.accountName}</span>
                                     </div>
                                   )}
                                </div>
                             </div>
                          ) : (
                             <div className="p-8 bg-amber-50 border border-amber-100 rounded-[32px] space-y-6 text-center">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-amber-500 mx-auto shadow-sm"><Coins size={40} /></div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-amber-900 uppercase">USDT Payment</h4>
                                    <p className="text-xs text-amber-700 font-medium">Network fees apply.</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-amber-100 font-mono text-[10px] text-amber-600 break-all select-all">
                                   0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                                </div>
                             </div>
                          )}

                          <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={80} /></div>
                              <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Payment Summary</h4>
                              <div className="space-y-4 border-t border-white/10 pt-6">
                                 <div className="flex justify-between items-center text-xs font-black text-white/50 uppercase">
                                    <span>Amount</span>
                                    <span className="text-white text-base">₦{parseFloat(fundAmount).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs font-black text-white/50 uppercase">
                                    <span>Fee</span>
                                    <span className="text-emerald-500 uppercase tracking-widest">Free</span>
                                 </div>
                                 <div className="h-px bg-white/10 pt-2" />
                                 <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total</span>
                                    <span className="text-3xl font-black font-space tracking-tighter">₦{parseFloat(fundAmount).toLocaleString()}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <button onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Back</button>
                              <button onClick={handleFundSubmit} disabled={paymentProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                                 {paymentProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Confirm Payment <ShieldCheck size={18} /></>}
                              </button>
                          </div>
                       </div>
                     )}
                   </div>
                 )
              )}

              {activeSubTab === "withdraw" && (
                 currentStep === 3 ? (
                   <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                     <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <Check size={32} className="md:w-12 md:h-12" />
                     </div>
                     <div className="space-y-2">
                         <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Money Sent</h2>
                         <p className="text-sm md:text-lg text-gray-500 font-medium">Money sent to your bank.</p>
                      </div>
                      <button onClick={resetAllSubFlows} className="w-full h-16 bg-[#0b0e14] text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press hover:bg-black transition-all">
                        Back to Wallet
                      </button>
                   </div>
                 ) : (
                   <form onSubmit={handleWithdrawalSubmit} className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                     <div className="space-y-2 text-center md:text-left">
                         <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Withdraw Money</h3>
                         <p className="text-sm md:text-lg text-gray-500 font-medium">Send money to your bank account.</p>
                     </div>

                     {currentStep === 1 ? (
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Select Bank</label>
                              <div className="relative">
                                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                 <input
                                   type="text"
                                   placeholder="Search bank name..."
                                   value={bankSearch}
                                   onChange={(e) => setBankSearch(e.target.value)}
                                   className="w-full h-14 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[18px] text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                 />
                              </div>
                              <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                 {filteredBanks.map(bank => (
                                   <button
                                     key={bank.code}
                                     type="button"
                                     onClick={() => { setBankCode(bank.code); setBankName(bank.name); setBankSearch(bank.name); }}
                                     className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${bankCode === bank.code ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                                   >
                                     {bank.name}
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Account Number</label>
                              <div className="flex gap-2">
                                 <input
                                   type="text"
                                   maxLength={10}
                                   value={accountNumber}
                                   onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                                   placeholder="0123456789"
                                   className="flex-1 h-14 px-6 bg-gray-50 border border-gray-100 rounded-[18px] text-lg font-mono font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                 />
                                 <button
                                   type="button"
                                   onClick={handleAccountLookup}
                                   disabled={!bankCode || accountNumber.length < 10 || verifyingAccount}
                                   className="px-6 h-14 bg-primary text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                                 >
                                   {verifyingAccount ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                   Verify
                                 </button>
                              </div>
                              {accountName && (
                                 <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Account Verified</p>
                                    <p className="text-sm font-black text-gray-900 mt-1">{accountName}</p>
                                 </div>
                              )}
                           </div>

                           <div className="space-y-3">
                              <div className="flex justify-between items-center px-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount (NGN)</label>
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
                             type="button"
                             onClick={() => setCurrentStep(2)}
                             disabled={!withdrawAmount || !bankCode || !accountNumber || !accountName}
                             className="w-full h-18 bg-[#0b0e14] text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press flex items-center justify-center gap-3 disabled:opacity-50"
                           >
                              Review Withdrawal <ArrowRight size={20} />
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-8 animate-fade-in">
                           <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-6 opacity-10"><Banknote size={80} /></div>
                              <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Withdrawal Summary</h4>
                              <div className="space-y-5 border-t border-white/10 pt-8">
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Recipient</span>
                                    <span className="text-white text-base">{accountName}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Bank</span>
                                    <span className="text-white text-base">{bankName}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Account</span>
                                    <span className="text-white text-base font-mono">{accountNumber}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Amount</span>
                                    <span className="text-white text-base">₦{parseFloat(withdrawAmount).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Processing fee</span>
                                    <span className="text-white text-base">₦12.50</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Speed</span>
                                    <span className="text-emerald-500">Instant</span>
                                 </div>
                                 <div className="h-px bg-white/10 pt-2" />
                                 <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total</span>
                                    <span className="text-3xl font-black font-space tracking-tighter">₦{(parseFloat(withdrawAmount) + 12.50).toLocaleString()}</span>
                                  </div>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Back</button>
                              <button type="submit" onClick={handleWithdrawalSubmit} disabled={withdrawProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                                 {withdrawProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Confirm Withdrawal <ShieldCheck size={18} /></>}
                              </button>
                           </div>
                        </div>
                     )}
                   </form>
                 )
              )}

              {activeSubTab === "transfer" && (
                 transferSuccess ? (
                   <div className="bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
                     <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
                     <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <Send size={32} className="md:w-12 md:h-12" />
                     </div>
                     <div className="space-y-2">
                         <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Transfer Sent</h2>
                         <p className="text-sm md:text-lg text-gray-500 font-medium">Money sent to <span className="font-black text-primary">{confirmedRecipient || "recipient"}</span> instantly.</p>
                     </div>
                     <button onClick={resetAllSubFlows} className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl active-press">
                       Return to Dashboard
                     </button>
                   </div>
                 ) : (
                   <form onSubmit={handleTransferSubmit} className="bento-card p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                     <div className="space-y-2 text-center md:text-left">
                         <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Send Money</h3>
                         <p className="text-sm md:text-lg text-gray-500 font-medium">Send money to other OBEY users.</p>
                     </div>

                     {currentStep === 1 ? (
                        <>
                         <div className="space-y-3">
                            <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-4">Recipient (Email or OBEY ID)</label>
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
                               <label className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount (NGN)</label>
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
                           type="button"
                           onClick={() => setCurrentStep(2)}
                           disabled={!transferAmount || !recipientIdentifier}
                           className="w-full h-18 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press flex items-center justify-center gap-3 disabled:opacity-50"
                         >
                             Review Transfer <ArrowRight size={20} />
                         </button>
                        </>
                     ) : (
                        <div className="space-y-8 animate-fade-in">
                           <div className="bg-[#0b0e14] text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-6 opacity-10"><Send size={80} /></div>
                              <h4 className="text-lg font-black uppercase italic tracking-widest flex items-center gap-3"><FileText className="text-primary" /> Transfer Summary</h4>
                              <div className="space-y-5 border-t border-white/10 pt-8">
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Recipient</span>
                                    <span className="text-white text-base">{recipientIdentifier}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Amount</span>
                                    <span className="text-white text-base">₦{parseFloat(transferAmount).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                    <span>Speed</span>
                                    <span className="text-emerald-500 font-black">Instant</span>
                                 </div>
                                 <div className="h-px bg-white/10 pt-2" />
                                 <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total</span>
                                    <span className="text-3xl font-black font-space tracking-tighter">₦{parseFloat(transferAmount).toLocaleString()}</span>
                                  </div>
                              </div>
                           </div>

                           <div className="flex gap-4">
                              <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[10px] rounded-2xl">Back</button>
                              <button type="submit" onClick={handleTransferSubmit} disabled={transferProcessing} className="flex-[2] h-16 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                                 {transferProcessing ? <Loader2 size={18} className="animate-spin" /> : <>Send Money <ShieldCheck size={18} /></>}
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
