import React, { useState } from "react";
import { UserProfile, Transaction } from "../types";
import { Copy, Check, DollarSign, ArrowDownLeft, ArrowUpRight, Send, HelpCircle, Shield, Download, Share2, RefreshCw } from "lucide-react";

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
  const [cardNo, setCardNo] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentProcessing, setPaymentStatus] = useState(false);
  const [fundReceipt, setFundReceipt] = useState<Transaction | null>(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [routingNo, setRoutingNo] = useState("");
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
      
      // Call parent balance updater
      const desc = fundMethod === "bank" ? "Virtual Vault Funding" : "Credit Card Top-Up";
      onFundWallet(amountVal, desc);

      // Create internal receipt
      const now = new Date();
      const mockTx: Transaction = {
        id: `OBY-${Math.floor(Math.random() * 899999) + 100000}X`,
        title: "Wallet Funding",
        category: "Transfer",
        type: "Credit",
        amount: amountVal,
        fee: 0,
        date: now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        time: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        status: "Success"
      };

      setFundReceipt(mockTx);
      setFundAmount("");
      setCardNo("");
      setCardExpiry("");
      setCardCvv("");
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
      if (isSuccess) {
        setWithdrawSuccess(true);
        setWithdrawAmount("");
        setBankName("");
        setAccountNo("");
        setRoutingNo("");
      }
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
      if (isSuccess) {
        setTransferSuccess(true);
        setTransferAmount("");
        setRecipientEmail("");
      }
    }, 1500);
  };

  const resetAllSubFlows = () => {
    setFundReceipt(null);
    setWithdrawSuccess(false);
    setTransferSuccess(false);
    setActiveSubState("overview");
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex bg-[#161F30] border border-[#242F41] p-1 rounded-2xl w-fit">
        <button
          onClick={() => { resetAllSubFlows(); setActiveSubState("overview"); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "overview" ? "bg-[#0057FF] text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Wallet Balance
        </button>
        <button
          onClick={() => { resetAllSubFlows(); setActiveSubState("fund"); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "fund" ? "bg-[#0057FF] text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Fund Wallet
        </button>
        <button
          onClick={() => { resetAllSubFlows(); setActiveSubState("withdraw"); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "withdraw" ? "bg-[#0057FF] text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Withdrawal
        </button>
        <button
          onClick={() => { resetAllSubFlows(); setActiveSubState("transfer"); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === "transfer" ? "bg-[#0057FF] text-white shadow-lg" : "text-slate-400 hover:text-white"
          }`}
        >
          Transfer cash
        </button>
      </div>

      {/* RENDER ACTIVE SUB FLOW */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Stats */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-8 relative overflow-hidden flex flex-col min-h-[220px] justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Capital Base</p>
                <p className="text-4xl sm:text-5xl font-mono font-bold text-white shrink-0 pt-0.5">
                  ${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveSubState("fund")}
                  className="flex-1 bg-[#0057FF] hover:bg-blue-600 text-white rounded-xl py-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active-press"
                >
                  <ArrowDownLeft size={16} /> Fund
                </button>
                <button
                  onClick={() => setActiveSubState("withdraw")}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-[#242F41] text-white rounded-xl py-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active-press"
                >
                  <ArrowUpRight size={16} /> Withdraw
                </button>
              </div>
            </div>

            {/* Virtual clearing account display */}
            <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white leading-tight">Virtual Clearing Account</h3>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-[#12B76A] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Operational
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Bank Name</p>
                  <p className="text-sm font-bold text-white">OBEY Global Clearing Bank</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Clearing ID</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm tracking-widest font-semibold text-white">8829 1044 22</p>
                    <button 
                      onClick={triggerCopyAccount}
                      className="text-[#0057FF] hover:text-blue-400 p-2 hover:bg-white/5 rounded-lg active-press shrink-0"
                    >
                      {copiedText ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic max-w-sm">
                Deposits routed to this virtual clearing address settle instantly and credit your primary balance profile.
              </p>
            </div>
          </div>

          {/* Allocation column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 space-y-6">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Capital Allocations</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Fiat Reserves</span>
                    <span className="font-mono">65%</span>
                  </div>
                  <div className="w-full bg-[#0B1220] rounded-full h-1.5">
                    <div className="bg-[#0057FF] h-1.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Cryptocurrency desk</span>
                    <span className="font-mono">35%</span>
                  </div>
                  <div className="w-full bg-[#0B1220] rounded-full h-1.5">
                    <div className="bg-[#00C6FF] h-1.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-5 flex items-start gap-4">
              <Shield className="text-[#00C6FF] shrink-0" size={24} />
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Signature Lock</h5>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed mt-1">
                  100% of capital assets are backed by full reserve values and protected under institutional multisig safety standards.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* FUNDING FORM FLOW */}
      {activeSubTab === "fund" && (
        <div className="max-w-xl mx-auto">
          {fundReceipt ? (
            /* Successful Funding Receipt Page */
            <div className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-8 flex flex-col text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
                  <Check size={32} />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#12B76A]">Transaction Successful</p>
                <h2 className="text-3xl font-mono font-bold text-white mt-2">${fundReceipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                <p className="text-xs text-slate-400 font-light mt-1">{fundReceipt.title}</p>
              </div>

              {/* Receipt invoice specifications */}
              <div className="space-y-4 bg-[#0B1220] border border-[#242F41] p-5 rounded-2xl text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-white font-bold select-all">{fundReceipt.id}</span>
                </div>
                <div className="border-t border-[#242F41]"></div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Date</span>
                  <span className="text-white font-semibold">{fundReceipt.date} • {fundReceipt.time}</span>
                </div>
                <div className="border-t border-[#242F41]"></div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Fee status</span>
                  <span className="bg-emerald-500/15 text-[#12B76A] px-2 py-0.5 rounded font-black text-[10px] uppercase">Free</span>
                </div>
                <div className="border-t border-[#242F41]"></div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Ledger status</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 bg-[#12B76A] rounded-full animate-ping"></span>
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full h-12 bg-[#0057FF] hover:bg-blue-600 active-press rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                  <Download size={14} /> Download PDF Invoice
                </button>
                <button onClick={resetAllSubFlows} className="w-full text-xs text-slate-400 hover:text-white font-bold mt-2 hover:underline">
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Funding checkout selections module */
            <div className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-base font-black text-white">Fund Cash Capital</h3>
              <p className="text-xs text-slate-400 font-medium">Select your preferred funding source to credit your wallet instantly.</p>

              <div className="grid grid-cols-2 gap-3 p-1 bg-[#0B1220] rounded-2xl border border-[#242F41]">
                <button
                  type="button"
                  onClick={() => setFundMethod("bank")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    fundMethod === "bank" ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setFundMethod("card")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    fundMethod === "card" ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Credit Card
                </button>
              </div>

              {fundMethod === "bank" ? (
                <div className="space-y-6">
                  {/* Bank Details Visual display */}
                  <div className="bg-[#0B1220] border border-[#242F41] p-5 rounded-2xl space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Initiate a bank transfer referencing your custom clearing numbers below. Funds credit instantly upon bank clearance.
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 uppercase tracking-widest font-black text-[9px]">Receipt bank</span>
                        <span className="text-white font-bold">OBEY Global Clearing Bank</span>
                      </div>
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400 uppercase tracking-widest font-black text-[9px]">Clearing Account</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono font-semibold">8829104422</span>
                          <button onClick={triggerCopyAccount} className="text-[#0057FF] p-1.5 rounded bg-white/5 hover:bg-white/10 active-press shrink-0">
                            {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleFundSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold">Simulated Transfer Amount ($)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                          <DollarSign size={16} />
                        </span>
                        <input
                          type="number"
                          required
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          placeholder="25000.00"
                          className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={paymentProcessing}
                      className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg shadow-blue-500/10"
                    >
                      {paymentProcessing ? <RefreshCw className="animate-spin mr-2" size={14} /> : "Simulate Payout Received"}
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleFundSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-mono outline-none text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-mono outline-none text-white text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold">CVV Sec-Code</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-mono outline-none text-white text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-xs text-slate-400 font-semibold">Top-up Value ($)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <DollarSign size={16} />
                      </span>
                      <input
                        type="number"
                        required
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="500.00"
                        className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg"
                  >
                    {paymentProcessing ? <RefreshCw className="animate-spin mr-2" size={14} /> : "Authorize Settlement Checkout"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* WITHDRAWAL FLOW */}
      {activeSubTab === "withdraw" && (
        <div className="max-w-xl mx-auto">
          {withdrawSuccess ? (
            <div className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-6 flex flex-col text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-2 animate-bounce">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-black text-white">Cashout Initiated</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your wallet reserves withdrawal payout has been successfully queued. Settles instantly to clearing credentials.
              </p>
              <button onClick={resetAllSubFlows} className="w-full bg-[#0057FF] hover:bg-blue-600 py-4 font-bold text-xs uppercase tracking-wider text-white rounded-xl active-press mt-4">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleWithdrawalSubmit} className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="text-base font-black text-white">Withdrawal Cashout</h3>
              <p className="text-xs text-slate-400 font-medium">Withdraw fiat assets back to your verified outer bank clearing profiles.</p>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Chase Bank, Citibank, JP Morgan"
                  className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    placeholder="9923847291"
                    className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white font-mono text-center outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Routing Number</label>
                  <input
                    type="text"
                    required
                    value={routingNo}
                    onChange={(e) => setRoutingNo(e.target.value)}
                    placeholder="012489248"
                    className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white font-mono text-center outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-400 font-semibold">Withdrawal Amount ($)</label>
                  <span className="text-slate-400 font-mono">Available: ${profile.balance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <DollarSign size={16} />
                  </span>
                  <input
                    type="number"
                    required
                    max={profile.balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="100.00"
                    className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={withdrawProcessing || !withdrawAmount || parseFloat(withdrawAmount) > profile.balance}
                className="w-full h-14 bg-red-500 hover:bg-red-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg shadow-red-500/10 disabled:opacity-50"
              >
                {withdrawProcessing ? <RefreshCw className="animate-spin mr-2" size={14} /> : "Initiate Cashout Wire"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TRANSFER FLOW */}
      {activeSubTab === "transfer" && (
        <div className="max-w-xl mx-auto">
          {transferSuccess ? (
            <div className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-6 flex flex-col text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-2 animate-bounce">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-black text-white">Funds Dispatched</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your OBEY peer transaction ledger processed correctly. Settle times are complete.
              </p>
              <button onClick={resetAllSubFlows} className="w-full bg-[#0057FF] hover:bg-blue-600 py-4 font-bold text-xs uppercase tracking-wider text-white rounded-xl active-press mt-4">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransferSubmit} className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="text-base font-black text-white">Peer Wallet Transfer</h3>
              <p className="text-xs text-slate-400 font-medium">Transfer instant liquidity to any registered OBEY ledger email address. Free of cost.</p>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@obey.finance"
                  className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-400 font-semibold">Transfer value ($)</label>
                  <span className="text-slate-400 font-mono">Available: ${profile.balance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <DollarSign size={16} />
                  </span>
                  <input
                    type="number"
                    required
                    max={profile.balance}
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="100.00"
                    className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={transferProcessing || !transferAmount || parseFloat(transferAmount) > profile.balance}
                className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg shadow-blue-500/10 disabled:opacity-50"
              >
                {transferProcessing ? <RefreshCw className="animate-spin mr-2" size={14} /> : "Dispatch Funds Instantly"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
