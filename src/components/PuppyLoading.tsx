import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from "../services/api";

export default function PuppyLoading() {
  const [livePrices, setLivePrices] = useState<any>(null);

  useEffect(() => {
    const fetchLiveContext = async () => {
      try {
        const res = await api.get('/market/prices?symbols=BTC,ETH,SOL,SUI');
        if (res.data) setLivePrices(res.data);
      } catch (err) {
        console.warn("[LOADER_SYNC] Failed to fetch real-time context nodes.");
      }
    };
    fetchLiveContext();
    const interval = setInterval(fetchLiveContext, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-24 overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
      <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center">
        
        {/* Institutional Ambient Glow */}
        <div className="absolute inset-0 bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />

        {/* --- Lottie Animation --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <DotLottieReact
            src="https://lottie.host/04486930-15fb-48bd-bc7e-261c7765c50b/lnr6pi3iR4.lottie"
            loop
            autoplay
          />
        </motion.div>

        {/* Institutional Particle Mesh (Slow & Graceful) */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -250],
              x: Math.cos(i) * 150,
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.5, ease: "circOut" }}
            className="absolute left-1/2 bottom-1/4 w-1 h-1 bg-blue-600 rounded-full blur-[1px] opacity-20"
          />
        ))}
      </div>

      {/* Institutional Progress Mesh */}
      <div className="text-center space-y-12 relative max-w-sm">
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.0, repeat: Infinity }}
          >
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic">
              Mesh <span className="text-blue-600">Sync...</span>
            </h3>
          </motion.div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.9em] animate-pulse">Institutional alignment in progress</p>
        </div>

        {/* Live Context UI */}
        <div className="bg-white/90 backdrop-blur-3xl rounded-[60px] p-12 border border-white/80 shadow-[0_40px_80px_rgba(0,0,0,0.06)] space-y-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-pulse" />
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] text-center flex items-center justify-center gap-3">
              <Sparkles size={18} className="text-blue-500" /> Real-Time Asset Node Mesh
           </p>
           <div className="grid grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                 {livePrices ? (
                   <>
                    {[
                      { sym: 'BTC', price: livePrices.BTC, color: 'text-orange-600', bg: 'bg-orange-50/70' },
                      { sym: 'ETH', price: livePrices.ETH, color: 'text-blue-600', bg: 'bg-blue-50/70' },
                      { sym: 'SOL', price: livePrices.SOL, color: 'text-purple-600', bg: 'bg-purple-50/70' },
                      { sym: 'SUI', price: livePrices.SUI, color: 'text-cyan-600', bg: 'bg-cyan-50/70' }
                    ].map((p) => (
                      <motion.div 
                        key={p.sym}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col items-center justify-center p-6 ${p.bg} rounded-[40px] border border-white/50 shadow-sm hover:shadow-md transition-all duration-700`}
                      >
                        <span className={`text-[11px] font-black ${p.color} uppercase mb-2 tracking-widest`}>{p.sym}</span>
                        <span className="text-[15px] font-mono font-black text-slate-900">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </motion.div>
                    ))}
                   </>
                 ) : (
                   <div className="col-span-2 flex flex-col items-center justify-center py-12 space-y-6">
                      <div className="w-14 h-14 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin shadow-lg" />
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">Establishing Secure Tunnel</p>
                   </div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Institutional Progress Bar */}
        <div className="flex flex-col items-center gap-8">
           <div className="w-80 h-4 bg-slate-100/50 rounded-full overflow-hidden relative shadow-inner border border-white">
              <motion.div 
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 4.0, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-400/20 via-blue-500/60 to-blue-400/20 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
              />
           </div>
           <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em]">Verification Status: Optimal</p>
        </div>
      </div>
    </div>
  );
}
