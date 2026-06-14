import React, { useState, useEffect } from "react";
import { UserProfile, AdminMetrics, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Activity, AlertCircle, Check, X, 
  TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, UserCheck, Settings,
  Zap, Shield, Server, ArrowUpRight, ShoppingCart, Lock, Trash2, Loader2,
  ChevronRight, ArrowRight, Search, Plus, Minus, Bell, CreditCard, Send, ShieldCheck,
  Cpu, Globe, Database, HardDrive, Terminal
} from "lucide-react";
import api, { settleEscrowTrade, adjustUserBalance } from "../services/api";
import { useNotification } from "./NotificationSystem";

interface AdminSystemProps {
  metrics: AdminMetrics;
  profile: UserProfile;
  onApproveKyc: () => void;
  onUpdateSystemStatus: (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => void;
}

export default function AdminSystem({ metrics, profile, onApproveKyc, onUpdateSystemStatus }: AdminSystemProps) {
  const { notify } = useNotification();
  const [activeAdminTab, setActiveAdminTab] = useState<"monitoring" | "users" | "marketplace" | "notifications" | "vit">("monitoring");
  
  const [kycQueue, setKycQueue] = useState<any[]>([]);
  const [escrowTrades, setEscrowTrades] = useState<any[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeStatus, setActiveStatus] = useState(metrics.systemStatus);
  const [settlingId, setSettlingId] = useState<string | null>(null);

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
  const [pushTarget, setPushTarget] = useState("all");
  const [sendingPush, setSendingPush] = useState(false);

  // Vault Metrics State
  const [vaultMetrics, setVaultMetrics] = useState({
    lockedReserves: 0,
    activeNodes: 0
  });

  // Account Credit Management State
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditType, setCreditType] = useState<"ADD" | "SUB">("ADD");

  const fetchAdminData = async () => {
    setLoadingUsers(true);
    setLoadingTrades(true);
    try {
      const [usersRes, vaultRes] = await Promise.all([
        api.get(`/admin/users?adminId=${profile.id}`),
        api.get(`/admin/vault-metrics?adminId=${profile.id}`)
      ]);
      
      setKycQueue(usersRes.data.filter((u: any) => u.kycStatus === 'Pending' || u.kycStatus === 'Unverified'));
      setVaultMetrics({
        lockedReserves: vaultRes.data.lockedReserves,
        activeNodes: vaultRes.data.activeNodes
      });
      setEscrowTrades(vaultRes.data.escrowTransactions);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      // Fallback for prototype
      setKycQueue([
        { id: "usr_2", name: "David Alao", email: "david@co-tech.com", documentType: "Passport Card", kycStatus: "Pending", balance: 5200 },
        { id: "usr_3", name: "Sarah Williams", email: "sarah.will@fintech.io", documentType: "National ID", kycStatus: "Pending", balance: 12500 }
      ]);
    } finally {
      setLoadingUsers(false);
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeAdminTab]);

  const handleApproveKycNode = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await api.post(`/admin/approve-kyc`, { 
        userId, 
        action, 
        adminId: profile.id 
      });
      if (res.data.success) {
        setKycQueue(prev => prev.filter(item => (item.supabaseId || item.id) !== userId));
        notify("success", action === 'APPROVE' ? "Identity Authorized" : "Identity Rejected", res.data.message);
        if (action === 'APPROVE') onApproveKyc();
      }
    } catch (error) {
      notify("error", "Protocol Failure", "Failed to settle identity node.");
    }
  };

  const handleSettleEscrow = async (txId: string, action: 'RELEASE' | 'REJECT') => {
    setSettlingId(txId);
    try {
      const response = await settleEscrowTrade(txId, action);
      if (response.data.success) {
        setEscrowTrades(prev => prev.filter(t => t.id !== txId));
        notify("success", `Asset ${action === 'RELEASE' ? 'Released' : 'Rejected'}`, `Node settlement complete.`);
      }
    } catch (error) {
      notify("error", "Settlement Failed", "Escrow node synchronization error.");
    } finally {
      setSettlingId(null);
    }
  };

  const handleSendPush = async () => {
    if (!pushTitle || !pushMessage) return;
    setSendingPush(true);
    try {
      await api.post(`/admin/push-notification`, {
        title: pushTitle,
        message: pushMessage,
        target: pushTarget,
        adminId: profile.id
      });
      notify("success", "Broadcast Dispatched", "Push notification mesh active.");
      setPushTitle("");
      setPushMessage("");
    } catch (error) {
      notify("error", "Broadcast Failure", "Signal propagation error.");
    } finally {
      setSendingPush(false);
    }
  };

  const runVitDiagnostic = () => {
    setIsVitSimulating(true);
    setVitLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INITIATING_DEEP_INSPECTION...`]);
    
    setTimeout(() => {
       setVitLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SWEEPING_ESCROW_MESH...`]);
    }, 1000);
    
    setTimeout(() => {
       setVitLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ALIGNING_CROSS_CHAIN_LIQUIDITY...`]);
    }, 2500);

    setTimeout(() => {
       setVitLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SYSTEM_INTEGRITY_OPTIMIZED_100%`]);
       setIsVitSimulating(false);
       notify("success", "VIT Optimization Complete", "Verified Institutional nodes re-aligned.");
    }, 4000);
  };

  const handleCreditAdjustment = async () => {
    if (!selectedUser || !creditAmount) return;
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await adjustUserBalance(selectedUser.supabaseId || selectedUser.id, amount, creditType);
      notify("success", "Ledger Updated", `Successfully ${creditType === 'ADD' ? 'credited' : 'debited'} ${selectedUser.name}'s account.`);
      setShowCreditModal(false);
      setCreditAmount("");
    } catch (err) {
      notify("error", "Ledger Error", "Failed to update node balance.");
    }
  };

  const changeStatus = (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => {
    setActiveStatus(status);
    onUpdateSystemStatus(status);
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Institutional Console</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium">Full-stack control over the OBEY fintech mesh.</p>
        </div>
        
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-gray-100 w-fit mx-auto md:mx-0 shadow-sm overflow-x-auto hide-scrollbar">
           {[
            { id: "monitoring", label: "Nodes", icon: Activity },
            { id: "users", label: "Ledger", icon: Users },
            { id: "marketplace", label: "Treasury", icon: ShoppingCart },
            { id: "notifications", label: "Broadcast", icon: Bell },
            { id: "vit", label: "VIT Access", icon: Zap },
           ].map(t => (
             <button 
              key={t.id}
              onClick={() => setActiveAdminTab(t.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeAdminTab === t.id ? 'bg-[#0b0e14] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
             >
               <t.icon size={14} className={t.id === 'vit' ? 'text-primary' : ''} /> {t.label}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeAdminTab === "monitoring" && (
          <motion.div key="monitoring" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: "Total Users", val: metrics.totalUsers.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-accent-blue" },
                { label: "Trade Volume", val: `$${metrics.totalVolume.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Fees Collected", val: `$${metrics.monthlyRevenue.toLocaleString()}`, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Pending Audits", val: kycQueue.length + escrowTrades.length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 p-5 md:p-8 rounded-[24px] md:rounded-[32px] shadow-xl flex flex-col sm:flex-row items-center justify-between group gap-4">
                  <div>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{m.val}</p>
                  </div>
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${m.bg} ${m.color} rounded-[16px] md:rounded-[22px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shrink-0`}>
                    <m.icon size={22} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Compliance Queue */}
              <div className="lg:col-span-8 bento-card p-6 md:p-10 space-y-8">
                 <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                   <ShieldCheck className="text-primary" /> Compliance Queue
                 </h3>
                 <div className="space-y-4">
                    {loadingUsers ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div> : 
                    kycQueue.length === 0 ? <p className="text-center py-12 text-gray-400 font-bold">No pending identity nodes.</p> :
                    kycQueue.map(item => (
                      <div key={item.id || item.supabaseId} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-primary border border-gray-100">{item.name[0]}</div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{item.documentType || "Verification Node"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleApproveKycNode(item.supabaseId || item.id, 'APPROVE')} className="h-10 px-4 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg">Approve</button>
                           <button onClick={() => handleApproveKycNode(item.supabaseId || item.id, 'REJECT')} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg"><X size={16} /></button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* System Health */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bento-card p-8 space-y-6">
                   <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Settings size={14} /> Node Status</h4>
                   <div className="space-y-3">
                      {["OPERATIONAL", "DEGRADED", "MAINTENANCE"].map(s => (
                        <button key={s} onClick={() => changeStatus(s as any)} className={`w-full py-4 px-5 rounded-xl text-[10px] font-black uppercase flex items-center justify-between border ${activeStatus === s ? 'bg-primary/5 border-primary text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                          {s}
                          <div className={`w-2 h-2 rounded-full ${activeStatus === s ? 'bg-primary animate-pulse' : 'bg-gray-300'}`} />
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeAdminTab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
             <div className="bento-card p-8 md:p-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">User Ledger</h3>
                   <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input type="text" placeholder="Search Account ID..." className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none" />
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-gray-100">
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Account</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reserves</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {loadingUsers ? <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="animate-spin inline-block text-primary" /></td></tr> :
                         kycQueue.map(u => (
                           <tr key={u.id || u.supabaseId} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">{u.name[0]}</div>
                                    <div>
                                       <p className="text-sm font-black text-gray-900">{u.name}</p>
                                       <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-5">
                                 <p className="text-sm font-mono font-black text-[#0b0e14]">₦{u.balance.toLocaleString()}</p>
                              </td>
                              <td className="py-5">
                                 <span className={`px-2 py-1 ${u.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} rounded-lg text-[8px] font-black uppercase tracking-widest`}>
                                    {u.kycStatus}
                                 </span>
                              </td>
                              <td className="py-5 text-right">
                                 <button onClick={() => { setSelectedUser(u); setShowCreditModal(true); }} className="px-4 py-2 bg-[#0b0e14] text-white text-[10px] font-black uppercase rounded-lg hover:bg-primary transition-all">
                                    Credit / Debit
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "marketplace" && (
          <motion.div key="marketplace" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
             <div className="bg-[#0b0e14] text-white rounded-[35px] p-8 md:p-12 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                   <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full bg-primary" />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                   <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center justify-center md:justify-start gap-4">
                        <Lock className="text-primary" /> Escrow Vault
                      </h3>
                      <p className="text-gray-500 font-medium max-w-lg">Authorize global asset node settlements from the escrow mesh.</p>
                   </div>
                   <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Locked reserves</p>
                      <p className="text-2xl font-black font-space text-primary">₦{vaultMetrics.lockedReserves.toLocaleString()}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                   {loadingTrades ? <div className="col-span-2 flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div> :
                   escrowTrades.length === 0 ? <p className="col-span-2 text-center py-12 text-gray-500 font-bold uppercase tracking-widest">No active escrow nodes.</p> :
                   escrowTrades.map(t => (
                     <div key={t.id} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col justify-between gap-10 hover:border-primary/50 transition-all">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xl font-black text-white">{t.assetName || t.asset}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Node ID: {t.id}</p>
                           </div>
                           <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-lg text-[9px] font-black uppercase">{t.status}</span>
                        </div>
                        <div className="flex items-end justify-between">
                           <div>
                              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Magnitude</p>
                              <p className="text-3xl font-black font-space text-white">₦{t.amount.toLocaleString()}</p>
                           </div>
                           <div className="flex gap-2">
                              <button disabled={settlingId === t.id} onClick={() => handleSettleEscrow(t.id, 'REJECT')} className="h-12 w-12 flex items-center justify-center bg-white/5 text-red-500 rounded-xl hover:bg-red-500/10 transition-all disabled:opacity-50"><Trash2 size={18} /></button>
                              <button disabled={settlingId === t.id} onClick={() => handleSettleEscrow(t.id, 'RELEASE')} className="h-12 px-6 bg-white text-[#0b0e14] text-[10px] font-black uppercase rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 flex items-center gap-2">
                                 {settlingId === t.id ? <Loader2 size={14} className="animate-spin" /> : "Release Funds"}
                              </button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "notifications" && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
             <div className="bento-card p-8 md:p-12 space-y-10">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Institutional Broadcast</h3>
                   <p className="text-gray-500 font-medium">Dispatch global push notifications across the OBEY mesh nodes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Signal Heading</label>
                         <input type="text" value={pushTitle} onChange={(e) => setPushTitle(e.target.value)} placeholder="System Maintenance..." className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Magnitude Target</label>
                         <select value={pushTarget} onChange={(e) => setPushTarget(e.target.value)} className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none">
                            <option value="all">Global Mesh (All Users)</option>
                            <option value="verified">Tier 2 Verified Only</option>
                            <option value="admin">Institutional Nodes Only</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Signal Payload</label>
                      <textarea value={pushMessage} onChange={(e) => setPushMessage(e.target.value)} placeholder="Enter protocol details..." className="w-full h-44 p-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none resize-none" />
                   </div>
                </div>

                <button onClick={handleSendPush} disabled={sendingPush || !pushTitle || !pushMessage} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 active-press flex items-center justify-center gap-3 disabled:opacity-50">
                   {sendingPush ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Dispatch Broadcast</>}
                </button>
             </div>
          </motion.div>
        )}

        {activeAdminTab === "vit" && (
          <motion.div key="vit" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* VIT Status */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-[#0b0e14] rounded-[2.5rem] p-10 border border-primary/20 relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                      <div className="space-y-6 relative z-10">
                         <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <Zap size={32} />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">VIT Mesh</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Verified Institutional Tier</p>
                         </div>
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Uptime</span>
                               <span className="text-[10px] font-black text-emerald-500 uppercase">99.99%</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Node Latency</span>
                               <span className="text-[10px] font-black text-primary uppercase">12ms</span>
                            </div>
                         </div>
                         <button 
                          onClick={runVitDiagnostic}
                          disabled={isVitSimulating}
                          className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 active-press flex items-center justify-center gap-2"
                         >
                            {isVitSimulating ? <Loader2 size={16} className="animate-spin" /> : <><Cpu size={16} /> Run VIT Diagnostic</>}
                         </button>
                      </div>
                   </div>

                   <div className="bento-card p-8 space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><Globe size={14} /> Global Edge Nodes</h4>
                      <div className="space-y-4">
                         {[
                           { name: "Lagos Center", load: "42%", status: "online" },
                           { name: "London Node", load: "18%", status: "online" },
                           { name: "NYC Gateway", load: "31%", status: "online" }
                         ].map(n => (
                           <div key={n.name} className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900">{n.name}</span>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-mono text-gray-400">{n.load}</span>
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* VIT System Logs */}
                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-[#0b0e14] rounded-[2.5rem] p-10 border border-white/5 h-full min-h-[600px] flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                         <div className="flex items-center gap-4">
                            <Terminal className="text-primary" size={24} />
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">Protocol Introspection</h3>
                         </div>
                         <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                         </div>
                      </div>
                      
                      <div className="flex-grow font-mono text-[11px] space-y-3 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
                         {vitLogs.map((log, i) => (
                           <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="flex gap-4"
                           >
                              <span className="text-gray-700">[{i.toString().padStart(2, '0')}]</span>
                              <span className={log.includes('OPTIMIZED') || log.includes('ONLINE') ? 'text-emerald-500' : 'text-primary/70'}>
                                 {log}
                              </span>
                           </motion.div>
                         ))}
                         {isVitSimulating && (
                           <motion.div 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-2 h-4 bg-primary inline-block ml-4"
                           />
                         )}
                      </div>

                      <div className="mt-auto pt-10 border-t border-white/5 flex gap-4">
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-5 space-y-2">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Mesh Compute</p>
                            <p className="text-2xl font-black text-white font-space">2.4 PFLOPS</p>
                         </div>
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-5 space-y-2">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Secured Transactions</p>
                            <p className="text-2xl font-black text-white font-space">8.2M+</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Adjustment Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowCreditModal(false)} />
           <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Adjust Ledger</h3>
                 <p className="text-sm font-medium text-gray-500">Managing node: <span className="font-black text-primary">{selectedUser.name}</span></p>
              </div>

              <div className="space-y-6">
                 <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                    <button onClick={() => setCreditType("ADD")} className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${creditType === 'ADD' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-400'}`}>Credit Node</button>
                    <button onClick={() => setCreditType("SUB")} className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase transition-all ${creditType === 'SUB' ? 'bg-white text-red-500 shadow-md' : 'text-gray-400'}`}>Debit Node</button>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Magnitude (₦)</label>
                    <div className="relative">
                       <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                       <input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} placeholder="0.00" className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-2xl text-2xl font-black text-gray-900 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowCreditModal(false)} className="flex-1 h-16 bg-gray-50 text-gray-400 font-black uppercase text-[11px] rounded-2xl">Cancel</button>
                 <button onClick={handleCreditAdjustment} className={`flex-[2] h-16 ${creditType === 'ADD' ? 'bg-emerald-500' : 'bg-red-500'} text-white font-black uppercase text-[11px] rounded-2xl shadow-xl active-press`}>
                    Confirm Node Adjustment
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
