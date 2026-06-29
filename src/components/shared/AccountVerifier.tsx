import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import api, { lookupBankAccount } from '../services/api';

interface Bank {
  name: string;
  code: string;
}

interface AccountVerifierProps {
  bank: Bank | null;
  accountNumber: string;
  onVerificationSuccess: (accountName: string) => void;
  disabled?: boolean;
}

export default function AccountVerifier({
  bank,
  accountNumber,
  onVerificationSuccess,
  disabled = false
}: AccountVerifierProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!bank || accountNumber.length !== 10) {
      setError('Please enter a valid 10-digit account number');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerifiedName(null);

    try {
      const result = await lookupBankAccount(accountNumber, bank.code);
      if (result.accountName) {
        setVerifiedName(result.accountName);
        onVerificationSuccess(result.accountName);
      } else {
        setError('Account not found. Please check the details.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!bank) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleVerify}
        disabled={disabled || isVerifying || accountNumber.length !== 10}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
          disabled || isVerifying || accountNumber.length !== 10
            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        }`}
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying...
          </>
        ) : verifiedName ? (
          <>
            <Check className="w-4 h-4" />
            Verified: {verifiedName}
          </>
        ) : (
          'Verify Account'
        )}
      </button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl"
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {verifiedName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl"
        >
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Account verified: <span className="font-semibold">{verifiedName}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
