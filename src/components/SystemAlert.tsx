import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, Terminal, Cpu } from "lucide-react";

interface SystemAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  logs?: string[];
  type?: "critical" | "warning" | "system";
}

export default function SystemAlert({ isOpen, onClose, title, message, logs, type = "system" }: SystemAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-[#fcfcfd] rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header: Windows Classic Style Mix */}
            <div className={`h-12 md:h-14 flex items-center justify-between px-4 md:px-6 border-b shrink-0 ${
              type === 'critical' ? 'bg-red-600 border-red-700' : 
              type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-[#0b0e14] border-black'
            }`}>
              <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                {type === 'critical' ? <ShieldAlert size={16} className="text-white shrink-0" /> : <Terminal size={16} className="text-primary shrink-0" />}
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-white truncate">System Executive Shell</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto">
              <div className="space-y-2 md:space-y-3 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-[#0b0e14]">{title}</h3>
                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">{message}</p>
              </div>

              {logs && logs.length > 0 && (
                <div className="bg-[#0b0e14] rounded-xl md:rounded-2xl p-4 md:p-6 font-mono text-[9px] md:text-[10px] text-primary/80 overflow-y-auto max-h-32 md:max-h-40 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 opacity-50">
                    <Cpu size={12} />
                    <span className="uppercase tracking-widest">Stack Trace Ledger</span>
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className="py-0.5 whitespace-pre-wrap">
                      <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                  <div className="animate-pulse h-3 w-1.5 bg-primary mt-2"></div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 h-14 md:h-16 bg-[#0b0e14] text-white rounded-[18px] md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary transition-all active-press shadow-xl shadow-black/20"
                >
                  Confirm Awareness
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 md:px-10 h-14 md:h-16 border border-gray-200 text-gray-400 rounded-[18px] md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:text-[#0b0e14] hover:bg-gray-50 transition-all"
                >
                  Ignore
                </button>
              </div>
            </div>

            {/* Footer Status */}
            <div className="px-6 md:px-10 py-3 md:py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between opacity-50 shrink-0">
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400">Node ID: TRICODE-SHELL</p>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[8px] md:text-[9px] font-black uppercase text-emerald-600">Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
