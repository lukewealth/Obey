import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Loader2, ArrowRight, CheckCircle2, 
  ShieldAlert, X, LogOut as LogOutIcon, RefreshCw,
  Mail, Fingerprint, Wallet, Activity
} from "lucide-react";
import { UserProfile } from "../types";

interface GatedVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  onLogout?: () => void;
  onRefresh?: () => void;
  profile: UserProfile;
}

export default function GatedVerificationModal({ isOpen, onClose, onVerify, onLogout, onRefresh, profile }: GatedVerificationModalProps) {
  const [status, setStatus] = useState<"initial" | "analyzing" | "complete">("initial");
  const [checklist, setChecklist] = useState({
    email: false,
    id: false,
    wallet: false,
    metadata: false
  });

  useEffect(() => {
    if (isOpen) {
      setStatus("initial");
      setChecklist({
        email: profile.isEmailVerified,
        id: !!profile.id,
        wallet: profile.balance >= 0,
        metadata: false
      });
    }
  }, [isOpen, profile]);

  const handleStartAnalysis = () => {
    setStatus("analyzing");
    
    // Step-by-step checklist animation
    const steps = ['email', 'id', 'wallet', 'metadata'];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setChecklist(prev => ({ ...prev, [step]: true }));
        if (index === steps.length - 1) {
          setStatus("complete");
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-2xl"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="w-full max-w-xl bg-white rounded-[35px] md:rounded-[50px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Success Particle Effects (Background) */}
            {status === "complete" && (
              <div className="absolute inset-0 pointer-events-none">
                 <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"
                 />
              </div>
            )}

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 text-center space-y-8 md:space-y-10">
               <AnimatePresence mode="wait">
                  {status === "initial" && (
                    <motion.div 
                      key="initial"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-8"
                    >
                       <div className="w-20 h-20 bg-accent-blue rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-inner">
                          <ShieldAlert size={40} />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Identity Checkpoint</h3>
                          <p className="text-gray-500 font-medium">Verify your institutional parameters to access the OBEY node.</p>
                       </div>

                       <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                          {[
                            { id: 'email', label: 'Email Node Alignment', icon: Mail, checked: profile.isEmailVerified },
                            { id: 'id', label: 'Institutional ID Sync', icon: Fingerprint, checked: !!profile.id },
                            { id: 'wallet', label: 'Core Wallet Integration', icon: Wallet, checked: true },
                            { id: 'metadata', label: 'Verified Metadata Mesh', icon: Activity, checked: false }
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${item.checked ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-gray-300'}`}>
                                     <item.icon size={18} />
                                  </div>
                                  <p className={`text-xs font-black uppercase tracking-widest ${item.checked ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                               </div>
                               {item.checked && <CheckCircle2 size={18} className="text-emerald-500" />}
                            </div>
                          ))}
                       </div>
                       
                       <button 
                        onClick={handleStartAnalysis}
                        className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active-press flex items-center justify-center gap-3"
                       >
                          Synchronize Nodes <ArrowRight size={20} />
                       </button>

                       <div className="flex items-center gap-4 pt-2">
                          <button 
                            onClick={onRefresh}
                            className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 active-press"
                          >
                             <RefreshCw size={14} /> ID Refresh
                          </button>
                          <button 
                            onClick={onLogout}
                            className="flex-1 py-4 border border-red-100 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2 active-press"
                          >
                             <LogOutIcon size={14} /> Exit Node
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {status === "analyzing" && (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8 py-6"
                    >
                       <div className="relative w-32 h-32 mx-auto">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-primary/10 border-t-primary rounded-full"
                          />
                          <div className="absolute inset-4 bg-gray-50 rounded-full flex items-center justify-center text-primary">
                             <Loader2 size={32} className="animate-spin" />
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Alignment in Progress</h3>
                          <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100 max-w-sm mx-auto">
                            {[
                              { id: 'email', label: 'Email Node Alignment', icon: Mail },
                              { id: 'id', label: 'Institutional ID Sync', icon: Fingerprint },
                              { id: 'wallet', label: 'Core Wallet Integration', icon: Wallet },
                              { id: 'metadata', label: 'Verified Metadata Mesh', icon: Activity }
                            ].map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <item.icon size={16} className={checklist[item.id as keyof typeof checklist] ? 'text-emerald-500' : 'text-gray-300'} />
                                   <p className={`text-[10px] font-black uppercase tracking-widest ${checklist[item.id as keyof typeof checklist] ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                                </div>
                                {checklist[item.id as keyof typeof checklist] ? (
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                ) : (
                                  <Loader2 size={14} className="text-primary animate-spin" />
                                )}
                              </div>
                            ))}
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {status === "complete" && (
                    <motion.div 
                      key="complete"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-10"
                    >
                       <motion.div 
                        initial={{ rotate: -20, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                       >
                          <CheckCircle2 size={48} />
                       </motion.div>
                       <div className="space-y-2">
                          <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Integrity Verified</h3>
                          <p className="text-gray-500 font-medium">Identity nodes synchronized. Secure session established.</p>
                       </div>
                       <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 text-left">
                          <ShieldCheck className="text-emerald-500 shrink-0" size={28} />
                          <div>
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Authentication Pulse</p>
                             <p className="text-base font-bold text-emerald-900">Success Code: OBY-SYNC-SEC</p>
                          </div>
                       </div>
                       <button 
                        onClick={onVerify}
                        className="w-full h-18 bg-[#0b0e14] text-white rounded-[25px] font-black uppercase text-sm tracking-[0.2em] shadow-2xl active-press hover:bg-primary transition-all flex items-center justify-center gap-3"
                       >
                          Enter Console <ArrowRight size={20} />
                       </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
