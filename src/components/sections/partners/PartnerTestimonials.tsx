"use client";

const testimonials = [
  {
    quote: "\"I added Prolify to one YouTube video about forming a US company as an Indian founder. ",
    boldPart: "Within 60 days it was my highest-earning affiliate.",
    rest: " The recurring commissions from compliance renewals are the part nobody talks about — that's where the real money is.\"",
    name: "Rahul K.",
    title: "YouTube Creator · 280K subscribers · Business & SaaS",
    initials: "RK",
    earnings: "$14,200 / mo",
    highlight: false,
  },
  {
    quote: "\"As a CPA, I was already helping my clients form US entities. Now I refer them to Prolify and earn a commission ",
    boldPart: "plus 10% recurring every year they stay.",
    rest: " It's become a meaningful revenue line for my practice.\"",
    name: "Sarah M.",
    title: "CPA · Small Business & E-Commerce Clients",
    initials: "SM",
    earnings: "$8,400 / mo",
    highlight: true,
  },
  {
    quote: "\"I run a newsletter for Nigerian founders building internet businesses. ",
    boldPart: "One Prolify feature in my newsletter drove 47 sign-ups.",
    rest: " The co-branded landing page made it feel like my own product — my readers trusted it immediately.\"",
    name: "Adaeze O.",
    title: "Newsletter Operator · 22K subscribers",
    initials: "AO",
    earnings: "$6,100 / mo",
    highlight: false,
  },
  {
    quote: "\"We added Prolify as a recommended service for our accelerator cohorts. ",
    boldPart: "Every founder who goes through our program now forms their US entity with Prolify.",
    rest: " The accelerator track is built exactly for how we operate.\"",
    name: "Tunde C.",
    title: "Managing Director · West Africa Tech Accelerator",
    initials: "TC",
    earnings: "$11,800 / mo",
    highlight: false,
  },
  {
    quote: "\"I teach Amazon FBA to 40,000 students. Prolify is the first business formation tool I've recommended where ",
    boldPart: "my students actually come back and thank me.",
    rest: " The AI compliance dashboard is genuinely impressive.\"",
    name: "James L.",
    title: "Course Creator · Amazon FBA & E-Commerce",
    initials: "JL",
    earnings: "$4,900 / mo",
    highlight: true,
  },
  {
    quote: "\"My immigration clients often need a US entity at the same time as their visa. Prolify's referral program for lawyers is the ",
    boldPart: "most professional partner program I've seen in this space.",
    rest: " Co-branded materials, dedicated support, recurring income.\"",
    name: "Elena P.",
    title: "Immigration Attorney · O-1 & EB-1 Specialist",
    initials: "EP",
    earnings: "$3,200 / mo",
    highlight: false,
  },
];

export default function PartnerTestimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,193,7,0.08),transparent_50%)]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFC107] border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-black uppercase tracking-[0.15em]">Partner Stories</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter mb-6">
            Partners earning real income, every month
          </h2>
          <p className="text-lg text-black/55 font-medium max-w-2xl mx-auto">
            From solo creators to accounting firms — here's what our partners say about building with Prolify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-7 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 ${t.highlight ? "bg-[#FFC107]" : "bg-white"}`}
            >
              <div className="absolute -top-3.5 right-5">
                <span className={`inline-block px-3 py-1.5 text-xs font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${t.highlight ? "bg-black text-[#FFC107]" : "bg-[#FFC107] text-black"}`}>
                  {t.earnings}
                </span>
              </div>

              <p className="text-black/75 text-sm leading-relaxed mb-6 flex-grow pt-2">
                {t.quote}
                <strong className="text-black font-black">{t.boldPart}</strong>
                {t.rest}
              </p>

              <div className={`flex items-center gap-3 pt-4 border-t-2 ${t.highlight ? "border-black/20" : "border-black/10"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-black font-black text-xs ${t.highlight ? "bg-black text-[#FFC107]" : "bg-[#FFC107] text-black"}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-black text-black text-sm">{t.name}</div>
                  <div className="text-black/50 text-xs mt-0.5">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
