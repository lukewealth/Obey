import React, { useState } from "react";
import { Shield, BadgeCheck, User, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IdentityVerificationProps {
  onComplete: () => void;
}

export default function IdentityVerification({ onComplete }: IdentityVerificationProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Content Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col justify-center space-y-8 md:space-y-10"
        >
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
              Verify Your<br/><span className="text-primary">Institutional Identity</span>
            </h1>
            <p className="mt-4 md:mt-6 text-gray-500 text-base md:text-lg max-w-xl font-medium mx-auto md:mx-0">
              To maintain the highest standards of security and regulatory compliance, we require a one-time identity verification to unlock full platform capabilities.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-6 md:space-y-8 max-w-lg mx-auto md:mx-0 w-full">
            {[
              { id: 1, title: "ID Upload", desc: "Official Passport, Driver’s License, or National ID card.", icon: CreditCard },
              { id: 2, title: "Selfie Verification", desc: "Liveness check to ensure the document belongs to you.", icon: User },
              { id: 3, title: "BVN Verification", desc: "Final validation against national financial databases.", icon: ShieldCheck }
            ].map((s) => (
              <div key={s.id} className={`flex items-start gap-4 md:gap-6 relative ${s.id < 3 ? "after:content-[''] after:absolute after:left-5 after:top-12 after:bottom-[-24px] after:w-0.5 after:bg-gray-100" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${step >= s.id ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                  <s.icon size={20} />
                </div>
                <div className="pt-1 overflow-hidden">
                  <h3 className={`text-lg md:text-xl font-black ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>{s.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 font-medium mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 md:pt-6">
            <button 
              onClick={handleStart}
              disabled={loading}
              className="w-full sm:w-auto px-8 md:px-12 h-14 md:h-16 bg-primary text-white rounded-[18px] md:rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Start Verification <ChevronRight size={20} /></>
              )}
            </button>
            <button className="w-full sm:w-auto px-8 md:px-12 h-14 md:h-16 border-2 border-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest rounded-[18px] md:rounded-2xl hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Visual/Trust Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-5 hidden lg:flex flex-col justify-center"
        >
          <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[40px] border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center text-primary">
                  <Shield size={28} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase text-primary tracking-[0.2em]">Security Protocol</h4>
                  <p className="text-xl font-black text-gray-900">Institutional-grade security</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Lock, text: "256-bit AES Encryption" },
                  { icon: BadgeCheck, text: "SOC2 Type II Compliant" },
                  { icon: Shield, text: "GDPR & KYC Compliant" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[22px] border border-gray-100/50">
                    <item.icon size={20} className="text-primary" />
                    <span className="font-bold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="rounded-[28px] overflow-hidden border border-gray-100">
                  <img 
                    src="/illustrations.jpg" 
                    alt="Security" 
                    className="w-full h-48 object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
