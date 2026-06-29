import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Download, Share2 } from 'lucide-react';

interface TransactionReceiptProps {
  type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'sale';
  amount: number;
  recipient?: string;
  reference: string;
  timestamp?: string;
  onClose?: () => void;
}

export default function TransactionReceipt({
  type,
  amount,
  recipient,
  reference,
  timestamp,
  onClose
}: TransactionReceiptProps) {
  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amt);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'transfer': return 'Transfer';
      case 'purchase': return 'Purchase';
      case 'sale': return 'Sale';
      default: return 'Transaction';
    }
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
  };

  const handleDownload = () => {
    const receiptData = {
      type: getTypeLabel(),
      amount: formatAmount(amount),
      recipient,
      reference,
      timestamp: timestamp || new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${reference}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${getTypeLabel()} Receipt`,
          text: `${getTypeLabel()} of ${formatAmount(amount)}${recipient ? ` to ${recipient}` : ''}\nReference: ${reference}`
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/10"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getTypeLabel()} Successful
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatAmount(amount)}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {recipient && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/10">
            <span className="text-sm text-gray-500 dark:text-gray-400">Recipient</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{recipient}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/10">
          <span className="text-sm text-gray-500 dark:text-gray-400">Reference</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-900 dark:text-white">{reference}</span>
            <button
              onClick={handleCopyReference}
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
              title="Copy reference"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        {timestamp && (
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Timestamp</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {new Date(timestamp).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Close
        </button>
      )}
    </motion.div>
  );
}
