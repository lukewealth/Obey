import React from "react";
import LegalPage from "./LegalPage";

interface LegalContentProps {
  slug: string;
  onBack: () => void;
}

export default function LegalContent({ slug, onBack }: LegalContentProps) {
  const contentMap: Record<string, { title: string; date: string; content: React.ReactNode }> = {
    privacy: {
      title: "Privacy Policy",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Data Collection</h3>
            <p>We collect personal information that you provide to us, including name, email address, and financial identifiers necessary for blockchain settlements and institutional nodes sync.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Institutional Security</h3>
            <p>Under TRICODE PRO LTD governance, all data is encrypted using AES-256 standards. We do not sell your personal data to third-party liquidity providers.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">3. Node Synchronization</h3>
            <p>Your transaction data is synchronized across our private ledger nodes to ensure sub-zero latency and high-throughput financial integrity.</p>
          </section>
        </>
      )
    },
    terms: {
      title: "Terms of Service",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Acceptance</h3>
            <p>By accessing the OBEY console, you agree to be bound by these terms governed by the laws of the jurisdiction of TRICODE PRO LTD.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Liquidity Risks</h3>
            <p>Digital asset management involves inherent market risks. OBEY provides the infrastructure; however, market variations in BTC, ETH, and NGN are subject to global liquidity pool shifts.</p>
          </section>
        </>
      )
    },
    amlkyc: {
      title: "AML / KYC Policy",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Identity Verification</h3>
            <p>To prevent money laundering and terrorist financing, OBEY enforces strict KYC (Know Your Customer) protocols. Level 2 access requires verified government-issued identification.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Transaction Monitoring</h3>
            <p>All settlements above ₦5,000,000 are subject to manual audit by the Marketplace Escrow Admin Control Portal.</p>
          </section>
        </>
      )
    },
    userdata: {
      title: "User Data Agreement",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Data Sovereignty</h3>
            <p>You retain ownership of your financial data. OBEY acts as a secure custodian using multi-signature cold storage for all sensitive user parameters.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Global Sync</h3>
            <p>By using our services, you permit the synchronization of your verified status across our global gateway nodes to facilitate instant cross-border transfers.</p>
          </section>
        </>
      )
    },
    globalaccess: {
      title: "Global Access Policy",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Jurisdiction Compliance</h3>
            <p>OBEY infrastructure is accessible globally; however, certain liquidity modules are restricted in sanctioned jurisdictions according to TRICODE PRO LTD compliance nodes.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Node Reach</h3>
            <p>We maintain active nodes in over 140 countries. Performance and settlement speeds may vary based on local network mesh density.</p>
          </section>
        </>
      )
    },
    disclosures: {
      title: "Risk Disclosures",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Market Volatility</h3>
            <p>Trading and holding digital assets involve significant risk. Prices can fluctuate wildly, and assets may lose their value entirely. OBEY is not responsible for market-induced losses.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Institutional Custody</h3>
            <p>While we use bank-grade encryption and cold storage, no system is entirely immune to sophisticated cyber threats. TRICODE PRO LTD maintains a reserve pool to mitigate systemic risks.</p>
          </section>
        </>
      )
    },
    status: {
      title: "System Status Protocol",
      date: "June 13, 2026",
      content: (
        <>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">1. Node Uptime</h3>
            <p>We maintain a 99.99% uptime for our master nodes. Real-time status is broadcasted across the global gateway to ensure transparent settlement processing.</p>
          </section>
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-[#0b0e14]">2. Maintenance Windows</h3>
            <p>Scheduled ledger maintenance is performed during low-traffic cycles. Users are notified via the OBEY console 48 hours in advance of any state-change interruptions.</p>
          </section>
        </>
      )
    }
  };

  const item = contentMap[slug] || contentMap.privacy;

  return (
    <LegalPage title={item.title} lastUpdated={item.date} onBack={onBack}>
      {item.content}
    </LegalPage>
  );
}
