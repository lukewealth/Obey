import React from "react";
import { CheckCircle2, Download, Share2, X, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionSuccessProps {
  amount: string | number;
  type: string;
  id: string;
  onClose: () => void;
}

export default function TransactionSuccess({ amount, type, id, onClose }: TransactionSuccessProps) {
  const formattedAmount = typeof amount === 'number' ? `₦${amount.toLocaleString()}` : amount;

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-3xl flex flex-col overflow-y-auto">
      <header className="h-16 md:h-20 px-6 md:px-8 flex items-center justify-between max-w-7xl mx-auto w-full shrink-0">
        <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] uppercase italic">OBEY</span>
        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active-press">
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 md:w-28 md:h-24 bg-emerald-50 text-emerald-500 rounded-[30px] md:rounded-[40px] flex items-center justify-center mb-6 md:mb-10 shadow-2xl shadow-emerald-500/10 shrink-0"
        >
          <CheckCircle2 size={48} className="md:w-16 md:h-16" />
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
    </div>
  );
}
