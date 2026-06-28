import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Loader2, ArrowRight, CheckCircle2, 
  ShieldAlert, X, LogOut as LogOutIcon, RefreshCw,
  Mail, Fingerprint, Wallet, Activity, Crown, Star,
  Zap, Award, TrendingUp
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
  const [currentStep, setCurrentStep] = useState(0);
  const [checklist, setChecklist] = useState({
    email: false,
    id: false,
    wallet: false,
    metadata: false
  });

  useEffect(() => {
    if (isOpen) {
      setStatus("initial");
      setCurrentStep(0);
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
    
    const steps = ['email', 'id', 'wallet', 'metadata'];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setChecklist(prev => ({ ...prev, [step]: true }));
        setCurrentStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => setStatus("complete"), 500);
        }
      }, (index + 1) * 800);
    });
  };

  const tierInfo = {
    1: { name: "Standard", icon: Star, color: "text-gray-500", bg: "bg-gray-100" },
    2: { name: "Verified", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-100" },
    3: { name: "Premium", icon: Crown, color: "text-purple-500", bg: "bg-purple-100" },
    4: { name: "Institutional", icon: Award, color: "text-amber-500", bg: "bg-amber-100" }
  };

  const currentTier = tierInfo[profile.tierLevel as keyof typeof tierInfo] || tierInfo[1];

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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-xl bg-white rounded-[35px] md:rounded-[50px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {status === "complete" && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"
                />
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary rounded-full blur-3xl"
                />
              </div>
            )}

            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full active-scale"
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
                       <motion.div
                         initial={{ y: -20, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         className="w-20 h-20 bg-accent-blue rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-inner"
                       >
                          <ShieldAlert size={40} />
                       </motion.div>
                       
                        <div className="space-y-2">
                           <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Verify Your Identity</h3>
                           <p className="text-gray-500 font-medium">Complete verification to access all features.</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                           {[
                             { id: 'email', label: 'Email Verified', icon: Mail, checked: profile.isEmailVerified },
                             { id: 'id', label: 'ID Verified', icon: Fingerprint, checked: !!profile.id },
                             { id: 'wallet', label: 'Wallet Connected', icon: Wallet, checked: true },
                             { id: 'metadata', label: 'Profile Complete', icon: Activity, checked: false }
                           ].map((item, index) => (
                            <motion.div 
                              key={item.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between"
                            >
                               <div className="flex items-center gap-4">
                                  <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${item.checked ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-gray-300'}`}
                                  >
                                      <item.icon size={18} />
                                  </motion.div>
                                  <p className={`text-xs font-black uppercase tracking-widest ${item.checked ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                               </div>
                               <AnimatePresence>
                                 {item.checked && (
                                   <motion.div
                                     initial={{ scale: 0, rotate: -180 }}
                                     animate={{ scale: 1, rotate: 0 }}
                                     exit={{ scale: 0 }}
                                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                   >
                                      <CheckCircle2 size={18} className="text-emerald-500" />
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                            </motion.div>
                          ))}
                       </div>

                       <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                          <currentTier.icon className={currentTier.color} size={24} />
                          <div className="text-left">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Tier</p>
                             <p className={`text-sm font-black ${currentTier.color}`}>{currentTier.name}</p>
                          </div>
                       </div>
                       
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartAnalysis}
                          className="w-full h-16 bg-primary text-white rounded-2xl font-bold uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:shadow-primary/40 transition-shadow"
                        >
                           Verify Now <ArrowRight size={20} />
                        </motion.button>

                        <div className="flex items-center gap-4 pt-2">
                           <motion.button 
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={onRefresh}
                             className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                           >
                              <RefreshCw size={14} /> Refresh
                           </motion.button>
                           <motion.button 
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={onLogout}
                             className="flex-1 py-4 border border-red-100 text-red-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                           >
                              <LogOutIcon size={14} /> Sign Out
                           </motion.button>
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
                          <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 border-4 border-primary/5 border-b-primary/50 rounded-full"
                          />
                          <div className="absolute inset-4 bg-gray-50 rounded-full flex items-center justify-center text-primary">
                             <motion.div
                               animate={{ scale: [1, 1.1, 1] }}
                               transition={{ duration: 1, repeat: Infinity }}
                             >
                                <Loader2 size={32} className="animate-spin" />
                             </motion.div>
                          </div>
                       </div>
                       
                        <div className="space-y-6">
                           <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verifying...</h3>
                           
                           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                             <motion.div
                               className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full"
                               initial={{ width: "0%" }}
                               animate={{ width: `${(currentStep / 4) * 100}%` }}
                               transition={{ duration: 0.5 }}
                             />
                           </div>
                           
                           <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100 max-w-sm mx-auto">
                             {[
                               { id: 'email', label: 'Email Verified', icon: Mail },
                               { id: 'id', label: 'ID Verified', icon: Fingerprint },
                               { id: 'wallet', label: 'Wallet Connected', icon: Wallet },
                               { id: 'metadata', label: 'Profile Complete', icon: Activity }
                             ].map((item, index) => (
                              <motion.div 
                                key={item.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                   <motion.div
                                     animate={checklist[item.id as keyof typeof checklist] ? { scale: [1, 1.2, 1] } : {}}
                                     transition={{ duration: 0.3 }}
                                   >
                                      <item.icon size={16} className={checklist[item.id as keyof typeof checklist] ? 'text-emerald-500' : 'text-gray-300'} />
                                   </motion.div>
                                   <p className={`text-[10px] font-black uppercase tracking-widest ${checklist[item.id as keyof typeof checklist] ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                                </div>
                                <AnimatePresence mode="wait">
                                  {checklist[item.id as keyof typeof checklist] ? (
                                    <motion.div
                                      key="check"
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      exit={{ scale: 0 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                       <CheckCircle2 size={14} className="text-emerald-500" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="loader"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                       <Loader2 size={14} className="text-primary" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
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
                      transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      className="space-y-10"
                    >
                       <motion.div 
                         initial={{ rotate: -20, scale: 0.5 }}
                         animate={{ rotate: 0, scale: 1 }}
                         transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                         className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                       >
                          <CheckCircle2 size={48} />
                       </motion.div>
                       
                        <div className="space-y-2">
                           <motion.h3
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.3 }}
                             className="text-4xl font-black text-gray-900 tracking-tighter"
                           >
                             Verification Complete
                           </motion.h3>
                           <motion.p
                             initial={{ y: 20, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.4 }}
                             className="text-gray-500 font-medium"
                           >
                             Your identity has been verified. You can now access all features.
                           </motion.p>
                        </div>
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 text-left"
                        >
                           <ShieldCheck className="text-emerald-500 shrink-0" size={28} />
                           <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verification Code</p>
                              <p className="text-base font-bold text-emerald-900">Status: Verified</p>
                           </div>
                        </motion.div>
                        
                        <motion.button 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onVerify}
                          className="w-full h-18 bg-[#0b0e14] text-white rounded-[25px] font-bold uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                        >
                           Continue <ArrowRight size={20} />
                        </motion.button>
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
