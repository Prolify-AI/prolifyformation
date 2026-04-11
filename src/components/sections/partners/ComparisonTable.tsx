"use client";

import { Check, X } from "lucide-react";

const features = [
  {
    label: "Commission rate",
    prolify: { text: "20–30%", highlight: true },
    doola: { text: "15%" },
    firstbase: { text: "10% / $40" },
    legalzoom: { text: "15%" },
  },
  {
    label: "Recurring commissions",
    prolify: { text: "Yes (10–15%)", check: true, highlight: true },
    doola: { text: "VIP only" },
    firstbase: { text: "No", cross: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "Attribution window",
    prolify: { text: "90 days", highlight: true },
    doola: { text: "60 days" },
    firstbase: { text: "Not disclosed" },
    legalzoom: { text: "30 days" },
  },
  {
    label: "CPA / Lawyer partner track",
    prolify: { text: "Dedicated track", check: true, highlight: true },
    doola: { text: "No", cross: true },
    firstbase: { text: "No", cross: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "Accelerator partner track",
    prolify: { text: "Dedicated track", check: true, highlight: true },
    doola: { text: "No", cross: true },
    firstbase: { text: "No", cross: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "White-label / reseller",
    prolify: { text: "Yes", check: true, highlight: true },
    doola: { text: "No", cross: true },
    firstbase: { text: "Yes", check: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "Co-marketing budget",
    prolify: { text: "Up to $2K/qtr", check: true, highlight: true },
    doola: { text: "Qualified only", check: true },
    firstbase: { text: "No", cross: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "Custom landing pages",
    prolify: { text: "Pro + Elite", check: true, highlight: true },
    doola: { text: "Qualified only", check: true },
    firstbase: { text: "No", cross: true },
    legalzoom: { text: "No", cross: true },
  },
  {
    label: "International focus",
    prolify: { text: "Core positioning", check: true, highlight: true },
    doola: { text: "Limited" },
    firstbase: { text: "Limited" },
    legalzoom: { text: "No", cross: true },
  },
];

type CellValue = {
  text: string;
  check?: boolean;
  cross?: boolean;
  highlight?: boolean;
};

function Cell({ val, isProlify = false }: { val: CellValue; isProlify?: boolean }) {
  if (val.check) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold text-sm ${isProlify ? "text-gray-900" : "text-gray-600"}`}>
        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isProlify ? "bg-[#FFC107]" : "bg-green-100"}`}>
          <Check className={`w-2.5 h-2.5 ${isProlify ? "text-gray-900" : "text-green-600"}`} strokeWidth={3} />
        </span>
        {val.text}
      </span>
    );
  }
  if (val.cross) {
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-300 font-semibold text-sm">
        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
          <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
        </span>
        {val.text}
      </span>
    );
  }
  return (
    <span className={`font-semibold text-sm ${isProlify ? "text-gray-900 font-bold" : "text-gray-400"}`}>
      {val.text}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,193,7,0.08),transparent_50%)]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFC107]/15 text-[#b08800] text-xs font-bold uppercase tracking-widest mb-5">
            Why Prolify
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-5">
            The partner program that actually pays
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See how Prolify stacks up against every other business formation affiliate program.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 shadow-xl shadow-gray-100 overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr]">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <span className="text-gray-400 font-bold text-sm">Feature</span>
            </div>
            <div className="px-6 py-4 bg-[#FFC107] border-b border-l border-gray-200">
              <span className="text-gray-900 font-black text-sm">Prolify</span>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-l border-gray-200">
              <span className="text-gray-400 font-semibold text-sm">doola</span>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-l border-gray-200">
              <span className="text-gray-400 font-semibold text-sm">Firstbase</span>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-l border-gray-200">
              <span className="text-gray-400 font-semibold text-sm">LegalZoom</span>
            </div>
          </div>

          {features.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1.5fr] ${i < features.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="px-6 py-4 text-gray-600 text-sm font-medium bg-white">{row.label}</div>
              <div className="px-6 py-4 border-l border-gray-100 bg-[#FFFDF0]">
                <Cell val={row.prolify} isProlify />
              </div>
              <div className="px-6 py-4 border-l border-gray-100 bg-white">
                <Cell val={row.doola} />
              </div>
              <div className="px-6 py-4 border-l border-gray-100 bg-white">
                <Cell val={row.firstbase} />
              </div>
              <div className="px-6 py-4 border-l border-gray-100 bg-white">
                <Cell val={row.legalzoom} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
