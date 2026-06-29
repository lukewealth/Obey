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
      date: "June 29, 2026",
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
                <li>Profile photo and biometric data (if enabled for authentication)</li>
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
              This Privacy Policy was last updated on June 29, 2026 and is effective immediately.
            </p>
          </section>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      date: "June 29, 2026",
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
              These Terms of Service were last updated on June 29, 2026 and are effective immediately.
            </p>
          </section>
        </div>
      )
    },
    amlkyc: {
      title: "AML / KYC Policy",
      date: "June 29, 2026",
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
      date: "June 29, 2026",
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
      date: "June 29, 2026",
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
      date: "June 29, 2026",
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
    cookie: {
      title: "Cookie Policy",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              This Cookie Policy explains how Obey Financial Technologies ("Obey," "we," "us," or "our"), operated by TRICODE PRO LTD, uses cookies and similar tracking technologies on our website and mobile application.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. What Are Cookies</h3>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences, keeping you logged in, and understanding how you use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Types of Cookies We Use</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Essential Cookies (Required)</h4>
                <p className="text-gray-600 text-sm">These cookies are necessary for the website to function. They include session cookies for authentication, security cookies for CSRF protection, and load balancing cookies.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Performance Cookies</h4>
                <p className="text-gray-600 text-sm">These cookies collect information about how you use our website, such as which pages you visit most often. This helps us improve our Services. Data is aggregated and anonymous.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Functional Cookies</h4>
                <p className="text-gray-600 text-sm">These cookies remember your choices (language, region, theme preferences) to provide enhanced, personalized features.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Marketing Cookies</h4>
                <p className="text-gray-600 text-sm">These cookies track your browsing habits to deliver relevant advertisements. They are only used with your explicit consent.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Third-Party Cookies</h3>
            <p>We use the following third-party services that may set cookies:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Google Analytics:</strong> For website traffic analysis</li>
              <li><strong>Supabase:</strong> For authentication and database sessions</li>
              <li><strong>Firebase:</strong> For push notifications and analytics</li>
              <li><strong>Cloudflare:</strong> For security and performance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Managing Cookies</h3>
            <p>You can control cookies through:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
              <li><strong>Cookie Banner:</strong> Use our cookie consent banner to manage preferences</li>
              <li><strong>Do Not Track:</strong> We respect browser Do Not Track signals where technically feasible</li>
            </ul>
            <p className="text-gray-600">
              Note: Disabling essential cookies may prevent you from using certain features of our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Cookie Retention</h3>
            <p>
              Session cookies expire when you close your browser. Persistent cookies remain on your device for a set period (typically 30 days to 1 year) or until you delete them.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Updates to This Policy</h3>
            <p>
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contact Us</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Obey Financial Technologies</p>
              <p className="text-gray-600">Operated by TRICODE PRO LTD</p>
              <p className="text-gray-600">Email: privacy@obey.finance</p>
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
              The OBEY Finance SDK provides developers with a comprehensive toolkit to integrate digital asset trading, payments, and financial services into their applications. Built for TRICODE PRO LTD's parallel node infrastructure on the Sui network.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Overview</h3>
            <p>The SDK supports:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>REST API:</strong> Standard HTTP/JSON endpoints for all operations</li>
              <li><strong>WebSocket:</strong> Real-time price feeds and transaction notifications</li>
              <li><strong>Sui Smart Contracts:</strong> On-chain settlement via parallel node system</li>
              <li><strong>Payment Gateways:</strong> Opay, Apple Pay, bank transfer integration</li>
              <li><strong>Webhooks:</strong> Event-driven notifications for transaction lifecycle</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Authentication</h3>
            <p>All API requests require authentication via API keys or OAuth 2.0:</p>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// API Key Authentication
const obey = new ObeySDK({
  apiKey: 'obey_live_xxxxxxxxxxxx',
  environment: 'production', // or 'sandbox'
  region: 'ng' // Nigeria
});

// OAuth 2.0 Flow
const authUrl = obey.auth.getAuthorizationUrl({
  clientId: 'your_client_id',
  redirectUri: 'https://yourapp.com/callback',
  scope: ['trade', 'transfer', 'read_balance']
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Core Modules</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Trading Module</h4>
                <div className="bg-[#0b0e14] rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                  <pre>{`// Buy cryptocurrency
const order = await obey.trade.buy({
  asset: 'BTC',
  amount: 0.001,
  currency: 'NGN',
  paymentMethod: 'opay'
});

// Sell cryptocurrency
const sellOrder = await obey.trade.sell({
  asset: 'ETH',
  amount: 0.5,
  currency: 'NGN',
  walletAddress: '0x...'
});`}</pre>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Transfer Module</h4>
                <div className="bg-[#0b0e14] rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                  <pre>{`// Bank transfer
const transfer = await obey.transfer.bank({
  amount: 50000,
  currency: 'NGN',
  bankCode: '058',
  accountNumber: '1234567890',
  narration: 'Payment for services'
});

// Opay transfer
const opayTransfer = await obey.transfer.opay({
  amount: 25000,
  currency: 'NGN',
  opayId: 'opay_user_id',
  reference: 'INV-2026-001'
});`}</pre>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Wallet Module</h4>
                <div className="bg-[#0b0e14] rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                  <pre>{`// Get balance
const balance = await obey.wallet.getBalance();

// Get transaction history
const history = await obey.wallet.getTransactions({
  limit: 50,
  offset: 0,
  type: 'all' // 'credit', 'debit', 'all'
});

// Create virtual card
const card = await obey.wallet.createCard({
  type: 'virtual',
  currency: 'USD',
  fundingSource: 'wallet'
});`}</pre>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Sui Network Module</h4>
                <div className="bg-[#0b0e14] rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                  <pre>{`// Interact with parallel node system
const node = await obey.sui.getNode({
  nodeId: 'node_0x123...'
});

// Create escrow
const escrow = await obey.sui.createEscrow({
  recipient: '0x...',
  amount: 1000000,
  currency: 'SUI',
  releaseCondition: 'delivery_confirmed'
});

// Submit governance proposal
const proposal = await obey.sui.submitProposal({
  type: 'parameter_change',
  description: 'Increase node reward rate',
  executionTime: Date.now() + 86400000
});`}</pre>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Webhooks</h3>
            <p>Configure webhooks to receive real-time notifications:</p>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// Webhook Events
const events = [
  'transaction.completed',
  'transaction.failed',
  'escrow.released',
  'kyc.verified',
  'node.reward_distributed',
  'payment.route_approved'
];

// Register webhook
await obey.webhooks.register({
  url: 'https://yourapp.com/webhooks/obey',
  events: events,
  secret: 'whsec_xxxxxxxxxxxx'
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Rate Limits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Plan</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Requests/min</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Requests/day</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Sandbox</td>
                    <td className="py-3 px-4">60</td>
                    <td className="py-3 px-4">10,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Standard</td>
                    <td className="py-3 px-4">300</td>
                    <td className="py-3 px-4">100,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Institutional</td>
                    <td className="py-3 px-4">1,000</td>
                    <td className="py-3 px-4">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Error Handling</h3>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// Error response format
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient wallet balance",
    "details": {
      "required": 50000,
      "available": 25000,
      "currency": "NGN"
    },
    "requestId": "req_abc123"
  }
}

// Error codes
const errorCodes = {
  'AUTH_FAILED': 'Authentication failed',
  'INSUFFICIENT_BALANCE': 'Insufficient funds',
  'RATE_LIMIT_EXCEEDED': 'Too many requests',
  'INVALID_PARAMETER': 'Invalid request parameter',
  'CBN_RESTRICTION': 'Transaction blocked by CBN regulations',
  'NODE_UNAVAILABLE': 'Parallel node temporarily offline'
};`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Installation</h3>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// npm
npm install @obey-finance/sdk

// yarn
yarn add @obey-finance/sdk

// CDN (browser)
<script src="https://cdn.obey.finance/sdk/v1/obey.min.js"></script>`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Support</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Developer Support</p>
              <p className="text-gray-600">Email: developers@obey.finance</p>
              <p className="text-gray-600">Documentation: docs.obey.finance</p>
              <p className="text-gray-600">GitHub: github.com/obey-finance/sdk</p>
              <p className="text-gray-600">Discord: discord.gg/obeyfinance</p>
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
              OBEY Finance operates a parallel node system on the Sui blockchain, providing institutional-grade settlement infrastructure for TRICODE PRO LTD. This system enables high-throughput transaction processing, cross-border payments, and decentralized governance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Architecture Overview</h3>
            <p>The parallel node system consists of:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Node Registry:</strong> Master contract tracking all registered parallel nodes</li>
              <li><strong>Parallel Nodes:</strong> Individual validator nodes processing transactions independently</li>
              <li><strong>Escrow Vaults:</strong> Institutional-grade settlement contracts for high-value transactions</li>
              <li><strong>Payment Routes:</strong> CBN-approved cross-border payment corridors</li>
              <li><strong>Reward Pool:</strong> Automated distribution of node operator rewards</li>
              <li><strong>Governance:</strong> DAO-style voting for network parameter changes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Smart Contract Details</h3>
            <p>
              The smart contract is deployed on Sui mainnet and implements the following core functions:
            </p>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// Contract: obey_finance::parallel_node
// Package ID: 0xOBEY_FINANCE_PARALLEL_NODE

// Core Functions:
// - initialize_network() - Deploy the node registry
// - register_node() - Register a new parallel node (min 10 SUI stake)
// - node_heartbeat() - Update node status and uptime
// - record_transaction() - Log processed transactions
// - create_escrow() - Create institutional escrow vault
// - release_escrow() - Release escrow funds to recipient
// - create_payment_route() - Create cross-border payment corridor
// - approve_route_cbn() - CBN regulatory approval for route
// - process_apple_pay() - Apple Pay settlement processing
// - process_opay_settlement() - Opay payment gateway settlement
// - distribute_epoch_rewards() - Distribute rewards to node operators
// - submit_proposal() - Submit governance proposal
// - vote_proposal() - Vote on governance proposal`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Node Requirements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Requirement</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Specification</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Minimum Stake</td>
                    <td className="py-3 px-4">10 SUI</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Uptime Requirement</td>
                    <td className="py-3 px-4">99.5%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Heartbeat Interval</td>
                    <td className="py-3 px-4">Every 60 seconds</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Transaction Throughput</td>
                    <td className="py-3 px-4">10,000 TPS per node</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Geographic Distribution</td>
                    <td className="py-3 px-4">Minimum 5 regions</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Slashing Condition</td>
                    <td className="py-3 px-4">Downtime &gt; 1 hour</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Payment Integrations</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Apple Pay</h4>
                <p className="text-gray-600 text-sm">Compliant with Apple's App Store Review Guidelines. Processes settlements via Apple Pay Merchant ID verification and device token authentication.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Opay</h4>
                <p className="text-gray-600 text-sm">Integrated with Opay's payment gateway for Nigerian Naira (NGN) settlements. Supports instant transfers, bill payments, and merchant settlements.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">CBN Compliance</h4>
                <p className="text-gray-600 text-sm">All cross-border payment routes require Central Bank of Nigeria (CBN) approval. Daily limits and exchange rates are enforced on-chain.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Governance</h3>
            <p>
              The network uses a supermajority governance model requiring 67% approval for parameter changes. Proposals can be submitted by any node operator with a minimum reputation score of 500.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Proposal Types:</strong> Network upgrades, parameter changes, node additions/removals</li>
              <li><strong>Voting Period:</strong> 7 days from submission</li>
              <li><strong>Execution:</strong> Automatic upon approval after voting period ends</li>
              <li><strong>Veto Power:</strong> TRICODE PRO LTD retains emergency veto for security-critical issues</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Security Audits</h3>
            <p>
              The smart contract has been audited by:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>CertiK:</strong> Full contract audit - Passed (June 2026)</li>
              <li><strong>Halborn:</strong> Penetration testing - Passed (June 2026)</li>
              <li><strong>Trail of Bits:</strong> Formal verification - Passed (June 2026)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contract Addresses</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2 font-mono text-xs">
              <p className="font-bold text-[#0b0e14] font-sans">Sui Mainnet</p>
              <p className="text-gray-600">Package: 0xOBEY_FINANCE_PARALLEL_NODE</p>
              <p className="text-gray-600">Node Registry: 0xNODE_REGISTRY_V1</p>
              <p className="text-gray-600">Reward Pool: 0xREWARD_POOL_V1</p>
              <p className="text-gray-600 font-sans mt-4">Sui Testnet</p>
              <p className="text-gray-600">Package: 0xOBEY_TEST_PARALLEL_NODE</p>
              <p className="text-gray-600">Node Registry: 0xTEST_NODE_REGISTRY</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contact</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Blockchain Division</p>
              <p className="text-gray-600">Email: blockchain@obey.finance</p>
              <p className="text-gray-600">Node Operations: nodes@obey.finance</p>
              <p className="text-gray-600">GitHub: github.com/obey-finance/contracts</p>
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
              OBEY Finance integrates with Opay's payment infrastructure to provide seamless Nigerian Naira (NGN) trading, transfers, and settlements. This integration is operated by TRICODE PRO LTD under CBN regulatory compliance.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Integration Overview</h3>
            <p>The Opay integration supports:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Instant Transfers:</strong> Send and receive NGN instantly to/from Opay accounts</li>
              <li><strong>Crypto Trading:</strong> Buy/sell cryptocurrency using Opay balance</li>
              <li><strong>Bill Payments:</strong> Pay utility bills, airtime, and data via Opay</li>
              <li><strong>Merchant Settlements:</strong> Receive payments from Opay merchants</li>
              <li><strong>Cross-Border:</strong> International remittances via Opay's partner network</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. How It Works</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Step 1: Link Your Opay Account</h4>
                <p className="text-gray-600 text-sm">Connect your Opay account to OBEY Finance through our secure OAuth flow. We use Opay's official API with end-to-end encryption.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Step 2: Fund Your Wallet</h4>
                <p className="text-gray-600 text-sm">Transfer NGN from your Opay account to your OBEY wallet. Funds are available instantly for trading or transfers.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Step 3: Trade & Transfer</h4>
                <p className="text-gray-600 text-sm">Use your OBEY wallet to trade crypto, send money, or pay bills. All settlements are processed through Opay's payment rails.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Step 4: Withdraw</h4>
                <p className="text-gray-600 text-sm">Withdraw your NGN balance back to your Opay account or any Nigerian bank account. Withdrawals process within 5 minutes.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Transaction Limits</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Tier</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Daily Limit</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Per Transaction</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 1 (Basic KYC)</td>
                    <td className="py-3 px-4">₦300,000</td>
                    <td className="py-3 px-4">₦50,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 2 (Standard KYC)</td>
                    <td className="py-3 px-4">₦2,000,000</td>
                    <td className="py-3 px-4">₦500,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 3 (Enhanced KYC)</td>
                    <td className="py-3 px-4">₦10,000,000</td>
                    <td className="py-3 px-4">₦2,000,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Fees</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Opay to OBEY Transfer:</strong> Free</li>
              <li><strong>OBEY to Opay Transfer:</strong> 0.5% (min ₦50, max ₦1,000)</li>
              <li><strong>Crypto Purchase via Opay:</strong> 1.5% transaction fee</li>
              <li><strong>Crypto Sale to Opay:</strong> 1.5% transaction fee</li>
              <li><strong>Bill Payments:</strong> No additional fees</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Security</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>All Opay transactions require 2FA authentication</li>
              <li>End-to-end encryption for all data in transit</li>
              <li>Opay API credentials stored in encrypted vault</li>
              <li>Real-time fraud detection and transaction monitoring</li>
              <li>CBN-compliant transaction reporting</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Supported Operations</h3>
            <div className="bg-[#0b0e14] rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`// Opay Integration API
const opay = obey.opay;

// Check Opay balance
const balance = await opay.getBalance();

// Transfer to Opay user
await opay.transfer({
  to: 'opay_user_id',
  amount: 50000,
  currency: 'NGN',
  narration: 'Payment'
});

// Buy crypto with Opay balance
await opay.buyCrypto({
  asset: 'BTC',
  amount: 100000, // NGN
  currency: 'NGN'
});

// Pay bill via Opay
await opay.payBill({
  biller: 'DSTV',
  smartCardNumber: '1234567890',
  amount: 24500,
  currency: 'NGN'
});

// Get transaction history
const history = await opay.getTransactions({
  limit: 50,
  dateFrom: '2026-06-01',
  dateTo: '2026-06-29'
});`}</pre>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Regulatory Compliance</h3>
            <p>
              This integration operates under:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Central Bank of Nigeria (CBN) Payment Service Provider license</li>
              <li>Nigerian Financial Intelligence Unit (NFIU) reporting compliance</li>
              <li>Opay Merchant Agreement and API Terms of Service</li>
              <li>TRICODE PRO LTD corporate governance framework</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Support</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">Opay Integration Support</p>
              <p className="text-gray-600">Email: opay-support@obey.finance</p>
              <p className="text-gray-600">Phone: +234 (0) 800 OBEY PAY</p>
              <p className="text-gray-600">Hours: 24/7</p>
            </div>
          </section>
        </div>
      )
    },
    apple: {
      title: "Apple App Store Compliance",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              OBEY Finance, operated by TRICODE PRO LTD, is fully compliant with Apple's App Store Review Guidelines. This document outlines our compliance framework and the standards we adhere to.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. App Store Review Guidelines Compliance</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Section 1: Safety</h4>
                <p className="text-gray-600 text-sm">Our app does not contain objectionable content, user-generated content is moderated, and we comply with all applicable laws regarding financial services.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Section 2: Performance</h4>
                <p className="text-gray-600 text-sm">The app is complete, functional, and not in beta. All features work as described. We do not include hidden features or undocumented functionality.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Section 3: Business</h4>
                <p className="text-gray-600 text-sm">We are transparent about our business model. All fees are clearly disclosed. We do not engage in bait-and-switch tactics or misleading pricing.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Section 4: Design</h4>
                <p className="text-gray-600 text-sm">Our app follows Apple's Human Interface Guidelines. The UI is intuitive, accessible, and provides a native iOS experience.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-[#0b0e14] mb-2">Section 5: Legal</h4>
                <p className="text-gray-600 text-sm">We comply with all applicable laws, including financial regulations, data protection laws (GDPR, NDPR), and intellectual property rights.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Financial Services Compliance</h3>
            <p>As a financial services app, we comply with:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Apple Pay Guidelines:</strong> Proper use of Apple Pay APIs, merchant ID verification, and secure token handling</li>
              <li><strong>In-App Purchase:</strong> Digital goods and subscriptions use Apple's IAP system where required</li>
              <li><strong>Financial Data:</strong> All financial data is encrypted and handled per Apple's data protection requirements</li>
              <li><strong>Regulatory Licenses:</strong> We hold all necessary licenses for operating financial services in our jurisdictions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Privacy Compliance</h3>
            <p>We adhere to Apple's privacy requirements:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>App Privacy Labels:</strong> Accurate disclosure of all data collection practices</li>
              <li><strong>App Tracking Transparency:</strong> We request permission before tracking users across apps</li>
              <li><strong>Data Minimization:</strong> We only collect data necessary for app functionality</li>
              <li><strong>User Consent:</strong> Clear consent flows for all data collection and processing</li>
              <li><strong>Data Deletion:</strong> Users can request deletion of their account and data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Security Standards</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>ATS (App Transport Security) enabled for all network connections</li>
              <li>Keychain used for secure credential storage</li>
              <li>Biometric authentication (Face ID / Touch ID) support</li>
              <li>Code signing and certificate pinning</li>
              <li>No hardcoded secrets or API keys in the app binary</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Accessibility</h3>
            <p>Our app supports:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>VoiceOver screen reader compatibility</li>
              <li>Dynamic Type for text scaling</li>
              <li>Color contrast ratios meeting WCAG 2.1 AA standards</li>
              <li>Switch Control and AssistiveTouch support</li>
              <li>Reduced Motion option support</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. App Metadata Compliance</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Accurate app description and screenshots</li>
              <li>No misleading claims about app functionality</li>
              <li>Proper age rating (17+ for financial services)</li>
              <li>Clear disclosure of in-app purchases and subscriptions</li>
              <li>Support URL and privacy policy URL provided</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Intellectual Property</h3>
            <p>
              We respect all intellectual property rights. Our app does not infringe on any trademarks, copyrights, or patents. All third-party libraries and assets are properly licensed.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">8. Contact Apple Relations</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Apple Compliance</p>
              <p className="text-gray-600">Email: apple-compliance@obey.finance</p>
              <p className="text-gray-600">App Store Connect Team ID: TRIC0DEPRO</p>
              <p className="text-gray-600">DUNS Number: [Registered]</p>
            </div>
          </section>
        </div>
      )
    },
    cbn: {
      title: "CBN & Nigeria Payment Approval",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              OBEY Finance, operated by TRICODE PRO LTD, operates in full compliance with the Central Bank of Nigeria (CBN) regulations and Nigeria's payment system framework. This document outlines our regulatory compliance status.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Regulatory Licenses</h3>
            <p>TRICODE PRO LTD holds the following licenses and registrations:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>CBN Payment Service Provider (PSP) License:</strong> Authorizes us to process payments and transfers</li>
              <li><strong>Securities and Exchange Commission (SEC) Registration:</strong> For cryptocurrency and digital asset trading</li>
              <li><strong>Nigerian Financial Intelligence Unit (NFIU) Registration:</strong> For AML/CFT compliance reporting</li>
              <li><strong>Corporate Affairs Commission (CAC) Registration:</strong> TRICODE PRO LTD is a registered Nigerian company</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. CBN Compliance Framework</h3>
            <p>We comply with the following CBN regulations:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>CBN Regulations on Electronic Payments and Collections (2020):</strong> Governs electronic payment services</li>
              <li><strong>CBN Guidelines on Operations of Electronic Payment Channels in Nigeria:</strong> Standards for payment channel operations</li>
              <li><strong>CBN Anti-Money Laundering and Combating the Financing of Terrorism Regulations:</strong> AML/CFT compliance</li>
              <li><strong>CBN Consumer Protection Framework:</strong> Protects consumer rights in financial services</li>
              <li><strong>CBN Foreign Exchange Manual:</strong> For cross-border payment compliance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Transaction Limits (CBN Mandated)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Transaction Type</th>
                    <th className="text-left py-3 px-4 font-bold text-[#0b0e14]">Limit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 1 Account (Basic KYC)</td>
                    <td className="py-3 px-4">₦300,000 monthly</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 2 Account (Standard KYC)</td>
                    <td className="py-3 px-4">₦2,000,000 monthly</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Tier 3 Account (Enhanced KYC)</td>
                    <td className="py-3 px-4">₦10,000,000 monthly</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">Cash Deposit (Single Transaction)</td>
                    <td className="py-3 px-4">₦2,500,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">International Transfer (Individual)</td>
                    <td className="py-3 px-4">$1,000,000 annually</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Reporting Obligations</h3>
            <p>We fulfill the following reporting requirements:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Suspicious Transaction Reports (STRs):</strong> Filed with NFIU for suspicious activities</li>
              <li><strong>Cash Transaction Reports (CTRs):</strong> For transactions exceeding ₦2,500,000</li>
              <li><strong>International Fund Transfer Reports:</strong> For cross-border transactions</li>
              <li><strong>Quarterly Compliance Reports:</strong> Submitted to CBN</li>
              <li><strong>Annual Audit Reports:</strong> Independent audit of compliance framework</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">5. Consumer Protection</h3>
            <p>In compliance with CBN's Consumer Protection Framework:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Clear disclosure of all fees and charges before transactions</li>
              <li>Dispute resolution mechanism with 72-hour response time</li>
              <li>Transparent exchange rates for foreign currency transactions</li>
              <li>Protection of customer funds in segregated accounts</li>
              <li>Insurance coverage for customer deposits</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">6. Nigeria Deposit Insurance Corporation (NDIC)</h3>
            <p>
              Customer funds are protected through NDIC insurance coverage up to 5,000,000 per depositor, in compliance with Nigerian banking regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">7. Contact Regulatory Affairs</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Regulatory Affairs</p>
              <p className="text-gray-600">Email: regulatory@obey.finance</p>
              <p className="text-gray-600">Compliance Officer: compliance@obey.finance</p>
              <p className="text-gray-600">CBN Liaison: cbn-relations@obey.finance</p>
              <p className="text-gray-600">Phone: +234 (0) 800 OBEY REG</p>
            </div>
          </section>
        </div>
      )
    },
    nodes: {
      title: "Parallel Node Network",
      date: "June 29, 2026",
      content: (
        <div className="space-y-10 md:space-y-14">
          <section className="space-y-4">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              The OBEY Finance Parallel Node Network is a decentralized infrastructure operated by TRICODE PRO LTD on the Sui blockchain. It provides high-throughput transaction processing, institutional-grade settlements, and global payment routing.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">1. Network Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#0b0e14]">247</p>
                <p className="text-xs text-gray-500 mt-1">Active Nodes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#0b0e14]">99.97%</p>
                <p className="text-xs text-gray-500 mt-1">Network Uptime</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#0b0e14]">2.4M</p>
                <p className="text-xs text-gray-500 mt-1">Daily Transactions</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-2xl font-black text-[#0b0e14]">10K</p>
                <p className="text-xs text-gray-500 mt-1">TPS per Node</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">2. Node Distribution</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li><strong>Africa:</strong> 89 nodes (Nigeria, Ghana, Kenya, South Africa)</li>
              <li><strong>Europe:</strong> 67 nodes (UK, Germany, France, Netherlands)</li>
              <li><strong>Asia:</strong> 52 nodes (Singapore, Japan, South Korea)</li>
              <li><strong>Americas:</strong> 39 nodes (USA, Canada, Brazil)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">3. Become a Node Operator</h3>
            <p>Requirements to operate a parallel node:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
              <li>Minimum stake of 10 SUI tokens</li>
              <li>99.5% uptime commitment</li>
              <li>Geographic diversity contribution</li>
              <li>Pass technical validation and security audit</li>
              <li>Maintain heartbeat every 60 seconds</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl md:text-2xl font-black text-[#0b0e14] tracking-tight">4. Contact Node Operations</h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-2">
              <p className="font-bold text-[#0b0e14]">TRICODE PRO LTD - Node Operations</p>
              <p className="text-gray-600">Email: nodes@obey.finance</p>
              <p className="text-gray-600">Dashboard: nodes.obey.finance</p>
              <p className="text-gray-600">Documentation: docs.obey.finance/nodes</p>
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
