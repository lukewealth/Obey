import React, { useState, useRef } from "react";
import { Shield, BadgeCheck, User, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Lock, Upload, Camera, Loader2, Sparkles, ArrowRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { UserProfile } from "../types";

interface IdentityVerificationProps {
  profile: UserProfile;
  onComplete: (kycLevel: number) => void;
}

export default function IdentityVerification({ profile, onComplete }: IdentityVerificationProps) {
  const [step, setStep] = useState(1); // 1: Intro, 2: ID Type, 3: ID Upload, 4: Selfie, 5: Analyzing, 6: Success
  const [loading, setLoading] = useState(false);
  const [idType, setIdType] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStart = () => {
    setStep(2);
  };

  const selectIdType = (type: string) => {
    setIdType(type);
    setStep(3);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setStep(4);
    }
  };

  const handleSelfieCapture = () => {
    setStep(5);
    setLoading(true);
    
    // Simulate Interswitch Identity Node sequence
    setTimeout(async () => {
      try {
        const res = await api.post('/sync/verify-kyc', {
          userId: profile.id || profile.email,
          idType: idType,
          idNumber: "SIM-8824-9010",
          livenessScore: 0.98
        });

        if (res.data.success) {
          setStep(6);
          setLoading(false);
        } else {
          throw new Error("Verification failed");
        }
      } catch (err) {
        setLoading(false);
        alert("Compliance Node Rejection. Please retry.");
        setStep(1);
      }
    }, 3500);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4 md:px-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="intro" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="space-y-10 md:space-y-16 text-center">
            <div className="space-y-6">
              <motion.div 
                initial={{ rotate: -10, scale: 0.8 }} 
                animate={{ rotate: 0, scale: 1 }} 
                className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-[35px] md:rounded-[45px] flex items-center justify-center text-primary mx-auto shadow-inner"
              >
                <Shield size={48} className="md:w-16 md:h-16" />
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Institutional <br/>Identity Node</h1>
                <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto font-medium">Level 2 verification unlocks Marketplace Escrow and unlimited institutional liquidity routing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
               {[
                 { title: "Escrow Access", desc: "Peer-to-Peer trading nodes.", icon: BadgeCheck },
                 { title: "No Limits", desc: "Unlimited magnitude routing.", icon: Zap },
                 { title: "Elite Status", desc: "Corporate clearing credentials.", icon: Star }
               ].map((benefit, i) => (
                 <div key={benefit.title} className="p-6 md:p-8 bg-white border border-gray-100 rounded-[28px] md:rounded-[32px] shadow-sm space-y-3 text-left group hover:border-primary/20 transition-all">
                    <benefit.icon className="text-primary" size={24} />
                    <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">{benefit.title}</h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{benefit.desc}</p>
                 </div>
               ))}
            </div>

            <button 
              onClick={handleStart}
              className="w-full md:w-auto px-12 md:px-16 h-16 md:h-20 bg-primary text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active-press flex items-center justify-center gap-3 mx-auto"
            >
              Initiate Protocol <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="type" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} className="space-y-10">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Select Node Type</h2>
                <p className="text-gray-500 font-medium">Choose your primary government identification asset.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "passport", label: "International Passport", icon: GlobeIcon },
                  { id: "license", label: "Driver's License", icon: CreditCard },
                  { id: "national", label: "National ID Card", icon: Shield },
                  { id: "voter", label: "Voter's Identity Node", icon: UserIcon }
                ].map((type) => (
                  <button 
                    key={type.id} 
                    onClick={() => selectIdType(type.id)}
                    className="p-8 md:p-10 bg-white border border-gray-100 rounded-[35px] flex items-center gap-6 hover:border-primary hover:shadow-2xl transition-all group active-press"
                  >
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <CreditCard size={28} />
                     </div>
                     <span className="text-lg font-black text-gray-900 uppercase tracking-tight">{type.label}</span>
                  </button>
                ))}
             </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="upload" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Asset Registration</h2>
                <p className="text-gray-500 font-medium">Scan or upload a high-fidelity image of your {idType} node.</p>
             </div>
             <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-gray-100 bg-gray-50/50 rounded-[45px] p-16 md:p-24 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-primary/20 transition-all group"
             >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm mb-6">
                   <Upload size={32} />
                </div>
                <h4 className="text-xl font-black text-gray-900 uppercase italic">Initialize Scan</h4>
                <p className="text-xs text-gray-400 font-medium mt-2">JPEG, PNG or Digital Node PDF (Max 10MB)</p>
             </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="selfie" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10 text-center">
             <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Liveness Verification</h2>
                <p className="text-gray-500 font-medium">Verify the node owner with a biometric liveness check.</p>
             </div>
             <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-900 rounded-full mx-auto relative overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                   <Camera size={64} className="animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                <motion.div 
                  animate={{ y: [0, 80, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-primary/40 blur-md z-10"
                ></motion.div>
             </div>
             <div className="max-w-xs mx-auto space-y-6">
                <div className="flex items-center gap-3 p-4 bg-accent-blue/40 rounded-2xl border border-blue-100 text-left">
                   <ShieldCheck size={20} className="text-primary shrink-0" />
                   <p className="text-[10px] text-blue-800 font-medium leading-relaxed uppercase tracking-widest">Biometric Mesh Active</p>
                </div>
                <button 
                  onClick={handleSelfieCapture}
                  className="w-full h-16 md:h-18 bg-primary text-white rounded-[20px] md:rounded-[25px] font-black uppercase text-xs tracking-widest shadow-2xl active-press"
                >
                  Capture Liveness Pulse
                </button>
             </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="analyzing" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10 py-12 md:py-20 text-center">
             <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-8 border-gray-50 border-t-primary rounded-full shadow-inner"
                />
                <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                   <RefreshCw size={48} className="animate-spin" />
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-widest uppercase italic">Mesh Analysis</h3>
                <div className="flex flex-col gap-2 items-center">
                   <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="flex items-center gap-3"
                   >
                      <Activity size={16} className="text-primary" />
                      <p className="text-[10px] md:text-[12px] font-black text-primary uppercase tracking-[0.4em]">Interswitch Identity Sync...</p>
                   </motion.div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Comparing biometric metadata with national nodes</p>
                </div>
             </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="success" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10 md:space-y-16 text-center">
             <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -30 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-32 h-32 md:w-40 md:h-40 bg-emerald-500 text-white rounded-[45px] md:rounded-[55px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                >
                   <CheckCircle2 size={64} className="md:w-20 md:h-20" />
                </motion.div>
                <div className="space-y-3">
                   <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Node Level 2<br/><span className="text-emerald-500">Authorized</span></h2>
                   <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto font-medium">Compliance sequence settled. Institutional access established across all ledger nodes.</p>
                </div>
             </div>

             <div className="bg-emerald-50/50 rounded-[35px] p-8 md:p-10 border border-emerald-100 flex flex-col sm:flex-row items-center gap-8 text-left shadow-inner">
                <ShieldCheck size={48} className="text-emerald-500 shrink-0" />
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Authentication Pulse Verified</p>
                   <p className="text-lg md:text-xl font-black text-emerald-900 tracking-tight">Escrow & Institutional Nodes Unlocked.</p>
                </div>
                <div className="hidden sm:block ml-auto px-4 py-2 bg-white rounded-xl border border-emerald-100 font-mono text-[10px] font-bold text-emerald-600 shadow-sm">
                   CODE: OBY-L2-SYNC
                </div>
             </div>

             <button 
              onClick={() => onComplete(2)}
              className="w-full md:w-auto px-16 h-18 md:h-20 bg-[#0b0e14] text-white rounded-[25px] md:rounded-[30px] font-black uppercase text-sm md:text-base tracking-[0.2em] shadow-2xl active-press hover:bg-primary transition-all flex items-center justify-center gap-3 mx-auto"
             >
                Return to Dashboard <ArrowRight size={20} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Internal icons not provided in the prompt but used for visual fidelity
const GlobeIcon = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const UserIcon = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
