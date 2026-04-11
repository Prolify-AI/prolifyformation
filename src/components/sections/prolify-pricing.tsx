"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, ArrowRight, Shield, Clock, Zap, Crown, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formationPlans, FormationPlan } from "@/lib/plans";

const planIcons: Record<string, React.ReactNode> = {
  rocket: <Rocket className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  crown: <Crown className="w-6 h-6" />,
};

const planAccents: Record<string, { bg: string; badge: string; ring: string }> = {
  "formation-starter": {
    bg: "bg-white",
    badge: "bg-gray-100 text-gray-700 border-gray-300",
    ring: "border-black",
  },
  "formation-growth": {
    bg: "bg-[#FFC107]",
    badge: "bg-black text-[#FFC107] border-black",
    ring: "border-black",
  },
  "formation-elite": {
    bg: "bg-black",
    badge: "bg-[#FFC107] text-black border-[#FFC107]",
    ring: "border-[#FFC107]",
  },
};

function PlanCard({ plan, isActive }: { plan: FormationPlan; isActive: boolean }) {
  const accent = planAccents[plan.id] ?? planAccents["formation-starter"];
  const isGrowth = plan.id === "formation-growth";
  const isElite = plan.id === "formation-elite";
  const textColor = isElite ? "text-white" : "text-black";
  const mutedColor = isElite ? "text-white/60" : "text-black/60";
  const checkBg = isGrowth ? "bg-black" : isElite ? "bg-[#FFC107]" : "bg-[#FFC107]";
  const checkColor = isGrowth ? "text-[#FFC107]" : "text-black";
  const dividerColor = isElite ? "border-white/20" : "border-black/10";
  const ctaBg = isElite
    ? "bg-[#FFC107] hover:bg-white text-black"
    : isGrowth
    ? "bg-black hover:bg-white text-white hover:text-black border-2 border-black"
    : "bg-black hover:bg-[#FFC107] text-white hover:text-black border-2 border-black";

  return (
    <div
      className={[
        "relative rounded-none border-2 p-8 md:p-10 flex flex-col transition-all duration-700 w-full",
        accent.bg,
        accent.ring,
        isActive
          ? "opacity-100 scale-100 translate-y-0 shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
          : "opacity-0 scale-95 translate-y-6 shadow-none pointer-events-none",
      ].join(" ")}
      style={{ minHeight: 520 }}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-none border-2 text-xs font-black uppercase tracking-widest shadow-md ${accent.badge}`}>
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-3 ${textColor}`}>
          <div className={`w-11 h-11 rounded-none flex items-center justify-center border-2 ${isElite ? "bg-[#FFC107] border-[#FFC107] text-black" : isGrowth ? "bg-[#FFC107] border-[#FFC107] text-black" : "bg-[#FFC107] border-black text-black"}`}>
            {planIcons[plan.icon]}
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${mutedColor}`}>Formation</p>
            <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
          </div>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-6 ${mutedColor}`}>{plan.tagline}</p>

      <div className={`pb-6 mb-6 border-b-2 ${dividerColor}`}>
        <div className="flex items-end gap-1">
          <span className={`text-2xl font-bold mt-2 ${textColor}`}>$</span>
          <span className={`text-7xl font-black tracking-tighter leading-none ${textColor}`}>{plan.price}</span>
        </div>
        <p className={`text-sm font-semibold mt-1 ${mutedColor}`}>one-time + state fees</p>
        <div className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${mutedColor}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{plan.processingSpeed}</span>
        </div>
      </div>

      {plan.additionalFeatures && (
        <p className={`text-xs font-black uppercase tracking-widest mb-3 ${mutedColor}`}>{plan.additionalFeatures}</p>
      )}

      <ul className="space-y-3 flex-grow mb-8">
        {plan.coreFeatures.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${checkBg}`}>
              <Check className={`w-3 h-3 ${checkColor}`} strokeWidth={3} />
            </div>
            <span className={`text-sm font-medium leading-snug ${textColor}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/signup">
        <button
          className={`w-full font-black text-sm py-4 px-6 rounded-none transition-all duration-300 flex items-center justify-center gap-2 group ${ctaBg}`}
        >
          Get Started
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Link>
    </div>
  );
}

export default function ProlifyPricing() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = formationPlans.length;

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + total) % total);
  }, [total]);

  const startAuto = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3500);
  }, [total]);

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isAutoPlaying) startAuto();
    return stopAuto;
  }, [isAutoPlaying, startAuto]);

  const handleManualNav = (index: number) => {
    setIsAutoPlaying(false);
    stopAuto();
    goTo(index);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  return (
    <section id="prolify-pricing" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,193,7,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,193,7,0.08)_0%,transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC107]/10 border-2 border-[#FFC107] mb-6">
            <Shield className="w-4 h-4 text-black" />
            <span className="text-sm font-semibold text-black">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight">
            Formation Packages
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Choose the right formation package for your needs. From self-serve filing to rush processing with dedicated support.
          </p>
        </div>

        <div className="max-w-xl mx-auto relative">
          <div className="relative overflow-hidden" style={{ minHeight: 560 }}>
            {formationPlans.map((plan, i) => (
              <div
                key={plan.id}
                className="absolute inset-0 transition-all duration-700"
                style={{ zIndex: i === activeIndex ? 10 : 0 }}
              >
                <div
                  className="animate-float"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    animationPlayState: i === activeIndex ? "running" : "paused",
                  }}
                >
                  <PlanCard plan={plan} isActive={i === activeIndex} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handleManualNav(activeIndex - 1)}
              className="w-10 h-10 rounded-none border-2 border-black flex items-center justify-center hover:bg-[#FFC107] transition-colors duration-200"
              aria-label="Previous plan"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {formationPlans.map((plan, i) => (
                <button
                  key={plan.id}
                  onClick={() => handleManualNav(i)}
                  className={`transition-all duration-300 rounded-none border-2 border-black ${
                    i === activeIndex
                      ? "w-8 h-3 bg-[#FFC107]"
                      : "w-3 h-3 bg-white hover:bg-[#FFC107]/40"
                  }`}
                  aria-label={`Go to ${plan.name} plan`}
                />
              ))}
            </div>

            <button
              onClick={() => handleManualNav(activeIndex + 1)}
              className="w-10 h-10 rounded-none border-2 border-black flex items-center justify-center hover:bg-[#FFC107] transition-colors duration-200"
              aria-label="Next plan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            {formationPlans.map((plan, i) => (
              <button
                key={plan.id}
                onClick={() => handleManualNav(i)}
                className={`text-sm font-black uppercase tracking-wide transition-all duration-300 pb-1 ${
                  i === activeIndex
                    ? "text-black border-b-2 border-[#FFC107]"
                    : "text-black/40 hover:text-black/70 border-b-2 border-transparent"
                }`}
              >
                {plan.name} — ${plan.price}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-10 text-center">
          <Link href="/pricing">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-sm rounded-none border-2 border-black hover:bg-[#FFC107] hover:text-black transition-all duration-300 group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
              View All Plans & Compare
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            State fees vary by state and are paid directly to the government.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
