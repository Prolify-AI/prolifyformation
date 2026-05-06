"use client";

import { Check, Zap, ChartBar as BarChart3, Headphones as HeadphonesIcon, Gift } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "30% Recurring Commission",
    description: "Earn 30% on every subscription payment—not just the first one. As long as your referred customer stays with Prolify, you keep earning.",
    tag: "Best in Class",
    tagColor: "bg-[#FFC107]",
  },
  {
    icon: Zap,
    title: "Instant Tracking Dashboard",
    description: "Real-time visibility into your clicks, signups, and earnings. Know exactly how your links are performing with a dedicated partner dashboard.",
    tag: "Real-Time",
    tagColor: "bg-[#FFF9E0]",
  },
  {
    icon: BarChart3,
    title: "Marketing Assets Provided",
    description: "Get access to banners, email templates, social media copy, and landing pages — everything you need to start promoting immediately.",
    tag: "Done For You",
    tagColor: "bg-white",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Partner Support",
    description: "A dedicated partner success manager is assigned to every active partner. Get help with strategy, content ideas, and maximizing your conversions.",
    tag: "Premium Support",
    tagColor: "bg-[#FFC107]",
  },
];

const perks = [
  "Monthly payouts via wire transfer or PayPal",
  "90-day cookie window",
  "No minimum payout threshold",
  "Co-marketing opportunities",
  "Early access to new Prolify features",
  "Featured placement in the Prolify directory",
];

export default function PartnerBenefits() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,193,7,0.08),transparent_50%)]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-sm font-black text-black uppercase tracking-wide">What You Get</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4">
            Benefits Built for Real Partners
          </h2>
          <p className="text-lg text-black/65 font-medium max-w-2xl mx-auto">
            We've designed the program to reward partners who genuinely help founders discover Prolify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group flex gap-6 p-8 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#FFC107] border-4 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-black tracking-tight">{benefit.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-black text-black border-2 border-black rounded ${benefit.tagColor}`}>{benefit.tag}</span>
                  </div>
                  <p className="text-sm text-black/65 leading-relaxed font-medium">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#FFF9E0] border-4 border-black rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black text-black mb-8 tracking-tight">Plus, Every Partner Gets:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {perks.map((perk, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#FFC107] border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                </div>
                <span className="text-sm font-bold text-black">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
