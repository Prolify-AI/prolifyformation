"use client";

import { useState } from "react";

const examples = [
  {
    icon: "✉",
    label: "Newsletter (5K subscribers)",
    sub: "One monthly feature, 5% conversion",
    earning: "~$1,200/mo",
  },
  {
    icon: "▶",
    label: "YouTube (50K subscribers)",
    sub: "One dedicated video, 4% conversion",
    earning: "~$4,800/mo",
  },
  {
    icon: "📊",
    label: "CPA Firm (500 clients)",
    sub: "Professional referral, 35% conversion",
    earning: "~$6,100/mo",
  },
  {
    icon: "🚀",
    label: "Accelerator (200 founders/cohort)",
    sub: "Cohort recommendation, 60% conversion",
    earning: "~$14,400/mo",
  },
];

export default function EarningsCalculator() {
  const [audience, setAudience] = useState(10000);
  const [conversionRate, setConversionRate] = useState(5);
  const [commission, setCommission] = useState(120);

  const referrals = Math.round((audience * conversionRate) / 100);
  const conversions = Math.round(referrals * 0.05);
  const monthlyEarnings = conversions * commission;
  const renewalIncome = Math.round(monthlyEarnings * 0.12);

  const formatNum = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n}`;

  return (
    <section className="py-24 bg-[#FFF9E0] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,193,7,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,193,7,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black text-black uppercase tracking-[0.15em]">Earnings Calculator</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-5">
              See what you could earn
            </h2>
            <p className="text-black/60 text-lg leading-relaxed mb-10 font-medium">
              Adjust the sliders to estimate your monthly earnings based on your audience size and conversion rate. Top partners earn $10,000+ per month.
            </p>

            <div className="space-y-3">
              {examples.map((ex, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{ex.icon}</span>
                    <div>
                      <div className="text-black font-black text-sm">{ex.label}</div>
                      <div className="text-black/45 text-xs">{ex.sub}</div>
                    </div>
                  </div>
                  <span className="text-black font-black text-base whitespace-nowrap bg-[#FFC107] px-3 py-1 rounded-lg border-2 border-black">{ex.earning}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-7 rounded-2xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-7">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-black/70 text-sm font-bold">Audience / Reach Size</span>
                  <span className="text-black font-black text-sm bg-[#FFF9E0] px-3 py-1 rounded-lg border-2 border-black">{audience.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={500000}
                  step={500}
                  value={audience}
                  onChange={(e) => setAudience(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer calc-slider"
                  style={{
                    background: `linear-gradient(to right, #FFC107 0%, #FFC107 ${(audience / 500000) * 100}%, #e5e5e5 ${(audience / 500000) * 100}%, #e5e5e5 100%)`,
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-black/70 text-sm font-bold">Estimated Conversion Rate (%)</span>
                  <span className="text-black font-black text-sm bg-[#FFF9E0] px-3 py-1 rounded-lg border-2 border-black">{conversionRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer calc-slider"
                  style={{
                    background: `linear-gradient(to right, #FFC107 0%, #FFC107 ${(conversionRate / 50) * 100}%, #e5e5e5 ${(conversionRate / 50) * 100}%, #e5e5e5 100%)`,
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-black/70 text-sm font-bold">Average Commission per Referral ($)</span>
                  <span className="text-black font-black text-sm bg-[#FFF9E0] px-3 py-1 rounded-lg border-2 border-black">${commission}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer calc-slider"
                  style={{
                    background: `linear-gradient(to right, #FFC107 0%, #FFC107 ${((commission - 50) / 450) * 100}%, #e5e5e5 ${((commission - 50) / 450) * 100}%, #e5e5e5 100%)`,
                  }}
                />
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#FFC107] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-black/60 text-sm font-bold mb-2">Estimated Monthly Earnings</p>
              <p className="text-6xl font-black text-black mb-2">{formatNum(monthlyEarnings)}</p>
              <p className="text-black/60 text-sm font-medium">per month from active referrals</p>
            </div>

            <div className="rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {[
                { label: "Estimated referrals / month", value: referrals.toLocaleString() },
                { label: "Conversions / month", value: conversions.toLocaleString() },
                { label: "Recurring renewal income (Yr 2)", value: `+$${renewalIncome}/mo` },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center px-6 py-4 ${i < 2 ? "border-b-2 border-black/10" : ""}`}>
                  <span className="text-black/55 text-sm font-medium">{row.label}</span>
                  <span className="text-black font-black text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          background: #FFC107;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #000;
          box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
        }
        .calc-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          background: #FFC107;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #000;
        }
      `}</style>
    </section>
  );
}
