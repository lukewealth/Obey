import React from "react";
import { Shield, Globe, Lock, ExternalLink, Apple, Smartphone, Building2, FileCheck } from "lucide-react";
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
                <img src="/obey_logo.svg" className="w-full h-full object-cover" alt="OBEY Logo" />
              </div>
              <span className="text-3xl md:text-4xl font-black tracking-tighter font-space uppercase">OBEY</span>
            </div>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-sm">
              Next-generation digital asset management and institutional liquidity infrastructure.
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

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => onNavigate(AppScreen.APPLE)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <Apple size={16} className="text-[#0b0e14]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-[#0b0e14]">Apple Compliant</span>
              </button>
              <button
                onClick={() => onNavigate(AppScreen.CBN)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <Building2 size={16} className="text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-emerald-600">CBN Approved</span>
              </button>
              <button
                onClick={() => onNavigate(AppScreen.SUI)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <Globe size={16} className="text-blue-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-blue-600">Sui Network</span>
              </button>
              <button
                onClick={() => onNavigate(AppScreen.OPAY)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group"
              >
                <Smartphone size={16} className="text-green-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-green-600">Opay Integrated</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
            <div className="space-y-6 md:space-y-8">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Company</h5>
              <ul className="space-y-4 md:space-y-5 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate(AppScreen.ABOUT)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">About Us <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.PRIVACY)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Privacy Policy <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.TERMS)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Terms of Service <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.AMLKYC)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">AML / KYC Policy <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.COOKIE)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Cookie Policy <ExternalLink size={12} /></button></li>
              </ul>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h5 className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-primary">Protocol</h5>
              <ul className="space-y-4 md:space-y-5 text-sm font-bold text-gray-500">
                <li><button onClick={() => onNavigate(AppScreen.NODES)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Parallel Nodes <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.SUI)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Sui Smart Contract <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.SDK)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Developer SDK <ExternalLink size={12} /></button></li>
                <li><button onClick={() => onNavigate(AppScreen.OPAY)} className="hover:text-primary transition-colors flex items-center gap-2 text-left">Opay Integration <ExternalLink size={12} /></button></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">Escrow Contracts <ExternalLink size={12} /></a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2">Yield Aggregator <ExternalLink size={12} /></a></li>
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
                  <FileCheck size={18} className="text-blue-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#0b0e14]">CBN Licensed</span>
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
             <p className="text-emerald-600">CBN APPROVED</p>
          </div>
          <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
            <button onClick={() => onNavigate(AppScreen.ABOUT)} className="hover:text-primary transition-colors uppercase">About</button>
            <button onClick={() => onNavigate(AppScreen.AMLKYC)} className="hover:text-primary transition-colors uppercase">AML / KYC</button>
            <button onClick={() => onNavigate(AppScreen.DISCLOSURES)} className="hover:text-primary transition-colors uppercase">Disclosures</button>
            <button onClick={() => onNavigate(AppScreen.STATUS)} className="hover:text-primary transition-colors uppercase">System Status</button>
            <button onClick={() => onNavigate(AppScreen.SDK)} className="hover:text-primary transition-colors uppercase">SDK Docs</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
