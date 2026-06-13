import React from "react";
import { Shield, Globe, Lock, ExternalLink } from "lucide-react";
import { AppScreen } from "../types";

interface StandardFooterProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function StandardFooter({ onNavigate }: StandardFooterProps) {
  return (
    <footer className="bg-[#0b0e14] text-white pt-24 pb-12 px-8 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-20">
          <div className="md:col-span-5 space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-[14px] shadow-lg shadow-primary/20">
                <span className="text-white font-black text-xl tracking-tighter">O</span>
              </div>
              <span className="text-4xl font-black tracking-tighter font-space">OBEY</span>
            </div>
            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-sm">
              Next-generation digital asset management and institutional liquidity infrastructure.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Corporate Parent</p>
                <p className="text-sm font-bold text-white">TRICODE PRO LTD</p>
              </div>
              <div className="w-px h-8 bg-gray-800"></div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-bold text-white">Operational</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16">
            <div className="space-y-8">
              <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Compliance</h5>
              <ul className="space-y-5 text-sm font-bold text-gray-400">
                <li><button onClick={() => onNavigate(AppScreen.PRIVACY)} className="hover:text-white transition-colors flex items-center gap-2 text-left">Privacy Policy <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.TERMS)} className="hover:text-white transition-colors flex items-center gap-2 text-left">Terms of Service <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.USERDATA)} className="hover:text-white transition-colors flex items-center gap-2 text-left">User Data Agreement <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.AMLKYC)} className="hover:text-white transition-colors flex items-center gap-2 text-left">AML / KYC Policy <ExternalLink size={12} /></button></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Protocol</h5>
              <ul className="space-y-5 text-sm font-bold text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Private Nodes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Yield Aggregator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Escrow Smart Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developer SDK</a></li>
              </ul>
            </div>
            <div className="space-y-8 hidden sm:block">
              <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Security</h5>
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <Shield size={18} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">256-Bit Encrypted</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <Lock size={18} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Biometric Auth</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start">
             <p>© 2026 OBEY FINANCIAL TECHNOLOGIES.</p>
             <div className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden sm:block"></div>
             <p className="text-gray-300">POWERED BY TRICODE PRO LTD</p>
          </div>
          <div className="flex gap-10 flex-wrap justify-center">
            <button onClick={() => onNavigate(AppScreen.AMLKYC)} className="hover:text-primary transition-colors uppercase">AML / KYC</button>
            <button className="hover:text-primary transition-colors uppercase">Disclosures</button>
            <button className="hover:text-primary transition-colors uppercase">System Status</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
