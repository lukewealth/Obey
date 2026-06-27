import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function PuppyLoading({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${compact ? '' : ''}`}>
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-blue-400/5 rounded-full blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className={`backdrop-blur-2xl bg-white/30 border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-[40px] flex flex-col items-center justify-center ${compact ? 'p-4' : 'p-6 md:p-10'}`}>
            <div className={compact ? 'w-28 h-28' : 'w-40 h-40 md:w-52 md:h-52'}>
              <DotLottieReact
                src="/assets/lottie/happy_dog.lottie"
                loop
                autoplay
              />
            </div>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className={`text-center ${compact ? 'mt-1' : 'mt-3'}`}
            >
              <h3 className={`${compact ? 'text-lg' : 'text-2xl md:text-3xl'} font-black text-slate-900 uppercase tracking-tighter italic`}>
                Mesh <span className="text-blue-600">Sync...</span>
              </h3>
            </motion.div>

            {!compact && (
              <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.7em] mt-2 animate-pulse">
                Aligning nodes
              </p>
            )}

            <div className={`mt-3 ${compact ? 'w-24' : 'w-40'} h-1.5 bg-slate-100/60 rounded-full overflow-hidden relative`}>
              <motion.div
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-400/20 via-blue-500/60 to-blue-400/20 rounded-full"
              />
            </div>
          </div>
        </motion.div>

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
            className="absolute left-1/2 bottom-1/3 w-1 h-1 bg-blue-500 rounded-full blur-[1px] opacity-20"
          />
        ))}
      </div>
    </div>
  );
}
