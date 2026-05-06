"use client";

import { useState } from "react";
import { X, Check, Rocket, Zap, Gift, Sparkles, Crown, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formationPlans, managementPlans } from "@/lib/plans";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected: (planId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gift: Gift,
  rocket: Rocket,
  zap: Zap,
  crown: Crown,
};

export default function PlanSelectionModal({
  isOpen,
  onClose,
  onPlanSelected,
}: PlanSelectionModalProps) {
  const { user, refreshUserData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"formation" | "management">("formation");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;

    setLoading(true);
    setSelectedPlan(planId);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          plan_selected: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData?.company_id) {
        await supabase
          .from("companies")
          .update({ current_plan: planId })
          .eq("id", profileData.company_id);
      }

      await refreshUserData();
      onPlanSelected(planId);
    } catch (error) {
      console.error("Error selecting plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipForNow = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await supabase
        .from("profiles")
        .update({
          plan_selected: true,
        })
        .eq("id", user.id);

      await refreshUserData();
      onClose();
    } catch (error) {
      console.error("Error skipping plan selection:", error);
    } finally {
      setLoading(false);
    }
  };

  const activePlans = selectedTab === "formation"
    ? formationPlans.filter((p) => p.price > 0)
    : managementPlans.filter((p) => p.priceMonthly > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-[#FFC107] via-[#FFB300] to-[#FFA000] rounded-t-3xl overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-white/10 rounded-full -mb-24" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        <div className="relative pt-8 px-8 pb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-4">
              <Crown className="w-4 h-4 text-black" />
              <span className="text-sm font-semibold text-black">Choose Your Plan</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Unlock Your Business Potential
            </h2>
            <p className="text-black/70 text-lg max-w-2xl mx-auto">
              Select the plan that best fits your business needs
            </p>
          </div>

          <div className="flex justify-center mb-4 mt-16">
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
                New Business
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
                Existing Business
              </button>
            </div>
          </div>

          {selectedTab === "management" && (
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    billingCycle === "annual"
                      ? "bg-white dark:bg-black text-black dark:text-white shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Annual <span className="text-green-600 font-semibold ml-1">-20%</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {activePlans.map((plan) => {
              const Icon = iconMap[plan.icon] || Rocket;
              const isSelected = selectedPlan === plan.id;
              const isPopular = plan.popular;
              const isFormation = selectedTab === "formation";
              const price = isFormation
                ? (plan as typeof formationPlans[number]).price
                : billingCycle === "annual"
                ? (plan as typeof managementPlans[number]).priceAnnual
                : (plan as typeof managementPlans[number]).priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${
                    isPopular
                      ? "border-[#FFC107] shadow-xl scale-105 z-10"
                      : isSelected
                      ? "border-[#FFC107] shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1.5 rounded-full bg-[#FFC107] text-black text-xs font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FFC107] flex items-center justify-center mb-4 shadow-lg">
                      <Icon className="w-6 h-6 text-black" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {plan.tagline}
                    </p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {isFormation ? " one-time" : "/mo"}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.coreFeatures.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#FFC107] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.coreFeatures.length > 5 && (
                        <li className="text-sm text-gray-500 dark:text-gray-400 pl-7">
                          + {plan.coreFeatures.length - 5} more features
                        </li>
                      )}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loading}
                      className={`w-full py-3 font-semibold rounded-xl transition-all ${
                        isPopular
                          ? "bg-[#FFC107] text-black hover:bg-[#FFB300] hover:shadow-lg"
                          : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                      }`}
                    >
                      {loading && selectedPlan === plan.id ? (
                        "Selecting..."
                      ) : (
                        <>
                          Choose {plan.name}
                          <Sparkles className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSkipForNow}
              disabled={loading}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Skip for now and continue with Free plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
