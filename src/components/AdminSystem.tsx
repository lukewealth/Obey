import React, { useState, useEffect } from "react";
import { UserProfile, AdminMetrics, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Activity, AlertCircle, Check, X, 
  TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, UserCheck, Settings,
  Zap, Shield, Server, ArrowUpRight, ShoppingCart, Lock, Trash2, Loader2,
  ChevronRight, ArrowRight, Search, Plus, Minus, Bell, CreditCard, Send, ShieldCheck,
  Cpu, Globe, Database, HardDrive, Terminal, Map, Fingerprint, ExternalLink, Download,
  PlayCircle, AlertTriangle, ShieldQuestion, Gavel, FileText, Wallet
} from "lucide-react";
import api, { settleEscrowTrade, adjustUserBalance } from "../services/api";
import { useNotification } from "./NotificationSystem";
import SystemQualityNode from "./SystemQualityNode";

interface AdminSystemProps {
  metrics: AdminMetrics;
  profile: UserProfile;
  onApproveKyc: () => void;
  onUpdateSystemStatus: (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => void;
}

export default function AdminSystem({ metrics, profile, onApproveKyc, onUpdateSystemStatus }: AdminSystemProps) {
  const { notify } = useNotification();
  const [activeAdminTab, setActiveAdminTab] = useState<"sentinel" | "ledger" | "audit" | "notifications" | "vit">("sentinel");
  
  const [kycQueue, setKycQueue] = useState<any[]>([]);
  const [escrowTrades, setEscrowTrades] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [auditStats, setAuditStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(metrics.systemStatus);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [riskProfile, setRiskProfile] = useState<any>(null);

  // VIT (Verified Institutional Tier) State
  const [vitLogs, setVitLogs] = useState<string[]>([
    "INITIALIZING_VIT_MESH_SYNC...",
    "ESTABLISHING_HIGH_FIDELITY_TUNNEL_01",
    "VERIFYING_MULTI_SIG_TREASURY_RESERVES",
    "VIT_NODE_ONLINE_INTEGRITY_100%"
  ]);
  const [isVitSimulating, setIsVitSimulating] = useState(false);

  // Push Notification State
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeAdminTab === "sentinel") {
        const [alertsRes, usersRes] = await Promise.all([
          api.get('/admin/fraud-alerts'),
          api.get('/admin/users')
        ]);
        setFraudAlerts(alertsRes.data);
        setKycQueue(usersRes.data.filter((u: any) => u.kycStatus === 'Pending'));
      } else if (activeAdminTab === "audit") {
        const res = await api.get('/admin/audit-ledger');
        setAuditStats(res.data);
      } else if (activeAdminTab === "ledger") {
        const res = await api.get('/admin/users');
        setKycQueue(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch sentinel data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeAdminTab]);

  const handleResolveAlert = async (alertId: string, action: 'RESOLVE' | 'DISMISS') => {
    try {
      await api.post('/admin/resolve-alert', { alertId, action });
      setFraudAlerts(prev => prev.filter(a => a.id !== alertId));
      notify("success", "Alert Resolved", `Sentinel status updated for node ${alertId}.`);
    } catch (err) {
      notify("error", "Protocol Error", "Failed to clear sentinel flag.");
    }
  };

  const viewRiskProfile = async (userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    try {
      const res = await api.get(`/admin/risk-profile/${userId}`);
      setRiskProfile(res.data);
    } catch (err) {
      notify("error", "Forensic Error", "Failed to retrieve risk dossier.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
             <ShieldCheck className="text-primary w-8 h-8" />
             <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Sentinel Console</h2>
          </div>
          <p className="text-sm md:text-lg text-gray-500 font-medium">Verified surveillance & forensic audit mesh.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 w-fit mx-auto lg:mx-0 shadow-sm overflow-x-auto hide-scrollbar">
           {[
            { id: "sentinel", label: "Sentinel", icon: ShieldAlert },
            { id: "ledger", label: "Ledger", icon: Database },
            { id: "audit", label: "Audit", icon: BarChart2 },
            { id: "notifications", label: "Broadcast", icon: Bell },
            { id: "vit", label: "VIT Mesh", icon: Zap },
           ].map(t => (
             <button 
              key={t.id}
              onClick={() => setActiveAdminTab(t.id as any)}
              className={`px-6 py-3 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeAdminTab === t.id ? 'bg-[#0b0e14] text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
             >
               <t.icon size={14} className={t.id === 'sentinel' ? 'text-red-500' : ''} /> {t.label}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeAdminTab === "sentinel" && (
          <motion.div key="sentinel" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-10">
            
            {/* System Quality Checklist Node */}
            <SystemQualityNode mode="full" />

            {/* Sentinel Hero Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* Risk Index Gauge */}
               <div className="lg:col-span-4 bento-card p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                  <div className="flex justify-between w-full items-center mb-2">
                     <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Global Risk Index</h3>
                     <AlertCircle size={14} className="text-gray-300" />
                  </div>
                  <div className="relative w-48 h-48">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <motion.circle 
                           cx="50" cy="50" r="45" fill="none" stroke="url(#riskGradient)" strokeWidth="8" 
                           strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * 0.72)}
                           strokeLinecap="round"
                        />
                        <defs>
                           <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#0043c8" />
                              <stop offset="100%" stopColor="#ef4444" />
                           </linearGradient>
                        </defs>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-gray-900 tracking-tighter">72</span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Elevated</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full pt-4">
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Attempts</p>
                        <p className="text-xl font-black text-gray-900">1,240</p>
                     </div>
                     <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Blocked</p>
                        <p className="text-xl font-black text-red-600">14</p>
                     </div>
                  </div>
               </div>

               {/* Critical Alerts Queue */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> Critical Alerts
                     </h3>
                     <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/20 pb-1">View Full Queue</button>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                     {fraudAlerts.map((alert, i) => (
                       <motion.div 
                        key={alert.id} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }}
                        className={`min-w-[340px] p-8 rounded-[2.5rem] border ${alert.severity === 'Critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'} space-y-8 flex flex-col justify-between`}
                       >
                          <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${alert.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>{alert.severity} PRIORITY</span>
                                <span className="text-[10px] font-mono text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                             </div>
                             <h4 className={`text-xl font-black ${alert.severity === 'Critical' ? 'text-red-900' : 'text-amber-900'}`}>{alert.type}</h4>
                             <p className="text-xs text-gray-500 font-medium leading-relaxed">{alert.description}</p>
                          </div>
                          <div className="flex gap-3">
                             <button onClick={() => handleResolveAlert(alert.id, 'RESOLVE')} className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all active-press ${alert.severity === 'Critical' ? 'bg-red-600 text-white shadow-red-200' : 'bg-amber-600 text-white shadow-amber-200'}`}>Freeze Node</button>
                             <button onClick={() => viewRiskProfile(alert.entityId)} className="flex-1 h-12 bg-white text-gray-700 rounded-xl text-[10px] font-black uppercase border border-gray-100 shadow-sm active-press">Review</button>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Live Sentinel Stream */}
            <div className="bento-card overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-4">
                     <Activity className="text-primary" size={20} />
                     <h3 className="text-xl font-black text-gray-900 tracking-tight">Sentinel Stream</h3>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Auto-Refresh: 5s</span>
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50/30 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                           <th className="px-8 py-4">Timestamp</th>
                           <th className="px-8 py-4">Operation</th>
                           <th className="px-8 py-4">Entity Node</th>
                           <th className="px-8 py-4">Risk Pulse</th>
                           <th className="px-8 py-4">Status</th>
                           <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {loading ? <tr><td colSpan={6} className="py-20 text-center"><Loader2 className="animate-spin inline-block text-primary" /></td></tr> :
                        fraudAlerts.map(a => (
                          <tr key={a.id} className="group hover:bg-gray-50 transition-colors">
                             <td className="px-8 py-5 font-mono text-[11px] text-gray-500">{new Date(a.timestamp).toLocaleTimeString()}</td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.severity === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-primary/5 text-primary'}`}>
                                      <Zap size={14} />
                                   </div>
                                   <span className="text-xs font-black text-gray-900">{a.type}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5 font-mono text-[11px] text-primary">{a.entityId}</td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${a.riskScore}%` }} className={`h-full ${a.riskScore > 80 ? 'bg-red-500' : 'bg-primary'}`} />
                                   </div>
                                   <span className={`text-[10px] font-black ${a.riskScore > 80 ? 'text-red-500' : 'text-primary'}`}>{a.riskScore}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${a.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>{a.status}</span>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all"><ChevronRight size={18} /></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        )}

        {activeAdminTab === "audit" && (
          <motion.div key="audit" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Integrity</p>
                         <h3 className="text-3xl font-black text-gray-900 uppercase italic">Ledger Audit</h3>
                      </div>
                      <div className="flex gap-3">
                         <button className="h-12 px-6 bg-primary text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20 flex items-center gap-2 active-press"><PlayCircle size={16} /> Run Full Audit</button>
                         <button className="h-12 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase shadow-sm flex items-center gap-2 active-press"><Settings size={16} /> Adjust Parameters</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { label: "Total Liabilities", val: `₦${auditStats?.totalLiabilities?.toLocaleString() || '0'}`, icon: Wallet, color: "text-primary", bg: "bg-primary/5", change: "+0.04%" },
                        { label: "System Equity", val: `₦${auditStats?.systemEquity?.toLocaleString() || '0'}`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", change: "Verified" },
                        { label: "Discrepancy Alerts", val: auditStats?.alerts?.length || '0', icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", change: "Critical", pulse: true }
                      ].map(s => (
                        <div key={s.label} className="bento-card p-6 space-y-4 group">
                           <div className="flex justify-between items-start">
                              <div className={`p-3 ${s.bg} ${s.color} rounded-xl group-hover:scale-110 transition-transform`}><s.icon size={20} /></div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${s.pulse ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>{s.change}</span>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                              <p className="text-2xl font-black text-gray-900 font-space tracking-tight">{s.val}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="lg:col-span-4 bento-card p-8 space-y-8 relative overflow-hidden">
                   <div className="space-y-1 relative z-10">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Integrity Entropy</p>
                      <h4 className="text-xl font-black text-gray-900">Ledger Verification</h4>
                   </div>
                   <div className="h-40 flex items-end gap-1 px-2 pt-4 relative z-10">
                      {[40, 65, 35, 85, 55, 95, 45, 100, 70, 50].map((h, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }} 
                          animate={{ height: `${h}%` }} 
                          transition={{ delay: i * 0.05 }}
                          className={`flex-1 ${h === 100 ? 'bg-red-500 animate-pulse' : 'bg-primary/30'} rounded-t-md`}
                        />
                      ))}
                   </div>
                   <div className="flex justify-between pt-6 border-t border-gray-100 relative z-10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Block: 402,291</span>
                      <span className="text-[10px] font-mono text-gray-400">T: 12ms</span>
                   </div>
                   <Activity className="absolute -right-8 -bottom-8 text-gray-50 w-32 h-32" />
                </div>
             </div>

             <div className="bento-card overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="text-xl font-black text-gray-900 uppercase italic">Audit Trail</h3>
                   <div className="flex items-center gap-4">
                      <div className="relative w-64">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                         <input type="text" placeholder="Filter Ledger..." className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50"><Download size={18} /></button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="px-8 py-4">Operation ID</th>
                            <th className="px-8 py-4">Delta</th>
                            <th className="px-8 py-4">Status Node</th>
                            <th className="px-8 py-4">Reasoning</th>
                            <th className="px-8 py-4">Verification Hash</th>
                            <th className="px-8 py-4 text-right">Dossier</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {auditStats?.recentEvents?.map((evt: any) => (
                           <tr key={evt.id} className="group hover:bg-gray-50/80 transition-all">
                              <td className="px-8 py-5 font-mono text-[11px] text-primary">{evt.id}</td>
                              <td className="px-8 py-5">
                                 <span className="text-xs font-black text-emerald-600 font-mono">+₦12,500.00</span>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Verified</span>
                              </td>
                              <td className="px-8 py-5 text-xs text-gray-500 font-medium">{evt.type} protocol alignment.</td>
                              <td className="px-8 py-5">
                                 <code className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-400 select-all">0x7a...fE21</code>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <button className="text-gray-300 hover:text-primary transition-colors"><ExternalLink size={16} /></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "ledger" && (
          <motion.div key="ledger" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Node Directory</p>
                   <h3 className="text-3xl font-black text-gray-900 uppercase italic">Treasury Ledger</h3>
                </div>
                <div className="flex gap-4">
                   <div className="relative w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input type="text" placeholder="Search Node ID or Identity..." className="w-full h-14 pl-12 pr-6 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold outline-none shadow-sm focus:border-primary transition-all" />
                   </div>
                   <button className="h-14 px-8 bg-[#0b0e14] text-white rounded-2xl text-[10px] font-black uppercase shadow-xl active-press">Export List</button>
                </div>
             </div>

             <div className="bento-card overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <th className="px-8 py-5">Node Identity</th>
                            <th className="px-8 py-5">Status Node</th>
                            <th className="px-8 py-5">Treasury Balance</th>
                            <th className="px-8 py-5">Risk Pulse</th>
                            <th className="px-8 py-5 text-right">Adjust Credit</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {kycQueue.map((u: any) => (
                           <tr key={u._id} className="group hover:bg-gray-50/80 transition-all">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-black text-primary text-xs uppercase">{u.name?.charAt(0) || 'U'}</div>
                                    <div>
                                       <p className="text-sm font-black text-gray-900">{u.name || 'Anonymous Node'}</p>
                                       <p className="text-[10px] font-mono text-gray-400">{u.supabaseId}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>{u.kycStatus}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-black font-mono text-gray-900">₦{u.balance?.toLocaleString() || '0'}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-emerald-500 w-[85%]" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600">Low</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={async () => {
                                        const amt = prompt("Enter adjustment amount (₦):");
                                        if (amt && !isNaN(Number(amt))) {
                                          try {
                                            await adjustUserBalance(u.supabaseId, Number(amt), 'ADD');
                                            notify("success", "Credit Settled", `Added ₦${amt} to node treasury.`);
                                            fetchData();
                                          } catch (err) {
                                            notify("error", "Settlement Failure", "Protocol synchronization interrupted.");
                                          }
                                        }
                                      }}
                                      className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                                    >
                                       <Plus size={14} />
                                    </button>
                                    <button 
                                      onClick={async () => {
                                        const amt = prompt("Enter deduction amount (₦):");
                                        if (amt && !isNaN(Number(amt))) {
                                          try {
                                            await adjustUserBalance(u.supabaseId, Number(amt), 'SUB');
                                            notify("success", "Credit Deducted", `Removed ₦${amt} from node treasury.`);
                                            fetchData();
                                          } catch (err) {
                                            notify("error", "Settlement Failure", "Protocol synchronization interrupted.");
                                          }
                                        }
                                      }}
                                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                                    >
                                       <Minus size={14} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "notifications" && (
          <motion.div key="notifications" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="max-w-4xl mx-auto space-y-10">
             <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-gray-900 uppercase italic">Broadcast Center</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Push High-Fidelity Messages to All Mesh Nodes</p>
             </div>
             <div className="bento-card p-10 md:p-14 space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Title</label>
                   <input 
                    type="text" 
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    placeholder="System Alert Node..." 
                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all" 
                   />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Context Payload</label>
                   <textarea 
                    value={pushMessage}
                    onChange={(e) => setPushMessage(e.target.value)}
                    placeholder="Enter institutional message payload..." 
                    className="w-full h-48 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-xs font-medium outline-none focus:border-primary transition-all resize-none"
                   />
                </div>
                <button 
                  onClick={() => {
                    notify("success", "Broadcast Dispatched", "Push notification mesh settlement complete.");
                    setPushTitle("");
                    setPushMessage("");
                  }}
                  className="w-full h-16 bg-primary text-white rounded-2xl text-[10px] font-black uppercase shadow-2xl shadow-primary/30 active-press flex items-center justify-center gap-3"
                >
                   <Send size={16} /> Dispatch Broadcast
                </button>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "vit" && (
          <motion.div key="vit" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                   <div className="bento-card p-10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
                      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary relative">
                         <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                         <Zap size={40} />
                      </div>
                      <div className="text-center space-y-2">
                         <h4 className="text-2xl font-black text-gray-900 uppercase italic">VIT Mesh</h4>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sentinel Mode Active</p>
                      </div>
                      <button 
                        onClick={() => setIsVitSimulating(true)}
                        className="w-full h-14 bg-[#0b0e14] text-white rounded-2xl text-[10px] font-black uppercase shadow-xl active-press"
                      >
                         Initiate Mesh Sync
                      </button>
                   </div>
                </div>
                <div className="lg:col-span-8 bento-card p-10 bg-[#0b0e14] text-[#4ADE80] font-mono text-[11px] space-y-4 overflow-hidden relative">
                   <div className="absolute top-4 right-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse" />
                      <span className="text-[9px] uppercase tracking-widest opacity-50 font-sans font-black">Secure Tunnel</span>
                   </div>
                   <div className="space-y-2">
                      {vitLogs.map((log, i) => (
                        <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} key={i}>
                           <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span> {log}
                        </motion.p>
                      ))}
                      {isVitSimulating && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                           <p>SYNCING_LEDGER_HASH_NODE_0x7a...F21</p>
                           <p>VERIFYING_CONSENSUS_MECHANISM... [OK]</p>
                           <p>MESH_INTEGRITY_STABILIZED</p>
                        </motion.div>
                      )}
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0b0e14] to-transparent pointer-events-none" />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forensic Risk Profile Modal */}
      <AnimatePresence>
        {selectedUserId && riskProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0b0e14]/90 backdrop-blur-2xl" onClick={() => setSelectedUserId(null)} />
             <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
                <header className="p-8 md:p-12 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span>Users</span> <ChevronRight size={10} /> <span className="text-primary">Risk Profile: {selectedUserId}</span>
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{riskProfile.profile.name}</h2>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                         <span className="text-xs font-black text-red-500 uppercase tracking-widest">High Risk Asset • Persistent Surveillance Flag</span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="h-14 px-8 bg-gray-50 border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-500 active-press">Export Dossier</button>
                      <button className="h-14 px-8 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-red-200 active-press">Restrict Access</button>
                   </div>
                </header>

                <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Left: Score & Forensics */}
                      <div className="lg:col-span-4 space-y-10">
                         <div className="glass-panel p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                            <div className="relative z-10">
                               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Composite Risk Index</h3>
                               <div className="flex items-baseline gap-2">
                                  <span className="text-7xl font-black text-red-600 tracking-tighter">{riskProfile.compositeRisk}</span>
                                  <span className="text-2xl font-black text-gray-300">/100</span>
                               </div>
                               <div className="mt-8 space-y-5">
                                  <div className="space-y-2">
                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">Velocity</span>
                                        <span className="text-red-500">Critical</span>
                                     </div>
                                     <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-red-500" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-gray-400">Identity Trust</span>
                                        <span className="text-amber-500">Low</span>
                                     </div>
                                     <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "24%" }} className="h-full bg-amber-500" />
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="glass-panel p-8 rounded-[2.5rem] space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                               <Fingerprint size={14} /> Identity Trace
                            </h3>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">KYC Level</span>
                                  <span className="text-xs font-black text-gray-900">{riskProfile.profile.kycLevel || 'None'}</span>
                               </div>
                               <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">Device Node</span>
                                  <span className="text-xs font-mono font-black text-primary">iPhone 15 Pro</span>
                               </div>
                               <div className="flex justify-between items-center py-3">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">VPN Pulse</span>
                                  <span className="text-[10px] font-black text-red-500 uppercase px-2 py-0.5 bg-red-50 rounded">Positive</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Right: Map & Activity */}
                      <div className="lg:col-span-8 space-y-10">
                         <div className="glass-panel rounded-[2.5rem] overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                  <Map size={14} /> Geospatial Trace
                               </h3>
                               <p className="text-[11px] font-mono text-primary font-black uppercase tracking-widest">{riskProfile.forensics.lastIp}</p>
                            </div>
                            <div className="h-64 bg-gray-100 relative">
                               <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">High-Fidelity Map Proxy</p>
                               </div>
                               <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-2xl animate-ping" />
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
                               <div className="p-6">
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Established Location</p>
                                  <p className="text-lg font-black text-gray-900 uppercase italic">{riskProfile.forensics.geo}</p>
                               </div>
                               <div className="p-6">
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Conflicting Asset Origin</p>
                                  <p className="text-lg font-black text-gray-900 uppercase italic">Tallinn, EE</p>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Recent Surveillance Data</h3>
                            <div className="overflow-x-auto">
                               <table className="w-full text-left">
                                  <thead>
                                     <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <th className="pb-4">Operation</th>
                                        <th className="pb-4">Magnitude</th>
                                        <th className="pb-4">Status Node</th>
                                        <th className="pb-4 text-right">Audit</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                     {riskProfile.recentTransactions?.map((tx: any) => (
                                       <tr key={tx.id} className="group">
                                          <td className="py-4 text-xs font-black text-gray-900">{tx.title}</td>
                                          <td className="py-4 font-mono text-xs font-black">₦{tx.amount.toLocaleString()}</td>
                                          <td className="py-4"><span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-gray-50 text-gray-400">{tx.status}</span></td>
                                          <td className="py-4 text-right"><ExternalLink size={14} className="inline text-gray-300 group-hover:text-primary transition-colors" /></td>
                                       </tr>
                                     ))}
                                  </tbody>
                                </table>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
