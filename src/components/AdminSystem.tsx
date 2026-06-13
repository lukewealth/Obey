import React, { useState } from "react";
import { UserProfile, AdminMetrics } from "../types";
import { 
  Users, DollarSign, Activity, AlertCircle, Check, X, 
  TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, UserCheck, Settings 
} from "lucide-react";

interface AdminSystemProps {
  metrics: AdminMetrics;
  profile: UserProfile;
  onApproveKyc: () => void;
  onUpdateSystemStatus: (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => void;
}

export default function AdminSystem({ metrics, profile, onApproveKyc, onUpdateSystemStatus }: AdminSystemProps) {
  const [kycQueue, setKycQueue] = useState([
    { id: "usr_2", name: "David Alao", email: "david@co-tech.com", documentType: "Passport Card Image", fileAttached: "passport_us_david.png", phone: "+234 802 991 2024", date: "June 09, 2026", status: "Pending" },
    { id: "usr_3", name: "Sarah Williams", email: "sarah.will@fintech.io", documentType: "National ID Slip", fileAttached: "sarah_nid_card.jpg", phone: "+234 811 445 1022", date: "June 08, 2026", status: "Pending" }
  ]);

  const [activeStatus, setActiveStatus] = useState(metrics.systemStatus);

  const handleApproveQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
    // If we're approving, trigger full system status KYC verify
    onApproveKyc();
  };

  const handleRejectQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
  };

  const changeStatus = (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => {
    setActiveStatus(status);
    onUpdateSystemStatus(status);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Ecosystem Monitoring Admin Desk</h2>
        <p className="text-xs text-gray-400 font-light mt-0.5">Corporate supervision dashboard managing compliant customer statuses and treasury ledger lines.</p>
      </div>

      {/* Primary Metrics stats grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-5 rounded-[20px] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Platform Users</span>
            <p className="text-2xl font-mono font-bold text-white">{metrics.totalUsers.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-5 rounded-[20px] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Trade Volume (USD)</span>
            <p className="text-2xl font-mono font-bold text-white">${metrics.totalVolume.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-[#00C6FF]/10 text-[#00C6FF] rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-5 rounded-[20px] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Fees Collected</span>
            <p className="text-2xl font-mono font-bold text-white">${metrics.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-[#12B76A] rounded-xl flex items-center justify-center shrink-0">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-5 rounded-[20px] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Pending Audits</span>
            <p className="text-2xl font-mono font-bold text-white">{kycQueue.length + (profile.kycStatus === "Pending" ? 1 : 0)}</p>
          </div>
          <div className="w-10 h-10 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center shrink-0 font-bold">
            !
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Compliance queue columns */}
        <section className="lg:col-span-8 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white leading-none">Identity Compliance Queue</h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-[#0B1220] border border-[#242F41] px-2.5 py-1 rounded">Security Gateways</span>
          </div>

          <div className="space-y-4">
            {/* If Client Profile is currently Pending KYC, display it first in the admin desk */}
            {profile.kycStatus === "Pending" && (
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-black text-white">{profile.name} (YOU)</p>
                    <span className="bg-yellow-500/15 text-yellow-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase">OWNER PROFILE</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {profile.email} • ID Document: Passport Photo Card • {profile.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    onClick={onApproveKyc}
                    className="h-8 px-3.5 bg-emerald-500 hover:bg-emerald-600 active-press text-white font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Check size={12} /> Approve Identity
                  </button>
                </div>
              </div>
            )}

            {/* Simulated verification files */}
            {kycQueue.map((item) => (
              <div 
                key={item.id} 
                className="p-4 bg-[#0B1220] border border-[#242F41] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#0B1220]/80 transition-all duration-200"
              >
                <div>
                  <p className="text-xs sm:text-sm font-black text-white">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    {item.email} • {item.documentType} ({item.fileAttached}) • {item.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button 
                    onClick={() => handleRejectQueueItem(item.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg active-press"
                  >
                    <X size={14} />
                  </button>
                  <button 
                    onClick={() => handleApproveQueueItem(item.id)}
                    className="h-8 px-3 bg-[#0057FF] hover:bg-blue-600 active-press text-white font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                  >
                    <Check size={12} /> Approve
                  </button>
                </div>
              </div>
            ))}

            {kycQueue.length === 0 && profile.kycStatus !== "Pending" && (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <CheckCircle2 className="text-emerald-500 mb-2" size={28} />
                <p className="text-xs font-bold uppercase tracking-wider">No pending items in queue</p>
                <p className="text-[10px] text-[#242F41] mt-1">Ecosystem KYC statuses are up to date and verified.</p>
              </div>
            )}
          </div>
        </section>

        {/* System Operations controller */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 shadow-xl space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Routing Status Controls</h4>
            
            <div className="space-y-2 pt-2">
              <button 
                onClick={() => changeStatus("OPERATIONAL")}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  activeStatus === "OPERATIONAL" ? "bg-emerald-500/10 border border-emerald-500/25 text-[#12B76A]" : "bg-white/5 border border-[#242F41] text-slate-400"
                }`}
              >
                <span>OPERATIONAL ACTIVE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              </button>

              <button 
                onClick={() => changeStatus("DEGRADED")}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  activeStatus === "DEGRADED" ? "bg-[#F79009]/10 border border-[#F79009]/25 text-[#F79009]" : "bg-white/5 border border-[#242F41] text-slate-400"
                }`}
              >
                <span>CHANNELS DEGRADED</span>
                <span className="w-2 h-2 rounded-full bg-[#F79009] shrink-0"></span>
              </button>

              <button 
                onClick={() => changeStatus("MAINTENANCE")}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  activeStatus === "MAINTENANCE" ? "bg-red-500/10 border border-red-500/25 text-red-400" : "bg-white/5 border border-[#242F41] text-slate-400"
                }`}
              >
                <span>LEDGER MAINTENANCE</span>
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              </button>
            </div>
          </div>

          <div className="bg-[#161F30] border border-[#242F41] p-5 rounded-[20px] flex items-start gap-4 text-xs font-light">
            <ShieldAlert className="text-[#00C6FF] shrink-0" size={24} />
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] font-sans">Decentralized Logs</p>
              <p className="text-slate-400 leading-relaxed text-[10px] mt-1 font-sans">
                Security actions are written sequentially. Administrative permissions require dual-factor security authorization.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
