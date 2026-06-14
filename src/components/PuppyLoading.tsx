import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
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

  // --- Ultra-Smooth & Slow Animation Variants ---
  const puppyVariants = {
    animate: {
      y: [0, -8, 0],
      scale: [1, 1.01, 1],
      transition: {
        duration: 3.0,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const tailVariants = {
    animate: {
      rotate: [-10, 10, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const earVariants = (isLeft: boolean) => ({
    animate: {
      rotate: isLeft ? [-8, 4, -8] : [8, -4, 8],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  });

  const blinkVariants = {
    animate: {
      scaleY: [1, 1, 0, 1, 1],
      transition: {
        duration: 5,
        repeat: Infinity,
        times: [0, 0.9, 0.93, 0.96, 1],
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-24 overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
      <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center">
        
        {/* Institutional Ambient Glow */}
        <div className="absolute inset-0 bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />

        {/* Dynamic Floor Shadow (Slow Bloom) */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.1, 0.15] }}
          transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 h-12 bg-slate-900/10 rounded-[100%] blur-3xl"
        />

        {/* --- Perfectly Joined SVG Dog Illustration (Standing Boy Dog) --- */}
        <motion.div 
          variants={puppyVariants}
          animate="animate"
          className="relative z-10 w-full h-full"
        >
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <defs>
              <linearGradient id="furGradientMain" x1="120" y1="40" x2="120" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBBD23" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="earGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <radialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Complete Illustration Mesh */}
            <g id="dog-illustration">
              {/* Tail Node (High Detail) */}
              <motion.g 
                variants={tailVariants} 
                animate="animate" 
                style={{ originX: "170px", originY: "130px" }}
              >
                <path d="M170 130C190 100 215 110 220 135C215 150 185 155 170 130Z" fill="#D97706" />
                <path d="M175 132C190 110 205 115 210 130C205 140 185 142 175 132Z" fill="#F59E0B" opacity="0.6" />
              </motion.g>

              {/* Back Legs (Far Side) */}
              <path d="M150 160C150 185 140 205 130 205H145C155 205 165 185 165 160V140H150V160Z" fill="#B45309" />
              <path d="M70 160C70 185 60 205 50 205H65C75 205 85 185 85 160V140H70V160Z" fill="#B45309" />

              {/* Integrated Torso Node (Stand Look) */}
              <path d="M55 90C55 70 160 70 175 120C185 160 165 185 140 185H80C55 185 50 160 55 90Z" fill="url(#furGradientMain)" />
              
              {/* Chest Detail */}
              <path d="M55 100C55 120 75 145 95 145C115 145 125 120 125 100" stroke="white" strokeOpacity="0.1" strokeWidth="4" strokeLinecap="round" />

              {/* Front Legs (Near Side) */}
              <motion.path 
                animate={{ scaleY: [1, 0.99, 1] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
                d="M85 160C85 190 75 210 65 210H85C95 210 105 190 105 160V135H85V160Z" 
                fill="#F59E0B" 
              />
              <motion.path 
                animate={{ scaleY: [1, 0.99, 1] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                d="M135 160C135 190 125 210 115 210H135C145 210 155 190 155 160V135H135V160Z" 
                fill="#F59E0B" 
              />

              {/* Head Unit (High-Fidelity) */}
              <g transform="translate(45, 45)">
                {/* Long Droopy Ears (Boy Dog aesthetic) */}
                <motion.path 
                  variants={earVariants(true)}
                  animate="animate"
                  style={{ originX: "15px", originY: "15px" }}
                  d="M5 15C-5 15 -15 60 -10 90C0 105 20 80 20 15Z" 
                  fill="url(#earGradient)" 
                />
                <motion.path 
                  variants={earVariants(false)}
                  animate="animate"
                  style={{ originX: "65px", originY: "15px" }}
                  d="M75 15C85 15 95 60 90 90C80 105 60 80 60 15Z" 
                  fill="url(#earGradient)" 
                />

                {/* Main Skull Path */}
                <path d="M10 50C10 15 70 15 70 50C70 85 60 105 40 105C20 105 10 85 10 50Z" fill="url(#furGradientMain)" />
                
                {/* Refined Muzzle */}
                <path d="M22 75C22 65 58 65 58 75C58 98 48 108 40 108C32 108 22 98 22 75Z" fill="#FFFBEB" />
                <path d="M35 82C35 79 45 79 45 82C45 88 40 92 40 92C40 92 35 88 35 82Z" fill="#0F172A" />

                {/* Eyes Mesh (Sparkling Deep Blue) */}
                <g transform="translate(22, 42)">
                   <circle cx="6" cy="6" r="9" fill="white" />
                   <motion.g variants={blinkVariants} animate="animate" style={{ originX: "6px", originY: "6px" }}>
                      <circle cx="6" cy="6" r="7" fill="#1D4ED8" />
                      <circle cx="6" cy="6" r="4" fill="#1E3A8A" />
                      <circle cx="4" cy="4" r="3" fill="url(#eyeShine)" />
                   </motion.g>
                </g>
                <g transform="translate(48, 42)">
                   <circle cx="6" cy="6" r="9" fill="white" />
                   <motion.g variants={blinkVariants} animate="animate" style={{ originX: "6px", originY: "6px" }}>
                      <circle cx="6" cy="6" r="7" fill="#1D4ED8" />
                      <circle cx="6" cy="6" r="4" fill="#1E3A8A" />
                      <circle cx="4" cy="4" r="3" fill="url(#eyeShine)" />
                   </motion.g>
                </g>

                {/* Institutional Blue Mesh Collar */}
                <path d="M15 95C15 92 65 92 65 95C65 100 15 100 15 95Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="1" />
                <circle cx="40" cy="100" r="4" fill="#FBBF24" />
                <path d="M38 100L42 100" stroke="#B45309" strokeWidth="0.5" />
              </g>
            </g>
          </svg>
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
