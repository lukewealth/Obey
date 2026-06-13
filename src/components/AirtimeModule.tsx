import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { Smartphone, Wifi, Check, RefreshCw, ChevronRight, AlertTriangle, ShieldCheck, Download } from "lucide-react";

interface AirtimeModuleProps {
  profile: UserProfile;
  onPurchase: (amount: number, description: string) => Promise<boolean> | boolean;
}

interface NetworkProvider {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  logoChar: string;
  paymentCode: string;
}

interface DataPlan {
  id: string;
  name: string;
  price: number; // in USD
  dataAmount: string;
  validity: string;
  paymentCode: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function AirtimeModule({ profile, onPurchase }: AirtimeModuleProps) {
  const [activeSegment, setActiveSegment] = useState<"airtime" | "data">("airtime");
  const [selectedProvider, setSelectedProvider] = useState<string>("mtn");
  const [phoneNo, setPhoneNo] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDataPlan, setSelectedDataPlan] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const [providers, setProviders] = useState<NetworkProvider[]>([
    { id: "mtn", name: "MTN Nigeria", color: "bg-[#FFCC00] text-black", borderColor: "hover:border-[#FFCC00]", logoChar: "M", paymentCode: "10903" },
    { id: "airtel", name: "Airtel", color: "bg-[#E50914] text-white", borderColor: "hover:border-[#E50914]", logoChar: "A", paymentCode: "90101" },
    { id: "glo", name: "Glo Mobile", color: "bg-[#339933] text-white", borderColor: "hover:border-[#339933]", logoChar: "G", paymentCode: "90701" },
    { id: "9mobile", name: "9mobile", color: "bg-[#015249] text-white", borderColor: "hover:border-[#015249]", logoChar: "9", paymentCode: "90801" },
  ]);

  const [activePlans, setActivePlans] = useState<DataPlan[]>([]);

  useEffect(() => {
    if (activeSegment === "data") {
      fetchDataPlans();
    }
  }, [activeSegment, selectedProvider]);

  const fetchDataPlans = async () => {
    try {
      // In a real scenario, we'd fetch from the backend:
      // const res = await fetch(`${BACKEND_URL}/api/vtu/payment-items/${selectedProvider}`);
      // const data = await res.json();
      // For now, we use simulated data linked to real networks
      const simulatedPlans: Record<string, DataPlan[]> = {
        mtn: [
          { id: "m1", name: "Value Lite Daily", price: 1.0, dataAmount: "1.5 GB", validity: "24 Hours", paymentCode: "10901" },
          { id: "m2", name: "Supreme Ultra Weekly", price: 5.0, dataAmount: "10 GB", validity: "7 Days", paymentCode: "10902" },
        ],
        airtel: [
          { id: "a1", name: "Airtel Binge Daily", price: 1.2, dataAmount: "2.0 GB", validity: "24 Hours", paymentCode: "90102" },
        ],
        // ... other telcos
      };
      setActivePlans(simulatedPlans[selectedProvider] || []);
    } catch (error) {
      console.error("Failed to fetch data plans", error);
    }
  };

  const currentProvider = providers.find((p) => p.id === selectedProvider) || providers[0];

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNo || phoneNo.length < 10) return;
    if (activeSegment === "airtime" && (!amount || parseFloat(amount) <= 0)) return;
    if (activeSegment === "data" && !selectedDataPlan) return;
    setShowCheckout(true);
  };

  const handlePurchaseFinal = async () => {
    let price = 0;
    let description = "";
    let paymentCode = currentProvider.paymentCode;

    if (activeSegment === "airtime") {
      price = parseFloat(amount);
      description = `Airtime dispatched to ${phoneNo} (${currentProvider.name})`;
    } else {
      const plan = activePlans.find((p) => p.id === selectedDataPlan);
      if (!plan) return;
      price = plan.price;
      description = `${plan.dataAmount} Data subscription delivered to ${phoneNo} (${currentProvider.name})`;
      paymentCode = plan.paymentCode;
    }

    if (price > profile.balance) {
      alert("Insufficient wallet capital reserves.");
      return;
    }

    setProcessing(true);
    try {
      const requestReference = `OBY-${Date.now()}`;
      const response = await fetch(`${BACKEND_URL}/api/vtu/recharge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentCode,
          customerId: phoneNo.startsWith("234") ? phoneNo : `234${phoneNo.replace(/^0/, "")}`,
          amount: price * 1500 * 100, // Convert USD to NGN Kobo (Simulated rate)
          requestReference,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const isSuccess = await onPurchase(price, description);
        if (isSuccess) {
          setShowCheckout(false);
          setSuccessReceipt({
            txId: requestReference,
            phone: phoneNo,
            provider: currentProvider.name,
            planType: activeSegment === "airtime" ? "Airtime Credit" : `${activePlans.find(p => p.id === selectedDataPlan)?.dataAmount} Data Plan`,
            amount: price,
            date: new Date().toLocaleString()
          });
          setAmount("");
          setSelectedDataPlan("");
          setPhoneNo("");
        }
      } else {
        alert(data.error || "Transaction failed at carrier level.");
      }
    } catch (error) {
      console.error(error);
      alert("System communication error.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {successReceipt ? (
        /* Successful Dispatch Screen Layout */
        <div className="max-w-xl mx-auto bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          
          <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
            <ShieldCheck size={36} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-[#12B76A] uppercase tracking-widest font-black">DISPATCH SUCCESSFUL</p>
            <h2 className="text-3xl font-mono text-white font-bold">${successReceipt.amount.toFixed(2)}</h2>
            <p className="text-xs text-slate-400 font-light">
              Mobile packet delivered securely to <span className="text-white font-mono">{successReceipt.phone}</span>
            </p>
          </div>

          {/* Checkout transaction sheet specs */}
          <div className="w-full space-y-4 bg-[#0B1220] border border-[#242F41] p-5 rounded-2xl text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Ledger Index ID</span>
              <span className="font-mono text-white font-bold">{successReceipt.txId}</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operator Network</span>
              <span className="text-white font-bold">{successReceipt.provider}</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Package Dispatched</span>
              <span className="text-white font-bold">{successReceipt.planType}</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Delivery Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 bg-[#12B76A] rounded-full animate-ping"></span>
                Instant Delivered
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button className="w-full h-12 bg-white/5 border border-[#242F41] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <Download size={14} /> DOWNLOAD RECEIPTS
            </button>
            <button onClick={() => setSuccessReceipt(null)} className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold transition-colors">
              Dispatch Another Bundle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form module */}
          <div className="lg:col-span-8 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#242F41] pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Mobile Network Services</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Top-up airtime or purchase automated high-speed data internet plans.</p>
              </div>
            </div>

            {/* Custom module segment toggle */}
            <div className="flex p-1 bg-[#0B1220] border border-[#242F41] rounded-2xl">
              <button
                type="button"
                onClick={() => { setActiveSegment("airtime"); setSelectedDataPlan(""); }}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeSegment === "airtime" ? "bg-[#0057FF] text-white shadow-xl" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone size={16} /> Airtime Top-Up
              </button>
              <button
                type="button"
                onClick={() => { setActiveSegment("data"); setAmount(""); }}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeSegment === "data" ? "bg-[#0057FF] text-white shadow-xl" : "text-slate-400 hover:text-white"
                }`}
              >
                <Wifi size={16} /> Internet Data Plans
              </button>
            </div>

            <form onSubmit={handleOpenCheckout} className="space-y-6">
              
              {/* Provider Row Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">Select Operator Network</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProvider(p.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border bg-[#0B1220] transition-all duration-200 ${
                        selectedProvider === p.id
                          ? "border-[#0057FF] bg-[#0057FF]/5 shadow-lg"
                          : "border-[#242F41] hover:bg-[#161F30]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mb-2 ${p.color}`}>
                        {p.logoChar}
                      </div>
                      <span className="text-xs font-bold text-white">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input Row */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold" htmlFor="rec-phone">Recipient Phone Number</label>
                <div className="flex">
                  <div className="bg-[#0B1220] border border-[#242F41] border-r-0 rounded-l-xl px-4 flex items-center text-xs text-slate-400 font-bold">
                    +234
                  </div>
                  <input
                    id="rec-phone"
                    type="tel"
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="809 102 8824"
                    className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-r-xl text-sm font-semibold outline-none text-white font-mono"
                  />
                </div>
              </div>

              {/* Value selector based on AIRTIME vs DATA segment */}
              {activeSegment === "airtime" ? (
                <div className="space-y-3">
                  <label className="text-xs text-slate-400 font-semibold">Enter Credit Value ($)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount ($)"
                      className="block w-full h-12 px-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-mono text-center font-bold text-white"
                    />
                    {amount && (
                      <div className="bg-white/5 border border-[#242F41] px-4 h-12 flex items-center rounded-xl text-xs text-slate-400 font-mono shrink-0 font-bold">
                        ≈ ₦{(parseFloat(amount) * 1500).toLocaleString()} NGN
                      </div>
                    )}
                  </div>
                  {/* Preset Quick values */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {["1", "2", "5", "10", "20", "50"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(v)}
                        className={`py-2 border rounded-lg text-xs font-mono font-bold transition-all ${
                          amount === v
                            ? "bg-[#0057FF] text-white border-[#0057FF]"
                            : "border-[#242F41] bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        ${v} ({parseInt(v) * 1500}₦)
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-widest">Select Internet Bundle Packages</label>
                  <div className="space-y-2.5">
                    {activePlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedDataPlan(plan.id)}
                        className={`p-4 bg-[#0B1220] border rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          selectedDataPlan === plan.id
                            ? "border-[#0057FF] bg-[#0057FF]/5"
                            : "border-[#242F41] hover:border-[#0057FF]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={selectedDataPlan === plan.id}
                            onChange={() => {}}
                            className="accent-[#0057FF]"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-black text-white">{plan.dataAmount} Pack</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 font-light mt-0.5">
                              {plan.name} • {plan.validity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-bold text-white">${plan.price.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500 font-mono">≈ ₦{(plan.price * 1500).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={activeSegment === "airtime" ? (!amount || !phoneNo) : (!selectedDataPlan || !phoneNo)}
                className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg shadow-blue-500/15 disabled:opacity-50"
              >
                Assemble Dispatch Order
              </button>
            </form>
          </div>

          {/* Info Desk Column */}
          <div className="lg:col-span-4 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 space-y-6 shadow-xl">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Network Coverage Details</h4>
            <div className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <p className="font-bold text-white">Sub-Second Processing</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  All airtime top-up items and data packages are queued, approved and compiled onto live carriers automatically.
                </p>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="space-y-1 pt-1">
                <p className="font-bold text-white">Reserve Cash Backings</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Your wallet capital provides unified settlement for international billing products without additional retail surcharges.
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-[#00C6FF] shrink-0" size={18} />
              <div>
                <p className="text-[11px] font-bold text-white">Notice</p>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                  Ensure phone records contain a valid carrier prefix. Once dispatched, carrier transactions are completed in full.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC CHECKOUT SHEET OVERLAY */}
      {showCheckout && (
        <div className="fixed inset-0 bg-[#0b1220]/80 backdrop-blur-md z-40 flex items-center justify-center p-6 bg-opacity-70">
          <div className="w-full max-w-md bg-[#161F30] border border-[#242F41] rounded-[20px] p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-black text-white">Verify Checkout Invoice</h3>
            <p className="text-xs text-slate-400">Review the delivery details carefully before authorizing standard payment settlement.</p>
 
            <div className="bg-[#0B1220] p-4 rounded-xl border border-[#242F41] space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Recipient Phone</span>
                <span className="font-mono text-white font-bold">+234 {phoneNo}</span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Provider Network</span>
                <span className="text-white font-bold">{currentProvider.name}</span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Product Service</span>
                <span className="text-[#00C6FF] font-black uppercase text-[10px]">
                  {activeSegment === "airtime" ? "Airtime Top-Up" : "Data Internet Packet"}
                </span>
              </div>
              <div className="border-t border-[#242F41]"></div>
              {activeSegment === "data" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Plan Internet</span>
                    <span className="text-white font-bold">
                      {activePlans.find((p) => p.id === selectedDataPlan)?.dataAmount} ({activePlans.find((p) => p.id === selectedDataPlan)?.name})
                    </span>
                  </div>
                  <div className="border-t border-[#242F41]"></div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Transfer processing fee</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-black uppercase">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-semibold text-slate-400 text-center">Debiting Wallet</span>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-white">
                  ${activeSegment === "airtime" ? parseFloat(amount).toFixed(2) : activePlans.find((p) => p.id === selectedDataPlan)?.price.toFixed(2)}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  ≈ ₦{((activeSegment === "airtime" ? parseFloat(amount) : activePlans.find((p) => p.id === selectedDataPlan)?.price || 0) * 1500).toLocaleString()} NGN
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="py-3.5 bg-white/5 border border-[#242F41] hover:bg-white/10 active-press rounded-xl text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurchaseFinal}
                disabled={processing}
                className="py-3.5 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                {processing ? <RefreshCw className="animate-spin mr-2" size={14} /> : "Authorize Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
