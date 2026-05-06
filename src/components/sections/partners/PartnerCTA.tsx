"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function PartnerCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,193,7,0.12),transparent_60%)]"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFC107]/15 text-[#b08800] rounded-full mb-10 text-xs font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-[#FFC107] rounded-full animate-pulse"></span>
          Limited partner spots available
        </span>

        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]">
          Your audience is already looking for this.
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Help them form their US company — and earn every time they do.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold text-base rounded-xl hover:bg-[#FFB300] transition-all duration-200 shadow-md hover:shadow-xl group"
          >
            Become a Partner
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="mailto:partners@prolify.co"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold text-base rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            <Mail className="w-5 h-5" />
            Talk to the team
          </a>
        </div>

        <p className="text-sm text-gray-400">
          Questions? Email{" "}
          <a href="mailto:partners@prolify.co" className="text-gray-600 font-semibold hover:text-[#b08800] transition-colors underline underline-offset-2">
            partners@prolify.co
          </a>
        </p>
      </div>
    </section>
  );
}
