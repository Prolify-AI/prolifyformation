"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const Features = () => {
  const { t } = useI18n();

  const STEPS = [
    {
      number: "01",
      title: t.features.step1Title,
      description: t.features.step1Desc,
      timeline: t.features.step1Time,
      color: "#FFC107",
    },
    {
      number: "02",
      title: t.features.step2Title,
      description: t.features.step2Desc,
      timeline: t.features.step2Time,
      color: "#FFC107",
    },
    {
      number: "03",
      title: t.features.step3Title,
      description: t.features.step3Desc,
      timeline: t.features.step3Time,
      color: "#FFC107",
    },
    {
      number: "04",
      title: t.features.step4Title,
      description: t.features.step4Desc,
      timeline: t.features.step4Time,
      color: "#FFC107",
    },
    {
      number: "05",
      title: t.features.step5Title,
      description: t.features.step5Desc,
      timeline: t.features.step5Time,
      color: "#FFC107",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 px-4 bg-[#FAFAFA] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,193,7,0.07) 0%, transparent 65%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            {t.features.howItWorks}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            {t.features.title}
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-16">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative group"
            >
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-[38px] left-[calc(50%+28px)] w-[calc(100%-16px)] h-px bg-gradient-to-r from-black/15 to-transparent z-0" />
              )}

              <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-6 flex flex-col gap-4 h-full group-hover:border-[#FFC107]/40 group-hover:shadow-md transition-all duration-200 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: "#FFC107", color: "#000" }}
                  >
                    {step.number}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-black/40">
                    <Clock className="w-3 h-3" />
                    {step.timeline}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-black text-base mb-2">{step.title}</h3>
                  <p className="text-xs text-black/55 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-3">{t.features.timelineSummaryLabel}</p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
              {t.features.timelineSummaryTitle}<br />
              <span className="text-[#FFC107]">{t.features.timelineSummaryHighlight}</span>
            </h3>
            <p className="text-white/50 text-sm font-medium max-w-md">
              {t.features.timelineSummaryNote}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFC107] text-black font-bold text-sm rounded-2xl hover:bg-[#FFB300] transition-all duration-200"
            >
              {t.features.ctaPrimary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/formation"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/20 text-white font-bold text-sm rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all duration-200"
            >
              {t.features.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
