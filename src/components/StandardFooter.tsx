import React from "react";
import { Shield, Globe, Lock, ExternalLink, Apple, Cpu, Network } from "lucide-react";
import { AppScreen } from "../types";

interface StandardFooterProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function StandardFooter({ onNavigate }: StandardFooterProps) {
  return (
    <footer className="bg-[#f4f5f7] border-t border-gray-200 text-[#0b0e14] pt-16 md:pt-24 pb-12 px-6 md:px-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-16 md:mb-20">
          <div className="md:col-span-5 space-y-8 md:space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0b0e14] flex items-center justify-center rounded-[10px] md:rounded-[14px] shadow-2xl overflow-hidden">
                <img src="/obey_logo.png" className="w-full h-full object-cover" alt="OBEY Logo" />
              </div>
              <span className="text-3xl md:text-4xl font-black tracking-tighter font-space uppercase">OBEY</span>
            </div>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-sm">
              Next-generation digital asset management and institutional liquidity infrastructure. Trade with Opay trading payment app.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Corporate Parent</p>
                <p className="text-xs md:text-sm font-bold text-[#0b0e14]">TRICODE PRO LTD</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xs md:text-sm font-bold text-[#0b0e14]">Operational</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Apple size={14} className="text-[#0b0e14]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0b0e14]">Apple Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Globe size={14} className="text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0b0e14]">CBN Approved</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                <Network size={14} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0b0e14]">Sui Network</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-10 md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Compliance</h5>
              <ul className="space-y-4 md:space-y-5 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate(AppScreen.PRIVACY)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Privacy Policy <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.TERMS)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Terms of Service <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.USERDATA)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">User Data <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.AMLKYC)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">AML / KYC <ExternalLink size={12} /></button></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Regulatory</h5>
              <ul className="space-y-4 md:space-y-5 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate(AppScreen.APPLE)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Apple Compliance <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.CBN)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">CBN Approval <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.DISCLOSURES)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Disclosures <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.STATUS)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">System Status <ExternalLink size={12} /></button></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Integration</h5>
              <ul className="space-y-4 md:space-y-5 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate(AppScreen.OPAY)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Opay Payments <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.SDK)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Developer SDK <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.SUI)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Sui Network <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.NODES)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Node Infra <ExternalLink size={12} /></button></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8 hidden sm:block">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Security</h5>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <Shield size={18} className="text-emerald-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#0b0e14]">256-Bit Encrypted</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <Lock size={18} className="text-primary" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#0b0e14]">Biometric Auth</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <Cpu size={18} className="text-blue-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#0b0e14]">Parallel Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          <div className="flex items-center gap-3 md:gap-4 text-center md:text-left flex-wrap justify-center md:justify-start leading-relaxed">
             <p>© 2026 OBEY FINANCIAL TECHNOLOGIES.</p>
             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></div>
             <p className="text-gray-600">POWERED BY TRICODE PRO LTD</p>
             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></div>
             <p className="text-primary">Trade with Opay</p>
          </div>
          <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
            <button onClick={() => onNavigate(AppScreen.APPLE)} className="hover:text-primary transition-colors uppercase">Apple</button>
            <button onClick={() => onNavigate(AppScreen.CBN)} className="hover:text-primary transition-colors uppercase">CBN</button>
            <button onClick={() => onNavigate(AppScreen.OPAY)} className="hover:text-primary transition-colors uppercase">Opay</button>
            <button onClick={() => onNavigate(AppScreen.SDK)} className="hover:text-primary transition-colors uppercase">SDK</button>
            <button onClick={() => onNavigate(AppScreen.SUI)} className="hover:text-primary transition-colors uppercase">Sui</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
