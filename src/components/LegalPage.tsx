import React from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  onBack: () => void;
}

export default function LegalPage({ title, lastUpdated, children, onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#0b0e14] selection:bg-primary/10 selection:text-primary pb-20 font-inter">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center">
        <div className="max-w-[1000px] mx-auto px-6 w-full flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-[#0b0e14]/60 hover:text-[#0b0e14] transition-all group"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Console
          </button>
          <span className="text-xl font-black tracking-tighter font-space uppercase">OBEY</span>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Compliance Protocol</p>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">{title}</h1>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest pt-4">Last Modified: {lastUpdated}</p>
          </div>

          <div className="prose prose-zinc prose-invert max-w-none">
             <div className="space-y-12 text-lg text-gray-500 font-medium leading-relaxed">
                {children}
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
