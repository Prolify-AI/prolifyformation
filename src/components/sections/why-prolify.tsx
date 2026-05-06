"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const LOGOS = [
  "Shopify", "Amazon", "Stripe", "QuickBooks", "Mercury", "Relay",
];

const WhyProlify = () => {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const TESTIMONIALS = [
    {
      quote: t.whyProlify.t1quote,
      name: t.whyProlify.t1name,
      title: t.whyProlify.t1title,
      country: t.whyProlify.t1country,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    {
      quote: t.whyProlify.t2quote,
      name: t.whyProlify.t2name,
      title: t.whyProlify.t2title,
      country: t.whyProlify.t2country,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      quote: t.whyProlify.t3quote,
      name: t.whyProlify.t3name,
      title: t.whyProlify.t3title,
      country: t.whyProlify.t3country,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
    {
      quote: t.whyProlify.t4quote,
      name: t.whyProlify.t4name,
      title: t.whyProlify.t4title,
      country: t.whyProlify.t4country,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
  ];

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  }, [TESTIMONIALS.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const testimonial = TESTIMONIALS[active];

  return (
    <section className="py-24 md:py-32 px-4 bg-[#FFFDF5] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,193,7,0.12) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/20 border border-[#FFC107]/50 text-xs font-bold uppercase tracking-widest text-black/70">
            {t.whyProlify.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            {t.whyProlify.title}
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            {t.whyProlify.subtitle}
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="bg-white border border-[#FFC107]/30 rounded-3xl p-8 md:p-12 relative shadow-sm">
            <Quote className="absolute top-8 left-8 w-8 h-8 text-[#FFC107]/50" />

            <blockquote className="text-xl md:text-2xl font-bold text-black leading-relaxed mb-8 pt-6">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC107]/60"
              />
              <div>
                <div className="font-bold text-black text-sm">{testimonial.name}</div>
                <div className="text-black/50 text-xs font-medium">{testimonial.title} · {testimonial.country}</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-7 h-2.5 bg-[#FFC107]"
                    : "w-2.5 h-2.5 bg-black/15 hover:bg-black/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-black/8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-black/35 mb-8">
            {t.whyProlify.integratesWith}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-sm font-bold text-black/30 hover:text-black/60 transition-colors cursor-default tracking-wide"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold text-sm rounded-2xl hover:bg-[#FFC107] hover:text-black transition-all duration-200 hover:shadow-lg"
          >
            {t.whyProlify.joinFounders}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyProlify;
