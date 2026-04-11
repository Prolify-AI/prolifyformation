"use client";

import { useState } from "react";
import { Check, Crown, Rocket, Zap, Gift, ArrowRight, Briefcase, Building2, Loader as Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formationPlans, managementPlans, type FormationPlan, type ManagementPlan } from "@/lib/plans";
import { useStripePriceConfig } from "@/hooks/useStripePriceConfig";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  rocket: Rocket,
  zap: Zap,
  crown: Crown,
};

export default function UpgradePlanSection() {
  const { company } = useAuth();
  const { getPriceId, loading: priceConfigLoading } = useStripePriceConfig();
  const [selectedTab, setSelectedTab] = useState<"formation" | "management">("management");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = company?.current_plan || "management-starter";

  const isValidPriceId = (priceId: string) => priceId.startsWith("price_1");

  const redirectToStripe = async (planId: string, priceId: string) => {
    if (!priceId || !isValidPriceId(priceId)) {
      setError("Ce plan n'est pas encore configuré. Allez sur /admin/stripe-config pour ajouter les Price IDs Stripe.");
      return;
    }

    setLoadingPlan(planId);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Veuillez vous connecter pour mettre à jour votre plan.");
        return;
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const origin = window.location.origin;

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "Apikey": supabaseAnonKey ?? "",
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: "subscription",
          success_url: `${origin}/dashboard?upgrade=success&plan=${planId}`,
          cancel_url: `${origin}/dashboard?section=upgrade`,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Échec de la création de la session de paiement.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleFormationUpgrade = (planId: string) => {
    const priceId = getPriceId(planId);
    redirectToStripe(planId, priceId);
  };

  const handleManagementUpgrade = (planId: string) => {
    const priceId = getPriceId(`${planId}-${billingCycle}`);
    redirectToStripe(planId, priceId);
  };

  const FormationCard = ({ plan }: { plan: FormationPlan }) => {
    const Icon = iconMap[plan.icon] || Crown;
    const isPopular = plan.popular;
    const isLoading = loadingPlan === plan.id;

    return (
      <div
        className={`relative rounded-2xl p-6 transition-all ${
          isPopular
            ? "bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-black shadow-2xl scale-105"
            : "bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107] hover:shadow-lg"
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Crown className="h-3.5 w-3.5" />
            Most Popular
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPopular ? "bg-black" : "bg-[#FFC107]"}`}>
            <Icon className={`h-6 w-6 ${isPopular ? "text-[#FFC107]" : "text-black"}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isPopular ? "text-black" : "text-black dark:text-white"}`}>{plan.name}</h3>
            <p className={`text-sm ${isPopular ? "text-black/80" : "text-black/70 dark:text-white/70"}`}>{plan.tagline}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${isPopular ? "text-black" : "text-black dark:text-white"}`}>
              {plan.price === 0 ? "$0" : `$${plan.price}`}
            </span>
          </div>
          <p className={`text-sm mt-1 ${isPopular ? "text-black/70" : "text-black/60 dark:text-white/60"}`}>
            One-time + State Fees
          </p>
        </div>

        <div className="space-y-2.5 mb-6">
          {plan.coreFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isPopular ? "text-black" : "text-[#FFC107]"}`} />
              <span className={`text-sm ${isPopular ? "text-black" : "text-black dark:text-white"}`}>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => handleFormationUpgrade(plan.id)}
          disabled={isLoading}
          className={`w-full font-bold shadow-lg ${
            isPopular
              ? "bg-black text-white hover:bg-black/90"
              : "bg-[#FFC107] text-black hover:bg-[#FFB300]"
          }`}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting...</>
          ) : (
            <>Get Started <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    );
  };

  const ManagementCard = ({ plan }: { plan: ManagementPlan }) => {
    const Icon = iconMap[plan.icon] || Crown;
    const isCurrentPlan = currentPlan === plan.id;
    const isPopular = plan.popular;
    const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
    const isLoading = loadingPlan === plan.id;

    return (
      <div
        className={`relative rounded-2xl p-6 transition-all ${
          isCurrentPlan
            ? "bg-white dark:bg-black border-2 border-[#FFC107] shadow-lg"
            : isPopular
            ? "bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-black shadow-2xl scale-105"
            : "bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107] hover:shadow-lg"
        }`}
      >
        {isPopular && !isCurrentPlan && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Crown className="h-3.5 w-3.5" />
            Most Popular
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFC107] text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            Current Plan
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isPopular && !isCurrentPlan ? "bg-black" : "bg-[#FFC107]"
          }`}>
            <Icon className={`h-6 w-6 ${isPopular && !isCurrentPlan ? "text-[#FFC107]" : "text-black"}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isPopular && !isCurrentPlan ? "text-black" : "text-black dark:text-white"}`}>{plan.name}</h3>
            <p className={`text-sm ${isPopular && !isCurrentPlan ? "text-black/80" : "text-black/70 dark:text-white/70"}`}>{plan.tagline}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${isPopular && !isCurrentPlan ? "text-black" : "text-black dark:text-white"}`}>
              {displayPrice === 0 ? "$0" : `$${displayPrice}`}
            </span>
            <span className={`${isPopular && !isCurrentPlan ? "text-black/80" : "text-black/70 dark:text-white/70"}`}>/mo</span>
          </div>
          {billingCycle === "annual" && plan.priceMonthly > 0 && (
            <p className={`text-sm mt-1 ${isPopular && !isCurrentPlan ? "text-black/80" : "text-green-600"}`}>
              Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/yr vs monthly
            </p>
          )}
        </div>

        <div className="space-y-2.5 mb-6">
          {plan.coreFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isPopular && !isCurrentPlan ? "text-black" : "text-[#FFC107]"}`} />
              <span className={`text-sm ${isPopular && !isCurrentPlan ? "text-black" : "text-black dark:text-white"}`}>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => handleManagementUpgrade(plan.id)}
          disabled={isCurrentPlan || isLoading || priceConfigLoading}
          className={`w-full font-bold shadow-lg ${
            isCurrentPlan
              ? "bg-white/50 dark:bg-black/50 text-black/50 dark:text-white/50 cursor-not-allowed border-2 border-black/20 dark:border-white/20"
              : isPopular
              ? "bg-black text-white hover:bg-black/90"
              : "bg-[#FFC107] text-black hover:bg-[#FFB300]"
          }`}
        >
          {isCurrentPlan ? (
            "Current Plan"
          ) : priceConfigLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
          ) : isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting...</>
          ) : (
            <>Upgrade Now <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black dark:text-white flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center">
            <Crown className="h-6 w-6 text-black" />
          </div>
          Upgrade Your Plan
        </h2>
        <p className="text-black/70 dark:text-white/70 mt-2 ml-13">
          Choose the plan that best fits your business needs
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm flex items-start gap-3">
          <span className="flex-1">{error}</span>
          {error.includes("admin/stripe-config") && (
            <a
              href="/admin/stripe-config"
              className="whitespace-nowrap font-semibold underline flex items-center gap-1 hover:opacity-80"
            >
              <Settings className="h-3.5 w-3.5" />
              Configurer
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="inline-flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => setSelectedTab("formation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedTab === "formation"
                ? "bg-[#FFC107] text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Formation Packages
          </button>
          <button
            onClick={() => setSelectedTab("management")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedTab === "management"
                ? "bg-[#FFC107] text-black shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Management Plans
          </button>
        </div>

        {selectedTab === "management" && (
          <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                billingCycle === "annual"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Annual <span className="text-green-600 font-semibold ml-1">-20%</span>
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-black/50 dark:text-white/50">
        {selectedTab === "formation"
          ? "One-time formation packages for starting a new business"
          : "Monthly subscriptions for managing your existing business"}
      </p>

      {selectedTab === "formation" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formationPlans.map((plan) => (
            <FormationCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {managementPlans.map((plan) => (
            <ManagementCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl p-6 hover:border-[#FFC107] transition-colors">
        <h3 className="text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FFC107]"></div>
          Need a custom solution?
        </h3>
        <p className="text-black/70 dark:text-white/70 mb-4">
          Contact our sales team for enterprise pricing and custom features tailored to your business.
        </p>
        <Button className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] font-semibold shadow-lg">
          Contact Sales
        </Button>
      </div>
    </div>
  );
}
