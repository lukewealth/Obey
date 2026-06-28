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
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          >
            {status === "complete" && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.05 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"
                />
              </div>
            )}

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 text-center space-y-5">
               <AnimatePresence mode="wait">
                  {status === "initial" && (
                    <motion.div 
                      key="initial"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-4"
                    >
                       <motion.div
                         initial={{ y: -10, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center text-primary mx-auto shadow-inner"
                       >
                          <ShieldAlert size={28} />
                       </motion.div>
                       
                        <div className="space-y-1">
                           <h3 className="text-xl font-bold text-gray-900 tracking-tight">Verify Your Identity</h3>
                           <p className="text-gray-500 text-sm">Complete verification to access all features.</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                           {[
                             { id: 'email', label: 'Email Verified', icon: Mail, checked: profile.isEmailVerified },
                             { id: 'id', label: 'ID Verified', icon: Fingerprint, checked: !!profile.id },
                             { id: 'wallet', label: 'Wallet Connected', icon: Wallet, checked: true },
                             { id: 'metadata', label: 'Profile Complete', icon: Activity, checked: false }
                           ].map((item, index) => (
                            <motion.div 
                              key={item.id}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between"
                            >
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.checked ? 'bg-emerald-50 text-emerald-500' : 'bg-white text-gray-300'}`}>
                                      <item.icon size={14} />
                                  </div>
                                  <p className={`text-xs font-medium ${item.checked ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                               </div>
                               <AnimatePresence>
                                 {item.checked && (
                                   <motion.div
                                     initial={{ scale: 0 }}
                                     animate={{ scale: 1 }}
                                     exit={{ scale: 0 }}
                                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                   >
                                      <CheckCircle2 size={14} className="text-emerald-500" />
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                           <currentTier.icon className={currentTier.color} size={16} />
                           <div className="text-left">
                              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Current Tier</p>
                              <p className={`text-xs font-bold ${currentTier.color}`}>{currentTier.name}</p>
                           </div>
                        </div>
                        
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartAnalysis}
                          className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                        >
                           Verify Now <ArrowRight size={16} />
                        </motion.button>

                        <div className="flex items-center gap-3 pt-1">
                           <motion.button 
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={onRefresh}
                             className="flex-1 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-[10px] tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                           >
                              <RefreshCw size={12} /> Refresh
                           </motion.button>
                           <motion.button 
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={onLogout}
                             className="flex-1 py-2.5 border border-red-100 text-red-500 rounded-lg font-medium text-[10px] tracking-wider hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"
                           >
                              <LogOutIcon size={12} /> Sign Out
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
                      className="space-y-4 py-2"
                    >
                       <div className="relative w-20 h-20 mx-auto">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-primary/10 border-t-primary rounded-full"
                          />
                          <div className="absolute inset-2 bg-gray-50 rounded-full flex items-center justify-center text-primary">
                             <Loader2 size={24} className="animate-spin" />
                          </div>
                       </div>
                       
                        <div className="space-y-3">
                           <h3 className="text-lg font-bold text-gray-900 tracking-tight">Verifying...</h3>
                           
                           <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                             <motion.div
                               className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full"
                               initial={{ width: "0%" }}
                               animate={{ width: `${(currentStep / 4) * 100}%` }}
                               transition={{ duration: 0.5 }}
                             />
                           </div>
                           
                           <div className="bg-gray-50 rounded-2xl p-3 space-y-2.5 border border-gray-100">
                             {[
                               { id: 'email', label: 'Email Verified', icon: Mail },
                               { id: 'id', label: 'ID Verified', icon: Fingerprint },
                               { id: 'wallet', label: 'Wallet Connected', icon: Wallet },
                               { id: 'metadata', label: 'Profile Complete', icon: Activity }
                             ].map((item, index) => (
                              <motion.div 
                                key={item.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                   <item.icon size={12} className={checklist[item.id as keyof typeof checklist] ? 'text-emerald-500' : 'text-gray-300'} />
                                   <p className={`text-[10px] font-medium ${checklist[item.id as keyof typeof checklist] ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                                </div>
                                <AnimatePresence mode="wait">
                                  {checklist[item.id as keyof typeof checklist] ? (
                                    <motion.div
                                      key="check"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                       <CheckCircle2 size={12} className="text-emerald-500" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="loader"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                       <Loader2 size={12} className="text-primary" />
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
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      className="space-y-5"
                    >
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                         className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                       >
                          <CheckCircle2 size={32} />
                       </motion.div>
                       
                        <div className="space-y-1">
                           <motion.h3
                             initial={{ y: 10, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.2 }}
                             className="text-xl font-bold text-gray-900 tracking-tight"
                           >
                              Verification Complete
                           </motion.h3>
                           <motion.p
                             initial={{ y: 10, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             transition={{ delay: 0.3 }}
                             className="text-gray-500 text-sm"
                           >
                              You can now access all features.
                           </motion.p>
                        </div>
                        
                        <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3"
                        >
                           <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                           <div>
                              <p className="text-[9px] font-medium text-emerald-600 uppercase tracking-wider">Status</p>
                              <p className="text-sm font-bold text-emerald-900">Verified</p>
                           </div>
                        </motion.div>
                        
                        <motion.button 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onVerify}
                          className="w-full h-12 bg-[#0b0e14] text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                        >
                           Continue <ArrowRight size={16} />
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
