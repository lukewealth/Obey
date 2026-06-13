import React, { useState } from "react";
import { Transaction } from "../types";
import { 
  Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, Check, X, 
  Clock, Download, Share2, CornerDownRight, ExternalLink, Calendar, HelpCircle 
} from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Ledger Audit History</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">Comprehensive chronological list of all ledger actions and processing receipts.</p>
        </div>
      </div>

      {/* Filter Options Control Panel */}
      <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 p-4 rounded-[20px] flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search bar */}
        <div className="relative w-full md:max-w-xs group">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Ledger (e.g. Card, Crypto, Airtime)..."
            className="block w-full h-10 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-500 text-white"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Credit vs Debit togglers */}
          <div className="flex bg-[#0B1220] border border-[#242F41] rounded-lg p-0.5 max-h-10">
            {(["All", "Credit", "Debit"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-[11px] font-bold rounded transition-all duration-150 ${
                  filterType === type ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
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
            className="h-10 px-3 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] rounded-lg text-xs text-white outline-none"
          >
            <option value="All" className="bg-[#0b1220]">All Statuses</option>
            <option value="Success" className="bg-[#0b1220]">Success Only</option>
            <option value="Processing" className="bg-[#0b1220]">Processing Only</option>
            <option value="Failed" className="bg-[#0b1220]">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Audit List of Rows */}
      <div className="bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] overflow-hidden shadow-xl">
        {filteredTx.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <SlidersHorizontal className="mb-4 opacity-50" size={32} />
            <p className="text-xs font-bold uppercase tracking-wider">No matching transaction indexes found</p>
            <p className="text-[11px] text-[#242F41] mt-1">Review your filters or search constraints above.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#242F41]">
            {filteredTx.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const isCredit = tx.type === "Credit";

              return (
                <div key={tx.id} className="transition-all">
                  {/* Primary Row header summary */}
                  <div
                    onClick={() => toggleExpandRow(tx.id)}
                    className={`flex items-center justify-between p-5 hover:bg-[#0B1220]/40 cursor-pointer select-none transition-colors border-l-4 ${
                      isExpanded ? "bg-[#0B1220]/20 border-l-[#0057FF]" : "border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit 
                          ? "bg-green-500/10 text-emerald-400" 
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-black text-white">{tx.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {tx.id} • {tx.category} • {tx.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className={`text-xs sm:text-sm font-mono font-bold ${isCredit ? "text-[#12B76A]" : "text-white"}`}>
                          {isCredit ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{tx.date}</p>
                      </div>
                      
                      {/* Operational Status badge indicator */}
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        tx.status === "Success" ? "bg-emerald-500" :
                        tx.status === "Processing" ? "bg-[#F79009] animate-pulse" : "bg-red-500"
                      }`} title={tx.status}></span>
                    </div>
                  </div>

                  {/* Expandable detailed Invoice specs info drawer */}
                  {isExpanded && (
                    <div className="bg-[#0B1220] p-5 sm:p-6 border-t border-b border-[#242F41] text-xs font-light space-y-5 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Summary Column */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Audit Details</p>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Order Ref ID</span>
                              <span className="font-mono text-white font-bold select-all">{tx.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Settle Block</span>
                              <span className="text-white font-mono">#98231 {tx.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Execution time</span>
                              <span className="text-white">{tx.date} at {tx.time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Charges breakdown Column */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Charges breakdown</p>
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Original Settle Value</span>
                              <span className="text-white font-mono">${tx.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-medium">Processing Fee charge</span>
                              <span className="text-white font-mono">${tx.fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#242F41] pt-1.5 font-bold">
                              <span className="text-slate-300">Total Charged reserves</span>
                              <span className="text-[#00C6FF] font-mono">${(tx.amount + tx.fee).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* System Status column */}
                        <div className="space-y-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Routing Clearance</p>
                            <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
                              Processed on decentralized OBEY settlement pipeline. Identity confirmed securely.
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button className="flex-1 h-9 bg-white/5 border border-[#242F41] hover:bg-white/10 active-press rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-white">
                              <Download size={12} /> PDF
                            </button>
                            <button className="flex-1 h-9 bg-white/5 border border-[#242F41] hover:bg-white/10 active-press rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-white">
                              <Share2 size={12} /> Share
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
