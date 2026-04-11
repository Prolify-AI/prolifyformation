"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How much can I earn as a Prolify partner?",
    answer: "Partners earn 20–30% commission on every formation, plus 10–15% recurring commissions on annual renewals. Top partners earn $10,000+ per month. There's no cap — the more you refer, the more you earn. You also get a $250 launch bonus when you generate your first 5 referrals within 60 days of joining.",
  },
  {
    question: "How does the attribution window work?",
    answer: "Prolify uses a 90-day cookie window — the longest in the industry. This means if someone clicks your link and signs up anytime within 90 days, you get credit for the referral. No lost commissions, no short attribution windows.",
  },
  {
    question: "When and how do I get paid?",
    answer: "Payouts are processed on the 1st of every month for all confirmed commissions from the previous month. We pay via Stripe, PayPal, or direct bank transfer (SWIFT/ACH). There is no minimum payout threshold — your first commission is paid immediately.",
  },
  {
    question: "Do you offer recurring commissions?",
    answer: "Yes. You earn 10–15% recurring commissions every year a customer you referred renews their compliance plan. This is the most powerful part of the Prolify partner program — your income compounds over time as your referral base grows.",
  },
  {
    question: "How do I get a custom landing page and discount code?",
    answer: "Custom co-branded landing pages and exclusive discount codes are available on the Pro and Elite partner tiers. Once approved, you can request these through your partner dashboard. The co-branded page is designed to feel like your own product — your audience sees your branding, not ours.",
  },
  {
    question: "I'm a CPA / lawyer / accountant. Is there a program for me?",
    answer: "Absolutely. We have a dedicated professional services partner track designed specifically for CPAs, immigration attorneys, and business consultants. You get higher commission rates, a dedicated account manager, white-label materials, and a co-branded service offering you can present to clients as your own.",
  },
  {
    question: "Can I promote Prolify if I'm not based in the US?",
    answer: "Yes — in fact, most of our top partners are outside the US. Prolify's core market is international founders building US companies, so partners in Nigeria, India, the UAE, Brazil, and Europe often see the highest conversion rates. Payouts are made in USD internationally.",
  },
  {
    question: "What is the minimum audience size to join?",
    answer: "There is no minimum audience requirement. We approve partners based on relevance and intent, not follower count. A CPA with 50 clients can out-earn a YouTuber with 100K subscribers. If your audience includes founders or entrepreneurs, we want to work with you.",
  },
];

export default function PartnerFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
            Everything you need to know
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Can't find your answer? Email us at{" "}
            <a href="mailto:partners@prolify.com" className="font-semibold text-[#FFC107] hover:underline transition-colors">
              partners@prolify.com
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${isOpen ? "bg-[#FFC107]/10 ring-2 ring-[#FFC107]/40" : "bg-white hover:shadow-md"}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-gray-900 text-base pr-4">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-[#FFC107]" : "bg-gray-100"}`}>
                    {isOpen
                      ? <Minus className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
                      : <Plus className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                    }
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-[#FFC107]/30 mb-4"></div>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
