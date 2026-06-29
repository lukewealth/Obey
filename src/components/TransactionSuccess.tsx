import React, { useEffect } from "react";
import { Download, Share2, X, Activity, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface TransactionSuccessProps {
  amount: string | number;
  type: string;
  id: string;
  onClose: () => void;
}

export default function TransactionSuccess({ amount, type, id, onClose }: TransactionSuccessProps) {
  const formattedAmount = typeof amount === 'number' ? `₦${amount.toLocaleString()}` : amount;

  // Auto-close after 5 seconds to transition to history
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col overflow-y-auto"
    >
      <header className="h-16 md:h-20 px-6 md:px-8 flex items-center justify-between max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2">
          <img src="/obey_logo.svg" alt="OBEY" className="w-8 h-8 md:w-9 md:h-9 rounded-xl shadow-sm" />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] uppercase italic">OBEY</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active-press">
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-2 shrink-0"
        >
          <DotLottieReact
            src="https://lottie.host/0414325b-916f-4152-8885-0f8e46d384e0/YdBGp1N4qJ.lottie"
            loop={false}
            autoplay
          />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2 mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
             <Activity size={12} className="text-emerald-500 animate-pulse" />
             <p className="text-[9px] md:text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Protocol Settled</p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">{formattedAmount}</h1>
          <p className="text-base md:text-xl text-gray-400 font-bold uppercase tracking-widest">{type}</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md bg-white rounded-[35px] md:rounded-[45px] p-8 md:p-10 border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] space-y-6 md:space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><ShieldCheck size={80} /></div>
          
          <div className="space-y-4 md:space-y-6 relative z-10">
            <div className="flex justify-between items-center gap-4">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Node Reference</span>
              <span className="text-xs md:text-sm font-bold text-gray-900 font-mono truncate select-all">{id}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center gap-4">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Timestamp</span>
              <span className="text-xs md:text-sm font-bold text-gray-900 truncate">{new Date().toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Network Fee</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm">SUB-ZERO</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4 relative z-10">
            <button className="h-14 md:h-16 bg-[#0b0e14] text-white rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-2xl active-press transition-all hover:bg-black">
              <Download size={16} className="md:w-4.5 md:h-4.5" /> Receipt
            </button>
            <button className="h-14 md:h-16 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-50 active-press transition-all">
              <Share2 size={16} className="md:w-4.5 md:h-4.5" /> Share
            </button>
          </div>
        </motion.div>

        <button onClick={onClose} className="mt-10 md:mt-12 text-[11px] md:text-sm font-black text-primary uppercase tracking-[0.3em] hover:underline underline-offset-8 active-press">
          Return to Console
        </button>
      </main>
    </motion.div>
  );
}
