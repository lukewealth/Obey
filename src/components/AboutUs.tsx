import React, { useState } from "react";
import { ShieldCheck, Globe, Zap, Users, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the OBEY Institutional Node?",
      a: "The OBEY Institutional Node is a high-throughput financial gateway that synchronizes private ledger data with global liquidity pools, ensuring instant settlement and bank-grade security."
    },
    {
      q: "How secure is the Virtual Card generation?",
      a: "All virtual cards are generated using 256-bit AES encryption and multi-signature authorization. They are fully compliant with PCI-DSS standards and compatible with major digital wallets."
    },
    {
      q: "What are the fees for global transfers?",
      a: "Our node mesh architecture allows for 0% internal transfer fees. Cross-border fiat settlements are subject to a minimal 0.1% liquidity spread, significantly lower than traditional banking."
    },
    {
      q: "How do I upgrade to Level 2 verification?",
      a: "Level 2 verification requires a government-issued ID and a liveness selfie check. This unlocks institutional limits and access to the Marketplace Escrow system."
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      <section id="about" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex px-5 py-2 bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">Branding</div>
                <h2 className="text-5xl md:text-7xl font-black text-[#0b0e14] tracking-tighter">Security first.<br/><span className="text-primary italic">Enterprise-ready.</span></h2>
                <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                  We process over $2.5B in monthly volume with zero downtime. Our infrastructure is built on multiple layers of bank-grade encryption and cold-storage institutional custody.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: ShieldCheck, title: "Military Grade", desc: "AES-256 encryption at rest and in transit." },
                  { icon: Globe, title: "Global Scale", desc: "Settlements in seconds across 140+ countries." },
                  { icon: Zap, title: "Instant Nodes", desc: "Direct connectivity to institutional liquidity." },
                  { icon: Users, title: "Institutional", desc: "Trusted by 500+ global enterprises." }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <item.icon size={24} />
                    </div>
                    <h4 className="text-lg font-black text-[#0b0e14]">{item.title}</h4>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-all duration-1000"></div>
              <div className="relative bg-white p-2 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
                <img 
                  src="/security_illustration.jpg" 
                  alt="Institutional Security" 
                  className="w-full h-[550px] object-cover rounded-[3.2rem] group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protection Level</p>
                      <p className="text-xl font-black text-[#0b0e14]">Military Grade Encryption</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <ShieldCheck size={28} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#0b0e14]">Common Questions</h2>
             <p className="text-lg text-gray-400 font-medium tracking-tight">Everything you need to know about the node ecosystem.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#fcfcfd] border border-gray-100 rounded-[2rem] overflow-hidden transition-all hover:border-primary/30 shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-8 flex items-center justify-between text-left"
                >
                  <span className="text-xl font-black tracking-tight text-[#0b0e14]">{faq.q}</span>
                  <div className={`w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#0b0e14] transition-transform ${openFaq === index ? 'rotate-180 bg-[#0b0e14] text-white' : ''}`}>
                     <ChevronDown size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <p className="text-gray-500 font-medium leading-relaxed text-lg pt-4 border-t border-gray-100">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Teaser */}
      <section className="px-6 pt-16">
         <div className="max-w-5xl mx-auto bg-[#0b0e14] rounded-[4rem] p-12 md:p-20 text-center space-y-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">Ready to join the <br /><span className="text-primary italic">next generation?</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="h-20 px-10 bg-white text-[#0b0e14] rounded-2xl flex items-center gap-5 hover:scale-105 transition-all shadow-2xl active-press group/btn">
                   <img src="https://developer.apple.com/assets/elements/icons/apple/apple-96x96.png" alt="Apple" className="w-8 h-8 group-hover/btn:scale-110 transition-transform" onError={(e) => { (e.target as HTMLImageElement).src = '/apple-logo.svg'; }} />
                   <div className="text-left">
                      <p className="text-[10px] font-bold uppercase opacity-50">App Store</p>
                      <p className="text-lg font-black uppercase tracking-wider">Download Now</p>
                   </div>
                </button>
                <button className="h-20 px-10 bg-[#1e232b] text-white rounded-2xl flex items-center gap-5 hover:scale-105 transition-all shadow-2xl active-press group/btn border border-white/5">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google" className="w-8 h-8 group-hover/btn:rotate-12 transition-transform" onError={(e) => { (e.target as HTMLImageElement).src = '/google-play.svg'; }} />
                   <div className="text-left">
                      <p className="text-[10px] font-bold uppercase opacity-50">Google Play</p>
                      <p className="text-lg font-black uppercase tracking-wider">Get it on</p>
                   </div>
                </button>
            </div>
         </div>
      </section>
    </div>
  );
}
