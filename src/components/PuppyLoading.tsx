import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // --- High-Detail Animation Variants ---
  const bodyVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [-1, 1, -1],
      scale: [1, 1.02, 1], // Breathing effect
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const headVariants = {
    animate: {
      y: [0, -8, 0],
      rotate: [-3, 3, -3],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.05 }
    }
  };

  const earVariants = (isLeft: boolean) => ({
    animate: {
      rotate: isLeft ? [-25, 5, -25] : [25, -5, 25],
      scaleY: [1, 1.1, 1],
      transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
    }
  });

  const blinkVariants = {
    animate: {
      scaleY: [1, 1, 0.1, 1, 1],
      transition: { duration: 3, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" }
    }
  };

  const tailVariants = {
    animate: {
      rotate: [-40, 40, -40],
      transition: { duration: 0.15, repeat: Infinity, ease: "linear" }
    }
  };

  const legVariants = (delay: number) => ({
    animate: {
      y: [0, -12, 0],
      scaleY: [1, 0.9, 1],
      transition: { duration: 0.3, repeat: Infinity, delay, ease: "easeInOut" }
    }
  });

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12 md:py-24 overflow-hidden">
      <div className="relative w-64 h-80 md:w-80 md:h-[400px]">
        
        {/* Dynamic Floor Shadow */}
        <motion.div 
          animate={{ scale: [1, 0.8, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/10 rounded-[100%] blur-2xl"
        />

        {/* --- 2D High-Detail Drawing Mesh --- */}
        <div className="relative z-10 w-full h-full flex flex-col items-center pt-20">
          
          {/* Main Body Node */}
          <motion.div variants={bodyVariants} animate="animate" className="relative w-40 h-44">
             {/* Core Torso with Gradient Depth */}
             <div className="absolute inset-0 bg-gradient-to-b from-amber-400 to-amber-600 rounded-[55px] shadow-2xl overflow-hidden border-b-4 border-amber-700/30">
                {/* Fur Patch Detailing */}
                <div className="absolute -left-4 top-10 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                <div className="absolute -right-2 top-4 w-12 h-12 bg-amber-700/20 rounded-full blur-lg" />
             </div>

             {/* Tail Node */}
             <motion.div 
                variants={tailVariants}
                animate="animate"
                className="absolute -right-4 top-1/2 w-20 h-7 bg-amber-700 rounded-full origin-left shadow-lg flex items-center justify-end px-2"
             >
                <div className="w-6 h-full bg-amber-400 rounded-full blur-[2px] opacity-40" />
             </motion.div>

             {/* Premium Collar Node */}
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-6 bg-red-600 rounded-full shadow-lg border-b-2 border-red-800 flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-inner border border-yellow-200" />
             </div>
          </motion.div>

          {/* Head Node (Higher Detailing) */}
          <motion.div
            variants={headVariants}
            animate="animate"
            className="absolute top-4 w-52 h-48 flex flex-col items-center"
          >
             {/* Cranium Mesh */}
             <div className="relative w-full h-full bg-gradient-to-b from-amber-300 to-amber-500 rounded-[75px] shadow-2xl border-b-4 border-amber-600/40 overflow-hidden">
                {/* Fur Detail Spots */}
                <div className="absolute top-2 left-10 w-12 h-8 bg-amber-700/20 rounded-full blur-md" />
                
                {/* Ears Node */}
                <motion.div variants={earVariants(true)} animate="animate" className="absolute -top-2 -left-4 w-16 h-28 bg-amber-800 rounded-full origin-bottom shadow-lg" />
                <motion.div variants={earVariants(false)} animate="animate" className="absolute -top-2 -right-4 w-16 h-28 bg-amber-800 rounded-full origin-bottom shadow-lg" />

                {/* Face Components Mesh */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                   {/* Ocular Mesh (Sparkling Blue Eyes) */}
                   <div className="flex gap-8">
                      {[1, 2].map(i => (
                        <div key={i} className="relative w-14 h-14 bg-gray-950 rounded-full border-[4px] border-white shadow-2xl overflow-hidden">
                           {/* Iris Gradient */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-400 to-cyan-200 opacity-60" />
                           {/* Animated Pupil */}
                           <motion.div variants={blinkVariants} animate="animate" className="absolute inset-0 bg-black flex items-center justify-center">
                              <div className="w-10 h-10 bg-gray-900 rounded-full" />
                           </motion.div>
                           {/* Light Reflections */}
                           <div className="absolute top-2 left-2 w-5 h-5 bg-white rounded-full opacity-90 blur-[0.5px]" />
                           <div className="absolute bottom-3 right-3 w-2 h-2 bg-white rounded-full opacity-60" />
                        </div>
                      ))}
                   </div>

                   {/* Muzzle Mesh (High Detail) */}
                   <div className="mt-2 w-32 h-24 bg-white/90 rounded-[50px] shadow-inner border border-gray-100 flex flex-col items-center pt-4">
                      {/* Nose Node */}
                      <div className="w-8 h-5 bg-gray-950 rounded-full shadow-lg flex flex-col items-center">
                         <div className="w-2 h-1 bg-white/20 rounded-full mt-1" />
                      </div>
                      {/* Mouth & Tongue Node */}
                      <div className="mt-1 flex flex-col items-center">
                         <div className="w-10 h-2 border-b-2 border-gray-300 rounded-full" />
                         <motion.div 
                           animate={{ scaleY: [1, 1.3, 1], rotate: [-2, 2, -2] }}
                           transition={{ duration: 0.3, repeat: Infinity }}
                           className="w-8 h-12 bg-gradient-to-b from-red-400 to-pink-500 rounded-b-full border-2 border-red-600/20 shadow-md"
                         />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Detailed Walking Paws Node */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
             {[0, 0.15, 0.3, 0.45].map((delay, idx) => (
               <motion.div 
                key={idx}
                variants={legVariants(delay)} 
                animate="animate" 
                className="w-12 h-16 flex flex-col items-center"
               >
                  <div className="w-full h-full bg-amber-600 rounded-b-3xl shadow-xl border-t-2 border-amber-700/20">
                     {/* Toe Detailing */}
                     <div className="mt-auto h-4 flex justify-around px-1 pb-1">
                        <div className="w-2 h-2 bg-amber-700/30 rounded-full" />
                        <div className="w-2 h-2 bg-amber-700/30 rounded-full" />
                        <div className="w-2 h-2 bg-amber-700/30 rounded-full" />
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>
        </div>

        {/* Global Particle Mesh */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150],
              x: Math.sin(i) * 80,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className="absolute left-1/2 bottom-1/3 w-2 h-2 bg-primary rounded-full blur-[1px] shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]"
          />
        ))}
      </div>

      {/* Institutional Progress Mesh */}
      <div className="text-center space-y-8 relative max-w-sm">
        <div className="space-y-3">
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.99, 1, 0.99] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
              Mesh <span className="text-primary">Alignment...</span>
            </h3>
          </motion.div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em] animate-pulse">Syncing institutional node depth</p>
        </div>

        {/* Live Context UI */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[45px] p-8 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] space-y-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 animate-pulse" />
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3">
              <Sparkles size={14} className="text-primary" /> Real-Time Asset Node Feed
           </p>
           <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                 {livePrices ? (
                   <>
                    {[
                      { sym: 'BTC', price: livePrices.BTC, color: 'text-orange-500', bg: 'bg-orange-50' },
                      { sym: 'ETH', price: livePrices.ETH, color: 'text-blue-500', bg: 'bg-blue-50' },
                      { sym: 'SOL', price: livePrices.SOL, color: 'text-purple-500', bg: 'bg-purple-50' },
                      { sym: 'SUI', price: livePrices.SUI, color: 'text-cyan-500', bg: 'bg-cyan-50' }
                    ].map((p) => (
                      <motion.div 
                        key={p.sym}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col items-center justify-center p-4 ${p.bg} rounded-[32px] border border-white shadow-sm hover:scale-105 transition-transform duration-300 group`}
                      >
                        <span className={`text-[10px] font-black ${p.color} uppercase mb-1 tracking-widest`}>{p.sym}</span>
                        <span className="text-[13px] font-mono font-black text-gray-900">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </motion.div>
                    ))}
                   </>
                 ) : (
                   <div className="col-span-2 flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-lg" />
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Establishing Data Tunnel</p>
                   </div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* Institutional Progress Bar */}
        <div className="flex flex-col items-center gap-5">
           <div className="w-64 h-2.5 bg-gray-100 rounded-full overflow-hidden relative shadow-inner border border-gray-50">
              <motion.div 
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-primary/60 via-primary to-primary/60 shadow-[0_0_25px_rgba(var(--color-primary-rgb),1)]"
              />
           </div>
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Integrity Level: 100%</p>
        </div>
      </div>
    </div>
  );
}
