import React from "react";
import { CheckCircle2, Download, Share2, X } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionSuccessProps {
  amount: string;
  type: string;
  id: string;
  onClose: () => void;
}

export default function TransactionSuccess({ amount, type, id, onClose }: TransactionSuccessProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-3xl flex flex-col overflow-y-auto">
      <header className="h-16 md:h-20 px-6 md:px-8 flex items-center justify-between max-w-7xl mx-auto w-full shrink-0">
        <span className="text-xl md:text-2xl font-black tracking-tighter text-primary">OBEY</span>
        <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 md:mb-10 shadow-inner shrink-0"
        >
          <CheckCircle2 size={40} className="md:w-12 md:h-12" />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2 mb-8 md:mb-12"
        >
          <p className="text-[9px] md:text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">Transaction Successful</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">{amount}</h1>
          <p className="text-base md:text-xl text-gray-500 font-medium">{type}</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[28px] md:rounded-[32px] p-6 md:p-10 border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-6 md:space-y-8"
        >
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center gap-4">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Node Reference</span>
              <span className="text-xs md:text-sm font-bold text-gray-900 font-mono truncate">{id}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center gap-4">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest shrink-0">Timestamp</span>
              <span className="text-xs md:text-sm font-bold text-gray-900 truncate">{new Date().toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Protocol Fee</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest">SUB-ZERO</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
            <button className="h-14 md:h-16 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-primary/20 active-press transition-all">
              <Download size={16} className="md:w-4.5 md:h-4.5" /> Receipt
            </button>
            <button className="h-14 md:h-16 bg-white border border-gray-100 text-gray-900 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-50 active-press transition-all">
              <Share2 size={16} className="md:w-4.5 md:h-4.5" /> Share
            </button>
          </div>
        </motion.div>

        <button onClick={onClose} className="mt-10 md:mt-12 text-[11px] md:text-sm font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-8">
          Return to Console
        </button>
      </main>
    </div>
  );
}
