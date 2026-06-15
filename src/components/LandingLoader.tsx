import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LandingLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0b0e14] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Ambient Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px]" 
      />

      {/* Main Loader Container */}
      <div className="relative flex items-center justify-center w-80 h-80 md:w-96 md:h-96">
        <DotLottieReact
          src="https://lottie.host/60e2c41b-b933-4d0e-a9fb-0228b60517cc/8BwkHq1W4z.lottie"
          loop
          autoplay
        />
      </div>

      {/* Loading Status Text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 md:mt-24 space-y-4 relative z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] ml-2">
            Obey Core Mesh
          </p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <p className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              Initializing Institutional Nodes
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-48 md:w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mx-auto mt-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
            className="h-full bg-gradient-to-r from-primary to-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
          />
        </div>

        {/* Random Bits of Data (Aesthetic) */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-8 opacity-10">
          <p className="font-mono text-[8px] text-white">0x8829...1044</p>
          <p className="font-mono text-[8px] text-white">SSL_SECURED</p>
          <p className="font-mono text-[8px] text-white">AES_256_GCM</p>
        </div>
      </motion.div>
    </div>
  );
}
