"use client";

import { Check, ArrowRight, Shield, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { formationPlans } from "@/lib/plans";

const PLAN_CONFIG: Record<string, { icon: React.ReactNode; highlight: boolean }> = {
  "formation-starter": { icon: <Shield className="w-5 h-5" />, highlight: false },
  "formation-growth": { icon: <Zap className="w-5 h-5" />, highlight: true },
  "formation-elite": { icon: <Crown className="w-5 h-5" />, highlight: false },
};

export default function ProlifyPricing() {
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
            Choose Your<br className="hidden sm:block" /> Formation Package.
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            One-time fee. No subscriptions for formation. State fees are paid directly to the government.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {formationPlans.map((plan) => {
            const config = PLAN_CONFIG[plan.id] ?? PLAN_CONFIG["formation-starter"];
            const isHighlight = config.highlight;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col transition-all duration-200 ${
                  isHighlight
                    ? "bg-black text-white shadow-xl scale-[1.02]"
                    : "bg-white border border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-[#FFC107] text-black text-xs font-black uppercase tracking-widest shadow-sm">
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

                  <h3 className={`text-xl font-black mb-1 ${isHighlight ? "text-white" : "text-black"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-medium mb-5 ${isHighlight ? "text-white/50" : "text-black/50"}`}>
                    {plan.tagline}
                  </p>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black tracking-tighter ${isHighlight ? "text-white" : "text-black"}`}>
                        ${plan.price}
                      </span>
                    </div>
                    <p className={`text-xs font-medium mt-1 ${isHighlight ? "text-white/40" : "text-black/40"}`}>
                      one-time + state fees
                    </p>
                  </div>

                  <div className={`h-px w-full mb-5 ${isHighlight ? "bg-white/10" : "bg-black/6"}`} />
                </div>

                <div className="px-7 flex-grow">
                  {plan.additionalFeatures && (
                    <p className={`text-xs font-black uppercase tracking-widest mb-4 ${isHighlight ? "text-[#FFC107]" : "text-black/40"}`}>
                      {plan.additionalFeatures}
                    </p>
                  )}
                  <ul className="space-y-3">
                    {plan.coreFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isHighlight ? "bg-[#FFC107]" : "bg-[#FFC107]/20"
                          }`}
                        >
                          <Check className={`w-2.5 h-2.5 ${isHighlight ? "text-black" : "text-black"}`} strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium leading-snug ${isHighlight ? "text-white/80" : "text-black/70"}`}>
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
                        isHighlight
                          ? "bg-[#FFC107] text-black hover:bg-[#FFB300]"
                          : "bg-black text-white hover:bg-[#FFC107] hover:text-black"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-bold text-black/60 hover:text-black transition-colors"
          >
            View all plans including ongoing management plans
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
