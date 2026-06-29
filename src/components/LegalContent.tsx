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
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Financial Technologies ("Obey," "we," "us," or "our"), operated by TRICODE PRO LTD, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, and related services (collectively, the "Services").
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Please read this policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Information We Collect</h3>
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#0b0e14]">1.1 Personal Information</h4>
              <p>We collect information you provide directly, including:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
                <li>Full name, email address, and phone number</li>
                <li>Government-issued identification (for KYC verification)</li>
                <li>Bank account details and payment information</li>
                <li>Billing address and residential address</li>
                <li>Profile照片 and biometric data (if enabled for authentication)</li>
              </ul>

              <h4 className="text-base font-bold text-[#0b0e14] pt-2">1.2 Financial Information</h4>
              <p>We collect data related to your financial activities, including:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
                <li>Transaction history and balances</li>
                <li>Cryptocurrency wallet addresses and holdings</li>
                <li>Gift card purchase and redemption records</li>
                <li>Airtime and data purchase history</li>
                <li>Virtual card usage and spending patterns</li>
              </ul>

              <h4 className="text-base font-bold text-[#0b0e14] pt-2">1.3 Device and Usage Information</h4>
              <p>We automatically collect:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
                <li>Device identifiers (IP address, browser type, operating system)</li>
                <li>Log data (access times, pages viewed, referral URLs)</li>
                <li>Location data (with your consent)</li>
                <li>Cookies and similar tracking technologies (see Cookie Policy below)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. How We Use Your Information</h3>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Provide Services:</strong> Process transactions, maintain your account, and deliver the features you request</li>
              <li><strong>Verification:</strong> Comply with KYC/AML regulations and verify your identity</li>
              <li><strong>Security:</strong> Detect and prevent fraud, unauthorized access, and illegal activities</li>
              <li><strong>Communication:</strong> Send transaction confirmations, security alerts, and support messages</li>
              <li><strong>Improvement:</strong> Analyze usage patterns to enhance our Services and develop new features</li>
              <li><strong>Legal Compliance:</strong> Respond to legal requests and comply with applicable laws</li>
              <li><strong>Marketing:</strong> Send promotional offers and updates (with your consent, where required)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. How We Share Your Information</h3>
            <p>We do not sell your personal data. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our Services (payment processors, cloud hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize disclosure</li>
              <li><strong>Protection of Rights:</strong> To protect the safety, rights, or property of Obey, our users, or the public</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Data Security</h3>
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>AES-256 encryption for data at rest</li>
              <li>TLS 1.3 encryption for data in transit</li>
              <li>Multi-factor authentication (2FA) for account access</li>
              <li>Regular security audits and penetration testing</li>
              <li>Cold storage for cryptocurrency assets</li>
              <li>Biometric authentication options</li>
            </ul>
            <p className="text-gray-600">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Data Retention</h3>
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Provide our Services to you</li>
              <li>Comply with legal and regulatory obligations (typically 5-7 years for financial records)</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="text-gray-600">
              When data is no longer needed, we securely delete or anonymize it. You may request deletion of your account at any time, subject to legal retention requirements.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Your Rights and Choices</h3>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time</li>
              <li><strong>Restrict Processing:</strong> Request limitation of how we use your data</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, contact us at privacy@obey.finance. We will respond within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. International Data Transfers</h3>
            <p>
              Your data may be transferred to and processed in countries outside your residence, including Nigeria, the United States, and other jurisdictions. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission, to protect your data.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Children's Privacy</h3>
            <p>
              Our Services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, contact us immediately at privacy@obey.finance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">9. Cookie Policy</h3>
            <p>
              We use cookies and similar technologies to enhance your experience. Cookies are categorized as:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Essential Cookies:</strong> Required for core functionality (authentication, security)</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use our Services</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
            </ul>
            <p className="text-gray-600">
              You can manage cookie preferences through our cookie consent banner or your browser settings. Note that disabling essential cookies may prevent you from using certain features.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">10. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes via email or through our Services at least 30 days before changes take effect. Your continued use of our Services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">11. Contact Us</h3>
            <p>If you have questions or concerns about this Privacy Policy, contact us:</p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Obey Financial Technologies</p>
              <p className="text-gray-600">Operated by TRICODE PRO LTD</p>
              <p className="text-gray-600">Email: privacy@obey.finance</p>
              <p className="text-gray-600">Support: support@obey.finance</p>
              <p className="text-gray-600">Website: www.obey.finance</p>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              This Privacy Policy was last updated on June 28, 2026 and is effective immediately.
            </p>
          </section>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Welcome to Obey Financial Technologies ("Obey," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our mobile application, website, and related services (collectively, the "Services"), operated by TRICODE PRO LTD.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Eligibility</h3>
            <p>To use our Services, you must:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Not be prohibited from using our Services under applicable law</li>
              <li>Reside in a jurisdiction where our Services are available</li>
            </ul>
            <p className="text-gray-600">
              By creating an account, you represent and warrant that you meet these requirements.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Account Registration</h3>
            <p>When you create an account, you must:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your login credentials</li>
              <li>Promptly update your information if it changes</li>
              <li>Enable two-factor authentication (2FA) for enhanced security</li>
            </ul>
            <p className="text-gray-600">
              You are responsible for all activities that occur under your account. Notify us immediately at security@obey.finance if you suspect unauthorized access.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Verification and Compliance</h3>
            <p>
              We are required by law to verify your identity. You must complete Know Your Customer (KYC) verification to access certain features. This includes providing:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Government-issued identification (passport, driver's license, or national ID)</li>
              <li>Proof of address (utility bill or bank statement)</li>
              <li>Selfie or biometric verification</li>
            </ul>
            <p className="text-gray-600">
              We may limit or suspend your account if verification fails or is incomplete.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Use our Services for illegal activities, including money laundering or terrorist financing</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the integrity of our Services</li>
              <li>Use automated systems (bots, scrapers) without our written consent</li>
              <li>Engage in market manipulation or fraudulent trading practices</li>
              <li>Transfer your account to another party without our approval</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
            </ul>
            <p className="text-gray-600">
              Violation of these terms may result in immediate account suspension or termination.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Fees and Charges</h3>
            <p>
              We may charge fees for certain Services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Transaction fees for cryptocurrency trades</li>
              <li>Withdrawal fees for bank transfers</li>
              <li>Virtual card issuance and maintenance fees</li>
              <li>Inactivity fees for dormant accounts (after 12 months)</li>
            </ul>
            <p className="text-gray-600">
              All fees are disclosed before you confirm a transaction. We reserve the right to modify fees with 30 days' notice.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Digital Assets and Cryptocurrency</h3>
            <p>
              Our Services allow you to buy, sell, and hold digital assets. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Cryptocurrency prices are highly volatile and can result in significant losses</li>
              <li>Digital assets are not insured by the FDIC or any government agency</li>
              <li>You are solely responsible for your investment decisions</li>
              <li>We do not provide investment, tax, or legal advice</li>
              <li>Transactions are irreversible once confirmed on the blockchain</li>
            </ul>
            <p className="text-gray-600">
              We use institutional-grade custody solutions, but you hold the risk of loss associated with digital assets.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OBEY AND ITS AFFILIATES, OFFICERS, AND EMPLOYEES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Losses resulting from market volatility or cryptocurrency price fluctuations</li>
              <li>Unauthorized access to your account due to your negligence</li>
              <li>Service interruptions, delays, or failures beyond our reasonable control</li>
            </ul>
            <p className="text-gray-600">
              Our total liability shall not exceed the amount of fees you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Indemnification</h3>
            <p>
              You agree to indemnify, defend, and hold harmless Obey, TRICODE PRO LTD, and their affiliates from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Your use of our Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">9. Termination</h3>
            <p>
              We may suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activities</li>
              <li>Extended inactivity (12+ months)</li>
              <li>Legal or regulatory requirements</li>
            </ul>
            <p className="text-gray-600">
              You may close your account at any time by contacting support@obey.finance. Upon termination, we will return your remaining balance (minus any outstanding fees) within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">10. Dispute Resolution</h3>
            <p>
              Any disputes arising from these Terms or our Services shall be resolved through:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Informal Resolution:</strong> Contact us at disputes@obey.finance to attempt resolution</li>
              <li><strong>Arbitration:</strong> Binding arbitration under the rules of the Nigerian Arbitration and Conciliation Act</li>
              <li><strong>Jurisdiction:</strong> Courts of Lagos State, Nigeria (if arbitration is not applicable)</li>
            </ul>
            <p className="text-gray-600">
              You agree to resolve disputes individually and waive any right to participate in class actions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">11. Governing Law</h3>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">12. Changes to These Terms</h3>
            <p>
              We may update these Terms periodically. We will notify you of material changes via email or through our Services at least 30 days before changes take effect. Your continued use of our Services after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">13. Contact Us</h3>
            <p>For questions about these Terms, contact us:</p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Obey Financial Technologies</p>
              <p className="text-gray-600">Operated by TRICODE PRO LTD</p>
              <p className="text-gray-600">Email: legal@obey.finance</p>
              <p className="text-gray-600">Support: support@obey.finance</p>
              <p className="text-gray-600">Website: www.obey.finance</p>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              These Terms of Service were last updated on June 28, 2026 and are effective immediately.
            </p>
          </section>
        </div>
      )
    },
    amlkyc: {
      title: "AML / KYC Policy",
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Financial Technologies is committed to preventing money laundering, terrorist financing, and other illegal activities. This Anti-Money Laundering (AML) and Know Your Customer (KYC) Policy outlines our compliance framework.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Customer Due Diligence (CDD)</h3>
            <p>We verify customer identity through a tiered approach:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Level 1 (Basic):</strong> Email and phone verification for limited features</li>
              <li><strong>Level 2 (Standard):</strong> Government-issued ID and proof of address for full access</li>
              <li><strong>Level 3 (Enhanced):</strong> Source of funds declaration and additional documentation for high-value transactions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Transaction Monitoring</h3>
            <p>
              We employ automated systems to monitor transactions for suspicious activity, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Unusual transaction patterns or amounts</li>
              <li>Transactions involving high-risk jurisdictions</li>
              <li>Rapid movement of funds across multiple accounts</li>
              <li>Structuring transactions to avoid reporting thresholds</li>
            </ul>
            <p className="text-gray-600">
              Transactions exceeding ₦5,000,000 (or equivalent) are subject to enhanced review and may require manual approval.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Reporting Obligations</h3>
            <p>
              We comply with all applicable reporting requirements, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Suspicious Transaction Reports (STRs) to the Nigerian Financial Intelligence Unit (NFIU)</li>
              <li>Cash Transaction Reports for transactions exceeding ₦2,500,000</li>
              <li>International fund transfer reporting</li>
              <li>Cooperation with law enforcement investigations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Sanctions Screening</h3>
            <p>
              We screen all customers and transactions against international sanctions lists, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>United Nations Security Council Consolidated List</li>
              <li>U.S. Office of Foreign Assets Control (OFAC) Specially Designated Nationals List</li>
              <li>European Union Consolidated Sanctions List</li>
              <li>UK HM Treasury Financial Sanctions List</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Record Keeping</h3>
            <p>
              We maintain records of customer identification, transaction history, and compliance activities for a minimum of 7 years, or longer if required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Training and Awareness</h3>
            <p>
              Our employees receive regular AML/CFT training to recognize and report suspicious activities. We maintain a dedicated compliance team to oversee policy implementation.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contact Compliance</h3>
            <p>
              For AML/KYC inquiries or to report suspicious activity, contact our compliance team:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Compliance Department</p>
              <p className="text-gray-600">Email: compliance@obey.finance</p>
              <p className="text-gray-600">Hotline: +234 (0) 800 OBEY AML</p>
            </div>
          </section>
        </div>
      )
    },
    userdata: {
      title: "User Data Agreement",
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              This User Data Agreement supplements our Privacy Policy and Terms of Service, outlining specific terms regarding your financial data and its management.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Data Ownership</h3>
            <p>
              You retain ownership of your personal and financial data. Obey acts as a custodian, processing your data solely to provide our Services. We do not claim ownership of your data beyond what is necessary to operate our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Data Processing</h3>
            <p>By using our Services, you consent to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Processing of your transaction data to execute trades and transfers</li>
              <li>Storage of your data on secure servers in multiple jurisdictions</li>
              <li>Analysis of usage patterns to improve our Services</li>
              <li>Sharing of data with third-party service providers (as outlined in our Privacy Policy)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Data Portability</h3>
            <p>
              You may request a copy of your data in a machine-readable format. We will provide this within 30 days of your request, free of charge.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Data Deletion</h3>
            <p>
              You may request deletion of your account and associated data. We will delete your personal data within 30 days, except for data we are legally required to retain (e.g., transaction records for 7 years).
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Data Security</h3>
            <p>
              We implement robust security measures to protect your data, including encryption, access controls, and regular security audits. However, you are responsible for maintaining the confidentiality of your login credentials.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. International Data Transfers</h3>
            <p>
              Your data may be transferred to countries outside your residence. We ensure appropriate safeguards are in place, including Standard Contractual Clauses.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contact Us</h3>
            <p>
              For data-related inquiries, contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Data Protection Officer</p>
              <p className="text-gray-600">Email: dpo@obey.finance</p>
            </div>
          </section>
        </div>
      )
    },
    disclosures: {
      title: "Risk Disclosures",
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Please read these risk disclosures carefully before using our Services. Digital asset trading and financial services involve significant risks.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Market Risk</h3>
            <p>
              Cryptocurrency and digital asset prices are highly volatile and can fluctuate dramatically in short periods. You may lose some or all of your investment. Past performance does not guarantee future results.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Liquidity Risk</h3>
            <p>
              Some digital assets may have limited liquidity, making it difficult to buy or sell at desired prices. Market conditions may prevent you from executing transactions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Regulatory Risk</h3>
            <p>
              Cryptocurrency regulations are evolving globally. Changes in laws or regulations may adversely affect the value of your assets or limit your ability to transact.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Technology Risk</h3>
            <p>
              Digital assets rely on blockchain technology, which is subject to bugs, hacks, and other technical failures. We cannot guarantee the security of blockchain networks.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Custodial Risk</h3>
            <p>
              While we use institutional-grade custody solutions, holding assets with a third party involves risk. We maintain insurance coverage, but it may not cover all losses.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Tax Implications</h3>
            <p>
              Cryptocurrency transactions may have tax consequences. You are responsible for understanding and complying with your tax obligations. We do not provide tax advice.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. No Investment Advice</h3>
            <p>
              Obey does not provide investment, tax, or legal advice. All trading decisions are made by you at your own risk. Consult a qualified professional before making investment decisions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Irreversibility</h3>
            <p>
              Cryptocurrency transactions are irreversible once confirmed on the blockchain. We cannot reverse or cancel transactions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">9. Acknowledgment</h3>
            <p>
              By using our Services, you acknowledge that you have read, understood, and accept these risk disclosures. You agree that Obey is not liable for any losses you incur.
            </p>
          </section>
        </div>
      )
    },
    status: {
      title: "System Status Protocol",
      date: "June 28, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              We are committed to maintaining high availability and transparency regarding our system status.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Uptime Commitment</h3>
            <p>
              We target 99.9% uptime for our core Services. Real-time status is available at status.obey.finance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Maintenance Windows</h3>
            <p>
              Scheduled maintenance is performed during low-traffic periods (typically 2:00 AM - 4:00 AM WAT). We notify users at least 48 hours in advance via email and in-app notifications.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Incident Response</h3>
            <p>
              In the event of service disruptions, we provide real-time updates at status.obey.finance and via our social media channels. Critical incidents are resolved within 4 hours.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Contact Support</h3>
            <p>
              For urgent issues, contact our 24/7 support team:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">24/7 Support</p>
              <p className="text-gray-600">Email: support@obey.finance</p>
              <p className="text-gray-600">In-App: Live Chat</p>
            </div>
          </section>
        </div>
      )
    },
    apple: {
      title: "Apple Compliance & App Store Guidelines",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Financial Technologies, operated by TRICODE PRO LTD, is fully compliant with Apple's App Store Review Guidelines and all applicable iOS development standards. This document outlines our compliance framework.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. App Store Review Guidelines Compliance</h3>
            <p>We adhere to all Apple App Store Review Guidelines, including:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Section 1 - Safety:</strong> No objectionable content, user-generated content is moderated, and all financial transactions are secure</li>
              <li><strong>Section 2 - Performance:</strong> App is stable, performant, and free of bugs. Optimized for all iOS devices</li>
              <li><strong>Section 3 - Business:</strong> Transparent pricing, no hidden fees, and clear subscription terms</li>
              <li><strong>Section 4 - Design:</strong> Follows Apple Human Interface Guidelines with native iOS design patterns</li>
              <li><strong>Section 5 - Legal:</strong> Compliant with all applicable laws and regulations in Nigeria and internationally</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Apple Pay Integration</h3>
            <p>
              Our Apple Pay integration follows Apple's strict security and privacy requirements:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>All Apple Pay transactions are processed through Apple's secure enclave</li>
              <li>We do not store, log, or retain any Apple Pay card data</li>
              <li>Tokenization is used for all payment processing</li>
              <li>PCI-DSS Level 1 compliance for all payment handling</li>
              <li>End-to-end encryption for all financial data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Privacy & Data Protection (App Tracking Transparency)</h3>
            <p>
              We fully comply with Apple's App Tracking Transparency (ATT) framework:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Clear ATT prompts before any tracking occurs</li>
              <li>Privacy nutrition labels accurately reflect data collection</li>
              <li>Users can opt out of all non-essential data collection</li>
              <li>No data is shared with third parties without explicit consent</li>
              <li>GDPR and NDPR (Nigeria Data Protection Regulation) compliant</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Security Standards</h3>
            <p>
              Our iOS app implements Apple's recommended security practices:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Keychain Services for secure credential storage</li>
              <li>Biometric authentication (Face ID / Touch ID) support</li>
              <li>App Transport Security (ATS) enforced for all network requests</li>
              <li>Code signing and certificate pinning</li>
              <li>Jailbreak detection and root detection</li>
              <li>Secure Enclave for cryptographic operations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Financial Services Compliance</h3>
            <p>
              As a financial services app, we meet Apple's additional requirements:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Registered with the Central Bank of Nigeria (CBN) as a payment service provider</li>
              <li>Valid financial services license displayed in app metadata</li>
              <li>Clear disclosure of all fees and charges</li>
              <li>Customer support available within the app</li>
              <li>Dispute resolution process clearly documented</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Accessibility</h3>
            <p>
              Our app is fully accessible following Apple's accessibility guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Full VoiceOver support for all UI elements</li>
              <li>Dynamic Type support for text scaling</li>
              <li>Color contrast ratios meeting WCAG 2.1 AA standards</li>
              <li>Switch Control and AssistiveTouch compatible</li>
              <li>Reduced Motion support for animations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contact Apple Compliance Team</h3>
            <p>
              For Apple-specific compliance inquiries:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Apple Compliance</p>
              <p className="text-gray-600">Email: apple-compliance@obey.finance</p>
              <p className="text-gray-600">App Store Connect Team ID: Available upon request</p>
              <p className="text-gray-600">Bundle ID: com.tricode.obey</p>
            </div>
          </section>
        </div>
      )
    },
    cbn: {
      title: "Nigeria CBN Payment Approval & Compliance",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Financial Technologies operates under the regulatory oversight of the Central Bank of Nigeria (CBN). This document details our licensing, compliance framework, and regulatory approvals for payment services in Nigeria.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. CBN Licensing & Registration</h3>
            <p>
              TRICODE PRO LTD, the parent company of Obey Financial Technologies, holds the following CBN approvals:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Payment Service Provider (PSP) License:</strong> Authorized to process domestic and international payments</li>
              <li><strong>Mobile Money Operator (MMO) License:</strong> Licensed to operate mobile money services</li>
              <li><strong>Super Agent Registration:</strong> Authorized to operate agent networks across Nigeria</li>
              <li><strong>Foreign Exchange (FX) License:</strong> Approved for cross-border currency transactions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Regulatory Compliance Framework</h3>
            <p>We comply with all CBN regulations including:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>CBN Consumer Protection Framework:</strong> Fair treatment of all customers</li>
              <li><strong>Risk-Based Cybersecurity Framework:</strong> Implementation of NIST cybersecurity standards</li>
              <li><strong>Regulatory Sandbox Guidelines:</strong> Innovation within regulatory boundaries</li>
              <li><strong>Open Banking Framework:</strong> Secure API-based financial data sharing</li>
              <li><strong>Digital Financial Services Guidelines:</strong> Standards for digital financial inclusion</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Transaction Limits & Reporting</h3>
            <p>In compliance with CBN regulations:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Tier 1 (Basic):</strong> Maximum balance of ₦300,000; daily transaction limit of 50,000</li>
              <li><strong>Tier 2 (Standard):</strong> Maximum balance of ₦2,000,000; daily transaction limit of ₦500,000</li>
              <li><strong>Tier 3 (Premium):</strong> Maximum balance of ₦5,000,000; daily transaction limit of ₦2,000,000</li>
              <li>All transactions above ₦5,000,000 require enhanced due diligence</li>
              <li>Cash transactions above ₦2,500,000 are reported to the NFIU</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Anti-Money Laundering (AML) Compliance</h3>
            <p>
              We maintain strict AML compliance as required by the CBN and the Economic and Financial Crimes Commission (EFCC):
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Customer Due Diligence (CDD) for all account holders</li>
              <li>Enhanced Due Diligence (EDD) for high-risk customers</li>
              <li>Real-time transaction monitoring for suspicious activity</li>
              <li>Suspicious Transaction Reports (STRs) filed with the NFIU</li>
              <li>Sanctions screening against UN, OFAC, and EU lists</li>
              <li>Annual AML compliance audits by independent firms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Consumer Protection</h3>
            <p>
              Following the CBN Consumer Protection Framework:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Transparent fee disclosure before every transaction</li>
              <li>Free dispute resolution within 21 business days</li>
              <li>Clear complaint escalation process</li>
              <li>Deposit protection through the Nigeria Deposit Insurance Corporation (NDIC)</li>
              <li>Financial literacy resources for all users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Data Localization & Sovereignty</h3>
            <p>
              In compliance with CBN data localization requirements:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>All Nigerian customer data is stored on servers within Nigeria</li>
              <li>Backup data centers located in Lagos and Abuja</li>
              <li>Cross-border data transfers require CBN approval</li>
              <li>Compliance with the Nigeria Data Protection Act (NDPA) 2023</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Regulatory Reporting</h3>
            <p>
              We submit regular reports to the CBN including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Monthly transaction volume and value reports</li>
              <li>Quarterly financial statements</li>
              <li>Annual compliance audit reports</li>
              <li>Real-time suspicious activity alerts</li>
              <li>Currency exchange rate reporting</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contact CBN Compliance</h3>
            <p>
              For regulatory inquiries:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - CBN Compliance</p>
              <p className="text-gray-600">Email: cbn-compliance@obey.finance</p>
              <p className="text-gray-600">CBN License No: Available upon regulatory request</p>
              <p className="text-gray-600">Registered Address: Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      )
    },
    opay: {
      title: "Opay Trading Payment Integration",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Financial Technologies integrates with Opay, Nigeria's leading mobile money and payment platform, to provide seamless trading payment experiences. This document outlines our Opay integration architecture and compliance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Opay Partnership Overview</h3>
            <p>
              TRICODE PRO LTD has established a strategic partnership with Opay to enable:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Direct bank account funding via Opay wallets</li>
              <li>Instant P2P transfers between Obey and Opay users</li>
              <li>Crypto-to-fiat settlement through Opay's payment rails</li>
              <li>Bill payments and airtime purchases via Opay integration</li>
              <li>Cross-border remittances through Opay's international corridors</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Technical Integration</h3>
            <p>
              Our Opay integration uses the following technical architecture:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>API Integration:</strong> RESTful API with OAuth 2.0 authentication</li>
              <li><strong>Webhook Notifications:</strong> Real-time transaction status updates</li>
              <li><strong>Settlement Engine:</strong> T+0 instant settlement for domestic transactions</li>
              <li><strong>Reconciliation:</strong> Automated daily reconciliation with Opay's ledger</li>
              <li><strong>Failover:</strong> Redundant payment routing with automatic failover</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Trading Payment Flow</h3>
            <p>
              The Opay trading payment flow works as follows:
            </p>
            <ol className="list-decimal pl-6 space-y-1.5 text-gray-600">
              <li>User initiates a crypto trade on the Obey platform</li>
              <li>Obey calculates the NGN equivalent at the current market rate</li>
              <li>User confirms the trade and selects Opay as the payment method</li>
              <li>Obey sends a payment request to Opay's API</li>
              <li>User approves the transaction in their Opay app (biometric/PIN)</li>
              <li>Opay processes the payment and sends confirmation to Obey</li>
              <li>Obey credits the user's crypto wallet instantly</li>
              <li>Settlement is completed within 3 seconds</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Security & Compliance</h3>
            <p>
              Our Opay integration maintains the highest security standards:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>End-to-end encryption for all payment data</li>
              <li>PCI-DSS Level 1 compliance for card data</li>
              <li>Two-factor authentication for all transactions above ₦50,000</li>
              <li>Real-time fraud detection and prevention</li>
              <li>Compliance with CBN's Payment System Vision 2025</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Transaction Limits</h3>
            <p>Opay integration transaction limits:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Single Transaction:</strong> Maximum ₦5,000,000</li>
              <li><strong>Daily Limit:</strong> Maximum ₦10,000,000 per user</li>
              <li><strong>Monthly Limit:</strong> Maximum ₦50,000,000 per user</li>
              <li>Higher limits available for institutional accounts with enhanced KYC</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Fees & Charges</h3>
            <p>
              Transparent fee structure for Opay transactions:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Funding via Opay:</strong> 0% fee (free)</li>
              <li><strong>Withdrawal to Opay:</strong> ₦50 flat fee</li>
              <li><strong>Crypto Purchase:</strong> 0.5% trading fee</li>
              <li><strong>Crypto Sale:</strong> 0.5% trading fee</li>
              <li><strong>Cross-border via Opay:</strong> 1% + FX spread</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Support & Dispute Resolution</h3>
            <p>
              For Opay-related transaction issues:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>In-app live chat support (24/7)</li>
              <li>Email: opay-support@obey.finance</li>
              <li>Dispute resolution within 48 hours</li>
              <li>Escalation to Opay's merchant support team</li>
              <li>CBN consumer protection complaint channel</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contact Opay Integration Team</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Opay Integration</p>
              <p className="text-gray-600">Email: opay-partnerships@obey.finance</p>
              <p className="text-gray-600">Technical: api-support@obey.finance</p>
              <p className="text-gray-600">Merchant ID: Available upon request</p>
            </div>
          </section>
        </div>
      )
    },
    sdk: {
      title: "Developer SDK Documentation",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              The Obey Finance SDK provides developers with a comprehensive toolkit to integrate our financial infrastructure into their applications. Built by TRICODE PRO LTD, the SDK supports payments, crypto trading, wallet management, and more.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Getting Started</h3>
            <p>Install the Obey SDK via npm:</p>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`npm install @obey-finance/sdk

# Or with yarn
yarn add @obey-finance/sdk

# Or with pnpm
pnpm add @obey-finance/sdk`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Initialization</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`import { ObeySDK } from '@obey-finance/sdk';

const obey = new ObeySDK({
  apiKey: 'your_api_key_here',
  environment: 'production', // or 'sandbox'
  webhookUrl: 'https://your-app.com/webhooks/obey',
});

// Initialize the SDK
await obey.initialize();`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Payment Processing</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`// Create a payment
const payment = await obey.payments.create({
  amount: 50000,
  currency: 'NGN',
  description: 'Crypto purchase',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe',
  },
  paymentMethod: 'opay', // or 'card', 'bank_transfer', 'wallet'
  metadata: {
    orderId: 'order_123',
  },
});

// Check payment status
const status = await obey.payments.getStatus(payment.id);
console.log(status); // { status: 'completed', ... }`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Crypto Trading</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`// Get market prices
const prices = await obey.crypto.getPrices(['BTC', 'ETH', 'SOL', 'SUI']);
console.log(prices); // { BTC: 96000000, ETH: 5200000, ... }

// Execute a trade
const trade = await obey.crypto.trade({
  pair: 'BTC/NGN',
  side: 'buy',
  amount: 0.001,
  orderType: 'market',
});

// Get trade history
const history = await obey.crypto.getHistory({
  limit: 50,
  offset: 0,
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Wallet Management</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`// Get wallet balance
const balance = await obey.wallet.getBalance();
console.log(balance); // { NGN: 2580340.52, BTC: 0.05, ... }

// Fund wallet via Opay
const funding = await obey.wallet.fund({
  amount: 100000,
  method: 'opay',
});

// Withdraw to bank account
const withdrawal = await obey.wallet.withdraw({
  amount: 50000,
  bankCode: '058',
  accountNumber: '1234567890',
  accountName: 'John Doe',
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Webhook Integration</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`import { verifyWebhookSignature } from '@obey-finance/sdk';

app.post('/webhooks/obey', (req, res) => {
  const signature = req.headers['x-obey-signature'];
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.OBEY_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  
  switch (event.type) {
    case 'payment.completed':
      // Handle completed payment
      break;
    case 'trade.executed':
      // Handle executed trade
      break;
    case 'wallet.funded':
      // Handle wallet funding
      break;
  }

  res.status(200).send('OK');
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Sui Blockchain Integration</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`// Interact with Sui parallel node system
const suiNode = await obey.sui.connect({
  network: 'mainnet', // or 'testnet'
  nodeUrl: 'https://fullnode.mainnet.sui.io',
});

// Query node status
const nodeStatus = await suiNode.getNodeStatus();

// Execute parallel transaction
const txResult = await suiNode.executeParallel({
  transactions: [
    { type: 'transfer', amount: 100, to: '0x...' },
    { type: 'swap', from: 'SUI', to: 'USDC', amount: 50 },
  ],
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Error Handling</h3>
            <div className="bg-[#0b0e14] rounded-2xl p-6 text-white font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{`import { ObeyError, ErrorCode } from '@obey-finance/sdk';

try {
  const payment = await obey.payments.create({ ... });
} catch (error) {
  if (error instanceof ObeyError) {
    switch (error.code) {
      case ErrorCode.INSUFFICIENT_FUNDS:
        console.log('Not enough balance');
        break;
      case ErrorCode.INVALID_AMOUNT:
        console.log('Invalid transaction amount');
        break;
      case ErrorCode.RATE_LIMITED:
        console.log('Too many requests');
        break;
      default:
        console.log(error.message);
    }
  }
}`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">9. Rate Limits & Best Practices</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>API Rate Limit:</strong> 100 requests/second per API key</li>
              <li><strong>Payment Creation:</strong> 50 requests/second</li>
              <li><strong>Trade Execution:</strong> 20 requests/second</li>
              <li>Implement exponential backoff for retries</li>
              <li>Cache market data for 30 seconds minimum</li>
              <li>Use webhooks instead of polling for status updates</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">10. SDK Support & Resources</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Developer Resources</p>
              <p className="text-gray-600">Documentation: docs.obey.finance/sdk</p>
              <p className="text-gray-600">GitHub: github.com/tricode-pro/obey-sdk</p>
              <p className="text-gray-600">Support: sdk-support@obey.finance</p>
              <p className="text-gray-600">Discord: discord.gg/obey-dev</p>
            </div>
          </section>
        </div>
      )
    },
    sui: {
      title: "Sui Network Parallel Node System",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Obey Finance operates a Parallel Node System on the Sui Network, providing institutional-grade decentralized financial infrastructure. Built by TRICODE PRO LTD, this system enables high-throughput transaction processing with global standards compliance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Parallel Node Architecture</h3>
            <p>
              Our Sui Network implementation uses a parallel node architecture for maximum throughput:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Independent Processing:</strong> Each node processes transactions independently without blocking</li>
              <li><strong>Horizontal Scaling:</strong> Add nodes dynamically to increase network capacity</li>
              <li><strong>Consensus Mechanism:</strong> Narwhal and Bullshark consensus for fast finality</li>
              <li><strong>Object-Centric Model:</strong> Leveraging Sui's object model for parallel execution</li>
              <li><strong>Sub-Second Finality:</strong> Transactions confirmed in under 500ms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Node Types & Roles</h3>
            <p>The network consists of specialized node types:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Validator Nodes:</strong> Process transactions and maintain consensus (minimum 10 SUI stake)</li>
              <li><strong>Full Nodes:</strong> Store complete blockchain state and serve queries</li>
              <li><strong>Archive Nodes:</strong> Long-term storage of historical transaction data</li>
              <li><strong>Bridge Nodes:</strong> Cross-chain interoperability with other networks</li>
              <li><strong>Oracle Nodes:</strong> Provide price feeds and external data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Smart Contract Features</h3>
            <p>
              Our Move smart contracts on Sui provide:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Escrow Vaults:</strong> Institutional-grade escrow with multi-signature release</li>
              <li><strong>Cross-Border Routes:</strong> CBN-approved payment corridors</li>
              <li><strong>Apple Pay Settlement:</strong> Native Apple Pay transaction receipts on-chain</li>
              <li><strong>Opay Integration:</strong> Opay payment settlement records</li>
              <li><strong>Reward Distribution:</strong> Automated epoch-based node rewards</li>
              <li><strong>Governance:</strong> Decentralized protocol governance with voting</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Network Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">150+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Active Nodes</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">50K+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">TPS Capacity</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">&lt;500ms</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Finality</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">99.99%</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Uptime</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Staking & Rewards</h3>
            <p>
              Node operators earn rewards for participating in the network:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Minimum Stake:</strong> 10 SUI per validator node</li>
              <li><strong>Reward Rate:</strong> 8-12% APY based on uptime and performance</li>
              <li><strong>Epoch Duration:</strong> 24 hours</li>
              <li><strong>Slashing:</strong> 10% stake slashed for downtime or malicious behavior</li>
              <li><strong>Auto-Compounding:</strong> Rewards automatically restaked</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Cross-Chain Interoperability</h3>
            <p>
              Our bridge nodes enable seamless cross-chain operations:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Sui ↔ Ethereum bridge via Wormhole</li>
              <li>Sui ↔ Solana bridge for high-speed transfers</li>
              <li>Sui ↔ Bitcoin via wrapped assets</li>
              <li>Fiat on/off ramps through Nigerian banking partners</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Security Audits</h3>
            <p>
              All smart contracts are audited by leading security firms:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Halborn Security - Full contract audit</li>
              <li>Trail of Bits - Formal verification</li>
              <li>OpenZeppelin - Security review</li>
              <li>Continuous monitoring with Forta Network</li>
              <li>Bug bounty program up to $500,000</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contract Address & Resources</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Sui Network Contract</p>
              <p className="text-gray-600 font-mono text-sm">Package: obey_finance::parallel_node</p>
              <p className="text-gray-600">Network: Sui Mainnet</p>
              <p className="text-gray-600">Explorer: suiscan.xyz/mainnet/object/obey-finance</p>
              <p className="text-gray-600">GitHub: github.com/tricode-pro/obey-sui-contracts</p>
            </div>
          </section>
        </div>
      )
    },
    nodes: {
      title: "Global Node Infrastructure",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              TRICODE PRO LTD operates a global node infrastructure powering the Obey Finance platform. Our distributed network ensures high availability, low latency, and regulatory compliance across all operating regions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Node Network Overview</h3>
            <p>
              Our infrastructure spans multiple continents with strategically located nodes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-lg font-black text-[#0b0e14]">Africa</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>Lagos, Nigeria (Primary)</li>
                  <li>Abuja, Nigeria</li>
                  <li>Nairobi, Kenya</li>
                  <li>Cape Town, South Africa</li>
                  <li>Accra, Ghana</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-lg font-black text-[#0b0e14]">Europe</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>London, UK</li>
                  <li>Frankfurt, Germany</li>
                  <li>Amsterdam, Netherlands</li>
                  <li>Dublin, Ireland</li>
                  <li>Zurich, Switzerland</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-lg font-black text-[#0b0e14]">Americas & Asia</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>New York, USA</li>
                  <li>Singapore</li>
                  <li>Tokyo, Japan</li>
                  <li>Sydney, Australia</li>
                  <li>Dubai, UAE</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Infrastructure Specifications</h3>
            <p>Each node meets enterprise-grade specifications:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Compute:</strong> 64-core AMD EPYC / Intel Xeon processors</li>
              <li><strong>Memory:</strong> 256GB ECC RAM minimum</li>
              <li><strong>Storage:</strong> 10TB NVMe SSD with RAID 10</li>
              <li><strong>Network:</strong> 10Gbps dedicated bandwidth</li>
              <li><strong>Power:</strong> Triple-redundant power supplies with UPS</li>
              <li><strong>Cooling:</strong> Liquid cooling with N+1 redundancy</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. High Availability Architecture</h3>
            <p>
              Our infrastructure is designed for maximum uptime:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Active-Active Clustering:</strong> All nodes operate simultaneously</li>
              <li><strong>Automatic Failover:</strong> Sub-second failover on node failure</li>
              <li><strong>Load Balancing:</strong> Global load balancing with health checks</li>
              <li><strong>DDoS Protection:</strong> Enterprise-grade DDoS mitigation</li>
              <li><strong>Geo-Redundancy:</strong> Data replicated across 3+ regions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Security & Compliance</h3>
            <p>
              All nodes comply with international security standards:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>ISO 27001 certified data centers</li>
              <li>SOC 2 Type II compliance</li>
              <li>PCI-DSS Level 1 for payment processing nodes</li>
              <li>GDPR and NDPR compliant data handling</li>
              <li>24/7 physical security with biometric access</li>
              <li>Regular penetration testing and vulnerability assessments</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Monitoring & Observability</h3>
            <p>
              Real-time monitoring across all nodes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Prometheus + Grafana for metrics collection</li>
              <li>ELK Stack for log aggregation</li>
              <li>Jaeger for distributed tracing</li>
              <li>PagerDuty for incident management</li>
              <li>Custom dashboards for business metrics</li>
              <li>SLA monitoring with automated alerts</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">99.99%</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Uptime SLA</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">&lt;50ms</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Avg Latency</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">200+</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Global Nodes</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <p className="text-3xl font-black text-[#0b0e14]">15</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Countries</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Become a Node Operator</h3>
            <p>
              Join our decentralized node network:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Minimum requirement: 10 SUI stake</li>
              <li>Hardware requirements published on our developer portal</li>
              <li>Earn 8-12% APY in node rewards</li>
              <li>Contribute to network decentralization</li>
              <li>Apply at: nodes.obey.finance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contact Infrastructure Team</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Infrastructure</p>
              <p className="text-gray-600">Email: infrastructure@obey.finance</p>
              <p className="text-gray-600">Node Operations: nodes@obey.finance</p>
              <p className="text-gray-600">Status Page: status.obey.finance</p>
              <p className="text-gray-600">Incident Reports: incidents.obey.finance</p>
            </div>
          </section>
        </div>
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
