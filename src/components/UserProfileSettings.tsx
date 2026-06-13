import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import { 
  User, Shield, Lock, Eye, Check, Upload, Trash, 
  Settings, Award, Sparkles, Smartphone, ChevronRight, CheckCircle2, AlertTriangle, RefreshCw
} from "lucide-react";

interface UserProfileSettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export default function UserProfileSettings({ profile, onUpdateProfile }: UserProfileSettingsProps) {
  // Edit Profile States
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

  const handleKycDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setKycDragActive(true);
    } else if (e.type === "dragleave") {
      setKycDragActive(false);
    }
  };

  const handleKycDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setKycDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedKycName(e.dataTransfer.files[0].name);
    }
  };

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedKycName(e.target.files[0].name);
    }
  };

  const removeKycFile = () => {
    setUploadedKycName(null);
    if (kycInputRef.current) kycInputRef.current.value = "";
  };

  const submitKycDocuments = () => {
    if (!uploadedKycName) return;
    setSubmittingKyc(true);
    setTimeout(() => {
      setSubmittingKyc(false);
      // Trigger Pending status transition
      onUpdateProfile({ kycStatus: "Pending" });
    }, 1500);
  };

  const handleTwoFactorToggle = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    onUpdateProfile({ twoFactorEnabled: nextVal });
  };

  return (
    <div className="space-y-8 pb-12">
      {showSaveSuccess && (
        <div className="fixed top-20 right-6 bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} /> Changes Saved Successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Account Biography Editor */}
        <div className="lg:col-span-8 space-y-8">
          
          <form onSubmit={handleProfileSave} className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white leading-none border-b border-[#242F41] pb-4">Personal Profile Credentials</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full h-11 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] text-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full h-11 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] text-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full h-11 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] text-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Promo code (Affiliation ID)</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromo(e.target.value)}
                  className="block w-full h-11 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] text-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 h-12 bg-[#0057FF] hover:bg-blue-600 active-press text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
            >
              Commit Changes
            </button>
          </form>

          {/* Connected Compliance Documentation check */}
          <section className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white leading-none">Identity Compliance Verification</h3>
            
            {profile.kycStatus === "Verified" ? (
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Full Identity Verification Completed</h4>
                  <p className="text-xs text-slate-400 font-light mt-1">
                    Your legal profile limits are raised to Level 2 (No transactional ceilings). You have full access to global clearings.
                  </p>
                </div>
              </div>
            ) : profile.kycStatus === "Pending" ? (
              <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 shrink-0 animate-pulse">
                  <RefreshCw size={28} className="animate-spin" style={{ animationDuration: "10s" }} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Verification audit queued</h4>
                  <p className="text-xs text-slate-400 font-light mt-1">
                    Compliance officers are actively auditing your attached passport document files. Wait time averages under 30 minutes. You can approve this yourself via the Admin Desk!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3 items-start text-xs font-light">
                  <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                  <div>
                    <h5 className="font-bold text-white">Action Required: Level 2 Limits</h5>
                    <p className="text-slate-400 leading-relaxed text-[11px] mt-0.5">
                      Upload your valid National Identification Slip or International Passport photo card files. Verification clears up your limits instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {uploadedKycName ? (
                    <div className="flex items-center justify-between p-4 bg-[#0B1220] border border-[#242F41] rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#00C6FF]">
                          <CheckCircle2 size={20} />
                        </div>
                        <span className="text-xs font-bold text-white truncate max-w-xs">{uploadedKycName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeKycFile}
                        className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-500 rounded-lg active-press shrink-0"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleKycDrag}
                      onDragOver={handleKycDrag}
                      onDragLeave={handleKycDrag}
                      onDrop={handleKycDrop}
                      onClick={() => kycInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        kycDragActive 
                          ? "border-[#0057FF] bg-[#0057FF]/5" 
                          : "border-[#242F41] bg-[#0B1220]/40 hover:bg-[#0B1220]/80"
                      }`}
                    >
                      <input
                        ref={kycInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleKycFileChange}
                        className="hidden"
                      />
                      <Upload className="text-slate-400 mb-2" size={28} />
                      <p className="text-xs font-bold text-white">Upload identity document or <span className="text-[#00C6FF] hover:underline">browse</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 font-light">Supports JPG, PNG up to 5MB</p>
                    </div>
                  )}

                  <button
                    onClick={submitKycDocuments}
                    disabled={!uploadedKycName || submittingKyc}
                    className="w-full py-3.5 bg-[#0057FF] hover:bg-blue-600 active-press text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingKyc ? <RefreshCw className="animate-spin" size={14} /> : "Submit To Verification Gateways"}
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Security / Toggles columns */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 shadow-xl space-y-5">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Platform Safety</h4>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3.5 bg-[#0B1220] rounded-2xl border border-[#242F41]">
                <div>
                  <h5 className="text-xs font-bold text-white font-sans">Two-Factor Security</h5>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5 font-sans">PIN code request on sign-in.</p>
                </div>
                {/* Custom toggle slider */}
                <button
                  type="button"
                  onClick={handleTwoFactorToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out font-semibold outline-none focus:outline-none ${
                    twoFactor ? "bg-[#0057FF]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                      twoFactor ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[11px] leading-relaxed text-slate-400 font-light font-sans">
                Two-Factor codes are issued directly to connected system devices or multi-signature keys dynamically upon sensitive events.
              </div>
            </div>
          </section>

          <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 relative overflow-hidden text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#00C6FF] mx-auto">
              <Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest font-sans">Premium support</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed font-light font-sans">
                Connected corporate accounts enjoy immediate 24/7 routing chat desks with our clearing agents globally.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
