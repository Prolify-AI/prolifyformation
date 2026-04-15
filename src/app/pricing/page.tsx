"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Check, X, ArrowRight, Shield, Briefcase, Building2, ChevronDown, DollarSign, Sparkles, Zap, TrendingUp } from "lucide-react";
import { formationPlans, managementPlans } from "@/lib/plans";
import Link from "next/link";

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState<"new" | "existing">("new");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const vipPerks = [
    { icon: DollarSign, title: "$5,000+ in Annual Savings", description: "Save thousands with exclusive discounts on Stripe, AWS, Shopify, and more." },
    { icon: Sparkles, title: "Premium Partner Perks", description: "Waived fees, extended trials, and founder-only pricing from 50+ partners." },
    { icon: Zap, title: "Priority Expert Help", description: "Jump the queue with dedicated support from our tax, legal, and compliance teams." },
    { icon: TrendingUp, title: "Powerful Business Tools", description: "Pre-negotiated deals on payment processing, hosting, marketing, and operations tools." },
  ];

  const formationComparison = [
    {
      category: "Formation Services",
      features: [
        { name: "Formation Filing", starter: "Full Service", growth: "Full Service", elite: "Full Service (Rush)" },
        { name: "Registered Agent (1 year)", starter: "Add-on: $129/yr", growth: true, elite: true },
        { name: "EIN (Tax ID)", starter: "Add-on: $79", growth: "With SSN", elite: "With or without SSN" },
        { name: "BOI / CTA Filing", starter: "Add-on: $99", growth: true, elite: true },
        { name: "Business Address + Mail Scanning", starter: false, growth: false, elite: true },
        { name: "Operating Agreement", starter: false, growth: "Template", elite: "Template" },
      ],
    },
    {
      category: "Processing & Support",
      features: [
        { name: "Processing Speed", starter: "Standard", growth: "5-7 days", elite: "1-2 days (Rush)" },
        { name: "Support Level", starter: "Email", growth: "Priority Email + Chat", elite: "Dedicated Onboarding Call" },
      ],
    },
  ];

  const managementComparison = [
    {
      category: "Bookkeeping",
      features: [
        { name: "Bookkeeping", starter: "Self-serve (Bank)", growth: "Full Software Suite", elite: "Dedicated Bookkeeper" },
        { name: "Bank Integration", starter: "Basic", growth: "Stripe, Shopify, PayPal", elite: "All + Custom" },
      ],
    },
    {
      category: "AI & Tax",
      features: [
        { name: "AI Chief of Staff", starter: "2 Copilots (50 queries)", growth: "4 Copilots (300 queries)", elite: "All 6 (Unlimited)" },
        { name: "Tax Services", starter: "Tax Calendar & Checklists", growth: "AI-Guided Quarterly Taxes", elite: "Managed Filing & Annual" },
      ],
    },
    {
      category: "Compliance & Mentorship",
      features: [
        { name: "Compliance", starter: "Document Vault (25 docs)", growth: "Filing Workflows", elite: "Managed + Alerts" },
        { name: "Mentorship", starter: "Pay-per-session", growth: "Group Office Hours", elite: "1:1 Mentorship (2x/mo)" },
      ],
    },
    {
      category: "Support",
      features: [
        { name: "Support Level", starter: "Email (48hr)", growth: "Email + Chat (24hr)", elite: "Priority Phone & Chat" },
      ],
    },
  ];

  const faqs = [
    { question: "What's the difference between Formation and Management plans?", answer: "Formation plans are one-time fees for creating your new US business (LLC or Corp). Management plans are monthly subscriptions for running an existing business — bookkeeping, taxes, compliance, and AI tools." },
    { question: "What's included in 'State Fees'?", answer: "State fees vary by state and are paid directly to the government for LLC formation. Most states charge between $50–$500. We'll tell you the exact amount before you pay anything. These fees are separate from Prolify's service fee." },
    { question: "Do I need to be a US citizen to use Prolify?", answer: "No. Prolify is built specifically for international founders. You don't need US citizenship, a US address, or a social security number to form a US business with us." },
    { question: "Can I switch from Formation to Management after my company is formed?", answer: "Yes. Once your company is formed, you can subscribe to any Management plan to handle ongoing bookkeeping, taxes, and compliance." },
    { question: "Can I upgrade my plan later?", answer: "Yes. You can upgrade at any time. For Management plans, we'll prorate the difference based on your billing cycle." },
    { question: "Do you offer annual discounts for Management plans?", answer: "Yes. Annual billing saves you up to 20% compared to monthly billing on all Management plans." },
    { question: "What happens if I need both Formation and Management?", answer: "Many founders start with a Formation plan to create their company, then add a Management plan for ongoing operations. You can bundle both at any time." },
  ];

  const comparisonData = selectedTab === "new" ? formationComparison : managementComparison;
  const planNames = ["Starter", "Growth", "Elite"];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <section className="relative pt-20 pb-20 px-4 bg-[#FAFAFA] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,193,7,0.08) 0%, transparent 65%)" }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60 mb-6">
            Transparent Pricing
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black mb-6">
            One Price.<br className="hidden sm:block" /> Everything Included.
          </h1>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed mb-10">
            Whether starting fresh or managing an existing business — we have you covered. No hidden fees. No surprises.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-black/8 shadow-sm text-sm font-bold text-black/70">
            <Shield className="h-4 w-4 text-[#FFC107]" />
            14-day money-back guarantee on all plans
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="w-full">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-1 p-1.5 bg-[#F5F5F5] rounded-2xl border border-black/6">
              <button
                onClick={() => setSelectedTab("new")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  selectedTab === "new" ? "bg-black text-white shadow-sm" : "text-black/50 hover:text-black"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                New Business
              </button>
              <button
                onClick={() => setSelectedTab("existing")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  selectedTab === "existing" ? "bg-black text-white shadow-sm" : "text-black/50 hover:text-black"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Existing Business
              </button>
            </div>
          </div>

          {selectedTab === "existing" && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-1 p-1 bg-[#F5F5F5] rounded-xl border border-black/6">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    billingCycle === "monthly" ? "bg-black text-white" : "text-black/50 hover:text-black"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    billingCycle === "annual" ? "bg-black text-white" : "text-black/50 hover:text-black"
                  }`}
                >
                  Annual <span className="text-green-600 ml-1">-20%</span>
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-black/40 text-xs font-medium mb-12">
            {selectedTab === "new" ? "One-time formation packages + state fees" : "Monthly subscriptions for ongoing business management"}
          </p>

          {selectedTab === "new" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-6 px-4">
              {formationPlans.map((plan) => {
                const isPopular = plan.popular;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl transition-all duration-200 ${
                      isPopular ? "bg-black shadow-xl" : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-[#FFC107] text-black text-xs font-black uppercase tracking-widest">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="p-6 pb-4">
                      <h3 className={`text-xl font-black mb-0.5 ${isPopular ? "text-white" : "text-black"}`}>{plan.name}</h3>
                      <p className={`text-xs font-medium mb-5 ${isPopular ? "text-white/45" : "text-black/45"}`}>{plan.tagline}</p>
                      <div className="flex items-baseline gap-0.5 mb-1">
                        <span className={`text-5xl font-black tracking-tighter ${isPopular ? "text-white" : "text-black"}`}>${plan.price}</span>
                      </div>
                      <p className={`text-xs font-medium ${isPopular ? "text-white/35" : "text-black/35"}`}>one-time + state fees</p>
                      <div className={`h-px w-full mt-5 ${isPopular ? "bg-white/10" : "bg-black/6"}`} />
                    </div>
                    <div className="px-6 flex-grow">
                      {plan.additionalFeatures && (
                        <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isPopular ? "text-[#FFC107]" : "text-black/35"}`}>
                          {plan.additionalFeatures}
                        </p>
                      )}
                      <ul className="space-y-2.5">
                        {plan.coreFeatures.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-[#FFC107]" : "bg-[#FFC107]/20"}`}>
                              <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                            </div>
                            <span className={`text-xs font-medium leading-snug ${isPopular ? "text-white/75" : "text-black/65"}`}>{f}</span>
                          </li>
                        ))}
                      </ul>
                      {plan.notIncluded && plan.notIncluded.length > 0 && (
                        <ul className="space-y-2 mt-3 pt-3 border-t border-black/6">
                          {plan.notIncluded.map((f) => (
                            <li key={f} className="flex items-start gap-2.5">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-white/10" : "bg-black/5"}`}>
                                <X className={`w-2.5 h-2.5 ${isPopular ? "text-white/30" : "text-black/25"}`} />
                              </div>
                              <span className={`text-xs font-medium leading-snug ${isPopular ? "text-white/30" : "text-black/30"}`}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="p-6 pt-5">
                      <Link href="/signup">
                        <button className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                          isPopular ? "bg-[#FFC107] text-black hover:bg-[#FFB300]" : "bg-black text-white hover:bg-[#FFC107] hover:text-black"
                        }`}>
                          {plan.price === 0 ? "Get Started Free" : `Choose ${plan.name}`}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-6 px-4">
              {managementPlans.map((plan) => {
                const isPopular = plan.popular;
                const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl transition-all duration-200 ${
                      isPopular ? "bg-black shadow-xl" : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-[#FFC107] text-black text-xs font-black uppercase tracking-widest">
                        </span>
                      </div>
                    )}
                    <div className="p-6 pb-4">
                      <h3 className={`text-xl font-black mb-0.5 ${isPopular ? "text-white" : "text-black"}`}>{plan.name}</h3>
                      <p className={`text-xs font-medium mb-5 ${isPopular ? "text-white/45" : "text-black/45"}`}>{plan.tagline}</p>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className={`text-5xl font-black tracking-tighter ${isPopular ? "text-white" : "text-black"}`}>${displayPrice}</span>
                        <span className={`text-sm font-bold ${isPopular ? "text-white/50" : "text-black/50"}`}>/mo</span>
                      </div>
                      {billingCycle === "annual" && plan.priceMonthly > 0 && (
                        <p className="text-xs font-semibold text-green-600">Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr</p>
                      )}
                      <div className={`h-px w-full mt-5 ${isPopular ? "bg-white/10" : "bg-black/6"}`} />
                    </div>
                    <div className="px-6 flex-grow">
                      {plan.additionalFeatures && (
                        <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isPopular ? "text-[#FFC107]" : "text-black/35"}`}>
                          {plan.additionalFeatures}
                        </p>
                      )}
                      <ul className="space-y-2.5">
                        {plan.coreFeatures.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-[#FFC107]" : "bg-[#FFC107]/20"}`}>
                              <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                            </div>
                            <span className={`text-xs font-medium leading-snug ${isPopular ? "text-white/75" : "text-black/65"}`}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 pt-5">
                      <Link href="/signup">
                        <button className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                          isPopular ? "bg-[#FFC107] text-black hover:bg-[#FFB300]" : "bg-black text-white hover:bg-[#FFC107] hover:text-black"
                        }`}>
                          {displayPrice === 0 ? "Start Free" : `Choose ${plan.name}`}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60 mb-4">
              Side by Side
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black">
              Compare {selectedTab === "new" ? "Formation" : "Management"} Plans
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-black/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-5 text-left font-black text-sm text-black/40 uppercase tracking-widest bg-black/2 w-1/4">Feature</th>
                    {planNames.map((name, i) => (
                      <th key={name} className={`px-6 py-5 text-center font-black text-sm uppercase tracking-widest ${i === 1 ? "bg-black text-white" : "bg-black/2 text-black/60"}`}>
                        <div className="mb-1">{name}</div>
                        {selectedTab === "new" ? (
                          <div className={`text-2xl font-black tracking-tighter ${i === 1 ? "text-[#FFC107]" : "text-black"}`}>
                            ${formationPlans[i]?.price ?? ""}
                          </div>
                        ) : (
                          <div className={`text-2xl font-black tracking-tighter ${i === 1 ? "text-[#FFC107]" : "text-black"}`}>
                            ${billingCycle === "annual" ? managementPlans[i]?.priceAnnual : managementPlans[i]?.priceMonthly ?? ""}
                            <span className="text-sm font-bold">/mo</span>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((category, catIndex) => (
                    <>
                      <tr key={`cat-${catIndex}`} className="bg-[#FFC107]/8">
                        <td colSpan={4} className="px-6 py-3 font-black text-xs text-black/50 uppercase tracking-widest">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featIndex) => {
                        const values = [
                          (feature as Record<string, unknown>).starter,
                          (feature as Record<string, unknown>).growth,
                          (feature as Record<string, unknown>).elite,
                        ];
                        return (
                          <tr key={`feat-${catIndex}-${featIndex}`} className="border-b border-black/5 last:border-0">
                            <td className="px-6 py-4 text-sm font-medium text-black/65">{feature.name}</td>
                            {values.map((val, vi) => (
                              <td key={vi} className={`px-6 py-4 text-center ${vi === 1 ? "bg-black/2" : ""}`}>
                                {typeof val === "boolean" ? (
                                  val ? (
                                    <div className="w-5 h-5 rounded-full bg-[#FFC107]/20 flex items-center justify-center mx-auto">
                                      <Check className="h-3 w-3 text-black" strokeWidth={3} />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                                      <X className="h-3 w-3 text-black/20" />
                                    </div>
                                  )
                                ) : (
                                  <span className="text-xs font-semibold text-black/65">{String(val)}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#FFC107]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 border border-black/20 text-xs font-bold uppercase tracking-widest text-black/70 mb-6">
              Partner Network
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">
              Unlock $5,000+ in<br className="hidden sm:block" /> Annual Savings
            </h2>
            <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
              Growth and Elite subscribers get exclusive access to VIP deals from the tools you actually use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vipPerks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div key={index} className="bg-white border border-black/8 rounded-3xl p-6 hover:border-black/20 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC107] border border-black/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-sm font-black text-black mb-2">{perk.title}</h3>
                  <p className="text-xs text-black/50 font-medium leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60 mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black">
              Common Questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-black/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-sm text-black pr-4">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-black/40 flex-shrink-0 transition-transform duration-200 ${openFAQ === index ? "rotate-180" : ""}`} />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-black/55 font-medium leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60 mb-6">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">
            Ready to Build<br className="hidden sm:block" /> Your US Business?
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed mb-10">
            Join thousands of founders who chose Prolify for transparent pricing, expert service, and everything in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-[#FFC107] hover:text-black transition-all duration-200 text-sm group">
                Start Your Business
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/formation">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC107]/10 text-black font-black rounded-2xl hover:bg-[#FFC107]/20 transition-all duration-200 text-sm border border-[#FFC107]/30">
                Learn About Formation
              </button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-black/35 font-medium">
            14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

    </main>
  );
}
