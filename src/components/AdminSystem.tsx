import React, { useState } from "react";
import { UserProfile, AdminMetrics } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Activity, AlertCircle, Check, X, 
  TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, UserCheck, Settings,
  Zap, Shield, Server, ArrowUpRight
} from "lucide-react";

interface AdminSystemProps {
  metrics: AdminMetrics;
  profile: UserProfile;
  onApproveKyc: () => void;
  onUpdateSystemStatus: (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => void;
}

export default function AdminSystem({ metrics, profile, onApproveKyc, onUpdateSystemStatus }: AdminSystemProps) {
  const [kycQueue, setKycQueue] = useState([
    { id: "usr_2", name: "David Alao", email: "david@co-tech.com", documentType: "Passport Card", fileAttached: "passport_us_david.png", phone: "+234 802 991 2024", date: "June 09, 2026", status: "Pending" },
    { id: "usr_3", name: "Sarah Williams", email: "sarah.will@fintech.io", documentType: "National ID", fileAttached: "sarah_nid_card.jpg", phone: "+234 811 445 1022", date: "June 08, 2026", status: "Pending" }
  ]);

  const [activeStatus, setActiveStatus] = useState(metrics.systemStatus);

  const handleApproveQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
    onApproveKyc();
  };

  const handleRejectQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
  };

  const changeStatus = (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => {
    setActiveStatus(status);
    onUpdateSystemStatus(status);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ecosystem Monitoring</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Supervise compliant statuses and platform health.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-blue rounded-full border border-blue-100">
          <Server size={16} className="text-primary" />
          <span className="text-[11px] text-primary font-black uppercase tracking-widest">Master Node: v4.0.0</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", val: metrics.totalUsers.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-accent-blue" },
          { label: "Trade Volume", val: `$${metrics.totalVolume.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Fees Collected", val: `$${metrics.monthlyRevenue.toLocaleString()}`, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Pending Audits", val: kycQueue.length + (profile.kycStatus === "Pending" ? 1 : 0), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((m) => (
          <motion.div 
            key={m.label}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 p-6 rounded-[28px] shadow-xl shadow-gray-200/50 flex items-center justify-between group transition-all"
          >
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{m.val}</p>
            </div>
            <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
              <m.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Compliance Queue */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white border border-gray-100 rounded-[32px] p-8 space-y-8 shadow-xl shadow-gray-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-blue/30 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Compliance Queue</h3>
              <p className="text-sm text-gray-500 font-medium">Audit identity records for Level 2 clearance.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-400">
              <UserCheck size={14} />
              Gatekeeper
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <AnimatePresence mode="popLayout">
              {profile.kycStatus === "Pending" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-accent-yellow/30 border border-yellow-200 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-yellow-600 shadow-sm font-black">
                      {profile.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-black text-gray-900">{profile.name} (YOU)</p>
                        <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">OWNER</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">Passport Card • {profile.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onApproveKyc}
                    className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 active-press transition-all"
                  >
                    <Check size={16} /> Approve Profile
                  </button>
                </motion.div>
              )}

              {kycQueue.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-white border border-gray-100 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-black group-hover:bg-white group-hover:text-primary transition-colors border border-gray-100">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="text-[15px] font-black text-gray-900">{item.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-widest">{item.documentType} • {item.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleRejectQueueItem(item.id)}
                      className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all active-press"
                    >
                      <X size={18} />
                    </button>
                    <button 
                      onClick={() => handleApproveQueueItem(item.id)}
                      className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 active-press transition-all"
                    >
                      Approve
                    </button>
                  </div>
                </motion.div>
              ))}

              {kycQueue.length === 0 && profile.kycStatus !== "Pending" && (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-[13px] font-black text-gray-400 uppercase tracking-widest">Queue Fully Audited</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-10"
        >
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 space-y-8 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-blue/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center text-primary">
                <Settings size={20} />
              </div>
              <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">System State</h4>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { id: "OPERATIONAL", label: "OPERATIONAL ACTIVE", color: "emerald" },
                { id: "DEGRADED", label: "CHANNELS DEGRADED", color: "amber" },
                { id: "MAINTENANCE", label: "LEDGER MAINTENANCE", color: "red" }
              ].map((s) => (
                <button 
                  key={s.id}
                  onClick={() => changeStatus(s.id as any)}
                  className={`w-full py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-between transition-all border ${
                    activeStatus === s.id 
                      ? `bg-${s.color}-50 border-${s.color}-200 text-${s.color}-600 shadow-sm` 
                      : "bg-gray-50 border-gray-100 text-gray-400 grayscale"
                  }`}
                >
                  <span>{s.label}</span>
                  <div className={`w-2.5 h-2.5 rounded-full bg-${s.color}-500 ${activeStatus === s.id ? 'animate-pulse' : ''}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-[32px] p-8 shadow-2xl flex flex-col justify-between text-white min-h-[240px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="space-y-4 relative z-10">
              <ShieldAlert size={32} className="text-primary" />
              <h5 className="text-xl font-black tracking-tight">Security Protocol</h5>
              <p className="text-sm text-white/50 font-medium leading-relaxed">
                All administrative actions are signed sequentially on the private ledger node. 2FA is mandatory for all state changes.
              </p>
            </div>
            <button className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/10 backdrop-blur-md transition-all">
              Audit Logs
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
