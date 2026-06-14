import React, { useState } from "react";
import { Transaction } from "../types";
import { 
  Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, Check, X, 
  Clock, Download, Share2, CornerDownRight, ExternalLink, Calendar, HelpCircle, ArrowRight,
  CheckCircle2, ShieldCheck
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

  return (
    <div className="space-y-6 md:space-y-10 pb-24 px-1 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center md:text-left">Audit Log</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Sequential record of all institutional settlements.</p>
        </div>
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary self-center md:self-auto">
           <Clock size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Real-time ledger sync active</span>
        </div>
      </div>

      {/* Filter Options Control Panel */}
      <div className="bento-card p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between shadow-xl">
        {/* Search bar */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Ledger (e.g. Card, Crypto)..."
            className="w-full h-12 md:h-14 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-[16px] md:rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Credit vs Debit togglers */}
          <div className="flex bg-gray-100 p-1 rounded-[14px] md:rounded-[18px] w-full sm:w-auto">
            {(["All", "Credit", "Debit"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 md:px-6 py-2 md:py-2.5 text-[11px] md:text-xs font-black rounded-[11px] md:rounded-[15px] transition-all flex-1 sm:flex-none ${
                  filterType === type ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Status Selectors */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 md:h-14 px-4 md:px-6 bg-white border border-gray-100 focus:ring-2 focus:ring-primary/10 rounded-[16px] md:rounded-[20px] text-xs md:text-sm font-bold text-gray-900 outline-none w-full sm:w-auto transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success Only</option>
            <option value="Processing">Processing Only</option>
            <option value="Failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Audit List of Rows */}
      <div className="bento-card overflow-hidden shadow-2xl">
        {filteredTx.length === 0 ? (
          <div className="py-24 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <SlidersHorizontal size={40} />
             </div>
             <div className="space-y-1">
                <p className="text-sm font-black text-gray-900 uppercase tracking-widest">No matching indexes</p>
                <p className="text-xs text-gray-400 font-medium">Refine your search parameters.</p>
             </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTx.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const isCredit = tx.type === "Credit";

              return (
                <div key={tx.id} className="transition-all">
                  <div
                    onClick={() => toggleExpandRow(tx.id)}
                    className={`flex items-center justify-between p-5 md:p-8 hover:bg-accent-blue/40 cursor-pointer select-none transition-all border-l-8 ${
                      isExpanded ? "bg-accent-blue/20 border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[22px] flex items-center justify-center shrink-0 shadow-sm ${
                        isCredit 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-red-50 text-red-600"
                      }`}>
                        {isCredit ? <ArrowDownLeft size={22} className="md:w-7 md:h-7" /> : <ArrowUpRight size={22} className="md:w-7 md:h-7" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm md:text-xl font-black text-gray-900 tracking-tight truncate">{tx.title}</p>
                        <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1 truncate">
                          {tx.id} • {tx.category} • {tx.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4 md:gap-8 shrink-0">
                      <div>
                        <p className={`text-base md:text-2xl font-mono font-black ${isCredit ? "text-emerald-600" : "text-gray-900"}`}>
                          {isCredit ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] md:text-[11px] text-gray-400 font-black mt-1 uppercase tracking-widest">{tx.date}</p>
                      </div>
                      
                      <div className="shrink-0" title={tx.status}>
                        {tx.status === "Success" ? (
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                          </div>
                        ) : tx.status === "Processing" || tx.status === "Escrow" || tx.status === "Awaiting Audit" ? (
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shadow-sm">
                            <Clock size={18} className="md:w-5 md:h-5 animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm">
                            <X size={18} className="md:w-5 md:h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50/50 border-y border-gray-100 overflow-hidden"
                      >
                        <div className="p-6 md:p-10 space-y-8 md:space-y-12">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            
                            {/* Summary Column */}
                            <div className="space-y-4 md:space-y-6">
                              <p className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Audit Parameters</p>
                              <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-[11px] md:text-xs text-gray-500 font-medium">Node Reference</span>
                                  <span className="text-[11px] md:text-xs font-mono text-gray-900 font-black select-all uppercase">{tx.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] md:text-xs text-gray-500 font-medium">Protocol Cluster</span>
                                  <span className="text-[11px] md:text-xs text-gray-900 font-bold uppercase">{tx.category} Hub</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] md:text-xs text-gray-500 font-medium">Execution Node</span>
                                  <span className="text-[11px] md:text-xs text-gray-900 font-bold">OBEY-SUI-0{Math.floor(Math.random()*9)+1}</span>
                                </div>
                              </div>
                            </div>

                            {/* Charges breakdown Column */}
                            <div className="space-y-4 md:space-y-6">
                              <p className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Settlement Ledger</p>
                              <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between">
                                  <span className="text-[11px] md:text-xs text-gray-500 font-medium">Gross Magnitude</span>
                                  <span className="text-[11px] md:text-xs text-gray-900 font-mono font-bold">${tx.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[11px] md:text-xs text-gray-500 font-medium">Protocol Surcharge</span>
                                  <span className="text-[11px] md:text-xs text-gray-900 font-mono font-bold">${tx.fee.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between font-black">
                                  <span className="text-[11px] md:text-xs text-primary uppercase">Total Authorised</span>
                                  <span className="text-[13px] md:text-base text-primary font-mono">${(tx.amount + tx.fee).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* System Status column */}
                            <div className="space-y-6 flex flex-col justify-between">
                              <div className="space-y-3">
                                <p className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Institutional Clearing</p>
                                <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3">
                                   <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                                   <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed">
                                     Processed on decentralized OBEY settlement pipeline. Secure record verified on chain.
                                   </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <button className="h-12 bg-white border border-gray-200 hover:border-primary/20 hover:bg-gray-50 active-press rounded-[14px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-gray-700 transition-all shadow-sm">
                                  <Download size={16} /> PDF
                                </button>
                                <button className="h-12 bg-white border border-gray-200 hover:border-primary/20 hover:bg-gray-50 active-press rounded-[14px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-gray-700 transition-all shadow-sm">
                                  <Share2 size={16} /> Share
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
    </div>
  );
}
