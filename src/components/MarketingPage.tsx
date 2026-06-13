import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, ArrowRight, Zap, Coins, Globe, Heart, 
  Award, ArrowUpRight, ChevronRight, Lock, Play, Star,
  Smartphone, CreditCard, RefreshCw, BarChart3, TrendingUp,
  ZapOff, CheckCircle2, ShieldAlert
} from "lucide-react";

interface MarketingPageProps {
  onNavigate: (screen: AppScreen) => void;
  btcPrice: number;
  ethPrice: number;
}

export default function MarketingPage({ onNavigate, btcPrice, ethPrice }: MarketingPageProps) {
  const [activeHeader, setActiveHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActiveHeader(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-bg-white)_0%,_var(--color-accent-blue)_50%,_var(--color-accent-yellow)_100%)] -z-20"></div>
      
      {/* Apple-style Glass Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-16 md:h-20 ${
          activeHeader
            ? "bg-white/70 border-b border-gray-100 backdrop-blur-2xl shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-black tracking-tighter text-primary">OBEY</span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-10">
            {["Solutions", "Security", "Ecosystem", "Institutional"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-[13px] font-bold text-gray-500 hover:text-primary transition-colors tracking-tight"
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="text-[13px] font-bold text-gray-700 hover:text-primary transition-colors py-2 px-4 rounded-full active-press"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-primary text-white hover:bg-primary/90 transition-all py-2.5 px-7 rounded-full text-[13px] font-bold shadow-xl shadow-primary/20 active-press"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-52 md:pb-40 relative flex flex-col items-center px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl text-center space-y-10"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-secondary text-[11px] font-black uppercase tracking-widest shadow-lg shadow-black/5"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              The Next Standard in Digital Liquidity
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-7xl md:text-[100px] font-black tracking-tighter leading-[0.9] text-gray-900"
            >
              Finance, <br />
              <span className="gradient-text">Masterfully</span> <br />
              Engineered.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Experience a hyper-efficient digital ecosystem for global payments, 
              institutional crypto assets, and seamless enterprise liquidity.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <button
                onClick={() => onNavigate(AppScreen.REGISTER)}
                className="w-full sm:w-auto bg-primary text-white font-bold text-lg px-12 py-6 rounded-[22px] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active-press"
              >
                Join the Network
              </button>
              <button
                onClick={() => onNavigate(AppScreen.LOGIN)}
                className="w-full sm:w-auto bg-white/60 backdrop-blur-md border border-white text-gray-900 font-bold text-lg px-12 py-6 rounded-[22px] shadow-sm transition-all hover:bg-white active-press flex items-center justify-center gap-3"
              >
                <Play size={20} fill="currentColor" /> Ecosystem Tour
              </button>
            </motion.div>
          </motion.div>

          {/* Featured Image: Dashboard Improvement */}
          <motion.div 
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 relative w-full max-w-6xl mx-auto px-4"
          >
            <div className="relative rounded-[45px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[1px] border-white/50 group">
              <div className="absolute inset-0 shimmer opacity-20 pointer-events-none"></div>
              <img 
                src="/Dasboard improvement.jpg" 
                alt="Obey Console" 
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                <div className="text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Platform v2.4.0 Stable</p>
                  </div>
                  <h3 className="text-5xl font-black tracking-tighter">Unified Operations.</h3>
                </div>
                <div className="hidden md:flex gap-6">
                  <div className="bg-white/20 backdrop-blur-xl px-6 py-4 rounded-[20px] text-white border border-white/20">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Status</p>
                    <p className="text-lg font-bold">Operational</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-xl px-6 py-4 rounded-[20px] text-white border border-white/20">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Network</p>
                    <p className="text-lg font-bold">Mainnet</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Micro UI Widgets */}
            <motion.div 
              animate={{ y: [0, -25, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 -left-12 p-8 bento-card border-none bg-white/80 z-20 hidden lg:block"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-accent-blue text-primary rounded-[20px] flex items-center justify-center shadow-inner">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Performance</p>
                  <p className="text-2xl font-black text-gray-900">+142.5%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 25, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-20 -right-16 p-8 bg-secondary rounded-[35px] shadow-2xl z-20 hidden lg:block border border-white/10"
            >
              <div className="flex items-center gap-5 text-white">
                <div className="w-14 h-14 bg-white/10 rounded-[20px] flex items-center justify-center">
                  <Lock size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">Security Level</p>
                  <p className="text-2xl font-black">Bank Grade</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Live Market Ticker */}
        <div className="w-full bg-white/30 backdrop-blur-md border-y border-white/50 py-4 md:py-6 overflow-hidden">
          <div className="flex whitespace-nowrap animate-ticker gap-16 md:gap-32 items-center">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Star size={18} fill="currentColor" />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest text-gray-400">BTC/USD</span>
                  <span className="text-xl font-bold font-mono tracking-tighter text-gray-900">${btcPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-emerald-500">+2.4%</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Smartphone size={18} />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest text-gray-400">ETH/USD</span>
                  <span className="text-xl font-bold font-mono tracking-tighter text-gray-900">${ethPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-emerald-500">+1.8%</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Zap size={18} />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest text-gray-400">NGN/USD</span>
                  <span className="text-xl font-bold font-mono tracking-tighter text-gray-900">₦1,425.00</span>
                  <span className="text-sm font-bold text-red-500">-0.4%</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bento Grid Features */}
        <section id="ecosystem" className="py-24 md:py-48 px-6">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="max-w-3xl space-y-6">
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Our Capabilities</span>
              <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
                Built for the <br />
                <span className="gradient-text">Hyper-Efficient.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Feature 1: Finsy Dashboard Influence */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-8 bento-card p-0 overflow-hidden group"
              >
                <div className="p-12 space-y-6">
                  <div className="w-16 h-16 bg-accent-blue rounded-[24px] flex items-center justify-center text-primary">
                    <CreditCard size={32} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-gray-900">Institutional Grade Wallets</h3>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg">
                    Manage multi-currency balances with bank-grade security protocols. 
                    Real-time settlement for enterprise liquidity at global scale.
                  </p>
                </div>
                <div className="mt-4 px-12 pb-12">
                  <img 
                    src="/142d283d890b510dcbc14b40f51acc9b.jpg" 
                    alt="Financial Dashboard" 
                    className="rounded-[30px] border border-black/5 group-hover:scale-[1.03] transition-transform duration-1000 shadow-2xl"
                  />
                </div>
              </motion.div>

              {/* Feature 2: Exchange */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-4 bg-primary p-12 rounded-[45px] shadow-2xl shadow-primary/40 flex flex-col justify-between text-white overflow-hidden relative"
              >
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative space-y-8">
                  <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center">
                    <RefreshCw size={32} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">Instant Liquidity</h3>
                  <p className="text-white/70 font-medium text-lg leading-relaxed">
                    Trade between fiat and crypto assets with sub-zero spreads and zero latency.
                  </p>
                </div>
                <div className="relative mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">LIVE TRADING</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold">OPERATIONAL</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: Gift Cards */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-4 bento-card p-0 flex flex-col overflow-hidden bg-accent-yellow/50 group"
              >
                <div className="p-12 space-y-6">
                  <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-yellow-600 shadow-sm">
                    <Star size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-gray-900">Premium Market</h3>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    Access global brands and liquidate gift assets at industry-leading rates.
                  </p>
                </div>
                <div className="mt-auto px-12 pb-12">
                   <img 
                    src="/gitfacrds.jpg" 
                    alt="Gift Cards" 
                    className="rounded-[25px] group-hover:rotate-2 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Feature 4: UI/UX Analytics */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="md:col-span-8 bento-card p-0 overflow-hidden flex flex-col md:flex-row items-center group"
              >
                <div className="p-12 space-y-8 flex-1">
                  <div className="w-16 h-16 bg-accent-blue rounded-[24px] flex items-center justify-center text-primary">
                    <BarChart3 size={32} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-gray-900">Advanced Analytics</h3>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    Visualize your wealth flow with precision. Real-time insights powered by high-fidelity data nodes.
                  </p>
                  <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest active-press shadow-xl shadow-primary/20">
                    Explore Charts
                  </button>
                </div>
                <div className="flex-1 w-full h-full min-h-[400px]">
                   <img 
                    src="/ui:ux.jpg" 
                    alt="Analytics Charts" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security / Trust Section */}
        <section id="security" className="py-24 md:py-48 bg-gray-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-primary text-[11px] font-black uppercase tracking-[0.3em]">
                <Lock size={14} /> Bank-Grade Infrastructure
              </div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                Security is <br />
                <span className="opacity-40">not optional.</span>
              </h2>
              <p className="text-xl text-white/50 font-medium leading-relaxed max-w-lg">
                We employ multi-layer encryption, cold-storage custody, and AI-driven fraud detection to ensure your assets remain untouchable.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                  <p className="text-4xl font-black">256-bit</p>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">AES Encryption</p>
                </div>
                <div className="space-y-3">
                  <p className="text-4xl font-black">0.0%</p>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Breach History</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-24 bg-primary/20 rounded-full blur-[120px]"></div>
              <div className="relative bento-card bg-white/5 border-white/10 p-12 backdrop-blur-3xl space-y-12">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-primary">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                    Live Shield Active
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest opacity-40">
                    <span>Vault Integrity</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-primary"
                    ></motion.div>
                  </div>
                </div>
                <div className="space-y-6">
                  {["Cold-storage institutional custody", "Real-time AI threat monitoring", "Multi-signature withdrawal gates"].map((text) => (
                    <div key={text} className="flex items-center gap-4">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                      <span className="text-lg font-medium text-white/80">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 md:py-48 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-12"
          >
            <h2 className="text-5xl md:text-[110px] font-black tracking-tighter leading-[0.85] text-gray-900">
              Elevate <br />
              <span className="gradient-text">Your Ambition.</span>
            </h2>
            <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Join 15M+ users redefining the boundaries of money and technology.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
               <button
                onClick={() => onNavigate(AppScreen.REGISTER)}
                className="bg-primary text-white font-black text-xl px-16 py-8 rounded-[30px] shadow-2xl shadow-primary/40 transition-all hover:scale-[1.05] active-press"
              >
                Create Account
              </button>
              <button
                onClick={() => onNavigate(AppScreen.LOGIN)}
                className="bg-white border border-gray-200 text-gray-900 font-black text-xl px-16 py-8 rounded-[30px] shadow-sm transition-all hover:bg-gray-50 active-press"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-xl border-t border-gray-100 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-8">
            <span className="text-3xl font-black text-primary tracking-tighter">OBEY</span>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              We're building the infrastructure for a more open, efficient, and transparent financial world. Engineered for the future.
            </p>
            <div className="flex gap-6">
              {[Globe, BarChart3, ShieldCheck].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-primary shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "Platform", links: ["Payments", "Crypto Vault", "Gift Market", "Institutional"] },
              { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "AML Policy", "Compliance"] },
              { title: "Status", links: ["Operational", "v2.4.0", "Cloud Node", "SUI Mainnet"] }
            ].map((section) => (section.title && (
              <div key={section.title} className="space-y-8">
                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900">{section.title}</h5>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            © 2026 OBEY FINANCIAL TECHNOLOGIES LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">SYSTEM STATUS: OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
