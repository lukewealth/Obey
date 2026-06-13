import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import { ShieldCheck, ArrowRight, Zap, Coins, Globe, Heart, Award, ArrowUpRight, ChevronRight, Lock } from "lucide-react";

interface MarketingPageProps {
  onNavigate: (screen: AppScreen) => void;
  btcPrice: number;
  ethPrice: number;
}

export default function MarketingPage({ onNavigate, btcPrice, ethPrice }: MarketingPageProps) {
  const [activeHeader, setActiveHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setActiveHeader(true);
      } else {
        setActiveHeader(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0b1220] min-h-screen text-[#f8faff] font-sans">
      {/* Top Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-16 ${
          activeHeader
            ? "bg-[#0b121f]/95 border-b border-white/10 backdrop-blur-md shadow-xl"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">OBEY</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Solutions</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Security</a>
            <a href="#benefits" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Benefits</a>
            <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Products</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors active-press py-2 px-4 rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-[#0057FF] text-white hover:bg-blue-600 transition-colors py-2 px-5 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 active-press"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main hero */}
      <section className="pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh] px-4 md:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0057FF]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#00C6FF]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-4xl text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#00C6FF] text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#00C6FF] rounded-full animate-ping"></span>
            NEW: Institutional Crypto Trading is Live
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-white">
            The Future of <br className="hidden sm:inline" />
            Finance is <span className="gradient-text">OBEY.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            A hyper-efficient digital ecosystem for global payments, crypto assets, gift cards, and enterprise liquidity. Designed for those who demand absolute precision and sub-second speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="w-full sm:w-auto bg-[#0057FF] hover:bg-blue-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active-press"
            >
              Get Started Now
            </button>
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-base px-8 py-4 rounded-xl transition-all active-press"
            >
              Access Platform
            </button>
          </div>
        </div>

        {/* Brand strip */}
        <div className="mt-20 w-full max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-40 hover:opacity-75 transition-opacity duration-500">
          <span className="font-extrabold text-sm sm:text-lg tracking-[0.2em] text-white">SECURE.</span>
          <span className="font-extrabold text-sm sm:text-lg tracking-[0.2em] text-white">FAST.</span>
          <span className="font-extrabold text-sm sm:text-lg tracking-[0.2em] text-white">GLOBAL.</span>
          <span className="font-extrabold text-sm sm:text-lg tracking-[0.2em] text-white">OBEY.</span>
        </div>
      </section>

      {/* Live price ticker list */}
      <div className="w-full bg-[#0d1627] border-y border-white/5 py-4 overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-12 items-center min-w-full">
          <div className="flex gap-12 animate-scroll-left">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">BTC/USD</span>
              <span className="font-mono text-sm text-white font-medium">${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="font-mono text-xs font-bold text-[#12B76A]">+2.45%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">ETH/USD</span>
              <span className="font-mono text-sm text-white font-medium">${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="font-mono text-xs font-bold text-[#12B76A]">+1.82%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">SOL/USD</span>
              <span className="font-mono text-sm text-white font-medium">$145.67</span>
              <span className="font-mono text-xs font-bold text-red-500">-0.42%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">USDC/USD</span>
              <span className="font-mono text-sm text-white font-medium">$1.00</span>
              <span className="font-mono text-xs font-bold text-gray-500">0.00%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">AD/NGN</span>
              <span className="font-mono text-sm text-white font-medium">₦920.00</span>
              <span className="font-mono text-xs font-bold text-[#12B76A]">+4.10%</span>
            </div>
            {/* Repeated for scrolling loop */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">BTC/USD</span>
              <span className="font-mono text-sm text-white font-medium">${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="font-mono text-xs font-bold text-[#12B76A]">+2.45%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">ETH/USD</span>
              <span className="font-mono text-sm text-white font-medium">${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="font-mono text-xs font-bold text-[#12B76A]">+1.82%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500">SOL/USD</span>
              <span className="font-mono text-sm text-white font-medium">$145.67</span>
              <span className="font-mono text-xs font-bold text-red-500">-0.42%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security first section */}
      <section id="security" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-[#00C6FF]">
              <Lock size={24} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Security first.<br />Enterprise-ready.
            </h2>
            <p className="text-gray-400 font-light leading-relaxed">
              We process over $2.5B in monthly volume with absolute security and zero downtime. All crypto assets are held in secure, military-grade multisig offline storage, backed by automated compliance checks.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                <span className="w-10 h-10 rounded-full border-2 border-[#0b1220] bg-gray-800 flex items-center justify-center text-xs font-bold">FE</span>
                <span className="w-10 h-10 rounded-full border-2 border-[#0b1220] bg-gray-700 flex items-center justify-center text-xs font-bold">LO</span>
                <span className="w-10 h-10 rounded-full border-2 border-[#0b1220] bg-gray-600 flex items-center justify-center text-xs font-bold">OB</span>
              </div>
              <p className="text-sm font-medium text-gray-400">Trusted by over 2M+ global users and retail firms</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-[#0057FF]/5 rounded-3xl blur-[50px] group-hover:bg-[#0057FF]/10 transition-all duration-300"></div>
            <div className="relative bg-[#111928]/80 border border-white/5 p-2 rounded-2xl overflow-hidden shadow-2xl">
              <img
                alt="Vault lock presentation"
                className="w-full h-80 object-cover rounded-xl grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLutHcPnESDSgtsjZdmPdcJ8Hyel06r_xgaHB-pqd4GLpKIFHdNWm9kOWO8AJsw52-xFJzpZEoVR6HmaIrN1svxo-6z30hRNvB6PUuDxC-5UjQ8EwxMSC9veKQTo2-Pjv8EGvbjw8dbUq0zRfr1Kwu3wAIK2_MwzG11xPdPVmXOSXSaMoZkAinZqNlI-9NE9PZv7t9Ao1OiogtNjoGot3tXAoPNyLX57aiYJ40sOsy3SO0CFpnUYiTD84LNG"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#0f172a]/95 border border-white/10 p-5 rounded-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PROTECTION CODE</p>
                    <p className="text-base font-black text-white">Military Grade AES-256</p>
                  </div>
                  <ShieldCheck className="text-[#00C6FF]" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="services" className="py-24 bg-[#0d1627]/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#00C6FF]">CAPABILITIES</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Modular Financial Engineering.</h2>
            </div>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="inline-flex items-center gap-2 text-[#00C6FF] font-bold text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              EXPLORE ALL PRODUCTS <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Box 1: Payments */}
            <div className="md:col-span-8 bg-[#111928]/80 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group hover:border-[#0057FF]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#0057FF]/5 rounded-full blur-[60px] pointer-events-none"></div>
              <div>
                <span className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                  <Globe size={24} />
                </span>
                <h3 className="text-2xl font-black text-white mb-2">Global Instant Payments</h3>
                <p className="text-gray-400 font-light max-w-md leading-relaxed text-sm">
                  Settle cross-border transactions in local currencies instantly. Settle data plans or buy credit across networks globally in seconds.
                </p>
              </div>
              <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <img
                  className="w-full h-48 object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLva0NJEFytGfzPdwC4OJPE6OYjAZ1jGgx16a49W_3vK6FENBhH9mud1pbJie-wFCwg58wQcM_KUyfmBGU6-moRmhwOO-y9uIq4Fs5GdyntBd46hcPCxbMXVYKV6wuIm85gHMQkkMBXyw7G55FWpQd99Te55-ebew6Phe_I3L1PQ5YIqud9UKHljLG1O_PZF2M14sUVrj4CpWlAngdaFCvEenEoeEB9Q_H-AmE7EauEzV7e1RELEv28ooI8Y"
                  alt="Fintech payments layout"
                />
              </div>
            </div>

            {/* Box 2: Crypto Vault */}
            <div className="md:col-span-4 bg-[#0057FF] rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group shadow-xl shadow-blue-500/15">
              <div className="absolute -inset-4 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="space-y-6">
                <span className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white">
                  <Coins size={24} />
                </span>
                <h3 className="text-2xl font-black text-white">Digital Asset Vault</h3>
                <p className="text-blue-100 font-light text-sm leading-relaxed">
                  Enterprise-grade crypto exchange and custody for major digital currencies. Buy, sell or swap without additional overhead.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-blue-200">
                <span className="font-mono tracking-widest font-black uppercase">LIVE TRADING</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#12B76A] animate-pulse"></div>
              </div>
            </div>

            {/* Box 3: Gift Cards */}
            <div className="md:col-span-12 bg-[#111928]/80 border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[#0057FF]/30 transition-all duration-300">
              <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-center">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white">
                  <Award size={28} className="text-[#00C6FF]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Global Gift Card Marketplace</h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
                    Redeem, calculate rates, buy, and sell regional card tokens for instant settlement directly to your cash wallet balance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate(AppScreen.REGISTER)}
                className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/15 text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider active-press whitespace-nowrap"
              >
                Access Marketplace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Professional Firms Choose Obey */}
      <section id="benefits" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Why Professional Firms Choose OBEY.</h2>
          <div className="w-16 h-1 bg-[#0057FF] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#111928]/50 border border-white/5 rounded-2xl space-y-4 hover:border-[#0057FF]/20 transition-all duration-300">
            <span className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </span>
            <h4 className="text-lg font-bold text-white">Sub-second Latency</h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Our core ledger transactions engine processes orders with zero wait times. Instantly fund your wallet or dispatch data packages.
            </p>
          </div>

          <div className="p-8 bg-[#111928]/50 border border-white/5 rounded-2xl space-y-4 hover:border-[#0057FF]/20 transition-all duration-300">
            <span className="w-10 h-10 bg-green-500/10 text-[#12B76A] rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </span>
            <h4 className="text-lg font-bold text-white">Deep Pool Liquidity</h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Consolidated liquidity pipelines ensure stable, transparent currency rates and maximum volume trade approvals without slippage.
            </p>
          </div>

          <div className="p-8 bg-[#111928]/50 border border-white/5 rounded-2xl space-y-4 hover:border-[#0057FF]/20 transition-all duration-300">
            <span className="w-10 h-10 bg-blue-500/10 text-[#00C6FF] rounded-xl flex items-center justify-center">
              <ArrowUpRight size={20} />
            </span>
            <h4 className="text-lg font-bold text-white">Unified API Portal</h4>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              Integrate billing or bulk crypto channels directly with our developer-focused utilities, fully compatible with corporate workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-[#0057FF] to-[#0d1627] overflow-hidden p-8 md:p-16 text-center relative shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(0,198,255,0.15)_0%,_transparent_55%)] pointer-events-none"></div>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-5xl font-black text-white leading-tight">Ready to transcend traditional finance?</h2>
            <p className="text-blue-100 text-sm sm:text-base font-light opacity-90">
              Join 2M+ users and over 10,000 corporate departments restructuring their digital finances today.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate(AppScreen.REGISTER)}
                className="bg-white text-[#0057FF] hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-all scale-press shadow-2xl active-press"
              >
                Open Your Wallet
              </button>
            </div>
            <p className="text-[10px] text-white/50 tracking-widest font-black uppercase pt-4">
              NO ACCOUNT FEES • 100% SECURE ASSET VAULT • 24/7 COMPLIANCE TEAM
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090e1a] border-t border-white/5 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <span className="text-2xl font-black text-white tracking-widest uppercase">OBEY</span>
            <p className="text-xs text-gray-500 font-light leading-relaxed max-w-xs">
              Building the global standard for digital liquidity, gift card trades, unified routing, and secure storage solutions.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-widest text-[#00C6FF]">Platform</h5>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><button onClick={() => onNavigate(AppScreen.LOGIN)} className="hover:text-white transition-colors">Trade Crypto</button></li>
              <li><button onClick={() => onNavigate(AppScreen.LOGIN)} className="hover:text-white transition-colors">Buy Airtime</button></li>
              <li><button onClick={() => onNavigate(AppScreen.LOGIN)} className="hover:text-white transition-colors">Sell Cards</button></li>
              <li><button onClick={() => onNavigate(AppScreen.LOGIN)} className="hover:text-white transition-colors">Vault</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-widest text-[#00C6FF]">Company</h5>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-widest text-[#00C6FF]">Legal</h5>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AML Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-widest text-[#00C6FF]">Status</h5>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#12B76A] font-medium">
                <span className="w-1.5 h-1.5 bg-[#12B76A] rounded-full animate-pulse"></span>
                Operational
              </span>
              <span className="text-[10px] text-gray-600 font-mono">v2.4.0-Stable</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2026 OBEY FINANCIAL TECHNOLOGIES LTD. ALL RIGHTS RESERVED.</p>
          <p className="tracking-widest uppercase text-[10px]">Secure Cloud Infrastructure Built on Antigravity</p>
        </div>
      </footer>
    </div>
  );
}
