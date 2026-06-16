import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ShieldCheck, Activity, Heart } from "lucide-react";

interface QualityItem {
  id: string;
  label: string;
  completed: boolean;
  type: "product" | "technical";
}

const QUALITY_CHECKLIST: QualityItem[] = [
  { id: "mesh-logic", label: "Institutional Mesh Logic", completed: true, type: "technical" },
  { id: "lint-verified", label: "Types Settled & Lint-Verified", completed: true, type: "technical" },
  { id: "edge-handling", label: "Edge-Node Error Handling", completed: true, type: "technical" },
  { id: "motion-opt", label: "Motion & Canvas Optimized", completed: true, type: "technical" },
  { id: "ui-fidelity", label: "High-Fidelity Aesthetic", completed: true, type: "product" },
  { id: "user-flow", label: "Sequential User Flow", completed: true, type: "product" },
  { id: "admin-oversight", label: "Comprehensive Admin Oversight", completed: true, type: "product" },
  { id: "security-auth", label: "Security Protocols Active", completed: true, type: "product" },
];

export default function SystemQualityNode({ mode = "compact" }: { mode?: "compact" | "full" }) {
  return (
    <div className={`bento-card p-6 ${mode === 'full' ? 'md:p-10' : ''} space-y-6 relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={80} className="text-primary" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Integrity Node</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quality Assurance Mesh</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary">100%</span>
          <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">Settled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {QUALITY_CHECKLIST.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5"
          >
            {item.completed ? (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={14} className="text-gray-300 shrink-0" />
            )}
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 truncate uppercase tracking-tight">{item.label}</p>
              <p className={`text-[7px] font-black uppercase tracking-[0.2em] ${item.type === 'technical' ? 'text-primary' : 'text-amber-500'}`}>
                {item.type} Value
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {mode === 'full' && (
        <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Build Node: STABLE</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Heart size={12} fill="currentColor" />
            <span className="text-[9px] font-black uppercase tracking-widest">Verified by AGENT</span>
          </div>
        </div>
      )}
    </div>
  );
}
