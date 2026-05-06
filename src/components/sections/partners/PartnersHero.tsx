"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "$1,500", label: "Max per referral" },
  { value: "90 days", label: "Attribution window" },
  { value: "20–30%", label: "Commission rate" },
  { value: "+10%", label: "Recurring on renewals" },
  { value: "24 hrs", label: "Approval time" },
];

const partnerTypes = [
  "E-Commerce Educators",
  "CPA Firms",
  "Immigration Lawyers",
  "YouTube Creators",
  "Startup Accelerators",
  "Newsletter Operators",
  "SaaS Communities",
  "Podcast Hosts",
];

export default function PartnersHero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FFC107] rounded-full blur-[200px] opacity-15"></div>
        <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-[#FFF9E0] rounded-full blur-[150px] opacity-60"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,193,7,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,193,7,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-40 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFC107]/15 mb-10">
          <span className="w-2 h-2 bg-[#FFC107] rounded-full animate-pulse"></span>
          <span className="text-sm font-bold text-[#b08800] uppercase tracking-wide">Now accepting partner applications</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[1.05] mb-8">
          Partner with the{" "}
          <span className="relative inline-block">
            <span className="relative z-10">AI-Native OS</span>
            <span className="absolute inset-0 bg-[#FFC107] -rotate-1 rounded-lg -z-0 scale-105"></span>
          </span>{" "}
          for US Business Formation
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
          Earn up to $1,500 per referral — plus recurring commissions. Help your audience form US companies, stay compliant, and build from anywhere in the world.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold text-base rounded-xl hover:bg-[#FFB300] transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            Become a Partner
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#partner-types"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold text-base rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            See Partner Types
          </a>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-100 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="partner-types" className="relative z-10 border-t border-gray-100 bg-white py-5 overflow-hidden">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">
          Trusted by partners across every founder ecosystem
        </p>
        <div className="flex items-center gap-0 animate-partners-marquee whitespace-nowrap">
          {[...partnerTypes, ...partnerTypes].map((type, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 text-gray-500 text-sm font-semibold border-r border-gray-100 last:border-r-0">
              <span className="w-2 h-2 bg-[#FFC107] rounded-full flex-shrink-0"></span>
              {type}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes partners-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partners-marquee {
          animation: partners-marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
