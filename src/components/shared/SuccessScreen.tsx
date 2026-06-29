import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SuccessScreenProps {
  amount: number | string;
  type: string;
  onClose: () => void;
}

export default function SuccessScreen({ amount, type, onClose }: SuccessScreenProps) {
  const formattedAmount = typeof amount === 'string' 
    ? amount 
    : `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl flex flex-col overflow-y-auto"
    >
      <header className="h-16 md:h-20 px-6 md:px-8 flex items-center justify-between max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2">
          <img src="/obey_logo.png" alt="OBEY" className="w-8 h-8 md:w-9 md:h-9 rounded-xl shadow-sm" />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] dark:text-white uppercase italic">OBEY</span>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center mb-6 shrink-0"
        >
          <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-20 h-20 md:w-32 md:h-32 text-emerald-600 dark:text-emerald-400" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2 mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[9px] md:text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em]">Protocol Settled</p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            {formattedAmount}
          </h1>
          <p className="text-base md:text-xl text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
            {type}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <button
            onClick={onClose}
            className="w-full py-4 md:py-5 bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] rounded-2xl font-bold text-sm md:text-base hover:bg-[#0b0e14]/90 dark:hover:bg-white/90 transition-all"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
}
