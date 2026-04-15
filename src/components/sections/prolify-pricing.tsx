"use client";

import { useState } from "react";
import { Check, ArrowRight, Shield, Zap, Crown, Briefcase, Building2, X } from "lucide-react";
import Link from "next/link";
import { formationPlans, managementPlans } from "@/lib/plans";

const FORMATION_CONFIG: Record<string, { icon: React.ReactNode; highlight: boolean }> = {
  "formation-starter": { icon: <Shield className="w-5 h-5" />, highlight: false },
  "formation-growth": { icon: <Zap className="w-5 h-5" />, highlight: true },
  "formation-elite": { icon: <Crown className="w-5 h-5" />, highlight: false },
};

export default function ProlifyPricing() {
  const [selectedTab, setSelectedTab] = useState<"new" | "existing">("new");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section id="prolify-pricing" className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,193,7,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            Choose Your<br className="hidden sm:block" /> Package.
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            Whether starting fresh or managing an existing business — we have you covered.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1.5 bg-[#F5F5F5] rounded-2xl border border-black/6">
            <button
              onClick={() => setSelectedTab("new")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                selectedTab === "new"
                  ? "bg-[#FFC107] text-black shadow-sm"
                  : "text-black/50 hover:text-black"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              New Business
            </button>
            <button
              onClick={() => setSelectedTab("existing")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                selectedTab === "existing"
                  ? "bg-[#FFC107] text-black shadow-sm"
                  : "text-black/50 hover:text-black"
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
                  billingCycle === "monthly" ? "bg-[#FFC107] text-black" : "text-black/50 hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  billingCycle === "annual" ? "bg-[#FFC107] text-black" : "text-black/50 hover:text-black"
                }`}
              >
                Annual <span className="text-green-700 ml-1 font-semibold">-20%</span>
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-black/40 text-xs font-medium mb-10">
          {selectedTab === "new"
            ? "One-time formation packages + state fees"
            : "Monthly subscriptions for ongoing business management"}
        </p>

        {selectedTab === "new" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {formationPlans.map((plan) => {
              const config = FORMATION_CONFIG[plan.id] ?? FORMATION_CONFIG["formation-starter"];
              const isHighlight = config.highlight;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl flex flex-col transition-all duration-200 ${
                    isHighlight
                      ? "bg-[#FFC107] shadow-xl scale-[1.02]"
                      : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-7 pb-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${
                        isHighlight ? "bg-[#FFC107] text-black" : "bg-[#FFC107]/15 text-black"
                      }`}
                    >
                      {config.icon}
                    </div>

                    <h3 className="text-xl font-black mb-1 text-black">{plan.name}</h3>
                    <p className={`text-xs font-medium mb-5 ${isHighlight ? "text-black/55" : "text-black/50"}`}>
                      {plan.tagline}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter text-black">${plan.price}</span>
                      </div>
                      <p className={`text-xs font-medium mt-1 ${isHighlight ? "text-black/45" : "text-black/40"}`}>
                        one-time + state fees
                      </p>
                    </div>

                    <div className={`h-px w-full mb-5 ${isHighlight ? "bg-black/15" : "bg-black/6"}`} />
                  </div>

                  <div className="px-7 flex-grow">
                    {plan.additionalFeatures && (
                      <p className={`text-xs font-black uppercase tracking-widest mb-4 ${isHighlight ? "text-black/60" : "text-black/40"}`}>
                        {plan.additionalFeatures}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {plan.coreFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlight ? "bg-black" : "bg-[#FFC107]/20"}`}>
                            <Check className={`w-2.5 h-2.5 ${isHighlight ? "text-[#FFC107]" : "text-black"}`} strokeWidth={3} />
                          </div>
                          <span className={`text-sm font-medium leading-snug ${isHighlight ? "text-black/80" : "text-black/70"}`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <ul className="space-y-2 mt-3 pt-3 border-t border-black/10">
                        {plan.notIncluded.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlight ? "bg-black/15" : "bg-black/5"}`}>
                              <X className={`w-2.5 h-2.5 ${isHighlight ? "text-black/40" : "text-black/25"}`} />
                            </div>
                            <span className={`text-sm font-medium leading-snug ${isHighlight ? "text-black/40" : "text-black/30"}`}>
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-7 pt-6">
                    <Link href="/signup">
                      <button
                        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                          isHighlight
                            ? "bg-black text-white hover:bg-black/85"
                            : "bg-black text-white hover:bg-[#FFC107] hover:text-black"
                        }`}
                      >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {managementPlans.map((plan) => {
              const isPopular = plan.popular;
              const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl flex flex-col transition-all duration-200 ${
                    isPopular
                      ? "bg-[#FFC107] shadow-xl scale-[1.02]"
                      : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-7 pb-0">
                    <h3 className="text-xl font-black mb-1 text-black">{plan.name}</h3>
                    <p className={`text-xs font-medium mb-5 ${isPopular ? "text-black/55" : "text-black/50"}`}>
                      {plan.tagline}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter text-black">${displayPrice}</span>
                        <span className={`text-sm font-bold ${isPopular ? "text-black/55" : "text-black/50"}`}>/mo</span>
                      </div>
                      {billingCycle === "annual" && plan.priceMonthly > 0 && (
                        <p className="text-xs font-semibold text-green-700 mt-1">
                          Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr
                        </p>
                      )}
                    </div>

                    <div className={`h-px w-full mb-5 ${isPopular ? "bg-black/15" : "bg-black/6"}`} />
                  </div>

                  <div className="px-7 flex-grow">
                    {plan.additionalFeatures && (
                      <p className={`text-xs font-black uppercase tracking-widest mb-4 ${isPopular ? "text-black/60" : "text-black/40"}`}>
                        {plan.additionalFeatures}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {plan.coreFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-black" : "bg-[#FFC107]/20"}`}>
                            <Check className={`w-2.5 h-2.5 ${isPopular ? "text-[#FFC107]" : "text-black"}`} strokeWidth={3} />
                          </div>
                          <span className={`text-sm font-medium leading-snug ${isPopular ? "text-black/80" : "text-black/70"}`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-7 pt-6">
                    <Link href="/signup">
                      <button
                        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                          isPopular
                            ? "bg-black text-white hover:bg-black/85"
                            : "bg-black text-white hover:bg-[#FFC107] hover:text-black"
                        }`}
                      >
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

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-black/60 hover:text-black transition-colors"
          >
            View full pricing details
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-black/40 font-medium mt-3">
            14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
