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

      {/* Dog Animation Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-[40px] flex flex-col items-center justify-center p-8 md:p-12">
          <div className="w-48 h-48 md:w-64 md:h-64">
            <DotLottieReact
              src="/assets/lottie/happy_dog.lottie"
              loop
              autoplay
            />
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mt-4"
          >
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
              Loading <span className="text-primary">Obey...</span>
            </h3>
          </motion.div>

          <p className="text-[10px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.7em] mt-3 animate-pulse">
            Getting ready
          </p>

          <div className="mt-4 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -120],
            x: Math.cos(i) * 60,
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "circOut" }}
          className="absolute left-1/2 bottom-1/3 w-1 h-1 bg-primary rounded-full blur-[1px] opacity-20"
        />
      ))}
    </div>
  );
}
