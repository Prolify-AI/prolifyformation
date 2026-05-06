import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Prolify",
  description: "Vectis Group LLC Privacy Policy for Prolify services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/8 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prolify
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-black/40">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/15 border border-[#FFC107]/40 text-xs font-bold uppercase tracking-widest text-black/70 mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-base text-black/55 font-medium">
            <strong>Effective Date:</strong> January 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> March 2026
          </p>
          <p className="text-sm text-black/50 mt-2 font-medium">
            Issued by <strong className="text-black">Vectis Group LLC.</strong>
          </p>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none text-black/80 leading-relaxed">

          <div className="bg-[#FFF9E0] border border-[#FFC107]/40 rounded-2xl p-6 mb-10 not-prose">
            <h2 className="text-base font-black text-black mb-3 uppercase tracking-wide">Notice at Collection (California Residents)</h2>
            <p className="text-sm text-black/70 leading-relaxed">
              We collect the following categories of personal information: identifiers (name, email, phone); commercial information (service usage, transaction history); internet/electronic network activity (app and website events, device data); financial information (bank account data, transaction data accessed via Stripe Financial Connections, Plaid, or Wise with your consent); and professional/employment information (business name, entity details, role). We do not sell or share personal information for cross-context behavioral advertising. California residents may exercise rights described in Addendum A. To submit a request, email <a href="mailto:privacy@prolify.co" className="text-[#B8860B] underline">privacy@prolify.co</a> with subject line "California Privacy Request."
            </p>
          </div>

          <div className="bg-[#FAFAFA] border border-black/8 rounded-2xl p-6 mb-10 not-prose">
            <h2 className="text-base font-black text-black mb-4 uppercase tracking-wide">Key Points Summary</h2>
            <ul className="space-y-2">
              {[
                ["Data Controller", "Vectis Group LLC., a company incorporated in the United States."],
                ["What We Collect", "Account information, business details, financial account data (with your consent via Stripe, Plaid, or Wise), device/usage data, and analytics data."],
                ["How We Use It", "To provide LLC formation, AI bookkeeping, compliance services, and to improve, secure, and communicate about our Services."],
                ["AI Processing", "We use automated systems to categorize transactions, generate financial reports, and provide bookkeeping insights. You can review and correct all AI-generated outputs."],
                ["Sharing", "Only with service providers, financial connectivity partners, and as required by law. We never sell your personal information."],
                ["International Transfers", "Data is processed in the United States. We rely on the EU-US Data Privacy Framework, UK-US Data Bridge, and Standard Contractual Clauses for lawful transfers."],
                ["Your Rights", "Depending on your jurisdiction, you may access, correct, delete, port, or restrict processing of your data. See Sections 10 and Addenda A–C."],
                ["Contact", "privacy@prolify.co"],
              ].map(([key, val]) => (
                <li key={key} className="flex gap-2 text-sm">
                  <span className="font-bold text-black flex-shrink-0">{key}:</span>
                  <span className="text-black/65">{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <Section title="1. Who We Are">
            <p>This Privacy Policy is issued by Vectis Group, LLC. ("Vectis," "Company," "we," "us," or "our"), the data controller responsible for the personal information described in this policy.</p>
            <ul>
              <li><strong>Registered Name:</strong> Vectis Group, LLC.</li>
              <li><strong>Registered Address:</strong> 30 N Gould St Ste N Sheridan, WY 82801</li>
              <li><strong>Privacy Contact:</strong> <a href="mailto:privacy@prolify.co">privacy@prolify.co</a></li>
              <li><strong>General Support:</strong> <a href="mailto:support@prolify.co">support@prolify.co</a></li>
              <li><strong>EU Representative (GDPR Art. 27):</strong> Gregory Colbert, <a href="mailto:colbert@prolify.co">colbert@prolify.co</a></li>
              <li><strong>UK Representative (UK GDPR Art. 27):</strong> Mark Damsell, <a href="mailto:damsell@prolify.co">damsell@prolify.co</a></li>
            </ul>
          </Section>

          <Section title="2. Scope of This Policy">
            <p>This Privacy Policy applies to all personal information we collect, use, store, and share when you:</p>
            <ul>
              <li>Visit or interact with our website (prolify.co) or any of our subdomains;</li>
              <li>Create an account and use our Services, including LLC formation, registered agent, compliance, AI bookkeeping, invoicing, and related business services;</li>
              <li>Link a financial account through Stripe Financial Connections, Plaid, Wise, or any other supported financial connectivity provider;</li>
              <li>Communicate with us through email, in-app chat, support tickets, or any other channel;</li>
              <li>Interact with our marketing communications, surveys, or events.</li>
            </ul>
            <p>This policy does not apply to third-party websites, applications, or services that we link to or integrate with, even if accessed through our Services.</p>
          </Section>

          <Section title="3. Information We Collect">
            <h3>3.1 Information You Provide Directly</h3>
            <ul>
              <li><strong>Account and Profile Information:</strong> Full legal name, email address, phone number, password (stored in hashed form), role or title, and profile preferences.</li>
              <li><strong>Business and Entity Information:</strong> Business name, entity type, formation state, registered agent details, EIN, articles of organization, operating agreements, and other formation or compliance documents.</li>
              <li><strong>Financial and Bookkeeping Information:</strong> Receipts, invoices, bank statements, expense reports, and other financial documents you upload.</li>
              <li><strong>Payment Information:</strong> Billing address, payment card details (processed and stored by Stripe; we do not store full card numbers).</li>
              <li><strong>Communications:</strong> Messages you send to our support team, survey responses, feedback, and testimonials.</li>
            </ul>
            <h3>3.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device and Technical Data:</strong> IP address, browser type and version, operating system, device identifiers, screen resolution, and language preferences.</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, clickstream data, session duration, and actions taken within the Services.</li>
              <li><strong>Analytics Data:</strong> We use PostHog to collect aggregated usage data. For EU/UK users, non-essential analytics cookies require your prior consent.</li>
              <li><strong>Log Data:</strong> Server logs that record requests made to our systems.</li>
            </ul>
            <h3>3.3 Financial Account Data (Third-Party Financial Connectivity)</h3>
            <p>If you choose to connect a bank account through one of our supported providers, we access and process financial account data with your explicit consent. Supported providers include Stripe Financial Connections, Plaid, and Wise.</p>
            <p><strong>Important:</strong> We never receive, store, or have access to your bank login credentials. All authentication occurs directly through the provider's secure connection flow. You may withdraw consent at any time by disconnecting the linked account in your account settings.</p>
          </Section>

          <Section title="4. How We Use Your Information">
            <h3>4.1 Providing and Operating the Services</h3>
            <p>Creating and managing accounts, processing LLC formations, enabling AI bookkeeping features, processing payments via Stripe, and generating financial views such as cash flow summaries and profit and loss statements.</p>
            <h3>4.2 Improving and Securing the Services</h3>
            <p>Analyzing usage patterns via PostHog, troubleshooting technical issues, preventing fraud, detecting unauthorized access, and conducting internal research and development using de-identified and aggregated data only.</p>
            <h3>4.3 Communicating with You</h3>
            <p>Sending transactional communications, responding to support requests, and sending marketing communications (only with your consent where required by law).</p>
            <h3>4.4 Legal and Compliance Obligations</h3>
            <p>Complying with applicable laws, establishing or defending legal claims, fulfilling tax reporting obligations, and responding to lawful requests from regulatory authorities and law enforcement.</p>
          </Section>

          <Section title="5. Automated Processing and AI Features">
            <p>Our Services use automated systems, including machine learning and AI, to provide core bookkeeping and financial analysis features.</p>
            <h3>5.1 What Our AI Does</h3>
            <p>Categorizes transactions, matches receipts and invoices to transactions, detects duplicates and anomalies, generates financial summaries and reports, and suggests chart-of-accounts mappings.</p>
            <h3>5.2 Human Oversight</h3>
            <p>All AI-generated outputs are presented to you for review. You can modify, correct, or override any AI-generated categorization at any time.</p>
            <h3>5.3 Model Training and Your Data</h3>
            <p><strong>We do not use your individually identifiable connected bank transaction data or uploaded financial documents to train general-purpose or third-party AI models.</strong> We may use de-identified and aggregated data to improve our product's AI performance.</p>
            <h3>5.4 AI Accuracy Disclaimer</h3>
            <p><strong>Important:</strong> AI-generated bookkeeping data, transaction categorizations, financial reports, and insights are provided for informational purposes and may contain errors. Users should independently verify the accuracy of all AI-generated outputs before relying on them for tax filings or financial reporting. Prolify is not a licensed accounting firm and our AI-generated outputs do not constitute professional accounting, tax, or financial advice.</p>
          </Section>

          <Section title="6. How We Share Your Information">
            <p>We share your personal information only as described below. <strong>We never sell your personal information.</strong></p>
            <h3>6.1 Service Providers (Data Processors)</h3>
            <p>We engage vetted third-party service providers for cloud hosting, product analytics (PostHog), payment processing (Stripe, Plaid, Wise), email delivery, customer support, and security. All providers are contractually prohibited from using your data for their own purposes.</p>
            <h3>6.2 Financial Connectivity Partners</h3>
            <p>When you link a financial account, Stripe, Plaid, and/or Wise process your financial data under their respective privacy policies. We maintain Data Processing Agreements with each partner.</p>
            <ul>
              <li>Stripe Privacy Policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
              <li>Plaid End User Privacy Policy: <a href="https://plaid.com/legal/#end-user-privacy-policy" target="_blank" rel="noopener noreferrer">plaid.com/legal</a></li>
              <li>Wise Privacy Policy: <a href="https://wise.com/us/legal/global-privacy-statement" target="_blank" rel="noopener noreferrer">wise.com/legal</a></li>
            </ul>
            <h3>6.3 Legal, Safety, and Compliance Disclosures</h3>
            <p>We may disclose personal information to comply with applicable laws, enforce our Terms of Service, detect or prevent fraud, or protect the rights and safety of Prolify, our users, or the public.</p>
            <h3>6.4 Business Transfers</h3>
            <p>If Prolify is involved in a merger, acquisition, or asset sale, your personal information may be transferred. We will provide notice before your information becomes subject to a different privacy policy.</p>
          </Section>

          <Section title="7. International Data Transfers">
            <p>Prolify is based in the United States. If you access our Services from outside the US—including from the EEA, UK, or Switzerland—your personal information will be transferred to and processed in the United States.</p>
            <p>We rely on the following lawful transfer mechanisms: EU-US Data Privacy Framework (DPF), UK-US Data Bridge (UK Extension to the DPF), and Standard Contractual Clauses (SCCs). We conduct Transfer Impact Assessments and implement supplementary measures where necessary.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain personal information only as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Data Category</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Account and profile data", "Duration of active account + 90 days post-termination"],
                    ["Business formation documents", "Duration of account + 7 years from the relevant tax year"],
                    ["Financial/bookkeeping data", "Duration of account + 7 years from the relevant tax year"],
                    ["Payment/billing records", "7 years from date of transaction"],
                    ["Communications", "3 years from last interaction or account closure"],
                    ["Device and usage data", "24 months from collection"],
                    ["Analytics data (PostHog)", "Duration of account or until you opt out"],
                    ["Security and access logs", "12 months from creation"],
                  ].map(([cat, period]) => (
                    <tr key={cat} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-medium text-black/75">{cat}</td>
                      <td className="px-4 py-3 text-black/60">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="9. Data Security">
            <p>We implement administrative, technical, and organizational security measures including:</p>
            <ul>
              <li>Encryption of data in transit (TLS 1.2+) and encryption at rest;</li>
              <li>Multi-factor authentication for access to internal systems;</li>
              <li>Role-based access controls limiting data access to authorized personnel;</li>
              <li>Regular security assessments, vulnerability scanning, and penetration testing;</li>
              <li>Employee security training and confidentiality obligations;</li>
              <li>Incident detection, response, and recovery procedures.</li>
            </ul>
            <p>If you have reason to believe that your interaction with us is no longer secure, please contact us immediately at <a href="mailto:security@prolify.co">security@prolify.co</a>.</p>
          </Section>

          <Section title="10. Your Rights and Choices">
            <h3>10.1 Universal Rights (All Users)</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete personal information.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal information, subject to legal retention requirements.</li>
              <li><strong>Account Controls:</strong> Update your profile, disconnect linked financial accounts, and manage notification and marketing preferences through your account settings.</li>
              <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from marketing emails using the link in any marketing communication.</li>
            </ul>
            <h3>10.2 How to Exercise Your Rights</h3>
            <p>Email <a href="mailto:privacy@prolify.co">privacy@prolify.co</a> with subject line "Privacy Rights Request" and include your full name, account email, the specific right(s) you wish to exercise, and your jurisdiction. We will respond to verified requests within 45 days.</p>
            <h3>10.3 Global Privacy Control</h3>
            <p>We honor the Global Privacy Control (GPC) signal. If your browser or device transmits a GPC signal, we will treat it as a valid opt-out of sale and sharing of personal information.</p>
          </Section>

          <Section title="11. Cookies, Analytics, and Tracking Technologies">
            <p>We use cookies and similar technologies to operate and improve the Services.</p>
            <ul>
              <li><strong>Strictly Necessary Cookies:</strong> Required for authentication, security, and core functionality. These cannot be disabled.</li>
              <li><strong>Analytics Cookies (PostHog):</strong> Used to understand how users interact with our Services. PostHog uses first-party cookies with a 365-day expiry and does not track users across different websites.</li>
              <li><strong>Preference Cookies:</strong> Used to remember your settings and preferences.</li>
            </ul>
            <p>For users in the EEA and UK, we display a cookie consent banner before setting non-essential cookies.</p>
          </Section>

          <Section title="12. Data Breach Notification">
            <p>In the event of a personal data breach affecting your personal information, we will notify you and the relevant supervisory authorities in accordance with applicable data protection laws, including GDPR Articles 33 and 34, GLBA Safeguards Rule breach notification requirements, and the breach notification laws of all applicable US states.</p>
          </Section>

          <Section title="13. Children's Privacy">
            <p>Our Services are intended for use by adults and business entities. We do not direct our Services to individuals under 18 years of age, and we do not knowingly collect personal information from anyone under 18. If you believe we have inadvertently collected information from a minor, please contact us at <a href="mailto:privacy@prolify.co">privacy@prolify.co</a>.</p>
          </Section>

          <Section title="14. Consumer Reporting Disclaimer">
            <p>Prolify is not a consumer reporting agency as defined by the Fair Credit Reporting Act. Our Services do not constitute consumer reports and the financial data generated by our AI bookkeeping features should not be used to determine any individual's eligibility for credit, insurance, or employment.</p>
          </Section>

          <Section title="15. Third-Party Links and Integrations">
            <p>The Services may contain links to third-party websites, applications, or services. This Privacy Policy does not apply to any third-party sites or services. We encourage you to read the privacy policy of any website you visit.</p>
          </Section>

          <Section title="16. Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time. If we make material changes, we will provide prominent notice through the Services, by email, or by other means prior to the changes taking effect. Material changes include: changes to categories of personal information collected, new purposes of processing, changes to data sharing practices, or modifications to your rights.</p>
          </Section>

          <Section title="17. Dispute Resolution">
            <h3>17.1 Governing Law</h3>
            <p>This Privacy Policy and any disputes arising out of or relating to it shall be governed by the laws of the United States, without regard to conflict of laws principles.</p>
            <h3>17.2 Arbitration (US Users)</h3>
            <p>For users located in the United States: Any dispute that cannot be resolved through informal negotiation within 30 days shall be resolved exclusively through binding individual arbitration administered by the American Arbitration Association. There shall be no right or authority for claims to be arbitrated on a class, collective, or representative basis. You may opt out of this arbitration provision by sending written notice to <a href="mailto:privacy@prolify.co">privacy@prolify.co</a> within 30 days of first accepting this Privacy Policy.</p>
            <h3>17.3 EEA and UK Users</h3>
            <p>The arbitration provision in Section 17.2 does not apply to users located in the EEA, UK, or Switzerland. Nothing in this Privacy Policy limits your right to bring proceedings before the courts of the EU Member State or UK jurisdiction in which you reside, or your right to lodge a complaint with a supervisory authority.</p>
          </Section>

          <Section title="18. Contact Information">
            <ul>
              <li><strong>Email:</strong> <a href="mailto:privacy@prolify.co">privacy@prolify.co</a></li>
              <li><strong>Mail:</strong> Vectis Group, LLC., Attn: Privacy, 30 N Gould St Ste N Sheridan, WY 82801</li>
              <li><strong>EU Representative:</strong> Gregory Colbert, <a href="mailto:colbert@prolify.co">colbert@prolify.co</a></li>
              <li><strong>UK Representative:</strong> Mark Damsell, <a href="mailto:damsell@prolify.co">damsell@prolify.co</a></li>
            </ul>
          </Section>

          <div className="mt-12 pt-8 border-t border-black/8">
            <h2 className="text-xl font-black text-black mb-4 uppercase tracking-wide">Addendum A: California Residents (CCPA)</h2>
            <p>This addendum supplements the main Privacy Policy for California residents pursuant to the CCPA/CPRA.</p>
            <p>We have collected in the preceding 12 months: Identifiers (name, email, phone, IP address), Financial information (bank account data, transaction data), Commercial information (services purchased, usage history), Internet/electronic activity (browsing, app usage), Professional/employment information (business name, role), Geolocation (inferred from IP), and Inferences (AI-generated transaction categories). <strong>None of this information has been sold or shared for cross-context behavioral advertising.</strong></p>
            <h3>Your California Privacy Rights:</h3>
            <ul>
              <li><strong>Right to Know/Access</strong> the categories and specific pieces of personal information we collected.</li>
              <li><strong>Right to Delete</strong> personal information we collected, subject to statutory exceptions.</li>
              <li><strong>Right to Correct</strong> inaccurate personal information.</li>
              <li><strong>Right to Opt Out of Sale/Sharing</strong> — We do not sell or share personal information for cross-context behavioral advertising.</li>
              <li><strong>Right to Limit Use of Sensitive PI</strong> — You may request we limit our use of sensitive personal information.</li>
              <li><strong>Right to Non-Discrimination</strong> — We will not discriminate against you for exercising any of your CCPA rights.</li>
            </ul>
            <p>To submit a request, email <a href="mailto:privacy@prolify.co">privacy@prolify.co</a> with subject "California Privacy Request."</p>
          </div>

          <div className="mt-8 pt-8 border-t border-black/8">
            <h2 className="text-xl font-black text-black mb-4 uppercase tracking-wide">Addendum B: European Economic Area Residents (GDPR)</h2>
            <p>We process your personal data on the following lawful bases: contract performance (account creation, LLC formation, AI bookkeeping, payment processing), legal obligation (tax compliance, AML/KYC obligations), legitimate interest (product analytics, fraud prevention, security monitoring), and consent (marketing emails, non-essential cookies, financial account linking).</p>
            <h3>Your GDPR Rights:</h3>
            <ul>
              <li>Right to restriction of processing (Art. 18)</li>
              <li>Right to data portability (Art. 20)</li>
              <li>Right to object to processing (Art. 21)</li>
              <li>Rights related to automated decision-making (Art. 22)</li>
              <li>Right to withdraw consent at any time (Art. 7)</li>
              <li>Right to lodge a complaint with a supervisory authority (Art. 77)</li>
            </ul>
            <p>You may request a copy of our Legitimate Interest Assessments or Standard Contractual Clauses by contacting <a href="mailto:privacy@prolify.co">privacy@prolify.co</a>.</p>
          </div>

          <div className="mt-8 pt-8 border-t border-black/8">
            <h2 className="text-xl font-black text-black mb-4 uppercase tracking-wide">Addendum C: United Kingdom Residents (UK GDPR)</h2>
            <p>Our UK Representative is: Mark Damsell, <a href="mailto:damsell@prolify.co">damsell@prolify.co</a>. We rely on the UK-US Data Bridge (the UK Extension to the EU-US Data Privacy Framework) and the UK International Data Transfer Agreement for transfers from the United Kingdom to the United States.</p>
            <p>You have the right to lodge a complaint with the Information Commissioner's Office (ICO): <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>, Telephone: +44 (0)303 123 1113.</p>
            <p>The mandatory arbitration provision in Section 17.2 does not apply to UK residents. Nothing in this policy restricts your rights under UK GDPR or the Data Protection Act 2018.</p>
          </div>

          <div className="mt-12 pt-8 border-t border-black/8 text-center not-prose">
            <p className="text-xs text-black/35 font-medium mb-1">
              &copy; 2026 Vectis Group, LLC. All rights reserved.
            </p>
            <p className="text-xs text-black/30">
              This document is for informational purposes and does not constitute legal advice. Prolify recommends consultation with qualified legal counsel for compliance verification.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-black text-black mb-4 pb-2 border-b border-black/8">{title}</h2>
      <div className="space-y-3 text-black/75 text-sm leading-relaxed [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#B8860B] [&_a]:underline [&_strong]:text-black [&_strong]:font-bold">
        {children}
      </div>
    </div>
  );
}
