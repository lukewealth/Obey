import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

/**
 * SyntaxTestComponent
 * 
 * Used for verifying component architecture, prop typing, and 
 * Tailwind CSS 4.0 utility resolution during the build process.
 */
interface SyntaxTestProps {
  status?: 'active' | 'pending';
  label: string;
}

export const SyntaxTestComponent: React.FC<SyntaxTestProps> = ({ 
  status = 'active', 
  label 
}) => {
  return (
    <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl flex items-center gap-4 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
        status === 'active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
      }`}>
        {status === 'active' ? <CheckCircle2 size={24} /> : <Zap size={24} />}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Node Component Status</p>
        <p className="text-lg font-black text-[#0b0e14] group-hover:text-primary transition-colors">{label}</p>
      </div>
    </div>
  );
};
