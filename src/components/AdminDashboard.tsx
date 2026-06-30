import React, { useState, useEffect } from "react";
import { AppScreen, AppTab, UserProfile, AdminMetrics } from "../types";
import AdminSystem from "./AdminSystem";
import TierManagement from "./TierManagement";
import PuppyLoading from "./PuppyLoading";
import { motion } from "framer-motion";
import { 
  ShieldCheck, LogOutIcon, Users, DollarSign, Activity, 
  AlertCircle, TrendingUp, BarChart2, ShieldAlert, 
  Zap, Server, ChevronRight, ArrowRight, Search, 
  Bell, CreditCard, Send, Cpu, Globe, Database, 
  HardDrive, Terminal, Map, Fingerprint, ExternalLink, 
  Download, PlayCircle, AlertTriangle, ShieldQuestion, 
  Gavel, FileText, Wallet, Settings, Home, Crown
} from "lucide-react";
import { useNotification } from "./NotificationSystem";
import api from "../services/api";

interface AdminDashboardProps {
  profile: UserProfile;
  onLogout: () => void;
  onBackToUserDashboard: () => void;
}

export default function AdminDashboard({ profile, onLogout, onBackToUserDashboard }: AdminDashboardProps) {
  const { notify } = useNotification();
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState<"overview" | "users" | "transactions" | "fraud" | "tiers" | "system">("overview");
  
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    totalVolume: 0,
    monthlyRevenue: 0,
    pendingKycCount: 0,
    systemStatus: "OPERATIONAL"
  });

  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminEarnings, setAdminEarnings] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState({
    api: 'checking',
    database: 'checking',
    webhooks: 'checking'
  });

  useEffect(() => {
    loadAdminData();
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const res = await api.get('/health');
      setSystemHealth({
        api: 'online',
        database: res.data.database ? 'connected' : 'disconnected',
        webhooks: 'active'
      });
    } catch (error) {
      setSystemHealth({
        api: 'offline',
        database: 'disconnected',
        webhooks: 'inactive'
      });
    }
  };

  const loadAdminData = async () => {
    setIsInitializing(true);
    try {
      const [usersRes, fraudRes, auditRes, earningsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/fraud-alerts'),
        api.get('/admin/audit-ledger'),
        api.get('/crypto-trade/admin-earnings').catch(() => ({ data: null })),
      ]);

      const usersData = usersRes.data.users || usersRes.data;
      const auditData = auditRes.data;

      setUsers(Array.isArray(usersData) ? usersData : []);
      setAdminMetrics({
        totalUsers: auditData.totalUsers || usersData.length || 0,
        totalVolume: auditData.totalVolume || 0,
        monthlyRevenue: auditData.monthlyRevenue || 0,
        pendingKycCount: auditData.pendingUsers || usersData.filter((u: any) => u.kycStatus === 'Pending').length,
        systemStatus: "OPERATIONAL"
      });

      if (earningsRes.data) {
        setAdminEarnings(earningsRes.data);
      }

      notify("success", "Admin Console Loaded", "All institutional nodes synchronized.");
    } catch (error) {
      console.error("Failed to load admin data:", error);
      notify("error", "Admin Load Failed", "Some data may be unavailable.");
    } finally {
      setTimeout(() => setIsInitializing(false), 1200);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isInitializing && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-4">
          <PuppyLoading />
          <p className="text-sm font-black uppercase tracking-widest text-gray-400">Initializing Admin Console...</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-gray-200 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center rounded-2xl shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">OBEY Admin Console</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Institutional Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={loadAdminData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Refresh</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">
              {adminMetrics.systemStatus}
            </span>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center font-black text-white text-sm">
              {profile.avatar}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">{profile.name}</p>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">VIT Admin</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-5rem)] p-6">
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "users", label: "Users", icon: Users },
              { id: "transactions", label: "Transactions", icon: DollarSign },
              { id: "fraud", label: "Fraud Alerts", icon: ShieldAlert },
              { id: "tiers", label: "Tier Management", icon: Crown },
              { id: "system", label: "System", icon: Server },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveAdminTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeAdminTab === item.id
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button 
              onClick={onBackToUserDashboard}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              <span>Switch to User View</span>
            </button>
          </div>
        </aside>

        <main className="flex-grow p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {activeAdminTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-10 h-10 text-blue-500" />
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">+12%</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                    <p className="text-3xl font-black text-gray-900">{adminMetrics.totalUsers.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-10 h-10 text-emerald-500" />
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">+8%</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Volume</p>
                    <p className="text-3xl font-black text-gray-900">₦{(adminMetrics.totalVolume / 1000000).toFixed(1)}M</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-10 h-10 text-purple-500" />
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">+15%</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Revenue</p>
                    <p className="text-3xl font-black text-gray-900">₦{(adminMetrics.monthlyRevenue / 1000).toFixed(1)}K</p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <AlertCircle className="w-10 h-10 text-orange-500" />
                      <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Pending</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">KYC Queue</p>
                    <p className="text-3xl font-black text-gray-900">{adminMetrics.pendingKycCount}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 mb-6">System Health</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`flex items-center gap-4 p-4 rounded-xl ${systemHealth.api === 'online' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${systemHealth.api === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">API Server</p>
                        <p className={`text-lg font-black ${systemHealth.api === 'online' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {systemHealth.api === 'online' ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-4 p-4 rounded-xl ${systemHealth.database === 'connected' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${systemHealth.database === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Database</p>
                        <p className={`text-lg font-black ${systemHealth.database === 'connected' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {systemHealth.database === 'connected' ? 'Connected' : 'Disconnected'}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-4 p-4 rounded-xl ${systemHealth.webhooks === 'active' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${systemHealth.webhooks === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-600">Webhooks</p>
                        <p className={`text-lg font-black ${systemHealth.webhooks === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {systemHealth.webhooks === 'active' ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 mb-6">Business Insights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">User Growth</p>
                      <p className="text-2xl font-black text-gray-900">{adminMetrics.totalUsers}</p>
                      <p className="text-xs text-emerald-600 font-bold mt-2">+12% this month</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">Transaction Volume</p>
                      <p className="text-2xl font-black text-gray-900">₦{(adminMetrics.totalVolume / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-emerald-600 font-bold mt-2">+8% this month</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">Monthly Revenue</p>
                      <p className="text-2xl font-black text-gray-900">₦{(adminMetrics.monthlyRevenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-emerald-600 font-bold mt-2">+15% this month</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                      <div className="flex items-center justify-between mb-4">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                        <span className="text-xs font-black text-amber-600 uppercase">Pending</span>
                      </div>
                      <p className="text-sm font-bold text-gray-600 mb-1">KYC Queue</p>
                      <p className="text-2xl font-black text-gray-900">{adminMetrics.pendingKycCount}</p>
                      <p className="text-xs text-amber-600 font-bold mt-2">Requires attention</p>
                    </div>
                  </div>

                  {adminEarnings && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        Platform Earnings (Crypto Trades)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Earnings</p>
                          <p className="text-2xl font-black text-amber-900">₦{adminEarnings.totalEarnings?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Earnings</p>
                          <p className="text-2xl font-black text-emerald-900">₦{adminEarnings.todayEarnings?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trade Count</p>
                          <p className="text-2xl font-black text-blue-900">{adminEarnings.transactionCount || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeAdminTab === "users" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900">User Management</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                    >
                      <option value="all">All Status</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Unverified">Unverified</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {users
                    .filter((u: any) => {
                      const matchesSearch = !searchQuery || 
                        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.supabaseId?.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === 'all' || u.kycStatus === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((user: any) => (
                      <div key={user._id || user.supabaseId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-black rounded-lg uppercase ${
                            user.kycStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                            user.kycStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.kycStatus || 'Unverified'}
                          </span>
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {users.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-bold">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeAdminTab === "transactions" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6">Transaction Ledger</h2>
                <div className="space-y-3">
                  {transactions.map((tx: any) => (
                    <div key={tx._id || tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tx.title || 'Transaction'}</p>
                          <p className="text-sm text-gray-500">{tx.userId} • {tx.date || new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">₦{(tx.amount || 0).toLocaleString()}</p>
                        <span className={`text-xs font-bold uppercase ${
                          tx.status === 'Success' || tx.status === 'Completed' ? 'text-emerald-600' :
                          tx.status === 'Processing' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>{tx.status || 'Unknown'}</span>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-bold">No transactions found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeAdminTab === "fraud" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6">Fraud Detection</h2>
                <div className="space-y-3">
                  {fraudAlerts.map((alert: any) => (
                    <div key={alert._id || alert.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{alert.type || 'Alert'}</p>
                          <p className="text-sm text-gray-600">{alert.description || 'Suspicious activity detected'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={async () => {
                            try {
                              await api.post('/admin/resolve-alert', { alertId: alert._id || alert.id, action: 'RESOLVE' });
                              setFraudAlerts(prev => prev.filter(a => (a._id || a.id) !== (alert._id || alert.id)));
                              notify("success", "Alert Resolved", "Fraud alert has been resolved.");
                            } catch (err) {
                              notify("error", "Error", "Failed to resolve alert.");
                            }
                          }}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-all"
                        >
                          Resolve
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await api.post('/admin/resolve-alert', { alertId: alert._id || alert.id, action: 'DISMISS' });
                              setFraudAlerts(prev => prev.filter(a => (a._id || a.id) !== (alert._id || alert.id)));
                              notify("success", "Alert Dismissed", "Fraud alert has been dismissed.");
                            } catch (err) {
                              notify("error", "Error", "Failed to dismiss alert.");
                            }
                          }}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-lg transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                  {fraudAlerts.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-bold">No fraud alerts</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeAdminTab === "tiers" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <TierManagement />
              </div>
            )}

            {activeAdminTab === "system" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6">System Configuration</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">System Status</p>
                      <p className="text-sm text-gray-500">Current operational status</p>
                    </div>
                    <select 
                      value={adminMetrics.systemStatus}
                      onChange={(e) => {
                        setAdminMetrics(prev => ({ ...prev, systemStatus: e.target.value as any }));
                        notify("success", "Status Updated", `System status changed to ${e.target.value}`);
                      }}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                    >
                      <option>OPERATIONAL</option>
                      <option>DEGRADED</option>
                      <option>MAINTENANCE</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Enable maintenance mode for users</p>
                    </div>
                    <button 
                      onClick={() => {
                        setAdminMetrics(prev => ({ ...prev, systemStatus: 'MAINTENANCE' }));
                        notify("warning", "Maintenance Mode", "System is now in maintenance mode.");
                      }}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all"
                    >
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Export Audit Logs</p>
                      <p className="text-sm text-gray-500">Download system audit trail</p>
                    </div>
                    <button 
                      onClick={() => {
                        const auditData = JSON.stringify({
                          users: users,
                          transactions: transactions,
                          fraudAlerts: fraudAlerts,
                          exportedAt: new Date().toISOString()
                        }, null, 2);
                        const blob = new Blob([auditData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        notify("success", "Export Complete", "Audit logs downloaded successfully.");
                      }}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">API Server</p>
                      <p className="text-sm text-gray-500">Backend service status</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg uppercase">
                      Online
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Database</p>
                      <p className="text-sm text-gray-500">MongoDB connection status</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg uppercase">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Payment Gateway</p>
                      <p className="text-sm text-gray-500">Nomba/Interswitch status</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg uppercase">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
