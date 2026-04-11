"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Check, X, ArrowRight, Sparkles, Shield, DollarSign, TrendingUp, Zap, ChevronDown, Building2, Briefcase } from "lucide-react";
import { formationPlans, managementPlans } from "@/lib/plans";

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState<"new" | "existing">("new");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [showAllFAQs, setShowAllFAQs] = useState(false);

  const vipPerks = [
    {
      icon: DollarSign,
      title: "$5,000+ in Annual Savings",
      description: "Save thousands with exclusive discounts on Stripe, AWS, Shopify, and more.",
    },
    {
      icon: Sparkles,
      title: "Premium Partner Perks",
      description: "Waived fees, extended trials, and founder-only pricing from 50+ partners.",
    },
    {
      icon: Zap,
      title: "Priority Expert Help",
      description: "Jump the queue with dedicated support from our tax, legal, and compliance teams.",
    },
    {
      icon: TrendingUp,
      title: "Powerful Business Tools",
      description: "Pre-negotiated deals on payment processing, hosting, marketing, and operations tools.",
    },
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
    {
      question: "What's the difference between Formation and Management plans?",
      answer: "Formation plans are one-time fees for creating your new US business (LLC or Corp). Management plans are monthly subscriptions for running an existing business -- bookkeeping, taxes, compliance, and AI tools.",
    },
    {
      question: "What's included in 'State Fees'?",
      answer: "State fees vary by state and are paid directly to the government for LLC formation. Most states charge between $50-$500. We'll tell you the exact amount before you pay anything. These fees are separate from Prolify's service fee.",
    },
    {
      question: "Do I need to be a US citizen to use Prolify?",
      answer: "No. Prolify is built specifically for international founders. You don't need US citizenship, a US address, or a social security number to form a US business with us.",
    },
    {
      question: "Can I switch from Formation to Management after my company is formed?",
      answer: "Yes. Once your company is formed, you can subscribe to any Management plan to handle ongoing bookkeeping, taxes, and compliance.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes. You can upgrade at any time. For Management plans, we'll prorate the difference based on your billing cycle.",
    },
    {
      question: "Do you offer annual discounts for Management plans?",
      answer: "Yes. Annual billing saves you up to 20% compared to monthly billing on all Management plans.",
    },
    {
      question: "What happens if I need both Formation and Management?",
      answer: "Many founders start with a Formation plan to create their company, then add a Management plan for ongoing operations. You can bundle both at any time.",
    },
  ];

  const displayedFAQs = showAllFAQs ? faqs : faqs.slice(0, 4);

  const comparisonData = selectedTab === "new" ? formationComparison : managementComparison;
  const planNames = ["Starter", "Growth", "Elite"];

  return (
    <main className="min-h-screen flex flex-col bg-white pt-24">
      <section className="bg-yellow-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-200 mb-6">
            <Shield className="h-5 w-5 text-black" />
            <span className="text-sm font-semibold text-black">100% Money-Back Guarantee</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
            Perfect Formation or Your Money Back
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            We know how critical it is to get your US business formed correctly. If there is an error in your formation paperwork due to our service, we will refund that portion of your payment -- no questions asked.
          </p>
          <a href="#" className="text-black hover:text-gray-700 font-semibold inline-flex items-center gap-1 transition-colors">
            See Full Terms <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button
                onClick={() => setSelectedTab("new")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === "new"
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Starting a New Business
              </button>
              <button
                onClick={() => setSelectedTab("existing")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === "existing"
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Building2 className="h-4 w-4" />
                I Have an Existing Business
              </button>
            </div>
          </div>

          {selectedTab === "existing" && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === "annual"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  Annual <span className="text-green-600 font-semibold ml-1">Save 20%</span>
                </button>
              </div>
            </div>
          )}

          {selectedTab === "new" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {formationPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col p-6 rounded-2xl transition-all hover:scale-[1.02] ${
                    plan.popular
                      ? "bg-yellow-100 border-2 border-yellow-400 shadow-xl"
                      : "bg-white border-2 border-gray-200 hover:border-yellow-400"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-black bg-yellow-400 rounded-full shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-black mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{plan.tagline}</p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black text-black">
                        {plan.price === 0 ? "$0" : `$${plan.price}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">One-time + State Fees</p>
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all mb-5 ${
                      plan.popular
                        ? "bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {plan.price === 0 ? "Get Started Free" : "Get Started"} <ArrowRight className="inline h-4 w-4 ml-1" />
                  </button>

                  <div className="space-y-2.5 flex-grow mb-4">
                    <h4 className="text-xs font-bold text-black uppercase tracking-wide">Included:</h4>
                    {plan.coreFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <div className="space-y-2 border-t border-gray-200 pt-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Not included:</h4>
                      {plan.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <X className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {managementPlans.map((plan) => {
                const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col p-6 rounded-2xl transition-all hover:scale-[1.02] ${
                      plan.popular
                        ? "bg-yellow-100 border-2 border-yellow-400 shadow-xl"
                        : "bg-white border-2 border-gray-200 hover:border-yellow-400"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-black bg-yellow-400 rounded-full shadow-lg">
                          <Sparkles className="h-3 w-3" />
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-black mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{plan.tagline}</p>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-4xl font-black text-black">
                          {displayPrice === 0 ? "$0" : `$${displayPrice}`}
                        </span>
                        <span className="text-gray-500 text-sm">/mo</span>
                      </div>
                      {billingCycle === "annual" && plan.priceMonthly > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr vs monthly
                        </p>
                      )}
                      {billingCycle === "monthly" && plan.priceAnnual > 0 && (
                        <p className="text-sm text-gray-400">
                          ${plan.priceAnnual}/mo billed annually
                        </p>
                      )}
                    </div>

                    <button
                      className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all mb-5 ${
                        plan.popular
                          ? "bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-lg"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {displayPrice === 0 ? "Start Free" : "Subscribe"} <ArrowRight className="inline h-4 w-4 ml-1" />
                    </button>

                    <div className="space-y-2.5 flex-grow mb-4">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                        {plan.additionalFeatures || "Included:"}
                      </h4>
                      {plan.coreFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <div className="space-y-2 border-t border-gray-200 pt-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Not included:</h4>
                        {plan.notIncluded.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <X className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Unlock $100K+ in Premium Perks with <br />
              <span className="text-yellow-400">Prolify Partner Network</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Growth and Elite subscribers get exclusive access to VIP deals from the business tools you will actually use.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 hover:shadow-lg transition-all">
              Explore Partner Perks <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipPerks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-yellow-400 transition-all hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Compare {selectedTab === "new" ? "Formation" : "Management"} Plans
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-6 py-4 text-left font-bold">Feature</th>
                    {planNames.map((name, i) => (
                      <th
                        key={name}
                        className={`px-6 py-4 text-center font-bold ${i === 1 ? "bg-yellow-400 text-black" : ""}`}
                      >
                        <div className="mb-1">{name}</div>
                        {selectedTab === "new" ? (
                          <>
                            <div className="text-xl font-black">
                              {formationPlans[i]?.price === 0 ? "$0" : `$${formationPlans[i]?.price ?? ""}`}
                            </div>
                            <div className={`text-xs ${i === 1 ? "text-black/70" : "text-gray-300"}`}>one-time</div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-black">
                              {managementPlans[i]?.priceMonthly === 0
                                ? "$0"
                                : billingCycle === "annual"
                                ? `$${managementPlans[i]?.priceAnnual ?? ""}`
                                : `$${managementPlans[i]?.priceMonthly ?? ""}`}
                            </div>
                            <div className={`text-xs ${i === 1 ? "text-black/70" : "text-gray-300"}`}>/mo</div>
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((category, catIndex) => (
                    <>
                      <tr key={`cat-${catIndex}`} className="bg-gray-100">
                        <td colSpan={4} className="px-6 py-3 font-bold text-black text-sm uppercase tracking-wide">
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
                          <tr key={`feat-${catIndex}-${featIndex}`} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-sm text-gray-700">{feature.name}</td>
                            {values.map((val, vi) => (
                              <td key={vi} className={`px-6 py-4 text-center ${vi === 1 ? "bg-yellow-50" : ""}`}>
                                {typeof val === "boolean" ? (
                                  val ? (
                                    <Check className="h-5 w-5 text-black mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-gray-300 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-sm font-semibold text-gray-700">{String(val)}</span>
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

      <section className="py-20 px-4 bg-yellow-400">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
            The Best Value for International Founders
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto mb-8 leading-relaxed">
            Whether you need basic formation or complete business operations, Prolify delivers more features and better support than competitors -- at a transparent, honest price.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-lg shadow-xl">
            Compare Prolify vs Others <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
              Pricing FAQs
            </h2>
          </div>

          <div className="space-y-6">
            {displayedFAQs.map((faq, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-all">
                <h3 className="text-lg font-bold text-black mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {faqs.length > 4 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllFAQs(!showAllFAQs)}
                className="inline-flex items-center gap-2 text-black hover:text-gray-700 font-semibold transition-colors"
              >
                {showAllFAQs ? "Show Less" : "Show More"}
                <ChevronDown className={`h-5 w-5 transition-transform ${showAllFAQs ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Less Confusion. More Growth.
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join Prolify and launch your US business with confidence. Complete formation, compliant operations, and ongoing support -- all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 hover:shadow-lg transition-all text-lg">
              Start Your Business <ArrowRight className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all text-lg">
              Book a Free Demo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
