"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

const FAQSection = () => {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: t.faq.q1, answer: t.faq.a1 },
    { question: t.faq.q2, answer: t.faq.a2 },
    { question: t.faq.q3, answer: t.faq.a3 },
    { question: t.faq.q4, answer: t.faq.a4 },
    { question: t.faq.q5, answer: t.faq.a5 },
    { question: t.faq.q6, answer: t.faq.a6 },
    { question: t.faq.q7, answer: t.faq.a7 },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 px-4 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 60%)" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            {t.faq.commonQuestions}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            {t.faq.title}
          </h2>
          <p className="text-lg text-black/55 font-medium leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-3 mb-14">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#FFC107]/40 bg-[#FFFDF5] shadow-sm"
                    : "border-black/8 bg-white hover:border-black/15"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                        isOpen ? "bg-[#FFC107] text-black" : "bg-black/5 text-black/50"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-black leading-snug">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-black/40 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-black/70" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pl-[calc(1.5rem+1.75rem+1rem)]">
                    <p className="text-sm text-black/65 leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-black rounded-3xl p-8 md:p-10 text-center">
          <p className="text-[#FFC107] text-xs font-bold uppercase tracking-widest mb-3">{t.faq.stillHaveQuestions}</p>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
            {t.faq.talkToTeam}
          </h3>
          <p className="text-white/50 text-sm font-medium mb-6 max-w-sm mx-auto">
            {t.faq.teamDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFC107] text-black font-bold text-sm rounded-2xl hover:bg-[#FFB300] transition-all duration-200"
            >
              {t.faq.getStartedFree}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/20 text-white font-bold text-sm rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all duration-200"
            >
              {t.faq.meetTheTeam}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
