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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-lg bg-[#fcfcfd] rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden"
          >
            {/* Header: Windows Classic Style Mix */}
            <div className={`h-14 flex items-center justify-between px-6 border-b ${
              type === 'critical' ? 'bg-red-600 border-red-700' : 
              type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-[#0b0e14] border-black'
            }`}>
              <div className="flex items-center gap-3">
                {type === 'critical' ? <ShieldAlert size={18} className="text-white" /> : <Terminal size={18} className="text-primary" />}
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">System Executive Shell</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 space-y-8 text-center md:text-left">
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tighter text-[#0b0e14]">{title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
              </div>

              {logs && logs.length > 0 && (
                <div className="bg-[#0b0e14] rounded-2xl p-6 font-mono text-[10px] text-primary/80 overflow-y-auto max-h-40 border border-white/5 shadow-inner">
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

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 h-16 bg-[#0b0e14] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all active-press shadow-xl shadow-black/20"
                >
                  Confirm Awareness
                </button>
                <button 
                  onClick={onClose}
                  className="px-10 h-16 border border-gray-200 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-[#0b0e14] hover:bg-gray-50 transition-all"
                >
                  Ignore
                </button>
              </div>
            </div>

            {/* Footer Status */}
            <div className="px-10 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between opacity-50">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Node ID: TRICODE-PRO-SHELL</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[9px] font-black uppercase text-emerald-600">Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
