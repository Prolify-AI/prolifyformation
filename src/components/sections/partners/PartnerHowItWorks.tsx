"use client";

const steps = [
  {
    number: "1",
    title: "Apply",
    description: "Fill out a 5-minute application. Tell us about your audience and how you plan to promote Prolify.",
    badge: "5 minutes",
  },
  {
    number: "2",
    title: "Get Approved",
    description: "Most applications are reviewed and approved within 24 hours. You'll receive your partner dashboard access immediately.",
    badge: "24 hours",
  },
  {
    number: "3",
    title: "Get Your Link & Kit",
    description: "Receive your unique tracking link, custom discount code, and a full success kit with copy, scripts, and assets ready to use.",
    badge: "Instant access",
  },
  {
    number: "4",
    title: "Promote",
    description: "Share your link in your content, newsletter, community, or client conversations. We provide everything you need to convert.",
    badge: "Your way",
  },
  {
    number: "5",
    title: "Get Paid",
    description: "Commissions are paid monthly via Stripe or PayPal. No minimum threshold. Track every click, conversion, and payout in real time.",
    badge: "Monthly payouts",
  },
];

export default function PartnerHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFC107]/15 text-[#b08800] text-xs font-bold uppercase tracking-widest mb-5">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            From application to first paycheck in 5 steps
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Get approved in 24 hours. Start earning immediately. No minimum referrals required to get paid.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#FFC107]/40 to-transparent z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center text-3xl font-black mb-5 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 ${i % 2 === 0 ? "bg-[#FFC107] text-gray-900" : "bg-gray-900 text-[#FFC107]"}`}>
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{step.description}</p>
                <span className="inline-flex items-center px-3 py-1 bg-[#FFC107]/15 text-[#b08800] text-xs font-semibold rounded-full">
                  {step.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
