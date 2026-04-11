"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Rocket, Target, Check, X, Lightbulb, Building2, Users, Zap, Package, CircleAlert as AlertCircle, CreditCard as Edit, CreditCard, Lock, Gift, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { countries } from "@/lib/countries";
import { usStates, getRecommendedState } from "@/lib/us-states";
import { plans } from "@/lib/plans";
import { StateSelector } from "@/components/state-selector";
import { supabase } from "@/lib/supabase/client";
import { calculateOrderTotal } from "@/data/stateFees";

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [showStateSelector, setShowStateSelector] = useState(false);

  const [formData, setFormData] = useState({
    country: "",
    businessGoal: "",
    entityType: "",
    companyName: "",
    formationState: "Wyoming",
    selectedPlan: "",
    expeditedEin: false,
    stateFee: 103.75,
    planPrice: 0,
    expeditedEinFee: 0,
    totalAmount: 0,
    paymentEmail: "",
    paymentName: "",
  });

  useEffect(() => {
    async function loadData() {
      const savedData = localStorage.getItem("onboarding_data");
      const quizEntityType = localStorage.getItem("quiz_entity_type");
      const fromQuiz = localStorage.getItem("from_quiz");

      const isFromQuiz = quizEntityType && fromQuiz;

      if (isFromQuiz) {
        setFormData(prev => ({
          ...prev,
          entityType: quizEntityType,
          businessGoal: "form_new",
          country: "United States"
        }));
        setCurrentStep(4);
        localStorage.removeItem("quiz_entity_type");
        localStorage.removeItem("from_quiz");
        localStorage.removeItem("onboarding_data");

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
        return;
      }

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed);
        } catch (e) {
        }
      } else if (quizEntityType) {
        setFormData(prev => ({ ...prev, entityType: quizEntityType }));
        localStorage.removeItem("quiz_entity_type");
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);

        const { data: existingOnboarding } = await supabase
          .from("onboarding_data")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingOnboarding) {
          setOnboardingId(existingOnboarding.id);
          setFormData({
            country: existingOnboarding.country_of_residence || "",
            businessGoal: existingOnboarding.business_goal || "",
            entityType: existingOnboarding.entity_type || "",
            companyName: existingOnboarding.company_name || "",
            formationState: existingOnboarding.formation_state || "Wyoming",
            selectedPlan: existingOnboarding.selected_plan || "",
            expeditedEin: existingOnboarding.expedited_ein || false,
            stateFee: existingOnboarding.state_fee || 103.75,
            planPrice: existingOnboarding.plan_price || 0,
            paymentEmail: existingOnboarding.payment_email || "",
            paymentName: existingOnboarding.payment_name || "",
            expeditedEinFee: existingOnboarding.expedited_ein_fee || 0,
            totalAmount: existingOnboarding.total_amount || 0,
          });

          if (existingOnboarding.completed) {
            window.location.href = "/dashboard";
          }
        }
      }
    }

    loadData();
  }, []);

  const saveProgress = async (updates: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...updates };

    localStorage.setItem("onboarding_data", JSON.stringify(updatedData));

    if (!userId) return;

    const dbData = {
      user_id: userId,
      country_of_residence: updates.country ?? formData.country,
      business_goal: updates.businessGoal ?? formData.businessGoal,
      entity_type: updates.entityType ?? formData.entityType,
      company_name: updates.companyName ?? formData.companyName,
      formation_state: updates.formationState ?? formData.formationState,
      selected_plan: updates.selectedPlan ?? formData.selectedPlan,
      expedited_ein: updates.expeditedEin ?? formData.expeditedEin,
      state_fee: updates.stateFee ?? formData.stateFee,
      plan_price: updates.planPrice ?? formData.planPrice,
      expedited_ein_fee: updates.expeditedEinFee ?? formData.expeditedEinFee,
      total_amount: updates.totalAmount ?? formData.totalAmount,
    };

    if (onboardingId) {
      await supabase
        .from("onboarding_data")
        .update(dbData)
        .eq("id", onboardingId);
    } else {
      const { data } = await supabase
        .from("onboarding_data")
        .insert(dbData)
        .select()
        .single();

      if (data) {
        setOnboardingId(data.id);
      }
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !formData.country) return;
    if (currentStep === 2 && !formData.businessGoal) return;
    if (currentStep === 3 && !formData.entityType) return;
    if (currentStep === 4 && !formData.companyName.trim()) return;
    if (currentStep === 5 && !formData.formationState) return;
    if (currentStep === 6 && !formData.selectedPlan) return;

    if (currentStep === 2 && formData.businessGoal === "grow_existing") {
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            onboarding_type: "existing_business",
            profile_completed: false,
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating profile:", error);
          return;
        }

        window.location.href = "/dashboard?complete_profile=true";
      } catch (err) {
        console.error("Error in handleNext:", err);
      }
      return;
    }

    if (currentStep < 9) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  };

  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!userId) {
      alert("You must be signed in to complete payment.");
      return;
    }

    if (!formData.selectedPlan || !formData.formationState) {
      alert("Please complete all steps before proceeding to payment.");
      return;
    }

    if (orderBreakdown.total <= 0) {
      alert("Invalid order total. Please go back and check your selections.");
      return;
    }

    setIsRedirectingToPayment(true);
    setPaymentError(null);

    const selectedPlanData = plans.find(p => p.id === formData.selectedPlan);
    const selectedStateData = usStates.find(s => s.name === formData.formationState);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !session) {
        alert("Session expired. Please sign in again.");
        setIsRedirectingToPayment(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/formation-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
            "Apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            user_id: userId,
            email: session.user.email,
            formation_state: formData.formationState,
            state_code: selectedStateData?.code ?? "",
            entity_type: formData.entityType,
            company_name: formData.companyName,
            plan_id: formData.selectedPlan,
            plan_name: selectedPlanData?.name ?? "",
            prolify_fee: orderBreakdown.prolifyFee,
            state_fee: orderBreakdown.stateFee,
            expedited_ein_fee: formData.expeditedEinFee,
            total_amount: orderBreakdown.total,
            success_url: `${window.location.origin}/onboarding/success`,
            cancel_url: `${window.location.origin}/onboarding`,
            onboarding_data: formData,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.error || "Failed to initiate payment. Please try again.");
        setIsRedirectingToPayment(false);
        return;
      }

      if (data.url) {
        localStorage.removeItem("onboarding_data");
        window.location.href = data.url;
      }
    } catch (err: any) {
      setPaymentError(err.message || "An error occurred. Please try again.");
      setIsRedirectingToPayment(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean | number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    saveProgress({ [field]: value } as Partial<typeof formData>);
  };

  const handleStateChange = (stateName: string) => {
    const state = usStates.find(s => s.name === stateName);
    if (state) {
      const order = calculateOrderTotal(stateName, formData.entityType, formData.planPrice, formData.expeditedEinFee);
      const newData = {
        formationState: stateName,
        stateFee: order.stateFee,
        totalAmount: order.total,
      };
      setFormData({ ...formData, ...newData });
      saveProgress(newData);
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const order = calculateOrderTotal(formData.formationState, formData.entityType, plan.price, formData.expeditedEinFee);
      const newData = {
        selectedPlan: planId,
        planPrice: plan.price,
        stateFee: order.stateFee,
        totalAmount: order.total,
      };
      setFormData({ ...formData, ...newData });
      saveProgress(newData);
    }
  };

  const handleExpeditedEinChange = (selected: boolean) => {
    const fee = selected ? 300 : 0;
    const order = calculateOrderTotal(formData.formationState, formData.entityType, formData.planPrice, fee);
    const newData = {
      expeditedEin: selected,
      expeditedEinFee: fee,
      totalAmount: order.total,
    };
    setFormData({ ...formData, ...newData });
    saveProgress(newData);
  };

  const selectedState = usStates.find(s => s.name === formData.formationState);
  const selectedPlan = plans.find(p => p.id === formData.selectedPlan);
  const orderBreakdown = calculateOrderTotal(formData.formationState, formData.entityType, formData.planPrice, formData.expeditedEinFee);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#FFC107]/10 via-white to-white dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a]">
      <div className="w-full max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step <= currentStep ? "bg-[#FFC107]" : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-3">
                Which country do you reside in? <Globe className="h-12 w-12 text-[#FFC107]" />
              </h1>
            </div>

            <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-8 max-w-2xl mx-auto">
              <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                <SelectTrigger className="w-full h-14 text-lg border-2">
                  <SelectValue placeholder="Select country of residence" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6 p-4 bg-[#FFC107]/10 rounded-lg border-2 border-[#FFC107]">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    We may offer recommendations depending on your country of residence.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleNext}
                disabled={!formData.country}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
                How can we help you?
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <button
                onClick={() => updateFormData("businessGoal", "form_new")}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  formData.businessGoal === "form_new"
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-black dark:border-white bg-white dark:bg-[#171717] hover:border-[#FFC107] dark:hover:border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Rocket className="h-12 w-12 text-red-500" />
                  {formData.businessGoal === "form_new" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.businessGoal !== "form_new" && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Form & start my new US business
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Form your company, get your EIN, and stay compliant.
                </p>
              </button>

              <button
                onClick={() => updateFormData("businessGoal", "grow_existing")}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  formData.businessGoal === "grow_existing"
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-black dark:border-white bg-white dark:bg-[#171717] hover:border-[#FFC107] dark:hover:border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Target className="h-12 w-12 text-green-500" />
                  {formData.businessGoal === "grow_existing" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.businessGoal !== "grow_existing" && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                  Run & grow my existing US business
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  International banking, tax filings, bookkeeping and more.
                </p>
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.businessGoal}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                What kind of business are you building?
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <button
                onClick={() => updateFormData("entityType", "LLC")}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  formData.entityType === "LLC"
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#171717] hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Users className="h-8 w-8 text-black dark:text-white mb-2" />
                    <h3 className="text-2xl font-bold text-black dark:text-white">LLC</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For small businesses and more flexibility.
                    </p>
                  </div>
                  {formData.entityType === "LLC" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.entityType !== "LLC" && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Limited liability protection for owners</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Simple management structure and easy to operate</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited owners (U.S. and international)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Less paperwork, corporate restrictions, no meeting requirements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">LLCs cannot issue stock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Ownership represented by members</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateFormData("entityType", "C-Corp")}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  formData.entityType === "C-Corp"
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#171717] hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Building2 className="h-8 w-8 text-black dark:text-white mb-2" />
                    <h3 className="text-2xl font-bold text-black dark:text-white">C-Corp</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For startups fundraising from investors.
                    </p>
                  </div>
                  {formData.entityType === "C-Corp" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.entityType !== "C-Corp" && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Limited liability protection for owners</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Ability to raise capital by issuing stock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Ownership represented by shareholders</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Management structure with more operating requirements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">More paperwork and corporate requirements such as annual meetings and minutes</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="p-4 bg-[#FFC107]/10 rounded-lg border-2 border-[#FFC107]">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Stuck on choosing your formation entity? Take our{" "}
                    <Link href="/quiz" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                      quick quiz
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.entityType}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                What is your desired company name?
              </h1>
            </div>

            <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-8 max-w-2xl mx-auto">
              <Input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="Enter company name"
                className="w-full h-14 text-lg border-2"
              />

              <div className="mt-6 p-4 bg-[#FFC107]/10 rounded-lg border-2 border-[#FFC107]">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Please provide your preferred company name. Don't worry - you will have another chance to review your company name and make any changes prior to starting the official business formation process.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.companyName.trim()}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                Which State do you want to form your business in?
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <button
                onClick={() => handleStateChange("Wyoming")}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  formData.formationState === "Wyoming"
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-black dark:border-white bg-white dark:bg-[#171717] hover:border-[#FFC107] dark:hover:border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Wyoming</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded-full">
                      Recommended
                    </span>
                  </div>
                  {formData.formationState === "Wyoming" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.formationState !== "Wyoming" && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setShowStateSelector(true)}
                className="p-8 rounded-2xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-[#171717] hover:border-gray-400 dark:hover:border-gray-600 transition-all text-left flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Other</h3>
                  <p className="text-gray-600 dark:text-gray-400">Choose another state</p>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">State Fee</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">State</span>
                  <span className="font-semibold text-black dark:text-white">{formData.formationState}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Price</span>
                  <span className="font-semibold text-black dark:text-white">${formData.stateFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Billing</span>
                  <span className="font-semibold text-black dark:text-white">One-time</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFC107]/10 rounded-lg border-2 border-[#FFC107] p-4 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    Wyoming is recommended for simplified formation, lower annual operating costs and flexibility. No corporate income tax or annual franchise tax.
                  </p>
                  <p>
                    Some states have additional requirements after your company is registered. You can view the full list of state-specific requirements{" "}
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                      here
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-[#171717] border-2 border-black dark:border-white rounded-2xl p-8 max-w-5xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Package className="h-10 w-10 text-[#FFC107]" />
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                  Choose Your Perfect Plan
                </h2>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                All plans include expert formation services, compliance support, and access to our business tools. Start your entrepreneurial journey with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left relative ${
                    plan.popular
                      ? "border-[#FFC107] bg-[#FFF9E6] dark:bg-[#FFD54F]/10"
                      : "border-black dark:border-white bg-white dark:bg-[#171717] hover:border-[#FFC107] dark:hover:border-[#FFC107] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
                  } ${
                    formData.selectedPlan === plan.id
                      ? "ring-4 ring-blue-500"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC107] text-black px-4 py-1 rounded-full text-xs font-bold">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    {plan.icon === "gift" && <Gift className="h-8 w-8 text-black dark:text-white" />}
                    {plan.icon === "rocket" && <Rocket className="h-8 w-8 text-black dark:text-white" />}
                    {plan.icon === "zap" && <Zap className="h-8 w-8 text-black dark:text-white" />}
                    {plan.icon === "crown" && <Crown className="h-8 w-8 text-black dark:text-white" />}
                    {plan.icon === "package" && <Package className="h-8 w-8 text-black dark:text-white" />}
                  </div>

                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {plan.tagline}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-black dark:text-white">${plan.price.toFixed(0)}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">/year</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                      Core Features
                    </p>
                    <div className="space-y-2">
                      {plan.coreFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {plan.additionalFeatures && (
                      <Link href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block">
                        {plan.additionalFeatures}
                      </Link>
                    )}
                  </div>

                  {formData.selectedPlan === plan.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.selectedPlan}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                Want to launch your business at lightning speed?
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <button
                onClick={() => handleExpeditedEinChange(true)}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  formData.expeditedEin
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#171717] hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#FFC107] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Expedited EIN</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Get your EIN number from the IRS up to 2 weeks faster!
                    </p>
                    <p className="text-3xl font-bold text-black dark:text-white">
                      $300 <span className="text-sm font-normal text-gray-500">One-time</span>
                    </p>
                  </div>
                  {formData.expeditedEin && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {!formData.expeditedEin && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                  )}
                </div>
              </button>

              <button
                onClick={() => handleExpeditedEinChange(false)}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  !formData.expeditedEin
                    ? "border-[#FFC107] bg-[#FFC107]/10"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#171717] hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No thanks,</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      I can wait up to 8 weeks on average for my company to be formed.
                    </p>
                  </div>
                  {!formData.expeditedEin && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {formData.expeditedEin && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
              >
                Next <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                Your dream business is ready. Are you?
              </h1>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    Flawless Formation — Or You Get Your Money Back
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    We know how important it is to get your company formed the right way. If there's an error in your formation due to our service, we'll refund that portion — no questions asked.
                  </p>
                  <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-sm">
                    See Conditions
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-black dark:text-white">Company</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1">
                    Edit <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Preferred name</span>
                    <span className="font-semibold text-black dark:text-white">{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Entity type</span>
                    <span className="font-semibold text-black dark:text-white">{formData.entityType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">State</span>
                    <span className="font-semibold text-black dark:text-white">{formData.formationState}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">Price Breakdown</h3>
                <div className="space-y-3 mb-6">
                  {orderBreakdown.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="font-semibold text-black dark:text-white">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black dark:text-white">Total due today</span>
                    <span className="text-3xl font-bold text-black dark:text-white">${orderBreakdown.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-[#FFC107] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  After confirming, we'll gather additional details about your company, such as company members, registered address, ownership breakdown, and more.
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-6 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 py-6 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all"
              >
                Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Lock className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                  Secure Payment
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your payment to start your business journey
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#171717] border-2 border-black dark:border-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4">What happens next</h2>
                  <div className="space-y-5">
                    {[
                      { step: "1", title: "Click the payment button", desc: "You'll be redirected to Stripe's secure checkout page." },
                      { step: "2", title: "Enter your card details on Stripe", desc: "Your payment information is handled entirely by Stripe — it never touches our servers." },
                      { step: "3", title: "Payment confirmed instantly", desc: "Once paid, you're brought back to Prolify and your formation order is saved automatically." },
                      { step: "4", title: "We file your company", desc: "Our team processes your formation with the state within the timeframe of your chosen plan." },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFC107] text-black font-black text-sm flex items-center justify-center flex-shrink-0">
                          {step}
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-sm">{title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 flex items-start gap-3">
                  <Lock className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your card details are processed exclusively by Stripe and are never stored on our servers.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] border-2 border-black dark:border-white rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] sticky top-8">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {orderBreakdown.breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                        <span className="font-semibold text-black dark:text-white">${item.amount.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="border-t-2 border-gray-800 dark:border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-black dark:text-white">Total due today</span>
                        <span className="text-3xl font-bold text-black dark:text-white">${orderBreakdown.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                      {paymentError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button
                      onClick={handleComplete}
                      disabled={isRedirectingToPayment}
                      className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Lock className="mr-2 h-5 w-5" />
                      {isRedirectingToPayment ? "Redirecting to Stripe..." : `Pay $${orderBreakdown.total.toFixed(2)} Securely`}
                    </Button>

                    <Button
                      onClick={handleBack}
                      disabled={isRedirectingToPayment}
                      variant="outline"
                      className="w-full py-4 border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] font-bold"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" /> Back to Summary
                    </Button>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Lock className="h-3 w-3" />
                    <span>Powered by Stripe | Secure payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showStateSelector && (
        <StateSelector
          selectedState={formData.formationState}
          onSelectState={handleStateChange}
          onClose={() => setShowStateSelector(false)}
        />
      )}
    </div>
  );
}
