import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Music, Vote, Coins, Gift, Zap, Users, Globe, Shield, TrendingUp, Heart, PawPrint } from "lucide-react";

interface InfographicPageProps {
  onBack: () => void;
}

export default function InfographicPage({ onBack }: InfographicPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-white text-[#0b0e14] overflow-y-auto">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0b0e14] text-white flex items-center justify-center group-hover:bg-primary transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <img src="/obey_logo.png" alt="OBEY" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-black tracking-tight">Obey</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex px-5 py-2 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Infographic Design
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            Trade with <span className="text-primary italic">Obey</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            The human-to-animal relationship, reimagined through tokenomics. How Obey transforms loyalty into reward through the $JARA ecosystem by TRICODE PRO LTD.
          </motion.p>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">The Human-Animal Bond</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">Just as humans have domesticated animals over millennia — building trust, loyalty, and mutual benefit — Obey builds the same bond with its users through technology and rewards.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Trust",
                desc: "Like a loyal companion, Obey is always there. Bank-grade security, 24/7 uptime, and zero hidden fees.",
                color: "bg-rose-50 text-rose-500",
              },
              {
                icon: PawPrint,
                title: "Loyalty",
                desc: "Every trade, every purchase, every transaction earns you $JARA tokens. The more you use Obey, the more you earn.",
                color: "bg-amber-50 text-amber-500",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Join a global node network of 15M+ users. Together, we power the future of decentralized finance.",
                color: "bg-blue-50 text-blue-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative bg-[#0b0e14] rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-white overflow-hidden space-y-16"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="inline-flex px-5 py-2 bg-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Ecosystem Product
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter">
              $JARA Token
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto">
              A Music Streaming NFT Voting Platform by TRICODE PRO LTD
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Music size={24} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black">Music Streaming</h4>
                  <p className="text-white/60 font-medium leading-relaxed">Stream music from independent artists. Earn $JARA tokens for every stream, share, and discovery.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Vote size={24} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black">NFT Voting</h4>
                  <p className="text-white/60 font-medium leading-relaxed">Vote on which artists get funded. Your $JARA tokens give you governance power over the platform's direction.</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Coins size={24} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black">Token Rewards</h4>
                  <p className="text-white/60 font-medium leading-relaxed">Earn $JARA for trading, buying gift cards, airtime, and data on Obey. The more you engage, the more you earn.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Gift size={24} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black">User Rewards System</h4>
                  <p className="text-white/60 font-medium leading-relaxed">Redeem $JARA for exclusive NFTs, premium features, cashback, and real-world merchandise.</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="text-center pt-8">
            <a
              href="https://www.mintjara.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-[#0b0e14] font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full hover:bg-white transition-all shadow-2xl shadow-primary/30"
            >
              <Zap size={18} />
              Visit mintjara.app
            </a>
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Tokenomics Flow</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">How $JARA tokens flow through the Obey ecosystem</p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {[
                { step: "01", title: "Trade & Earn", desc: "Every crypto trade, gift card purchase, airtime & data buy earns $JARA", icon: TrendingUp, color: "bg-emerald-50 text-emerald-500 border-emerald-100" },
                { step: "02", title: "Stake & Vote", desc: "Stake $JARA to vote on artists and platform governance decisions", icon: Vote, color: "bg-blue-50 text-blue-500 border-blue-100" },
                { step: "03", title: "Stream & Discover", desc: "Use $JARA to unlock premium music content and exclusive NFT drops", icon: Music, color: "bg-purple-50 text-purple-500 border-purple-100" },
                { step: "04", title: "Redeem & Grow", desc: "Cash out $JARA for rewards, cashback, merchandise, or hold for appreciation", icon: Gift, color: "bg-amber-50 text-amber-500 border-amber-100" },
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="relative">
                  <div className={`bg-white border-2 rounded-[2rem] p-6 md:p-8 space-y-4 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${item.color}`}>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Step {item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto">
                      <item.icon size={24} />
                    </div>
                    <h4 className="text-lg font-black tracking-tight">{item.title}</h4>
                    <p className="text-sm font-medium opacity-70 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">User Rewards Tiers</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">The more you trade, the more you earn. Climb the ranks.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                tier: "Node Starter",
                emoji: "🐣",
                reward: "1x $JARA",
                perks: ["Earn $JARA on every trade", "Access basic music streaming", "Community voting rights"],
                border: "border-gray-200",
                bg: "bg-gray-50",
              },
              {
                tier: "Node Operator",
                emoji: "🐕",
                reward: "3x $JARA",
                perks: ["3x token multiplier", "NFT airdrops", "Premium artist access", "Priority support"],
                border: "border-primary/30",
                bg: "bg-primary/5",
                featured: true,
              },
              {
                tier: "Node Master",
                emoji: "🦁",
                reward: "10x $JARA",
                perks: ["10x token multiplier", "Exclusive NFT collection", "Governance proposals", "Cashback on all trades", "VIP events access"],
                border: "border-amber-300",
                bg: "bg-amber-50",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`border-2 rounded-[2rem] p-8 md:p-10 space-y-6 relative overflow-hidden ${item.border} ${item.bg} ${item.featured ? "shadow-xl md:scale-105" : ""} hover:shadow-xl transition-all duration-300`}
              >
                {item.featured && (
                  <div className="absolute top-4 right-4 bg-primary text-[#0b0e14] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="text-5xl">{item.emoji}</div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">{item.tier}</h4>
                  <p className="text-primary font-black text-lg">{item.reward}</p>
                </div>
                <ul className="space-y-3">
                  {item.perks.map((perk, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                      <Zap size={14} className="text-primary shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Built by TRICODE PRO LTD</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Obey Financial Technologies is operated by TRICODE PRO LTD — a registered and CBN-licensed payment service provider building Africa's most trusted digital finance platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "AES-256 Encrypted" },
              { icon: Globe, label: "140+ Countries" },
              { icon: Zap, label: "Instant Settlement" },
              { icon: Users, label: "15M+ Users" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center space-y-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary">
                  <item.icon size={24} />
                </div>
                <p className="text-sm font-black uppercase tracking-wider text-[#0b0e14]">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="text-center space-y-8 pb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Ready to earn <span className="text-primary italic">$JARA</span>?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.mintjara.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-[#0b0e14] font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full hover:bg-black hover:text-white transition-all shadow-2xl shadow-primary/30"
            >
              Explore $JARA
            </a>
            <button
              onClick={onBack}
              className="bg-[#0b0e14] text-white font-black uppercase tracking-widest text-sm px-10 py-5 rounded-full hover:bg-primary hover:text-[#0b0e14] transition-all shadow-2xl"
            >
              Start Trading
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
