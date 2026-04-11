"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Sparkles, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formationPlans, managementPlans, FormationPlan, ManagementPlan } from "@/lib/plans";
import { stripeProducts } from "@/stripe-config";

const PLAN_PRICE_MAP: Record<string, string> = {
  "formation-starter": stripeProducts.find((p) => p.name === "Starter" && p.price === 149)?.priceId ?? "",
  "formation-growth": stripeProducts.find((p) => p.name === "Growth" && p.price === 299)?.priceId ?? "",
  "formation-elite": stripeProducts.find((p) => p.name === "Elite" && p.price === 499)?.priceId ?? "",
};

const PLAN_ICONS: Record<string, React.ElementType> = {
  rocket: Rocket,
  zap: Zap,
  crown: Crown,
};

function PlanSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [tab, setTab] = useState<"formation" | "management">("formation");

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam) setSelectedPlan(planParam);
    const tabParam = searchParams.get("tab");
    if (tabParam === "management" || tabParam === "formation") setTab(tabParam);
  }, [searchParams]);

  const handleContinue = () => {
    if (!selectedPlan) return;
    const priceId = PLAN_PRICE_MAP[selectedPlan];
    router.push(`/signup?plan=${selectedPlan}&price_id=${priceId}`);
  };

  const renderFormationPlan = (plan: FormationPlan) => {
    const Icon = PLAN_ICONS[plan.icon] ?? Rocket;
    const isSelected = selectedPlan === plan.id;
    const priceId = PLAN_PRICE_MAP[plan.id];

    return (
      <button
        key={plan.id}
        onClick={() => setSelectedPlan(plan.id)}
        disabled={!priceId}
        className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all ${
          isSelected
            ? "border-[#FFC107] bg-[#FFC107]/5"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        } ${!priceId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC107] text-black text-xs font-black px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
        )}
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isSelected ? "bg-[#FFC107]" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Icon className={`h-5 w-5 ${isSelected ? "text-black" : "text-gray-600 dark:text-gray-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-black text-lg text-black dark:text-white">{plan.name}</h3>
              <div className="text-right">
                <span className="text-2xl font-black text-black dark:text-white">${plan.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">one-time</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{plan.tagline}</p>
            <ul className="space-y-1.5">
              {plan.coreFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="h-3.5 w-3.5 text-[#FFC107] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center">
            <Check className="h-3.5 w-3.5 text-black" />
          </div>
        )}
      </button>
    );
  };

  const renderManagementPlan = (plan: ManagementPlan) => {
    const Icon = PLAN_ICONS[plan.icon] ?? Rocket;
    const isSelected = selectedPlan === plan.id;

    return (
      <button
        key={plan.id}
        onClick={() => setSelectedPlan(plan.id)}
        className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all cursor-pointer ${
          isSelected
            ? "border-[#FFC107] bg-[#FFC107]/5"
            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC107] text-black text-xs font-black px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
        )}
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isSelected ? "bg-[#FFC107]" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Icon className={`h-5 w-5 ${isSelected ? "text-black" : "text-gray-600 dark:text-gray-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-black text-lg text-black dark:text-white">{plan.name}</h3>
              <div className="text-right">
                <span className="text-2xl font-black text-black dark:text-white">${plan.priceMonthly}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/mo</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{plan.tagline}</p>
            <ul className="space-y-1.5">
              {plan.coreFeatures.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="h-3.5 w-3.5 text-[#FFC107] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center">
            <Check className="h-3.5 w-3.5 text-black" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-2xl font-black text-black dark:text-white">Prolify</span>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span className="w-6 h-6 rounded-full bg-[#FFC107] text-black text-xs font-black flex items-center justify-center">1</span>
            <span className="font-medium text-[#FFC107]">Choose a plan</span>
            <span className="mx-2 text-gray-300">—</span>
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 text-xs font-black flex items-center justify-center">2</span>
            <span>Your details</span>
            <span className="mx-2 text-gray-300">—</span>
            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 text-xs font-black flex items-center justify-center">3</span>
            <span>Payment</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-black dark:text-white mb-2">Choose your plan</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Select the plan that best fits your needs. You can always upgrade later.
        </p>

        <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl w-fit">
          <button
            onClick={() => { setTab("formation"); setSelectedPlan(null); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "formation"
                ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Starting a Business
          </button>
          <button
            onClick={() => { setTab("management"); setSelectedPlan(null); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === "management"
                ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            I Have a Business
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {tab === "formation"
            ? formationPlans.map(renderFormationPlan)
            : managementPlans.map(renderManagementPlan)}
        </div>

        {tab === "management" && (
          <p className="text-xs text-gray-400 dark:text-gray-600 mb-6 text-center">
            Management plan checkout coming soon. Formation plans are available now.
          </p>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selectedPlan || (tab === "formation" && !PLAN_PRICE_MAP[selectedPlan ?? ""])}
          className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000] text-black font-black py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-40 text-base"
        >
          Continue with {selectedPlan ? formationPlans.find(p => p.id === selectedPlan)?.name ?? managementPlans.find(p => p.id === selectedPlan)?.name : "selected plan"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#FFC107] font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PlanSelectionPage() {
  return (
    <Suspense>
      <PlanSelectionContent />
    </Suspense>
  );
}
