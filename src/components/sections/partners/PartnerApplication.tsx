"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: "⚡",
    title: "Approved in 24 hours.",
    detail: "Most applications are reviewed and approved the same business day.",
  },
  {
    icon: "💰",
    title: "No minimum payout.",
    detail: "Earn your first commission and we'll pay it — no threshold required.",
  },
  {
    icon: "🎁",
    title: "$250 launch bonus.",
    detail: "Earn a $250 cash bonus when you generate your first 5 referrals within 60 days of joining.",
  },
  {
    icon: "🌍",
    title: "Open worldwide.",
    detail: "Partners from any country are welcome. Payouts in USD via Stripe, PayPal, or bank transfer.",
  },
  {
    icon: "📦",
    title: "Everything you need to launch.",
    detail: "Your tracking link, discount code, and full success kit are ready the moment you're approved.",
  },
];

const partnerTypes = [
  "Content Creator (YouTube, Blog, Newsletter)",
  "CPA / Accountant",
  "Immigration Lawyer / Attorney",
  "Startup Accelerator / Incubator",
  "Course Creator / Educator",
  "Community Leader / Forum",
  "SaaS / Software Company",
  "Other",
];

const audienceSizes = [
  "Under 1,000",
  "1,000 – 5,000",
  "5,000 – 25,000",
  "25,000 – 100,000",
  "100,000+",
];

export default function PartnerApplication() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    partnerType: "",
    website: "",
    audienceSize: "",
    promotion: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="apply" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFC107]/15 text-[#b08800] text-xs font-bold uppercase tracking-widest mb-6">
              Apply Now
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-5 leading-[1.05]">
              Ready to start earning?
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Join Prolify's partner program in 5 minutes. Get approved in 24 hours. Start earning immediately.
            </p>

            <div className="space-y-5">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-[#FFC107]/15 flex items-center justify-center text-xl">
                    {b.icon}
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-gray-900">{b.title}</span>{" "}
                    <span className="text-gray-500">{b.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="p-10 rounded-2xl bg-[#FFC107]/10 ring-2 ring-[#FFC107]/30 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Application received!</h3>
                <p className="text-gray-500">We'll review your application and respond within 24 hours. Check your inbox at <strong className="text-gray-900">{form.email}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white shadow-xl shadow-gray-100 ring-1 ring-gray-100 space-y-5">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Partner Application</h3>
                  <p className="text-gray-400 text-sm mt-1">Takes about 5 minutes. We'll review and respond within 24 hours.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">First Name *</label>
                    <input
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Alex"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Last Name *</label>
                    <input
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Johnson"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="alex@yoursite.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Partner Type *</label>
                  <select
                    name="partnerType"
                    required
                    value={form.partnerType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your partner type</option>
                    {partnerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Your Website / Channel / Community URL *</label>
                  <input
                    name="website"
                    required
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yoursite.com or youtube.com/yourchannel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Audience Size / Reach</label>
                  <select
                    name="audienceSize"
                    value={form.audienceSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your approximate reach</option>
                    {audienceSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">How do you plan to promote Prolify? *</label>
                  <textarea
                    name="promotion"
                    required
                    value={form.promotion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. YouTube videos about business formation, newsletter features, CPA client referrals, accelerator cohort recommendations..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Country / Region</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="e.g. Nigeria, India, United States, Brazil..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50 focus:border-[#FFC107] transition-all bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#FFC107] text-gray-900 font-bold text-base rounded-xl hover:bg-[#FFB300] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {loading ? "Submitting..." : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
