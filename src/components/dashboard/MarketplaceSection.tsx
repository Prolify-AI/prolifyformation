"use client";

import { Store, Sparkles, ShoppingBag, Zap, Globe, Package, ArrowRight } from "lucide-react";

const UPCOMING_FEATURES = [
  { icon: ShoppingBag, label: "Vetted Partner Services" },
  { icon: Zap, label: "One-Click Integrations" },
  { icon: Globe, label: "Global Vendor Network" },
  { icon: Package, label: "Exclusive Bundle Deals" },
];

export default function MarketplaceSection() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFC107]/6 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#FFC107]/4 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-2xl shadow-[#FFC107]/30 mx-auto">
            <Store className="h-12 w-12 text-black" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-[#FFC107]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
          <span className="text-xs font-bold text-[#FFC107] uppercase tracking-widest">Coming Soon</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white mb-5 leading-none tracking-tight">
          Prolify<br />
          <span className="text-[#FFC107]">Marketplace</span>
        </h1>

        <p className="text-base md:text-lg text-black/60 dark:text-white/60 max-w-md leading-relaxed mb-10">
          We&apos;re building a curated marketplace of premium tools, services, and integrations — hand-picked to help your business grow faster.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-10">
          {UPCOMING_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#111] border-2 border-black/8 dark:border-white/8 hover:border-[#FFC107]/40 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#FFC107]" />
                </div>
                <p className="text-xs font-semibold text-black/70 dark:text-white/70 text-center leading-snug">
                  {feature.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-md p-6 rounded-2xl bg-black dark:bg-white border-2 border-black dark:border-white">
          <div className="flex items-center gap-3 mb-3">
            <ArrowRight className="h-5 w-5 text-[#FFC107]" />
            <p className="text-sm font-bold text-white dark:text-black">
              Be the first to know when we launch
            </p>
          </div>
          <p className="text-xs text-white/60 dark:text-black/60 leading-relaxed">
            We&apos;re configuring partnerships and integrations. This section will be live very soon with everything you need to scale your business.
          </p>
        </div>
      </div>
    </div>
  );
}
