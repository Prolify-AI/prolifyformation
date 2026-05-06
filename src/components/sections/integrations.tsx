"use client";

import { useState } from "react";
import { ArrowRight, Building2, CreditCard, BookOpen, FileText, ChartBar as BarChart2 } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

const IntegrationsSection = () => {
  const { t } = useI18n();

  const SERVICES = [
    {
      id: "formation",
      icon: Building2,
      color: "#FFC107",
      label: t.integrations.s1label,
      headline: t.integrations.s1headline,
      description: t.integrations.s1desc,
      features: [t.integrations.s1f1, t.integrations.s1f2, t.integrations.s1f3, t.integrations.s1f4],
      cta: t.integrations.s1cta,
      href: "/formation",
    },
    {
      id: "banking",
      icon: CreditCard,
      color: "#22C55E",
      label: t.integrations.s2label,
      headline: t.integrations.s2headline,
      description: t.integrations.s2desc,
      features: [t.integrations.s2f1, t.integrations.s2f2, t.integrations.s2f3, t.integrations.s2f4],
      cta: t.integrations.s2cta,
      href: "/banking-guidance",
    },
    {
      id: "bookkeeping",
      icon: BookOpen,
      color: "#3B82F6",
      label: t.integrations.s3label,
      headline: t.integrations.s3headline,
      description: t.integrations.s3desc,
      features: [t.integrations.s3f1, t.integrations.s3f2, t.integrations.s3f3, t.integrations.s3f4],
      cta: t.integrations.s3cta,
      href: "/bookkeeping",
    },
    {
      id: "taxes",
      icon: FileText,
      color: "#10B981",
      label: t.integrations.s4label,
      headline: t.integrations.s4headline,
      description: t.integrations.s4desc,
      features: [t.integrations.s4f1, t.integrations.s4f2, t.integrations.s4f3, t.integrations.s4f4],
      cta: t.integrations.s4cta,
      href: "/taxes",
    },
    {
      id: "analytics",
      icon: BarChart2,
      color: "#F59E0B",
      label: t.integrations.s5label,
      headline: t.integrations.s5headline,
      description: t.integrations.s5desc,
      features: [t.integrations.s5f1, t.integrations.s5f2, t.integrations.s5f3, t.integrations.s5f4],
      cta: t.integrations.s5cta,
      href: "/analytics",
    },
  ];

  const [activeId, setActiveId] = useState("formation");
  const active = SERVICES.find((s) => s.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section id="integrations" className="py-24 md:py-32 px-4 bg-[#FAFAFA] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            {t.integrations.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            {t.integrations.title}
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            {t.integrations.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${
                  isActive
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-black/60 border-black/10 hover:border-black/30 hover:text-black"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl border border-black/8 shadow-sm p-10 flex flex-col">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
              style={{ background: `${active.color}20` }}
            >
              <ActiveIcon className="w-7 h-7" style={{ color: active.color }} />
            </div>

            <span
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: active.color }}
            >
              {active.label}
            </span>

            <h3 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight mb-4">
              {active.headline}
            </h3>

            <p className="text-base text-black/60 leading-relaxed font-medium mb-8">
              {active.description}
            </p>

            <ul className="space-y-3 mb-10 flex-grow">
              {active.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${active.color}20` }}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke={active.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-black/75">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={active.href}
              className="group inline-flex items-center gap-2 font-bold text-sm text-black hover:text-black/70 transition-colors mt-auto"
            >
              {active.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {SERVICES.filter((s) => s.id !== activeId).map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="group bg-white rounded-2xl border border-black/8 hover:border-black/20 shadow-sm hover:shadow-md p-6 text-left transition-all duration-200 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-black text-sm mb-0.5">{s.label}</div>
                    <div className="text-xs text-black/50 font-medium truncate">{s.headline}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-black/50 flex-shrink-0 mt-0.5 transition-all group-hover:translate-x-0.5" />
                </button>
              );
            })}

            <div className="bg-black rounded-2xl p-6 mt-2">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{t.integrations.prolifyPromiseBadge}</p>
              <p className="text-white font-bold text-base leading-snug mb-4">
                {t.integrations.prolifyPromiseText}
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFC107] text-black text-sm font-bold rounded-xl hover:bg-[#FFB300] transition-colors"
              >
                {t.integrations.getStartedFree}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
