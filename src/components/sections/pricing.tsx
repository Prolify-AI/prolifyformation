"use client";

import { useState } from "react";
import { Check, ArrowRight, X, Briefcase, Building2 } from "lucide-react";
import { formationPlans, managementPlans } from "@/lib/plans";
import Link from "next/link";

const PricingSection = () => {
  const [selectedTab, setSelectedTab] = useState<"new" | "existing">("new");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="relative py-24 md:py-32 px-4 bg-[#FAFAFA]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            All Plans
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            One Price. Everything<br className="hidden sm:block" /> Included.
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            Whether starting fresh or managing an existing business — we have you covered.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-black/8 shadow-sm">
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
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-black/8 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-[#FFC107] text-black"
                    : "text-black/50 hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  billingCycle === "annual"
                    ? "bg-[#FFC107] text-black"
                    : "text-black/50 hover:text-black"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full pt-6">
            {formationPlans.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl transition-all duration-200 ${
                    isPopular
                      ? "bg-[#FFC107] shadow-xl"
                      : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 pb-4">
                    <h3 className="text-lg font-black mb-0.5 text-black">
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-medium mb-4 ${isPopular ? "text-black/55" : "text-black/45"}`}>
                      {plan.tagline}
                    </p>
                    <div className="flex items-baseline gap-0.5 mb-1">
                      <span className="text-4xl font-black tracking-tighter text-black">
                        ${plan.price}
                      </span>
                    </div>
                    <p className={`text-xs font-medium ${isPopular ? "text-black/45" : "text-black/35"}`}>
                      one-time + state fees
                    </p>
                    <div className={`h-px w-full mt-5 ${isPopular ? "bg-black/15" : "bg-black/6"}`} />
                  </div>

                  <div className="px-6 flex-grow">
                    {plan.additionalFeatures && (
                      <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isPopular ? "text-black/60" : "text-black/35"}`}>
                        {plan.additionalFeatures}
                      </p>
                    )}
                    <ul className="space-y-2.5 w-full">
                      {plan.coreFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-black" : "bg-[#FFC107]/20"}`}>
                            <Check className={`w-2.5 h-2.5 ${isPopular ? "text-[#FFC107]" : "text-black"}`} strokeWidth={3} />
                          </div>
                          <span className={`text-xs font-medium leading-snug flex-1 ${isPopular ? "text-black/80" : "text-black/65"}`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <ul className="space-y-2 mt-3 pt-3 border-t border-black/10 w-full">
                        {plan.notIncluded.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-black/15" : "bg-black/5"}`}>
                              <X className={`w-2.5 h-2.5 ${isPopular ? "text-black/40" : "text-black/25"}`} />
                            </div>
                            <span className={`text-xs font-medium leading-snug flex-1 ${isPopular ? "text-black/40" : "text-black/30"}`}>
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-6 pt-5">
                    <Link href="/signup">
                      <button
                        className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
                          isPopular
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {managementPlans.map((plan) => {
              const isPopular = plan.popular;
              const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl transition-all duration-200 ${
                    isPopular
                      ? "bg-[#FFC107] shadow-xl"
                      : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 pb-4">
                    <h3 className="text-lg font-black mb-0.5 text-black">
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-medium mb-4 ${isPopular ? "text-black/55" : "text-black/45"}`}>
                      {plan.tagline}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-black tracking-tighter text-black">
                        ${displayPrice}
                      </span>
                      <span className={`text-sm font-bold ${isPopular ? "text-black/55" : "text-black/50"}`}>/mo</span>
                    </div>
                    {billingCycle === "annual" && plan.priceMonthly > 0 && (
                      <p className="text-xs font-semibold text-green-700">
                        Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr
                      </p>
                    )}
                    <div className={`h-px w-full mt-5 ${isPopular ? "bg-black/15" : "bg-black/6"}`} />
                  </div>

                  <div className="px-6 flex-grow">
                    {plan.additionalFeatures && (
                      <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isPopular ? "text-black/60" : "text-black/35"}`}>
                        {plan.additionalFeatures}
                      </p>
                    )}
                    <ul className="space-y-2.5">
                      {plan.coreFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? "bg-black" : "bg-[#FFC107]/20"}`}>
                            <Check className={`w-2.5 h-2.5 ${isPopular ? "text-[#FFC107]" : "text-black"}`} strokeWidth={3} />
                          </div>
                          <span className={`text-xs font-medium leading-snug ${isPopular ? "text-black/80" : "text-black/65"}`}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-5">
                    <Link href="/signup">
                      <button
                        className={`w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group ${
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
          <p className="text-black/50 text-sm font-medium">
            All plans include a{" "}
            <span className="text-black font-bold bg-[#FFC107] px-2 py-0.5 rounded-lg">14-day money-back guarantee</span>.
            No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
