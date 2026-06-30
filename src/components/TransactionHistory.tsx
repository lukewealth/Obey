import React, { useState } from "react";
import { Transaction } from "../types";
import { 
  Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, Check, X, 
  Clock, Download, Share2, CornerDownRight, ExternalLink, Calendar, HelpCircle, ArrowRight,
  CheckCircle2, ShieldCheck, PieChart, BarChart3, FileSpreadsheet, FileText, ChevronDown,
  Info, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Credit" | "Debit">("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpandRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter application
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch = 
      tx.title.toLowerCase().includes(search.toLowerCase()) || 
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "All" || tx.type === filterType;
    const matchesStatus = filterStatus === "All" || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalVolume = filteredTx.reduce((acc, tx) => acc + tx.amount, 0);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Title', 'Category', 'Type', 'Amount', 'Status', 'Reference'];
    const rows = filteredTx.map(tx => [
      tx.date,
      tx.time,
      tx.title,
      tx.category,
      tx.type,
      tx.amount.toString(),
      tx.status,
      tx.id
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export to PDF (simplified - opens print dialog)
  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center md:text-left">Transaction History</h2>
          <p className="text-sm text-gray-500 font-medium text-center md:text-left">All your recent transactions</p>
        </div>
      </div>

      {/* Top Bento Row: Filters & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
         {/* Filter Options */}
         <div className="lg:col-span-8 bento-card p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between shadow-xl">
            <div className="relative w-full group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
               <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Recipient, ID, or Protocol..."
                  className="w-full h-12 md:h-14 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
               />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="flex bg-gray-100 p-1.5 rounded-xl w-full sm:w-auto">
                  {(["All", "Credit", "Debit"] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-6 py-2.5 text-[11px] font-black rounded-lg transition-all flex-1 sm:flex-none ${
                        filterType === type ? "bg-white text-primary shadow-md" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {type}
                    </button>
                  ))}
               </div>
               <button className="p-4 bg-primary text-white rounded-xl shadow-lg active-press shrink-0"><SlidersHorizontal size={18} /></button>
            </div>
         </div>

         {/* Stats Card */}
         <div className="lg:col-span-4 bento-card p-6 md:p-8 space-y-2 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sourced Magnitude</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-3xl md:text-4xl font-black text-gray-900 font-space tracking-tight">₦{totalVolume.toLocaleString()}</h3>
               <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">+12.4%</span>
            </div>
         </div>
      </div>

      {/* Transaction Table */}
      <div className="bento-card overflow-hidden shadow-2xl border border-gray-100">
        {!Array.isArray(transactions) || filteredTx.length === 0 ? (
          <div className="py-32 text-center space-y-6">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <PieChart size={48} />
             </div>
             <div className="space-y-1">
                <p className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Zero Nodes Found</p>
                <p className="text-sm text-gray-400 font-medium">Reset filters to align with ecosystem data.</p>
             </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTx.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const isCredit = tx.type === "Credit";

              return (
                <div key={tx.id} className="transition-all">
                  <div
                    onClick={() => toggleExpandRow(tx.id)}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 hover:bg-gray-50/50 cursor-pointer select-none transition-all border-l-8 ${
                      isExpanded ? "bg-accent-blue/20 border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center shrink-0 shadow-inner ${
                        isCredit 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-red-50 text-red-600"
                      }`}>
                        {isCredit ? <ArrowDownLeft size={24} className="md:w-8 md:h-8" /> : <ArrowUpRight size={24} className="md:w-8 md:h-8" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-base md:text-xl font-black text-gray-900 tracking-tight truncate uppercase italic">{tx.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tx.date} • {tx.time}</span>
                           <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isCredit ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-100/50 text-red-600'}`}>{tx.category} Node</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-10">
                       <div className="text-right">
                          <p className={`text-xl md:text-3xl font-black font-space tracking-tight ${isCredit ? "text-emerald-600" : "text-gray-900"}`}>
                            {isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                             <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'Success' ? 'text-emerald-600' : 'text-amber-600'}`}>{tx.status}</span>
                          </div>
                       </div>
                       <ChevronDown className={`text-gray-300 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-primary' : ''}`} size={24} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 border-y border-gray-100 overflow-hidden"
                      >
                        <div className="p-8 md:p-12 space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                            
                            {/* Forensic Column */}
                            <div className="space-y-6">
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2"><Info size={12} /> Forensic ID</p>
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Execution Node</p>
                                  <p className="text-xs font-mono font-black text-gray-900 uppercase">OBEY-NODE-0{Math.floor(Math.random()*9)+1}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Reference Hash</p>
                                  <p className="text-xs font-mono font-black text-primary select-all">TXN-{tx.id.substring(0, 12)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">Gateway</p>
                                  <p className="text-xs font-bold text-gray-900 italic">Institutional Treasury (Main)</p>
                                </div>
                              </div>
                            </div>

                            {/* Ledger Breakdown */}
                            <div className="space-y-6">
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2"><PieChart size={12} /> Ledger Alignment</p>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Base Magnitude</span>
                                  <span className="text-xs font-mono font-black text-gray-900">₦{tx.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Protocol Surcharge</span>
                                  <span className="text-xs font-mono font-black text-gray-900">₦{(tx.fee || 0).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-gray-200" />
                                <div className="flex justify-between items-center pt-2">
                                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Settled Sum</span>
                                  <span className="text-lg font-mono font-black text-primary">₦{(tx.amount + (tx.fee || 0)).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Verification & Actions */}
                            <div className="space-y-8 flex flex-col justify-between">
                              <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-3">
                                 <div className="flex items-center gap-2 text-emerald-500">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Integrity</span>
                                 </div>
                                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                   This settlement has been cross-verified by the Sentinel Mesh and anchored on-chain for institutional transparency.
                                 </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <button className="h-14 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 active-press shadow-sm">
                                  <FileText size={16} /> Receipt
                                </button>
                                <button className="h-14 bg-[#0b0e14] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all active-press shadow-xl">
                                  <Share2 size={16} /> Relay
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights Section: Institutional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bento-card p-8 space-y-6 relative overflow-hidden group">
            <BarChart3 className="absolute -right-4 -bottom-4 text-gray-50 w-32 h-32 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter relative z-10">Flow Analysis</h4>
            <div className="space-y-5 relative z-10">
               {[
                  { label: "Institutional Cards", val: "₦142,500", p: 75, c: "bg-primary" },
                  { label: "Digital Assets", val: "₦42,200", p: 45, c: "bg-emerald-500" }
               ].map(m => (
                 <div key={m.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-gray-400">{m.label}</span>
                       <span className="text-gray-900">{m.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.p}%` }} className={`h-full ${m.c}`} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bento-card p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-2">
               <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Export Node Data</h4>
               <p className="text-xs text-gray-400 font-medium leading-relaxed">Generate high-fidelity forensic reports for tax and institutional auditing.</p>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={exportToCSV} className="h-14 bg-gray-50 text-gray-700 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active-press hover:bg-gray-100 transition-colors"><FileSpreadsheet size={16} /> CSV</button>
                <button onClick={exportToPDF} className="h-14 bg-gray-50 text-gray-700 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active-press hover:bg-gray-100 transition-colors"><FileText size={16} /> PDF</button>
             </div>
            <button className="h-14 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active-press">Schedule Auto-Export</button>
         </div>

         <div className="bg-[#0b0e14] p-8 rounded-[2.5rem] space-y-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 group-hover:bg-primary/30 transition-all" />
            <div className="space-y-4">
               <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Institutional Support</h4>
               <p className="text-xs text-gray-500 font-medium leading-relaxed">Our execution specialists are available 24/7 for manual ledger reconciliation.</p>
            </div>
            <button className="h-14 bg-white text-[#0b0e14] rounded-2xl text-[10px] font-black uppercase tracking-widest active-press flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">Contact Specialist <ArrowRight size={14} /></button>
         </div>
      </div>
    </div>
  );
}
