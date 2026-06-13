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
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-3xl flex flex-col">
      <header className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <span className="text-2xl font-black tracking-tighter text-primary">OBEY</span>
        <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
          <X size={24} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-inner"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2 mb-12"
        >
          <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Transaction Successful</p>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter">{amount}</h1>
          <p className="text-xl text-gray-500 font-medium">{type}</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[32px] p-10 border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-8"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</span>
              <span className="text-sm font-bold text-gray-900 font-mono">{id}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</span>
              <span className="text-sm font-bold text-gray-900">{new Date().toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Fee</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Free</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button className="h-16 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active-press transition-all">
              <Download size={18} /> Receipt
            </button>
            <button className="h-16 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 active-press transition-all">
              <Share2 size={18} /> Share
            </button>
          </div>
        </motion.div>

        <button onClick={onClose} className="mt-12 text-sm font-black text-primary uppercase tracking-[0.2em] hover:underline underline-offset-8">
          Return to Console
        </button>
      </main>
    </div>
  );
}
