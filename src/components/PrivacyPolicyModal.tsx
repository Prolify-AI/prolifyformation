"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PrivacyPolicyModalProps {
  children: React.ReactNode;
  className?: string;
}

export function PrivacyPolicyModal({ children, className }: PrivacyPolicyModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black/8 flex-shrink-0 bg-white">
              <div>
                <h2 className="text-lg font-black text-black">Privacy Policy</h2>
                <p className="text-xs text-black/50 font-medium">Vectis Group LLC — Last Updated: March 2026</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-black/6 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 text-sm text-black/75 leading-relaxed space-y-6">

              <Notice />

              <Section title="Key Points Summary">
                <ul className="space-y-1.5 list-none">
                  {[
                    ["Data Controller", "Vectis Group LLC., incorporated in the United States."],
                    ["What We Collect", "Account info, business details, financial account data (with consent via Stripe, Plaid, or Wise), device/usage data."],
                    ["How We Use It", "LLC formation, AI bookkeeping, compliance services, and to improve, secure, and communicate about our Services."],
                    ["AI Processing", "Automated systems categorize transactions and generate financial reports. You can review and correct all AI outputs."],
                    ["Sharing", "Only with service providers and as required by law. We never sell your personal information."],
                    ["Your Rights", "You may access, correct, delete, or restrict processing of your data. See sections below."],
                    ["Contact", "privacy@prolify.co"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex gap-2">
                      <span className="font-bold text-black flex-shrink-0">{k}:</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="1. Who We Are">
                <p>This Privacy Policy is issued by Vectis Group, LLC. ("Vectis," "Company," "we," "us," or "our"), the data controller responsible for the personal information described in this policy.</p>
                <ul className="mt-2 space-y-1 list-none">
                  <li><strong>Registered Address:</strong> 30 N Gould St Ste N Sheridan, WY 82801</li>
                  <li><strong>Privacy Contact:</strong> privacy@prolify.co</li>
                  <li><strong>EU Representative:</strong> Gregory Colbert, colbert@prolify.co</li>
                  <li><strong>UK Representative:</strong> Mark Damsell, damsell@prolify.co</li>
                </ul>
              </Section>

              <Section title="2. Information We Collect">
                <p><strong>You provide directly:</strong> Name, email, phone, password, business details, EIN, financial documents, and communications.</p>
                <p className="mt-2"><strong>Collected automatically:</strong> IP address, browser type, usage data, and analytics data (via PostHog).</p>
                <p className="mt-2"><strong>Financial account data:</strong> If you connect a bank account via Stripe Financial Connections, Plaid, or Wise, we access transaction data with your explicit consent. We never receive your bank login credentials.</p>
              </Section>

              <Section title="3. How We Use Your Information">
                <p>We use your information to: provide and operate the Services; process LLC formations and compliance filings; enable AI bookkeeping features; process payments; improve and secure the Services; communicate with you; and comply with legal obligations.</p>
              </Section>

              <Section title="4. AI Features & Automated Processing">
                <p>Our AI categorizes transactions, matches receipts, detects anomalies, and generates financial reports. All AI-generated outputs are presented for your review — you can modify or override any result at any time.</p>
                <p className="mt-2"><strong>We do not use your individually identifiable financial data to train general-purpose AI models.</strong></p>
                <p className="mt-2 text-black/60 text-xs">AI-generated outputs are for informational purposes only and do not constitute professional accounting, tax, or financial advice.</p>
              </Section>

              <Section title="5. How We Share Your Information">
                <p><strong>We never sell your personal information.</strong> We share data only with: service providers (PostHog, Stripe, Plaid, Wise, cloud hosting) under strict data processing agreements; when required by law; or in connection with a business transfer (with prior notice).</p>
              </Section>

              <Section title="6. Data Retention">
                <p>Account data is retained for the duration of your account plus 90 days. Business formation documents and financial data are retained for 7 years from the relevant tax year, as required by law. Usage data is retained for 24 months.</p>
              </Section>

              <Section title="7. Data Security">
                <p>We use TLS encryption in transit, encryption at rest, multi-factor authentication, role-based access controls, and regular security assessments. Contact security@prolify.co if you believe your account has been compromised.</p>
              </Section>

              <Section title="8. Your Rights">
                <p>You may request access, correction, or deletion of your personal information. To exercise your rights, email <strong>privacy@prolify.co</strong> with subject "Privacy Rights Request." We respond within 45 days.</p>
                <p className="mt-2">EEA residents have additional rights under GDPR (portability, restriction, objection). UK residents may contact the ICO at ico.org.uk. California residents may submit requests under CCPA.</p>
              </Section>

              <Section title="9. Cookies & Analytics">
                <p>We use strictly necessary cookies for authentication and PostHog analytics cookies to improve the product. EEA/UK users are asked for consent before non-essential cookies are set.</p>
              </Section>

              <Section title="10. Children's Privacy">
                <p>Our Services are for adults and business entities only. We do not knowingly collect information from anyone under 18. Contact privacy@prolify.co if you believe a minor's data was collected.</p>
              </Section>

              <Section title="11. Changes to This Policy">
                <p>We may update this Privacy Policy. Material changes will be communicated by email or in-app notice before they take effect. Continued use of the Services constitutes acceptance of the revised policy.</p>
              </Section>

              <Section title="12. Contact">
                <p><strong>Email:</strong> privacy@prolify.co</p>
                <p><strong>Mail:</strong> Vectis Group, LLC., Attn: Privacy, 30 N Gould St Ste N Sheridan, WY 82801</p>
              </Section>

              <p className="text-xs text-black/35 text-center pt-4 border-t border-black/8">
                © 2026 Vectis Group, LLC. All rights reserved. This document does not constitute legal advice.
              </p>
            </div>

            <div className="px-6 py-4 border-t-2 border-black/8 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-black py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Notice() {
  return (
    <div className="bg-[#FFF9E0] border border-[#FFC107]/40 rounded-xl p-4">
      <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">Notice at Collection (California Residents)</p>
      <p className="text-xs text-black/65">We collect identifiers, commercial information, internet activity, financial information (with consent), and professional information. We do not sell or share personal information for cross-context behavioral advertising. Email privacy@prolify.co with subject "California Privacy Request" to exercise your rights.</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-black text-black text-sm mb-2 pb-1 border-b border-black/8">{title}</h3>
      <div className="space-y-1 [&_strong]:text-black [&_strong]:font-bold">{children}</div>
    </div>
  );
}
