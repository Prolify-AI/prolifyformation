"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "What type of business are you starting?",
    options: ["E-commerce", "SaaS / Software", "Services / Consulting", "Physical Product", "Other"],
  },
  {
    id: 2,
    question: "Are you planning to raise venture capital?",
    options: ["Yes, definitely", "Maybe in the future", "No", "Not sure"],
  },
  {
    id: 3,
    question: "How many founders will your company have?",
    options: ["Just me (1)", "2 founders", "3–5 founders", "More than 5"],
  },
  {
    id: 4,
    question: "Expected annual revenue in year one?",
    options: ["Under $50k", "$50k – $250k", "$250k – $1M", "Over $1M"],
  },
  {
    id: 5,
    question: "What matters most to you?",
    options: ["Simple structure & tax benefits", "Ability to raise investor funding", "Maximum legal protection", "Not sure yet"],
  },
];

function getRecommendation(answers: Record<number, string>) {
  const raiseVC = answers[1];
  const revenue = answers[3];
  if (raiseVC === "Yes, definitely" || revenue === "Over $1M") return "C-Corp";
  return "LLC";
}

export default function BusinessTools() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const [revenue, setRevenue] = useState(10000);
  const [feeRate, setFeeRate] = useState(10);

  const monthlyFees = (revenue * feeRate) / 100;
  const savings = monthlyFees * 0.65;
  const annualSavings = savings * 12;

  const handleAnswer = (answer: string) => {
    const updated = { ...answers, [currentQ]: answer };
    setAnswers(updated);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers({});
    setDone(false);
  };

  const recommendation = getRecommendation(answers);

  return (
    <section className="py-24 md:py-32 px-4 bg-[#FAFAFA] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-xs font-bold uppercase tracking-widest text-black/60">
            Free Business Tools
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black">
            Make Smarter Decisions<br className="hidden sm:block" /> Before You Launch.
          </h2>
          <p className="text-lg text-black/55 max-w-xl mx-auto font-medium leading-relaxed">
            Use our free planning tools to choose the right entity and understand your costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl border border-black/8 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#FFC107] px-8 py-6">
              <h3 className="text-xl font-black text-black mb-1">LLC or C-Corp?</h3>
              <p className="text-sm text-black/65 font-medium">
                Answer 5 quick questions to find the right entity type for your goals.
              </p>
            </div>

            <div className="p-8 flex-grow flex flex-col">
              {!done ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex gap-1 flex-1">
                      {questions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= currentQ ? "bg-[#FFC107]" : "bg-black/8"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-black/40 whitespace-nowrap">
                      {currentQ + 1}/{questions.length}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-black mb-4">
                    {questions[currentQ].question}
                  </h4>

                  <div className="space-y-2 flex-grow">
                    {questions[currentQ].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-black/8 text-sm font-semibold text-black/70 hover:border-[#FFC107] hover:bg-[#FFC107]/5 hover:text-black transition-all duration-200"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center flex-grow justify-center gap-6 py-4">
                  <div className="w-16 h-16 bg-[#FFC107] rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-2">We Recommend</p>
                    <h4 className="text-4xl font-black text-black mb-3">{recommendation}</h4>
                    <p className="text-sm text-black/60 font-medium leading-relaxed max-w-xs mx-auto">
                      {recommendation === "LLC"
                        ? "An LLC offers the simplicity, tax flexibility, and liability protection that fits your goals."
                        : "A C-Corp is better suited for raising venture capital and scaling with investors."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <Link
                      href="/signup"
                      className="w-full py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-[#FFC107] hover:text-black transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Form My {recommendation}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={reset}
                      className="text-xs font-semibold text-black/40 hover:text-black transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-black/8 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#FFF9E0] px-8 py-6 border-b border-black/6">
              <h3 className="text-xl font-black text-black mb-1">Platform Fee Calculator</h3>
              <p className="text-sm text-black/65 font-medium">
                See how much you could save by accepting payments directly via Stripe.
              </p>
            </div>

            <div className="p-8 flex-grow flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-black">Monthly Revenue</label>
                  <span className="text-xl font-black text-black">${revenue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={500}
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-black/8 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFC107] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <p className="text-xs text-black/40 font-medium mt-1.5">Revenue from Teachable, Gumroad, Substack, etc.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-black">Platform Fee Rate</label>
                  <span className="text-xl font-black text-black">{feeRate}%</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={feeRate}
                  onChange={(e) => setFeeRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-black/8 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFC107] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div className="mt-auto pt-5 border-t border-black/6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-black/60">Monthly platform fees</span>
                  <span className="text-sm font-bold text-red-500 line-through">${monthlyFees.toFixed(0)}</span>
                </div>
                <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-2xl p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-1">Your potential monthly savings</p>
                  <p className="text-4xl font-black text-black">${savings.toFixed(0)}</p>
                  <p className="text-xs text-black/50 font-medium mt-1">${annualSavings.toFixed(0)} saved per year</p>
                </div>
                <Link
                  href="/taxes"
                  className="w-full py-3.5 rounded-2xl bg-black text-white text-sm font-bold hover:bg-[#FFC107] hover:text-black transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Start Saving Today
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
