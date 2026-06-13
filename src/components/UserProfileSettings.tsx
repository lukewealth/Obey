import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Lock, Eye, Check, Upload, Trash, 
  Settings, Award, Sparkles, Smartphone, ChevronRight, 
  CheckCircle2, AlertTriangle, RefreshCw, Bell, CreditCard,
  Zap, Star, Activity, ShieldCheck, Mail, Phone, ArrowRight
} from "lucide-react";

interface UserProfileSettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export default function UserProfileSettings({ profile, onUpdateProfile }: UserProfileSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [promoCode, setPromo] = useState(profile.promoCode);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // KYC States
  const [uploadedKycName, setUploadedKycName] = useState<string | null>(null);
  const [kycDragActive, setKycDragActive] = useState(false);
  const kycInputRef = useRef<HTMLInputElement>(null);
  const [submittingKyc, setSubmittingKyc] = useState(false);

  // Security States
  const [twoFactor, setTwoFactor] = useState(profile.twoFactorEnabled);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email, phone, promoCode });
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedKycName(e.target.files[0].name);
    }
  };

  const submitKycDocuments = () => {
    if (!uploadedKycName) return;
    setSubmittingKyc(true);
    setTimeout(() => {
      setSubmittingKyc(false);
      onUpdateProfile({ kycStatus: "Pending" });
    }, 1500);
  };

  const tabVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Identity</h2>
          <p className="text-gray-500 font-medium">Manage your institutional credentials and security nodes.</p>
        </div>
        <AnimatePresence>
          {showSaveSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] py-2.5 px-5 rounded-full border border-emerald-100 flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 size={14} /> Records Updated
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Profile Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-10"
        >
          <div className="bento-card p-10 space-y-12 group overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/30 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
            
            <div className="flex items-center gap-6 border-b border-gray-100 pb-10 relative z-10">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-primary to-secondary p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full bg-white rounded-[24px] flex items-center justify-center text-primary font-black text-2xl uppercase tracking-tighter shadow-inner">
                  {profile.avatar}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Identity Hub</h3>
                <p className="text-sm text-gray-500 font-medium">Verified Legal Entity: <span className="text-gray-900 font-bold">{profile.name}</span></p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Primary Email Node</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Verified Mobile ID</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Institutional Promo Node</label>
                  <div className="relative">
                    <Star className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromo(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-12 h-16 bg-primary hover:bg-primary/90 text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-[22px] shadow-2xl shadow-primary/20 transition-all active-press"
              >
                Sync Records
              </button>
            </form>
          </div>

          {/* Compliance Card */}
          <div className="bento-card p-10 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-yellow/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-[3s]"></div>
            
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">Identity Compliance</h3>
                 <p className="text-sm text-gray-500 font-medium">Tier-based institutional clearance protocol.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                <Shield size={14} fill="currentColor" />
                Level 2 Clearance
              </div>
            </div>

            {profile.kycStatus === "Verified" ? (
              <div className="p-10 bg-emerald-50/50 border border-emerald-100 rounded-[40px] flex items-start gap-8 relative z-10">
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-emerald-500 shadow-xl border border-emerald-100 shrink-0">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black text-gray-900 tracking-tight">Audit Authorized</h4>
                  <p className="text-base text-gray-600 font-medium leading-relaxed max-w-lg">
                    Your institutional profile has settled. Transactional ceilings have been removed and global digital routing is active on all nodes.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-2">
                     <Activity size={12} /> Live Settlement Active
                  </div>
                </div>
              </div>
            ) : profile.kycStatus === "Pending" ? (
              <div className="p-10 bg-accent-yellow/30 border border-yellow-100 rounded-[40px] flex items-start gap-8 relative z-10">
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-yellow-600 shadow-xl border border-yellow-100 shrink-0">
                  <RefreshCw size={40} className="animate-spin" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black text-gray-900 tracking-tight">Compliance Audit Queued</h4>
                  <p className="text-base text-gray-700 font-medium leading-relaxed">
                    Identity records are currently being audited against global merchant nodes. Estimated settlement: <span className="font-black text-primary">&lt;12 mins</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                <div className="p-8 bg-yellow-50/80 border border-yellow-100 rounded-[32px] flex gap-6 items-start">
                  <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none">Upgrade Required</h4>
                    <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                      Upload a valid National ID or Passport node to unlock Level 2 transactional magnitude and institutional global withdrawals.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <AnimatePresence mode="wait">
                    {uploadedKycName ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-8 bg-accent-blue/30 border border-blue-100 rounded-[32px]"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-[22px] flex items-center justify-center text-primary shadow-sm">
                            <ShieldCheck size={28} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-black text-gray-900 truncate max-w-xs">{uploadedKycName}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Node ready for audit</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedKycName(null)}
                          className="w-14 h-14 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-all active-press flex items-center justify-center"
                        >
                          <Trash size={24} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        onClick={() => kycInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[45px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-primary/40 transition-all duration-400"
                      >
                        <input
                          ref={kycInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleKycFileChange}
                          className="hidden"
                        />
                        <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-gray-300 shadow-sm mb-6">
                          <Upload size={40} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 tracking-tight">Initialize Asset Dispatch</h4>
                        <p className="text-sm text-gray-400 font-medium mt-2">Supports high-res JPG, PNG or PDF nodes up to 10MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={submitKycDocuments}
                    disabled={!uploadedKycName || submittingKyc}
                    className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50"
                  >
                    {submittingKyc ? <RefreshCw className="animate-spin" size={24} /> : (
                      <div className="flex items-center gap-3">Submit Identity Node <ArrowRight size={20} /></div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Security / Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-10"
        >
          <div className="bento-card p-10 space-y-10 group overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-blue/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary">
                <Lock size={24} />
              </div>
              <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Security Nodes</h4>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-1">
                  <h5 className="text-base font-black text-gray-900 tracking-tight">Biometric Auth</h5>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Multi-Sig Node</p>
                </div>
                <button
                  onClick={() => { setTwoFactor(!twoFactor); onUpdateProfile({ twoFactorEnabled: !twoFactor }); }}
                  className={`w-14 h-8 rounded-full p-1.5 transition-colors duration-400 ${twoFactor ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-400 ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="p-6 bg-accent-blue/20 border border-blue-100 rounded-[28px] space-y-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Compliance Guard Active</span>
                </div>
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  Encryption secrets are dynamically rotated and stored in multi-signature cold storage vaults for every sensitive node movement.
                </p>
              </div>

              <button className="w-full py-5 bg-gray-900 text-white rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active-press">
                Update Master Password
              </button>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="bg-primary rounded-[45px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/30 group">
            <div className="absolute inset-0 shimmer opacity-10"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-6 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-white mx-auto mb-4 border border-white/10 backdrop-blur-md">
                <Sparkles size={32} />
              </div>
              <h5 className="text-2xl font-black tracking-tight leading-tight">Master your <br /> wealth flow.</h5>
              <p className="text-white/60 font-medium text-sm leading-relaxed mx-auto max-w-[200px]">
                Corporate nodes receive world-class audit support and sub-zero spread trading.
              </p>
              <button className="w-full py-5 bg-white text-primary rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active-press transition-all hover:scale-[1.03]">
                Activate Elite Node
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
