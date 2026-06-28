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
    }
  };

  const item = contentMap[slug] || contentMap.privacy;

  return (
    <LegalPage title={item.title} lastUpdated={item.date} onBack={onBack}>
      {item.content}
    </LegalPage>
  );
}
