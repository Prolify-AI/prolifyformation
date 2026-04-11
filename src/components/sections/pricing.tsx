"use client";

import { useState } from "react";
import { Check, ArrowRight, X, Sparkles, Briefcase, Building2 } from "lucide-react";
import { formationPlans, managementPlans } from "@/lib/plans";

const PricingSection = () => {
  const [selectedTab, setSelectedTab] = useState<"new" | "existing">("new");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section id="pricing" className="relative py-20 md:py-32 px-4 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFC10706_1px,transparent_1px),linear-gradient(to_bottom,#FFC10706_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16 md:mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black bg-[#FFC107] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-4 w-4 text-black" />
            <span className="text-sm font-bold text-black uppercase">Transparent Pricing</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
            One Price. Everything Included. <span className="relative inline-block"><span className="relative z-10">No Surprises.</span><span className="absolute bottom-1 left-0 right-0 h-3 bg-[#FFC107] -z-0 opacity-50"></span></span>
          </h2>
          <p className="text-lg md:text-xl text-black/65 max-w-2xl mx-auto leading-relaxed font-medium">
            Whether you are starting fresh or managing an existing business, we have you covered
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setSelectedTab("new")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                selectedTab === "new"
                  ? "bg-[#FFC107] text-black shadow-sm border-2 border-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              New Business
            </button>
            <button
              onClick={() => setSelectedTab("existing")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                selectedTab === "existing"
                  ? "bg-[#FFC107] text-black shadow-sm border-2 border-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Existing Business
            </button>
          </div>
        </div>

        {selectedTab === "existing" && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#FFC107] text-black border-2 border-black"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "annual"
                    ? "bg-[#FFC107] text-black border-2 border-black"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Annual <span className="text-green-600 font-semibold ml-1">-20%</span>
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <p className="text-black/50 text-sm font-medium">
            {selectedTab === "new"
              ? "One-time formation packages + state fees"
              : "Monthly subscriptions for ongoing business management"}
          </p>
        </div>

        {selectedTab === "new" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center lg:justify-items-stretch">
            {formationPlans.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.id}
                  className={`group relative flex flex-col p-6 rounded-lg transition-all duration-300 ${
                    isPopular
                      ? "bg-[#FFC107] border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      : "bg-white border-4 border-[#FFC107] shadow-[6px_6px_0px_0px_rgba(255,193,7,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#FFC107] bg-black rounded-lg border-2 border-[#FFC107]">
                        <Sparkles className="h-3 w-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black mb-1">{plan.name}</h3>
                    <p className="text-sm text-black/70 font-medium">{plan.tagline}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-black">
                        {plan.price === 0 ? "$0" : `$${plan.price}`}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-black/60 font-medium">one-time + state fees</p>
                  </div>

                  <div className="flex-grow mb-6">
                    {plan.additionalFeatures && (
                      <h5 className="text-xs font-bold mb-3 text-black uppercase tracking-wide">
                        {plan.additionalFeatures}
                      </h5>
                    )}
                    {!plan.additionalFeatures && (
                      <h5 className="text-xs font-bold mb-3 text-black uppercase tracking-wide">
                        INCLUDED:
                      </h5>
                    )}
                    <ul className="space-y-2.5">
                      {plan.coreFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className={`mt-0.5 rounded-full p-0.5 border-2 ${isPopular ? "bg-black border-black" : "bg-[#FFC107] border-black"}`}>
                            <Check className={`h-3 w-3 flex-shrink-0 ${isPopular ? "text-[#FFC107]" : "text-black"}`} />
                          </div>
                          <span className="text-sm text-black font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <ul className="space-y-2 mt-3 pt-3 border-t border-black/10">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-full p-0.5 border-2 bg-black/10 border-black/20">
                              <X className="h-3 w-3 text-black/30 flex-shrink-0" />
                            </div>
                            <span className="text-sm text-black/40 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    className={`group/btn relative w-full flex items-center justify-center gap-2 rounded-lg font-bold text-sm py-3.5 transition-all duration-300 border-2 ${
                      isPopular
                        ? "bg-black hover:bg-white text-white hover:text-black border-black"
                        : "bg-[#FFC107] hover:bg-black text-black hover:text-white border-black"
                    }`}
                  >
                    <span className="relative z-10">{plan.price === 0 ? "Get Started Free" : `Choose ${plan.name}`}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center lg:justify-items-stretch">
            {managementPlans.map((plan) => {
              const isPopular = plan.popular;
              const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
              return (
                <div
                  key={plan.id}
                  className={`group relative flex flex-col p-6 rounded-lg transition-all duration-300 ${
                    isPopular
                      ? "bg-[#FFC107] border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      : "bg-white border-4 border-[#FFC107] shadow-[6px_6px_0px_0px_rgba(255,193,7,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,193,7,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#FFC107] bg-black rounded-lg border-2 border-[#FFC107]">
                        <Sparkles className="h-3 w-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black mb-1">{plan.name}</h3>
                    <p className="text-sm text-black/70 font-medium">{plan.tagline}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-black">
                        {displayPrice === 0 ? "$0" : `$${displayPrice}`}
                      </span>
                      <span className="text-lg font-bold text-black/70">/mo</span>
                    </div>
                    {billingCycle === "annual" && plan.priceMonthly > 0 && (
                      <p className="text-sm mt-1 text-green-700 font-semibold">
                        Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr
                      </p>
                    )}
                    {billingCycle === "monthly" && plan.priceAnnual > 0 && (
                      <p className="text-sm mt-1 text-black/50 font-medium">
                        ${plan.priceAnnual}/mo billed annually
                      </p>
                    )}
                    {displayPrice === 0 && <p className="text-sm mt-1 text-black/60 font-medium">Free forever</p>}
                  </div>

                  <div className="flex-grow mb-6">
                    {plan.additionalFeatures && (
                      <h5 className="text-xs font-bold mb-3 text-black uppercase tracking-wide">
                        {plan.additionalFeatures}
                      </h5>
                    )}
                    {!plan.additionalFeatures && (
                      <h5 className="text-xs font-bold mb-3 text-black uppercase tracking-wide">
                        INCLUDED:
                      </h5>
                    )}
                    <ul className="space-y-2.5">
                      {plan.coreFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className={`mt-0.5 rounded-full p-0.5 border-2 ${isPopular ? "bg-black border-black" : "bg-[#FFC107] border-black"}`}>
                            <Check className={`h-3 w-3 flex-shrink-0 ${isPopular ? "text-[#FFC107]" : "text-black"}`} />
                          </div>
                          <span className="text-sm text-black font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <ul className="space-y-2 mt-3 pt-3 border-t border-black/10">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-full p-0.5 border-2 bg-black/10 border-black/20">
                              <X className="h-3 w-3 text-black/30 flex-shrink-0" />
                            </div>
                            <span className="text-sm text-black/40 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    className={`group/btn relative w-full flex items-center justify-center gap-2 rounded-lg font-bold text-sm py-3.5 transition-all duration-300 border-2 ${
                      isPopular
                        ? "bg-black hover:bg-white text-white hover:text-black border-black"
                        : "bg-[#FFC107] hover:bg-black text-black hover:text-white border-black"
                    }`}
                  >
                    <span className="relative z-10">{displayPrice === 0 ? "Start Free" : `Choose ${plan.name}`}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-black/60 text-sm font-medium">
            All plans include a <span className="text-black font-bold bg-[#FFC107] px-2 py-0.5 rounded">14-day money-back guarantee</span>. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
