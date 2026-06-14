import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function PuppyLoading() {
  const [livePrices, setLivePrices] = useState<any>(null);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    const fetchLiveContext = async () => {
      try {
        const res = await api.get('/market/prices?symbols=BTC,ETH,SOL,SUI');
        if (res.data) {
          setLivePrices(res.data);
        }
      } catch (err) {
        console.warn("[LOADER_SYNC] Failed to fetch real-time context nodes.");
        setLoadingError(true);
      }
    };

    fetchLiveContext();
    const interval = setInterval(fetchLiveContext, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12 md:py-24">
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        {/* High-Fidelity Puppy Image Design Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, -2, 2, 0],
            opacity: 1
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10 w-full h-full rounded-[45px] overflow-hidden shadow-2xl border-4 border-white shadow-primary/20"
        >
          <img 
            src="/assets/puppy/puppy_big_eyes.jpg" 
            alt="Happy Puppy" 
            className="w-full h-full object-cover"
            loading="eager"
          />
          
          {/* Animated Sparkling Effects (Blue Eyes Vibe) */}
          <motion.div 
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              x: [20, 40, 20],
              y: [40, 30, 40]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-400 rounded-full blur-md"
          />
          <motion.div 
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              x: [80, 100, 80],
              y: [40, 50, 40]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-white rounded-full blur-sm"
          />
        </motion.div>

        {/* Happy Particle Mesh */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              x: Math.sin(i) * 50,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
            className="absolute left-1/2 bottom-1/2 w-2 h-2 bg-primary rounded-full"
          />
        ))}

        {/* Dynamic Shadow */}
        <motion.div 
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.3, 0.15, 0.3]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900/20 rounded-full blur-xl"
        />
      </div>

      <div className="text-center space-y-6 relative max-w-sm">
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
              Synchronizing <span className="text-primary">Ecosystem...</span>
            </h3>
          </motion.div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Institutional Node Discovery</p>
        </div>

        {/* Live Context Data (CoinAPI Integration) */}
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Live Market Parameters</p>
           <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="wait">
                 {livePrices ? (
                   <>
                    {[
                      { sym: 'BTC', price: livePrices.BTC },
                      { sym: 'ETH', price: livePrices.ETH },
                      { sym: 'SOL', price: livePrices.SOL },
                      { sym: 'SUI', price: livePrices.SUI }
                    ].map((p) => (
                      <motion.div 
                        key={p.sym}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-50 shadow-sm"
                      >
                        <span className="text-[10px] font-black text-gray-900">{p.sym}</span>
                        <span className="text-[10px] font-mono font-black text-primary">${p.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </motion.div>
                    ))}
                   </>
                 ) : (
                   <div className="col-span-2 flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                   </div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
              <motion.div 
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
