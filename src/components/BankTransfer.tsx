import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, ArrowRight, ArrowLeftRight, Loader2, Check, Search,
  AlertCircle, Banknote, User, Hash, Shield, Clock, TrendingUp
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface BankTransferProps {
  profile: UserProfile;
  transactions: Transaction[];
  onTransferComplete: (amount: number, details: string) => Promise<boolean> | boolean;
}

interface Bank {
  code: string;
  name: string;
}

export default function BankTransfer({ profile, transactions, onTransferComplete }: BankTransferProps) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  
  // Send money state
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // Receive money state
  const [virtualAccount, setVirtualAccount] = useState<{
    accountNumber: string;
    accountName: string;
    bankName: string;
  } | null>(null);
  const [loadingVirtualAccount, setLoadingVirtualAccount] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBanks();
    fetchVirtualAccount();
  }, [profile.id]);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await api.get('/nomba/banks');
      if (response.data?.banks) {
        setBanks(response.data.banks);
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      notify("error", "Network Error", "Could not load bank list. Please try again.");
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchVirtualAccount = async () => {
    try {
      setLoadingVirtualAccount(true);
      const response = await api.get('/nomba/virtual-accounts', {
        params: { userId: profile.id }
      });
      if (response.data?.accounts?.length > 0) {
        setVirtualAccount(response.data.accounts[0]);
      }
    } catch (error) {
      console.error('Failed to fetch virtual account:', error);
    } finally {
      setLoadingVirtualAccount(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (accountNumber.length !== 10 || !selectedBank) {
      notify("error", "Invalid Details", "Please enter a valid 10-digit account number and select a bank.");
      return;
    }

    setVerifyingAccount(true);
    try {
      const response = await api.post('/nomba/account-lookup', {
        accountNumber,
        bankCode: selectedBank.code
      });

      if (response.data?.success) {
        setAccountName(response.data.accountName);
        notify("success", "Account Verified", `Account name: ${response.data.accountName}`);
      } else {
        notify("error", "Verification Failed", "Could not verify account. Please check details.");
      }
    } catch (error) {
      console.error('Account verification failed:', error);
      notify("error", "Verification Error", "Failed to verify account. Please try again.");
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleTransfer = async () => {
    const amountVal = parseFloat(amount);
    if (!amountVal || amountVal <= 0) {
      notify("error", "Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (amountVal > profile.balance) {
      notify("error", "Insufficient Balance", "You don't have enough balance for this transfer.");
      return;
    }

    if (!accountName) {
      notify("error", "Account Not Verified", "Please verify the recipient account first.");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    const amountVal = parseFloat(amount);
    setProcessing(true);

    try {
      const response = await api.post('/nomba/withdraw', {
        userId: profile.id,
        amount: amountVal,
        accountNumber,
        bankCode: selectedBank!.code,
        accountName,
        narration: narration || 'Bank Transfer'
      });

      if (response.data?.success) {
        await onTransferComplete(amountVal, `Bank Transfer to ${accountName}`);
        setTransactionRef(response.data.transaction?.reference || `TXN-${Date.now()}`);
        setTransferSuccess(true);
        notify("success", "Transfer Initiated", "Your transfer is being processed.");
      } else {
        notify("error", "Transfer Failed", response.data?.error || "Could not complete transfer.");
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      notify("error", "Transfer Error", "Failed to complete transfer. Please try again.");
    } finally {
      setProcessing(false);
      setShowConfirmation(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify("success", "Copied", "Account number copied to clipboard.");
  };

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    bank.code.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const recentTransfers = transactions
    .filter(t => t.category === 'Transfer' && t.paymentMethod === 'bank_transfer')
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Bank Transfer
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Send and receive money via bank transfer
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab("send")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "send"
              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <ArrowLeftRight size={18} />
          Send Money
        </button>
        <button
          onClick={() => setActiveTab("receive")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "receive"
              ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Banknote size={18} />
          Receive Money
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "send" ? (
          <motion.div
            key="send"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {transferSuccess ? (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check size={40} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Transfer Initiated</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your transfer of ₦{parseFloat(amount).toLocaleString()} to {accountName} is being processed.
                </p>
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
                  <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{transactionRef}</p>
                </div>
                <button
                  onClick={() => {
                    setTransferSuccess(false);
                    setAccountNumber("");
                    setAccountName("");
                    setAmount("");
                    setNarration("");
                    setSelectedBank(null);
                  }}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  New Transfer
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/10 space-y-6">
                {/* Bank Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Select Bank
                  </label>
                  {loadingBanks ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          placeholder="Search banks..."
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                        {filteredBanks.map((bank) => (
                          <button
                            key={bank.code}
                            onClick={() => {
                              setSelectedBank(bank);
                              setAccountName("");
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                              selectedBank?.code === bank.code
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Building2 size={18} />
                              <span className="font-medium">{bank.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Account Number */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Account Number
                  </label>
                  <div className="relative">
                    <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit account number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                    />
                  </div>
                  {accountNumber.length === 10 && selectedBank && !accountName && (
                    <button
                      onClick={handleVerifyAccount}
                      disabled={verifyingAccount}
                      className="w-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {verifyingAccount ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield size={16} />
                          Verify Account
                        </>
                      )}
                    </button>
                  )}
                  {accountName && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                      <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        {accountName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount (NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Available: ₦{profile.balance.toLocaleString()}
                  </p>
                </div>

                {/* Narration */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Narration (Optional)
                  </label>
                  <input
                    type="text"
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Transfer Button */}
                <button
                  onClick={handleTransfer}
                  disabled={!selectedBank || accountNumber.length !== 10 || !amount || !accountName}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="receive"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {loadingVirtualAccount ? (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-12 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : virtualAccount ? (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/10 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Banknote size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Virtual Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share these details to receive money
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{virtualAccount.bankName}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                        {virtualAccount.accountNumber}
                      </p>
                      <button
                        onClick={() => handleCopy(virtualAccount.accountNumber)}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Name</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{virtualAccount.accountName}</p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-4 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Important</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Only NGN transfers to this account will be credited to your wallet. Other currencies or failed transfers will be returned to the sender.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/10 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <Banknote size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Virtual Account</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have a virtual account yet. Contact support to get one.
                </p>
              </div>
            )}

            {/* Recent Transfers */}
            {recentTransfers.length > 0 && (
              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transfers</h3>
                  <Clock size={18} className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  {recentTransfers.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <ArrowLeftRight size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{tx.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ₦{tx.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 space-y-6 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Confirm Transfer
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Recipient</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{accountName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bank</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedBank?.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/10">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Account</span>
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">{accountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                  <span className="text-xl font-bold text-primary">₦{parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={processing}
                  className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTransfer}
                  disabled={processing}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
