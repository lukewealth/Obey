import React from "react";
import { motion } from "framer-motion";

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
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Mesh Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] border border-white/5 rounded-full"
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 45}deg) translate(140px, -50%)`
              }}
            />
          ))}
        </motion.div>

        {/* Middle Status Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-[200px] h-[200px] md:w-[240px] md:h-[240px] border border-dashed border-white/10 rounded-full"
        />

        {/* Inner Pulsing Ring */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[140px] h-[140px] md:w-[160px] md:h-[160px] border-2 border-primary/20 rounded-full"
        />

        {/* Central Logo Node */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-24 h-24 md:w-28 md:h-28 bg-white rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] group"
        >
          <motion.span 
            animate={{ 
              textShadow: [
                "0 0 0px rgba(0,0,0,0)",
                "0 0 10px rgba(0,0,0,0.2)",
                "0 0 0px rgba(0,0,0,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#0b0e14] font-black text-4xl md:text-5xl uppercase tracking-tighter italic"
          >
            O
          </motion.span>
          
          {/* Scanning Effect */}
          <motion.div 
            animate={{ top: ["-20%", "120%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-primary/30 blur-[2px] z-20 pointer-events-none"
          />
        </motion.div>

        {/* Corner Brackets */}
        <div className="absolute -inset-10 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-xl" />
        </div>
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
