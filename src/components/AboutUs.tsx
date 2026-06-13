import React from "react";
import { ShieldCheck, Globe, Zap, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Security first.<br/><span className="text-primary">Enterprise-ready.</span></h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                We process over $2.5B in monthly volume with zero downtime. Our infrastructure is built on multiple layers of bank-grade encryption and cold-storage institutional custody.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "Military Grade", desc: "AES-256 encryption at rest and in transit." },
                { icon: Globe, title: "Global Scale", desc: "Settlements in seconds across 50+ countries." },
                { icon: Zap, title: "Instant Nodes", desc: "Direct connectivity to institutional liquidity." },
                { icon: Users, title: "Institutional", desc: "Trusted by 500+ global enterprises." }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-12 h-12 bg-accent-blue rounded-xl flex items-center justify-center text-primary">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-all duration-1000"></div>
            <div className="relative bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
              <img 
                src="https://lh3.googleusercontent.com/aida/AP1WRLutHcPnESDSgtsjZdmPdcJ8Hyel06r_xgaHB-pqd4GLpKIFHdNWm9kOWO8AJsw52-xFJzpZEoVR6HmaIrN1svxo-6z30hRNvB6PUuDxC-5UjQ8EwxMSC9veKQTo2-Pjv8EGvbjw8dbUq0zRfr1Kwu3wAIK2_MwzG11xPdPVmXOSXSaMoZkAinZqNlI-9NE9PZv7t9Ao1OiogtNjoGot3tXAoPNyLX57aiYJ40sOsy3SO0CFpnUYiTD84LNG" 
                alt="Security Vault" 
                className="w-full h-[500px] object-cover rounded-[2.2rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur-2xl p-6 rounded-3xl border border-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protection Level</p>
                    <p className="text-lg font-black text-gray-900">Multi-Signature Custody</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
