"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TermsModalProps {
  children: React.ReactNode;
  className?: string;
}

export function TermsModal({ children, className }: TermsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
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
                <h2 className="text-lg font-black text-black">Terms of Service</h2>
                <p className="text-xs text-black/50 font-medium">Vectis Group LLC — Effective: April 15, 2026</p>
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

              <div className="bg-[#FFF9E0] border border-[#FFC107]/40 rounded-xl p-4 space-y-1">
                <p className="text-xs font-black text-black uppercase tracking-wide mb-2">Important Notice for International Founders</p>
                {[
                  "Prolify is NOT a law firm, tax advisor, accountant, or bank — see Section 4.",
                  "Prolify does not provide legal advice, even though we provide formation guidance.",
                  "Consult a US lawyer before finalizing your business structure.",
                  "Your password is your responsibility; your business decisions are your responsibility.",
                  "We're here to coordinate and guide, not to manage your company.",
                  "If something goes wrong, you may have limited ability to sue us in court (see arbitration clause in Section 20).",
                ].map((point, i) => (
                  <p key={i} className="text-xs text-black/65 flex gap-2"><span className="text-[#FFC107] font-black">•</span>{point}</p>
                ))}
              </div>

              <Section title="Introduction">
                <p>Welcome to Prolify. These Terms of Service ("Terms") govern your access to and use of the Prolify platform, including our website, mobile applications, and services (collectively, the "Service"). By creating an account or using Prolify in any way, you agree to be bound by these Terms.</p>
                <ul className="mt-2 space-y-1">
                  <li><strong>"We," "us," "our," and "Prolify"</strong> refer to Vectis Group, LLC, doing business as Prolify, a Wyoming limited liability company at 30 N Gould St Ste N, Sheridan, WY 82801.</li>
                  <li><strong>"You," "your," and "user"</strong> refer to you, the individual or entity using Prolify, and any authorized representatives acting on your behalf.</li>
                  <li><strong>"Service"</strong> means Prolify's platform and all services offered through it.</li>
                </ul>
              </Section>

              <Section title="1. Acceptance of Terms">
                <p>By accessing or using Prolify, you acknowledge that you have read, understood, and agree to be bound by these Terms. We may update these Terms at any time. Material changes will be effective immediately upon posting for new users, and 30 days after posting for existing customers. Your continued use of Prolify following any update constitutes acceptance of the updated Terms.</p>
              </Section>

              <Section title="2. Eligibility Requirements">
                <p><strong>2.1 Age and Legal Capacity:</strong> You must be at least 18 years old and have the legal capacity to enter into a binding contract.</p>
                <p className="mt-1"><strong>2.2 International Users:</strong> Prolify is designed for non-US founders seeking to form or operate US entities. You are solely responsible for complying with all applicable laws in your country of residence and the United States.</p>
                <p className="mt-1"><strong>2.3 Sanctions:</strong> You represent that you are not located in, resident of, or organized under the laws of any country subject to US comprehensive sanctions (including Iran, North Korea, Syria, and Cuba), and are not on any government watch list.</p>
                <p className="mt-1"><strong>2.4 Account Ownership:</strong> You may not share your account credentials. You are solely responsible for the security of your account and all activity that occurs under it.</p>
              </Section>

              <Section title="3. Description of Services">
                <p>Prolify provides AI-native formation and compliance guidance including: formation filing coordination, EIN assistance, registered agent coordination, banking and payment readiness guidance, compliance tracking, AI-powered bookkeeping, invoicing, and financial account connectivity via Stripe Financial Connections, Plaid, and Wise.</p>
                <p className="mt-2"><strong>Prolify does NOT:</strong> provide legal advice, tax/accounting advice, serve as a bank, guarantee government approval, act as your attorney/accountant/fiduciary, register your business directly, handle your banking credentials, or serve as a licensed accounting firm or CPA.</p>
              </Section>

              <Section title="4. Critical Disclaimers: Not Legal, Tax, or Financial Advice">
                <p className="font-bold text-black">THIS IS THE MOST IMPORTANT SECTION. PLEASE READ CAREFULLY.</p>
                <p className="mt-2">Prolify is not a law firm, accountant, tax advisor, bank, or financial advisor. The services and guidance we provide are informational and educational only.</p>
                <p className="mt-1"><strong>4.1</strong> Formation guidance is informational only — not legal advice. Consult a licensed attorney before finalizing business structure decisions.</p>
                <p className="mt-1"><strong>4.2</strong> Using Prolify does not create an attorney-client relationship.</p>
                <p className="mt-1"><strong>4.3</strong> AI bookkeeping outputs are automated suggestions — NOT professional accounting or tax advice. They must be reviewed by you or a qualified professional.</p>
                <p className="mt-1"><strong>4.4</strong> Prolify does not provide financial or investment advice.</p>
                <p className="mt-1"><strong>4.5</strong> Prolify cannot guarantee government outcomes, including formation approval, EIN issuance timelines, or acceptance of filings.</p>
                <p className="mt-1"><strong>4.6</strong> You are solely responsible for consulting licensed professionals about your business, tax, and compliance obligations.</p>
              </Section>

              <Section title="5. Account Registration and Security">
                <p>You must provide accurate, current, and complete information during registration and keep it up-to-date. You are solely responsible for protecting your account password and for all activity under your account. Report unauthorized access immediately to security@prolify.com.</p>
                <p className="mt-1">We may suspend or terminate your account immediately if you violate these Terms, provide false information, or use the Service for illegal purposes.</p>
              </Section>

              <Section title="6. User Responsibilities">
                <p>You agree to use Prolify only for lawful purposes. You represent that your business operates in compliance with applicable laws and that you have disclosed all material information affecting your eligibility. You are solely responsible for all business decisions related to your company formation, structure, operations, and compliance.</p>
              </Section>

              <Section title="7. Acceptable Use Policy">
                <p>You may not use Prolify to: violate any law; facilitate money laundering, terrorist financing, or sanctions evasion; commit fraud or misrepresentation; impersonate others; attempt unauthorized access to Prolify systems; upload malware; or harass any person.</p>
              </Section>

              <Section title="8. Payments, Billing, and Subscriptions">
                <p>Subscription services are billed at the rates displayed on our website. Formation services may include one-time fees. All prices are in USD. You are responsible for applicable taxes. Payments are processed through third-party processors (including Stripe) — Prolify does not store your full payment card information.</p>
                <p className="mt-1"><strong>Billing Errors:</strong> If charged in error, contact support@prolify.co immediately. We will investigate and issue a refund or credit if confirmed.</p>
              </Section>

              <Section title="9. Subscription Auto-Renewal">
                <p>Unless you cancel, your subscription automatically renews at the end of each billing cycle at the then-current rate. To cancel, log into your account or email support@prolify.co at least 48 hours before the next renewal date. Cancellation is effective at the end of your current billing period — no pro-rate refunds for early cancellation.</p>
              </Section>

              <Section title="10. Cancellation and Refund Policy">
                <p><strong>Formation Services:</strong> 100% refund if cancelled within 30 days of purchase and documents have not yet been submitted to a state agency. No refunds after submission.</p>
                <p className="mt-1"><strong>Subscription Services:</strong> Generally non-refundable. A one-time courtesy refund may be offered if cancelled in error within 48 hours of sign-up.</p>
                <p className="mt-1"><strong>Government Fees:</strong> Not refundable. These are paid directly to government agencies and outside Prolify's control.</p>
                <p className="mt-1">To request a refund, email support@prolify.co with your account email and order number.</p>
              </Section>

              <Section title="11. Third-Party Services and Partners">
                <p>Prolify partners with third-party registered agents, banks, payment processors, and tax professionals. These partners are independent contractors, not agents of Prolify. Prolify is not liable for their performance, errors, or fees. When you connect financial accounts, authentication is handled entirely by Stripe Financial Connections, Plaid, or Wise — Prolify never receives or stores your bank login credentials.</p>
              </Section>

              <Section title="12. Intellectual Property">
                <p>Prolify owns all intellectual property in the Service. You receive a limited, non-exclusive, non-transferable license to use the Service for your own purposes. You may not copy, modify, reverse-engineer, or sell the Service. Feedback you submit grants Prolify a royalty-free license to use it for any purpose.</p>
              </Section>

              <Section title="13. Warranties and Disclaimers">
                <p className="font-bold text-black">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
                <p className="mt-1">Prolify disclaims all warranties including merchantability, fitness for a particular purpose, non-infringement, and warranties that the Service will be uninterrupted or error-free. You are responsible for verifying all information with appropriate professionals before relying on it.</p>
              </Section>

              <Section title="14. Limitation of Liability">
                <p className="font-bold text-black">PROLIFY'S TOTAL LIABILITY TO YOU IS LIMITED TO THE FEES YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
                <p className="mt-1">If you have not paid any fees, Prolify's liability is limited to $100. Prolify is not liable for indirect, incidental, special, consequential, or punitive damages, lost profits, or lost data.</p>
              </Section>

              <Section title="15. Indemnification">
                <p>You agree to indemnify and hold harmless Prolify and its officers, directors, employees, and agents from claims arising from your use of the Service, your violation of these Terms, your violation of any law or third-party rights, or your failure to consult with appropriate professionals.</p>
                <p className="mt-1">Prolify agrees to indemnify you from third-party claims that the Prolify Service infringes a patent, copyright, or trade secret.</p>
              </Section>

              <Section title="16. Privacy and Data Protection">
                <p>Your use of Prolify is governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using Prolify, you consent to the practices described in our Privacy Policy.</p>
              </Section>

              <Section title="17. Term and Termination">
                <p>These Terms are effective when you first use the Service. You may terminate at any time by discontinuing use and canceling your subscription. Prolify may terminate immediately if you violate these Terms, or with 30 days' notice for convenience. Upon termination, your right to use the Service ends immediately, but outstanding fees remain due.</p>
              </Section>

              <Section title="18. Governing Law">
                <p>These Terms are governed by the laws of the State of Wyoming, without regard to conflict of law principles. This choice of law does not deprive you of rights that cannot be waived under your country's laws.</p>
              </Section>

              <Section title="19. Dispute Resolution and Arbitration">
                <p><strong>Informal Resolution First:</strong> Before initiating arbitration, you must notify Prolify in writing at support@prolify.co and attempt good-faith negotiation for at least 30 days.</p>
                <p className="mt-1"><strong>Binding Arbitration:</strong> Unresolved disputes are resolved by binding arbitration administered by the AAA under its Consumer Arbitration Rules — not by court litigation. There is no judge or jury, no right to appeal, and the process is confidential.</p>
                <p className="mt-1"><strong>Right to Opt Out (30 days):</strong> You may opt out of arbitration by sending written notice to privacy@prolify.co within 30 days of first accepting these Terms, including your name, email, and statement: "I opt out of the arbitration clause."</p>
                <p className="mt-1"><strong>Class Action Waiver:</strong> Arbitration is on an individual basis — no class actions or representative actions.</p>
                <p className="mt-1"><strong>Exceptions:</strong> Small claims court, intellectual property claims, and injunctive relief are not subject to arbitration. EEA/UK users retain the right to bring claims in their local courts.</p>
              </Section>

              <Section title="20. General Provisions">
                <p><strong>Severability:</strong> If any provision is found invalid, the remaining provisions continue in full force.</p>
                <p className="mt-1"><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Prolify.</p>
                <p className="mt-1"><strong>Contact:</strong> privacy@prolify.co / support@prolify.co — Vectis Group, LLC, 30 N Gould St Ste N, Sheridan, WY 82801</p>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-black text-black text-sm mb-2 pb-1 border-b border-black/8">{title}</h3>
      <div className="space-y-1 [&_strong]:text-black [&_strong]:font-bold">{children}</div>
    </div>
  );
}
