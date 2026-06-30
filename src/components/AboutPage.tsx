import React from "react";
import { motion } from "framer-motion";
import { Shield, Globe, Zap, Users, Award, Heart, Code, Lock, ChevronRight, ExternalLink } from "lucide-react";
import { AppScreen } from "../types";

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export default function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0b0e14] text-white py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors mb-12 group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">
              About OBEY
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              The Future of<br />
              <span className="text-primary italic">Digital Finance</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-2xl">
              OBEY is a next-generation digital financial platform built on institutional-grade infrastructure, 
              combining crypto trading, banking, payments, and wealth management in one seamless experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0b0e14] leading-tight">
                Democratizing access to<br />
                <span className="text-primary italic">institutional finance</span>
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                We believe everyone deserves access to the same financial tools and infrastructure 
                that power global institutions. OBEY bridges the gap between traditional banking 
                and decentralized finance, creating a unified platform that's secure, fast, and accessible.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Instant Settlement</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-purple-700 uppercase tracking-widest">Global Access</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "$2.5B+", label: "Monthly Volume", icon: Globe },
                { value: "140+", label: "Countries", icon: Globe },
                { value: "500K+", label: "Active Users", icon: Users },
                { value: "99.99%", label: "Uptime", icon: Zap },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 space-y-3"
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                  <p className="text-3xl md:text-4xl font-black text-[#0b0e14] tracking-tighter">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16 md:mb-20">
            <div className="inline-flex px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Core Values
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0b0e14]">
              Built on <span className="text-primary italic">principles</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Security First",
                desc: "256-bit AES encryption, biometric authentication, and multi-signature authorization protect every transaction.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: Lock,
                title: "Privacy by Design",
                desc: "Your financial data is encrypted at rest and in transit. We never sell or share your personal information.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Zap,
                title: "Instant Everything",
                desc: "Sub-second transaction settlement, real-time market data, and instant notifications keep you ahead.",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: Code,
                title: "Open Infrastructure",
                desc: "Built on open protocols with public APIs, SDKs, and developer tools for the next generation of fintech.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Heart,
                title: "User Obsessed",
                desc: "Every feature is designed with user experience as the primary consideration. Simple, beautiful, powerful.",
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                icon: Award,
                title: "Regulatory Compliance",
                desc: "Fully licensed and regulated. CBN approved, PCI-DSS compliant, and aligned with global financial standards.",
                color: "text-primary",
                bg: "bg-primary/5",
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 space-y-6 hover:shadow-xl transition-shadow group"
              >
                <div className={`w-12 h-12 ${value.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-6 h-6 ${value.color}`} />
                </div>
                <h3 className="text-xl font-black text-[#0b0e14] tracking-tight">{value.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0b0e14] rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="inline-flex px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">
                Compliance & Trust
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                Licensed. Regulated.<br />
                <span className="text-primary italic">Trusted globally.</span>
              </h2>
              <p className="text-lg text-white/60 font-medium leading-relaxed max-w-2xl mb-12">
                OBEY operates under strict regulatory oversight, ensuring your funds are protected 
                and your transactions comply with international financial standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "CBN Licensed", desc: "Central Bank of Nigeria" },
                  { label: "PCI-DSS", desc: "Payment Card Industry" },
                  { label: "SOC 2 Type II", desc: "Security & Compliance" },
                  { label: "GDPR", desc: "Data Protection" },
                ].map((cert, i) => (
                  <div key={cert.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                    <p className="text-lg font-black text-white">{cert.label}</p>
                    <p className="text-xs text-white/40 font-medium">{cert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0b0e14] leading-tight">
            Ready to join the<br />
            <span className="text-primary italic">next generation?</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
            Get started with OBEY today and experience the future of digital finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onBack}
              className="h-14 px-10 bg-[#0b0e14] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl active-press flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight size={16} />
            </button>
            <button
              onClick={() => onNavigate(AppScreen.SDK)}
              className="h-14 px-10 bg-white text-[#0b0e14] border border-gray-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm active-press flex items-center justify-center gap-2"
            >
              Developer Docs <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
