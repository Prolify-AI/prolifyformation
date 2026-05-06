"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, ChevronRight, ArrowLeft, Building2, Search, Package, Briefcase, MapPin, Users, FileText, ClipboardList, CreditCard as Edit, X, Plus, Save, Loader as Loader2, RefreshCw, PartyPopper } from "lucide-react";
import { submitToRainc, checkNameAvailability, type RaincStep, type RaincProgress } from "@/lib/rainc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usStates } from "@/lib/us-states";
import { plans, formationPlans } from "@/lib/plans";
import { supabase } from "@/lib/supabase/client";
import { AddressAutocomplete } from "@/components/dashboard/AddressAutocomplete";
import { useStripePriceConfig } from "@/hooks/useStripePriceConfig";

interface OnboardingWizardProps {
  userId: string;
  userName: string;
  onComplete: () => void;
  startFresh?: boolean;
  paymentSuccess?: boolean;
}

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const STEPS = [
  { id: 1 as StepId, label: "Structure Type", desc: "What will be the structure of this entity?" },
  { id: 2 as StepId, label: "Name Search", desc: "Check if your desired company name is available." },
  { id: 3 as StepId, label: "Formation Package", desc: "Select the package that best fits your business needs." },
  { id: 4 as StepId, label: "Principal Activity", desc: "What products or services will your business provide?" },
  { id: 5 as StepId, label: "Business Address", desc: "Where is your principal place of business?" },
  { id: 6 as StepId, label: "Controlling Officers", desc: "Who is authorized to manage and control this entity?" },
  { id: 7 as StepId, label: "Annual Report", desc: "Would you like to enroll in annual reporting service?" },
  { id: 8 as StepId, label: "Review & Submit", desc: "Review all information and form your entity." },
];

interface FormData {
  entityType: string;
  managementStructure: string;
  companyName: string;
  formationState: string;
  selectedPlan: string;
  businessCategory: string;
  businessPurpose: string;
  principalStreet: string;
  principalCity: string;
  principalState: string;
  principalZip: string;
  mailingSameAsPrincipal: boolean;
  mailingStreet: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  officerType: string;
  officerTitle: string;
  officerFirstName: string;
  officerLastName: string;
  officerPhone: string;
  officerEmail: string;
  officerStreet: string;
  officerCity: string;
  officerState: string;
  officerZip: string;
  annualReportEnrolled: boolean;
}

export default function OnboardingWizard({ userId, userName, onComplete, startFresh = false, paymentSuccess = false }: OnboardingWizardProps) {
  const { getPriceId } = useStripePriceConfig();
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<{ step: RaincStep; message: string } | null>(null);
  const [completedRaincSteps, setCompletedRaincSteps] = useState<Set<RaincStep>>(new Set());
  const [activeRaincStep, setActiveRaincStep] = useState<RaincStep | null>(null);
  const [savedRaincProgress, setSavedRaincProgress] = useState<RaincProgress | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);
  const paymentAutoSubmitRef = useRef(false);

  const [formData, setFormData] = useState<FormData>({
    entityType: "",
    managementStructure: "Member Managed",
    companyName: "",
    formationState: "Wyoming",
    selectedPlan: "formation-starter",
    businessCategory: "",
    businessPurpose: "",
    principalStreet: "",
    principalCity: "",
    principalState: "",
    principalZip: "",
    mailingSameAsPrincipal: true,
    mailingStreet: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
    officerType: "Person",
    officerTitle: "Managing Member",
    officerFirstName: userName.split(" ")[0] || "",
    officerLastName: userName.split(" ").slice(1).join(" ") || "",
    officerPhone: "",
    officerEmail: "",
    officerStreet: "",
    officerCity: "",
    officerState: "",
    officerZip: "",
    annualReportEnrolled: false,
  });

  useEffect(() => {
    async function loadDraft() {
      if (startFresh) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("user_id", userId)
        .eq("completed", false)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setOnboardingId(data.id);
        const restoredStep = (data.current_step as StepId) || 1;
        setCurrentStep(restoredStep);
        const completed = new Set<StepId>();
        for (let s = 1; s < restoredStep; s++) completed.add(s as StepId);
        setCompletedSteps(completed);
        setFormData({
          entityType: data.entity_type || "",
          managementStructure: data.management_structure || "Member Managed",
          companyName: data.company_name || "",
          formationState: data.formation_state || "Wyoming",
          selectedPlan: data.selected_plan || "formation-starter",
          businessCategory: data.business_category || "",
          businessPurpose: data.business_purpose || "",
          principalStreet: data.principal_street || "",
          principalCity: data.principal_city || "",
          principalState: data.principal_state || "",
          principalZip: data.principal_zip || "",
          mailingSameAsPrincipal: data.mailing_same_as_principal ?? true,
          mailingStreet: data.mailing_street || "",
          mailingCity: data.mailing_city || "",
          mailingState: data.mailing_state || "",
          mailingZip: data.mailing_zip || "",
          officerType: data.officer_type || "Person",
          officerTitle: data.officer_title || "Managing Member",
          officerFirstName: data.officer_first_name || userName.split(" ")[0] || "",
          officerLastName: data.officer_last_name || userName.split(" ").slice(1).join(" ") || "",
          officerPhone: data.officer_phone || "",
          officerEmail: data.officer_email || "",
          officerStreet: data.officer_street || "",
          officerCity: data.officer_city || "",
          officerState: data.officer_state || "",
          officerZip: data.officer_zip || "",
          annualReportEnrolled: data.annual_report_enrolled || false,
        });
      }
      setLoading(false);
    }
    loadDraft();
  }, [userId, userName]);

  const saveProgress = useCallback(async (updates: Partial<FormData>, nextStep?: number, showStatus = true) => {
    if (showStatus) setAutoSaveStatus("saving");
    const d = { ...formData, ...updates };
    const dbData = {
      user_id: userId,
      entity_type: d.entityType,
      management_structure: d.managementStructure,
      company_name: d.companyName,
      formation_state: d.formationState,
      selected_plan: d.selectedPlan,
      business_category: d.businessCategory,
      business_purpose: d.businessPurpose,
      principal_street: d.principalStreet,
      principal_city: d.principalCity,
      principal_state: d.principalState,
      principal_zip: d.principalZip,
      mailing_same_as_principal: d.mailingSameAsPrincipal,
      mailing_street: d.mailingSameAsPrincipal ? d.principalStreet : d.mailingStreet,
      mailing_city: d.mailingSameAsPrincipal ? d.principalCity : d.mailingCity,
      mailing_state: d.mailingSameAsPrincipal ? d.principalState : d.mailingState,
      mailing_zip: d.mailingSameAsPrincipal ? d.principalZip : d.mailingZip,
      officer_type: d.officerType,
      officer_title: d.officerTitle,
      officer_first_name: d.officerFirstName,
      officer_last_name: d.officerLastName,
      officer_phone: d.officerPhone,
      officer_email: d.officerEmail,
      officer_street: d.officerStreet,
      officer_city: d.officerCity,
      officer_state: d.officerState,
      officer_zip: d.officerZip,
      annual_report_enrolled: d.annualReportEnrolled,
      business_goal: "form_new",
      plan_price: plans.find((p) => p.id === d.selectedPlan)?.price || 0,
      state_fee: 103.75,
      total_amount: (plans.find((p) => p.id === d.selectedPlan)?.price || 0) + 103.75,
      completed: false,
      current_step: nextStep ?? currentStep,
    };

    try {
      if (onboardingId) {
        await supabase.from("onboarding_data").update(dbData).eq("id", onboardingId);
      } else {
        const { data: existing } = await supabase
          .from("onboarding_data")
          .select("id")
          .eq("user_id", userId)
          .eq("completed", false)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (existing) {
          setOnboardingId(existing.id);
          await supabase.from("onboarding_data").update(dbData).eq("id", existing.id);
        } else {
          const { data } = await supabase.from("onboarding_data").insert(dbData).select().single();
          if (data) setOnboardingId(data.id);
        }
      }
      if (showStatus) {
        setAutoSaveStatus("saved");
        setLastSaved(new Date());
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
      if (showStatus) setAutoSaveStatus("idle");
    }
  }, [formData, userId, onboardingId, currentStep]);

  const handleNext = async (updates: Partial<FormData> = {}) => {
    const updated = { ...formData, ...updates };
    setFormData(updated);
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    const nextStep = currentStep < 8 ? (currentStep + 1) as StepId : currentStep;
    await saveProgress(updates, nextStep);
    if (currentStep < 8) setCurrentStep(nextStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as StepId);
  };

  const goToStep = (stepId: StepId) => {
    if (completedSteps.has(stepId) || stepId < currentStep) setCurrentStep(stepId);
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = async () => {
    try {
      setAutoSaveStatus("saving");
      const d = formData;
      const dbData = {
        user_id: userId,
        entity_type: d.entityType,
        management_structure: d.managementStructure,
        company_name: d.companyName,
        formation_state: d.formationState,
        selected_plan: d.selectedPlan,
        business_category: d.businessCategory,
        business_purpose: d.businessPurpose,
        principal_street: d.principalStreet,
        principal_city: d.principalCity,
        principal_state: d.principalState,
        principal_zip: d.principalZip,
        mailing_same_as_principal: d.mailingSameAsPrincipal,
        mailing_street: d.mailingSameAsPrincipal ? d.principalStreet : d.mailingStreet,
        mailing_city: d.mailingSameAsPrincipal ? d.principalCity : d.mailingCity,
        mailing_state: d.mailingSameAsPrincipal ? d.principalState : d.mailingState,
        mailing_zip: d.mailingSameAsPrincipal ? d.principalZip : d.mailingZip,
        officer_type: d.officerType,
        officer_title: d.officerTitle,
        officer_first_name: d.officerFirstName,
        officer_last_name: d.officerLastName,
        officer_street: d.officerStreet,
        officer_city: d.officerCity,
        officer_state: d.officerState,
        officer_zip: d.officerZip,
        annual_report_enrolled: d.annualReportEnrolled,
        business_goal: "form_new",
        plan_price: plans.find((p) => p.id === d.selectedPlan)?.price || 0,
        state_fee: 103.75,
        total_amount: (plans.find((p) => p.id === d.selectedPlan)?.price || 0) + 103.75,
        completed: false,
        current_step: currentStep,
      };

      if (onboardingId) {
        await supabase.from("onboarding_data").update(dbData).eq("id", onboardingId);
      } else {
        const { data: existing } = await supabase
          .from("onboarding_data")
          .select("id")
          .eq("user_id", userId)
          .eq("completed", false)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (existing) {
          await supabase.from("onboarding_data").update(dbData).eq("id", existing.id);
        } else {
          await supabase.from("onboarding_data").insert(dbData);
        }
      }
      setAutoSaveStatus("saved");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      onComplete();
    }
  };

  const persistRaincProgress = (progress: RaincProgress) => {
    try {
      localStorage.setItem(`rainc_progress_${userId}`, JSON.stringify({ progress, formData }));
    } catch {}
  };

  const loadRaincProgress = (): RaincProgress | null => {
    try {
      const raw = localStorage.getItem(`rainc_progress_${userId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.progress || null;
    } catch {
      return null;
    }
  };

  const clearRaincProgress = () => {
    try {
      localStorage.removeItem(`rainc_progress_${userId}`);
    } catch {}
  };

  const runRaincSubmission = async (resumeProgress: RaincProgress | null = null) => {
    setSubmitting(true);
    setSubmitError(null);
    setCompletedRaincSteps(new Set());
    setActiveRaincStep("create_company");

    const suffix = formData.entityType === "C-Corp" ? "Inc." : "LLC";

    const result = await submitToRainc(
      {
        companyName: `${formData.companyName} ${suffix}`,
        entityType: formData.entityType,
        businessState: formData.formationState,
        managementStructure: formData.managementStructure,
        contactTitle: formData.officerTitle || "Owner",
        contactFirstName: formData.officerFirstName,
        contactLastName: formData.officerLastName,
        contactPhone: formData.officerPhone || "",
        contactEmail: formData.officerEmail || "",
        contactStreet: formData.officerStreet,
        contactCity: formData.officerCity,
        contactState: formData.officerState,
        contactZip: formData.officerZip,
      },
      resumeProgress,
      (completedStep, progress) => {
        setCompletedRaincSteps((prev) => new Set([...prev, completedStep]));
        const stepOrder: RaincStep[] = ["create_company", "add_service", "submit_info"];
        const nextIdx = stepOrder.indexOf(completedStep) + 1;
        if (nextIdx < stepOrder.length) setActiveRaincStep(stepOrder[nextIdx]);
        persistRaincProgress(progress);
      }
    );

   if (result.success) {
      await finalizeSubmission(result.companyId);
      clearRaincProgress();
      setSubmitSuccess(true);
      setSubmitting(false);
      setTimeout(() => onComplete(), 3000);
    } else {
      if (result.error.startsWith("INVALID_COMPANY:") || result.error.startsWith("Une company")) {
        clearRaincProgress();
        setSavedRaincProgress(null);
      }
      setSubmitError({ step: result.failedStep, message: result.error });
      setSubmitting(false);
    }
  };

  const finalizeSubmission = async (raincCompanyId: string) => {
    const dbData: Record<string, unknown> = {
      user_id: userId,
      entity_type: formData.entityType,
      management_structure: formData.managementStructure,
      company_name: formData.companyName,
      formation_state: formData.formationState,
      selected_plan: formData.selectedPlan,
      business_category: formData.businessCategory,
      business_purpose: formData.businessPurpose,
      principal_street: formData.principalStreet,
      principal_city: formData.principalCity,
      principal_state: formData.principalState,
      principal_zip: formData.principalZip,
      mailing_same_as_principal: formData.mailingSameAsPrincipal,
      mailing_street: formData.mailingSameAsPrincipal ? formData.principalStreet : formData.mailingStreet,
      mailing_city: formData.mailingSameAsPrincipal ? formData.principalCity : formData.mailingCity,
      mailing_state: formData.mailingSameAsPrincipal ? formData.principalState : formData.mailingState,
      mailing_zip: formData.mailingSameAsPrincipal ? formData.principalZip : formData.mailingZip,
      officer_type: formData.officerType,
      officer_title: formData.officerTitle,
      officer_first_name: formData.officerFirstName,
      officer_last_name: formData.officerLastName,
      officer_phone: formData.officerPhone,
      officer_email: formData.officerEmail,
      officer_street: formData.officerStreet,
      officer_city: formData.officerCity,
      officer_state: formData.officerState,
      officer_zip: formData.officerZip,
      annual_report_enrolled: formData.annualReportEnrolled,
      business_goal: "form_new",
      plan_price: plans.find((p) => p.id === formData.selectedPlan)?.price || 0,
      state_fee: 103.75,
      total_amount: (plans.find((p) => p.id === formData.selectedPlan)?.price || 0) + 103.75,
      completed: true,
    };

    if (onboardingId) {
      await supabase.from("onboarding_data").update(dbData).eq("id", onboardingId);
    } else {
      await supabase.from("onboarding_data").insert(dbData);
    }

    const suffix = formData.entityType === "C-Corp" ? "Inc." : "LLC";
    await supabase.from("user_companies").insert({
      user_id: userId,
      name: `${formData.companyName} ${suffix}`,
      entity_type: formData.entityType,
      formation_state: formData.formationState,
      address: `${formData.principalStreet}, ${formData.principalCity}, ${formData.principalState} ${formData.principalZip}`,
      officer_first_name: formData.officerFirstName,
      officer_last_name: formData.officerLastName,
      officer_title: formData.officerTitle,
      rainc_company_id: raincCompanyId,
      status: "active",
      plan: formData.selectedPlan,
    });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", userId)
      .single();

    if (profileData?.company_id) {
      await supabase.from("companies").update({
        name: formData.companyName,
        business_type: formData.entityType,
        current_plan: formData.selectedPlan,
        address: `${formData.principalStreet}, ${formData.principalCity}, ${formData.principalState} ${formData.principalZip}`,
      }).eq("id", profileData.company_id);
    }

    await supabase.from("profiles").update({ profile_completed: true }).eq("id", userId);
  };

  const handleComplete = async () => {
    setPaymentError(null);
    const priceId = getPriceId(formData.selectedPlan);

    if (!priceId || !priceId.startsWith("price_1")) {
      const saved = loadRaincProgress();
      await runRaincSubmission(saved);
      return;
    }

    setRedirectingToPayment(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !session) {
        setPaymentError("Please sign in to complete your payment.");
        setRedirectingToPayment(false);
        return;
      }

      await saveProgress({}, 8, false);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const origin = window.location.origin;

      const plan = plans.find((p) => p.id === formData.selectedPlan);
      const stateData = usStates.find((s) => s.name === formData.formationState);
      const stateFee = stateData
        ? (formData.entityType === "C-Corp" ? stateData.corpFee : stateData.llcFee)
        : 103.75;
      const prolifyFee = plan?.price ?? 0;
      const totalAmount = prolifyFee + stateFee;

      const response = await fetch(`${supabaseUrl}/functions/v1/formation-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "Apikey": supabaseAnonKey ?? "",
        },
        body: JSON.stringify({
          user_id: userId,
          email: session.user.email,
          formation_state: formData.formationState,
          state_code: stateData?.code ?? "",
          entity_type: formData.entityType,
          company_name: formData.companyName,
          plan_id: formData.selectedPlan,
          plan_name: plan?.name ?? formData.selectedPlan,
          prolify_fee: prolifyFee,
          state_fee: stateFee,
          expedited_ein_fee: 0,
          total_amount: totalAmount,
          success_url: `${origin}/dashboard?formation_payment=success`,
          cancel_url: `${origin}/dashboard?start_formation=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const parts = [data.error || `HTTP ${response.status}`];
        if (data.code) parts.push(`[${data.code}]`);
        if (data.type) parts.push(`(${data.type})`);
        throw new Error(parts.join(" "));
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setPaymentError(message);
      setRedirectingToPayment(false);
    }
  };

  useEffect(() => {
    if (loading || paymentAutoSubmitRef.current) return;
    if (paymentSuccess) {
      paymentAutoSubmitRef.current = true;
      const saved = loadRaincProgress();
      runRaincSubmission(saved);
    }
  }, [loading, paymentSuccess]);

  const selectedPlan = plans.find((p) => p.id === formData.selectedPlan);
  const totalAmount = (selectedPlan?.price || 0) + 103.75;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-black/60 dark:text-white/60">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (submitting || submitSuccess || submitError) {
    const displaySteps = [
      { key: "create_company" as RaincStep, label: "Creating your company..." },
      { key: "add_service" as RaincStep, label: "Registering in jurisdiction..." },
      { key: "submit_info" as RaincStep, label: "Submitting formation details..." },
    ];

    const stepDone = (key: RaincStep) => completedRaincSteps.has(key);
    const stepActive = (key: RaincStep) => activeRaincStep === key;
    const stepFailed = (key: RaincStep) => {
      if (!submitError) return false;
      return submitError.step === key;
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md mx-4">
          {submitSuccess ? (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FFC107]/15 flex items-center justify-center">
                <PartyPopper className="h-10 w-10 text-[#FFC107]" />
              </div>
              <h2 className="text-2xl font-black text-black dark:text-white mb-2">Company Successfully Formed!</h2>
              <p className="text-black/50 dark:text-white/50 text-sm mb-6">
                Your company is now active. Redirecting you to the dashboard...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFC107]/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-[#FFC107]" />
                </div>
                <h2 className="text-xl font-black text-black dark:text-white">
                  {submitError ? "Formation Paused" : "Forming Your Company"}
                </h2>
                <p className="text-sm text-black/40 dark:text-white/40 mt-1">
                  {submitError ? `Failed at: ${submitError.step.replace(/_/g, " ")}` : "Please don't close this window"}
                </p>
              </div>

              <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl overflow-hidden mb-5">
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {displaySteps.map((s) => {
                    const done = stepDone(s.key);
                    const active = !done && stepActive(s.key) && !submitError;
                    const failed = stepFailed(s.key);

                    return (
                      <div key={s.key} className="flex items-center gap-4 px-5 py-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                          {done ? (
                            <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center">
                              <Check className="h-4 w-4 text-black" strokeWidth={3} />
                            </div>
                          ) : failed ? (
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <X className="h-4 w-4 text-red-500" strokeWidth={3} />
                            </div>
                          ) : active ? (
                            <div className="w-8 h-8 rounded-full border-2 border-[#FFC107] border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-black/15 dark:border-white/15" />
                          )}
                        </div>
                        <p className={`text-sm font-semibold ${
                          done ? "text-black dark:text-white" :
                          failed ? "text-red-500" :
                          active ? "text-black dark:text-white" :
                          "text-black/30 dark:text-white/30"
                        }`}>
                          {s.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {submitError && (
                <div className="space-y-3">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Error details</p>
                    <p className="text-xs text-red-500 dark:text-red-400/80 font-mono break-all">{submitError.message}</p>
                  </div>
                  <button
                    onClick={() => runRaincSubmission(savedRaincProgress)}
                    className="w-full h-11 rounded-xl bg-[#FFC107] hover:bg-[#FFB300] text-black font-black flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry from where it stopped
                  </button>
                  <button
                    onClick={() => { setSubmitError(null); setSavedRaincProgress(null); }}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 text-sm font-semibold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Go back and review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-white dark:bg-[#0a0a0a]">
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border-2 border-black/10 dark:border-white/10">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-[#FFC107]/20 flex items-center justify-center mx-auto mb-4">
                <Save className="h-6 w-6 text-[#FFC107]" />
              </div>
              <h3 className="text-xl font-black text-black dark:text-white text-center mb-2">Save & Exit?</h3>
              <p className="text-sm text-black/60 dark:text-white/60 text-center mb-6">
                Your progress will be saved. You can continue from Step {currentStep} anytime by clicking
                &quot;Continue Formation&quot; on your dashboard.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowExitConfirm(false)}
                  variant="outline"
                  className="flex-1 border-2 border-black/20 dark:border-white/20 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmExit}
                  className="flex-1 bg-[#FFC107] hover:bg-[#FFB300] text-black font-black"
                >
                  {autoSaveStatus === "saving" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save & Exit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="w-72 flex-shrink-0 bg-[#f5f5f0] dark:bg-[#111] border-r-2 border-black/10 dark:border-white/10 flex flex-col">
        <div className="p-6 border-b-2 border-black/10 dark:border-white/10">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 text-sm font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Save & Exit
          </button>
          <h2 className="text-lg font-black text-black dark:text-white">Form a Company</h2>
          <p className="text-sm text-black/60 dark:text-white/60">Start your new business</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-black/10 dark:bg-white/10" />
            <div className="space-y-1">
              {STEPS.map((step, idx) => {
                const isCompleted = completedSteps.has(step.id);
                const isActive = step.id === currentStep;
                const isClickable = isCompleted || step.id < currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => isClickable && goToStep(step.id)}
                    disabled={!isClickable && !isActive}
                    className={`w-full flex items-start gap-3 p-2 rounded-xl text-left transition-all relative ${
                      isActive
                        ? "bg-white dark:bg-white/10 shadow-sm"
                        : isClickable
                        ? "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                        : "cursor-default"
                    }`}
                  >
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center">
                          <Check className="h-4 w-4 text-black" strokeWidth={3} />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                            isActive
                              ? "border-[#FFC107] bg-[#FFC107] text-black"
                              : "border-black/25 dark:border-white/25 text-black/40 dark:text-white/40 bg-[#f5f5f0] dark:bg-[#111]"
                          }`}
                        >
                          {step.id}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold leading-tight ${
                          isActive
                            ? "text-black dark:text-white"
                            : isCompleted
                            ? "text-black/80 dark:text-white/80"
                            : "text-black/40 dark:text-white/40"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 leading-snug ${
                          isActive
                            ? "text-black/60 dark:text-white/60"
                            : isCompleted
                            ? "text-black/50 dark:text-white/50"
                            : "text-black/30 dark:text-white/30"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <ProgressBanner
          currentStep={currentStep}
          completedSteps={completedSteps}
          totalSteps={STEPS.length}
          autoSaveStatus={autoSaveStatus}
          lastSaved={lastSaved}
        />
        <div className="max-w-2xl mx-auto px-8 py-10">
          {currentStep === 1 && (
            <StructureTypeStep
              entityType={formData.entityType}
              managementStructure={formData.managementStructure}
              onNext={(entityType, managementStructure) =>
                handleNext({ entityType, managementStructure })
              }
            />
          )}
          {currentStep === 2 && (
            <NameSearchStep
              companyName={formData.companyName}
              formationState={formData.formationState}
              entityType={formData.entityType}
              onNext={(companyName, formationState) =>
                handleNext({ companyName, formationState })
              }
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <FormationPackageStep
              selectedPlan={formData.selectedPlan}
              onNext={(selectedPlan) => handleNext({ selectedPlan })}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <PrincipalActivityStep
              businessCategory={formData.businessCategory}
              businessPurpose={formData.businessPurpose}
              onNext={(businessCategory, businessPurpose) =>
                handleNext({ businessCategory, businessPurpose })
              }
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <BusinessAddressStep
              data={formData}
              onNext={(updates) => handleNext(updates)}
              onBack={handleBack}
            />
          )}
          {currentStep === 6 && (
            <ControllingOfficersStep
              data={formData}
              onNext={(updates) => handleNext(updates)}
              onBack={handleBack}
            />
          )}
          {currentStep === 7 && (
            <AnnualReportStep
              enrolled={formData.annualReportEnrolled}
              onNext={(annualReportEnrolled) => handleNext({ annualReportEnrolled })}
              onBack={handleBack}
            />
          )}
          {currentStep === 8 && (
            <ReviewSubmitStep
              formData={formData}
              totalAmount={totalAmount}
              saving={saving || submitting || redirectingToPayment}
              onGoToStep={goToStep}
              onSubmit={handleComplete}
              onBack={handleBack}
              paymentError={paymentError}
              redirectingToPayment={redirectingToPayment}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ProgressBanner({
  currentStep,
  completedSteps,
  totalSteps,
  autoSaveStatus,
  lastSaved,
}: {
  currentStep: StepId;
  completedSteps: Set<StepId>;
  totalSteps: number;
  autoSaveStatus: "idle" | "saving" | "saved";
  lastSaved: Date | null;
}) {
  const stepsRemaining = totalSteps - 1 - completedSteps.size;
  const progressPercent = Math.round((completedSteps.size / (totalSteps - 1)) * 100);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="border-b-2 border-[#FFC107]/40 bg-[#FFC107]/8 px-8 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFC107]/20 border-2 border-[#FFC107]/40 flex items-center justify-center">
              <span className="text-xs font-black text-black dark:text-white">{completedSteps.size}/{totalSteps - 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-black dark:text-white">
                {currentStep === 8
                  ? "Ready to submit"
                  : stepsRemaining > 0
                  ? `${stepsRemaining} step${stepsRemaining !== 1 ? "s" : ""} remaining`
                  : "Almost done — review and submit"}
              </p>
              <p className="text-xs text-black/50 dark:text-white/50 truncate">
                Step {currentStep} of {totalSteps}: {STEPS.find((s) => s.id === currentStep)?.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              {autoSaveStatus === "saving" && (
                <>
                  <Loader2 className="h-3 w-3 text-black/40 dark:text-white/40 animate-spin" />
                  <span className="text-xs text-black/40 dark:text-white/40">Saving...</span>
                </>
              )}
              {autoSaveStatus === "saved" && (
                <>
                  <Check className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Saved</span>
                </>
              )}
              {autoSaveStatus === "idle" && lastSaved && (
                <>
                  <Save className="h-3 w-3 text-black/30 dark:text-white/30" />
                  <span className="text-xs text-black/30 dark:text-white/30">Saved at {formatTime(lastSaved)}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FFC107] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-black/60 dark:text-white/60 w-8 text-right">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-black text-black dark:text-white mb-1">{title}</h1>
      <p className="text-black/60 dark:text-white/60">{subtitle}</p>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-black/10 dark:border-white/10">
      {onBack ? (
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-black/20 dark:border-white/20 font-semibold hover:border-[#FFC107] gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-black px-8 gap-2 disabled:opacity-40"
      >
        {nextLabel} <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function StructureTypeStep({
  entityType,
  managementStructure,
  onNext,
}: {
  entityType: string;
  managementStructure: string;
  onNext: (entityType: string, mgmt: string) => void;
}) {
  const [selected, setSelected] = useState(entityType || "LLC");
  const [mgmt, setMgmt] = useState(managementStructure);

  const entities = [
    { id: "LLC", label: "Limited Liability Company (LLC)", desc: "Flexible structure with liability protection, ideal for most small businesses and international founders." },
    { id: "C-Corp", label: "C Corporation (C-Corp)", desc: "Best for startups seeking venture capital, with ability to issue stock options to employees." },
  ];

  const structures = ["Member Managed", "Manager Managed"];

  return (
    <div>
      <StepHeader title="Structure Type" subtitle="What will be the structure of this entity?" />

      <div className="space-y-3 mb-8">
        <p className="text-sm font-bold text-black/70 dark:text-white/70">Entity Type</p>
        {entities.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selected === e.id
                ? "border-[#FFC107] bg-[#FFC107]/8"
                : "border-black/15 dark:border-white/15 hover:border-[#FFC107]/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-black dark:text-white text-sm">{e.label}</p>
                <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">{e.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 flex items-center justify-center ${
                  selected === e.id ? "border-[#FFC107] bg-[#FFC107]" : "border-black/30 dark:border-white/30"
                }`}
              >
                {selected === e.id && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected === "LLC" && (
        <div className="mb-8">
          <p className="text-sm font-bold text-black/70 dark:text-white/70 mb-3">Management Structure</p>
          <div className="flex gap-2">
            {structures.map((s) => (
              <button
                key={s}
                onClick={() => setMgmt(s)}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                  mgmt === s
                    ? "border-[#FFC107] bg-[#FFC107] text-black"
                    : "border-black/15 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-[#FFC107]/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <NavButtons onNext={() => selected && onNext(selected, mgmt)} nextDisabled={!selected} />
    </div>
  );
}

function NameSearchStep({
  companyName,
  formationState,
  entityType,
  onNext,
  onBack,
}: {
  companyName: string;
  formationState: string;
  entityType: string;
  onNext: (name: string, state: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(companyName);
  const [state, setState] = useState(formationState || "Wyoming");
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<"available" | "taken" | "error" | null>(null);
  const [checkedName, setCheckedName] = useState("");
  const suffix = entityType === "C-Corp" ? "Inc." : "LLC";

  const fullName = name.trim() ? `${name.trim()} ${suffix}` : "";

  const handleNameChange = (value: string) => {
    setName(value);
    if (availability !== null) setAvailability(null);
  };

  const handleCheckAvailability = async () => {
    if (!name.trim()) return;
    setChecking(true);
    setAvailability(null);
    const result = await checkNameAvailability(fullName);
    setCheckedName(fullName);
    if (result.error) {
      setAvailability("error");
    } else {
      setAvailability(result.available ? "available" : "taken");
    }
    setChecking(false);
  };

  const nameChanged = checkedName !== fullName;
  const canProceed = availability === "available" && !nameChanged;

  return (
    <div>
      <StepHeader title="Name Search" subtitle="Check if your desired company name is available." />

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-2">Company Name</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 dark:text-white/40" />
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your company name"
                className="pl-9 border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-11"
              />
            </div>
            <div className="px-3 py-2.5 bg-[#FFC107] rounded-lg text-sm font-black text-black whitespace-nowrap">
              {suffix}
            </div>
          </div>
          {name.trim() && (
            <p className="text-xs text-black/50 dark:text-white/50 mt-2">
              Legal name: <span className="font-semibold text-black dark:text-white">{fullName}</span>
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={handleCheckAvailability}
          disabled={!name.trim() || checking}
          className="w-full h-11 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-40"
        >
          {checking ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking availability...
            </span>
          ) : (
            "Check Availability"
          )}
        </Button>

        {availability === "available" && !nameChanged && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-700 dark:text-green-400">This name is available!</p>
              <p className="text-xs text-green-600/80 dark:text-green-500/80 mt-0.5">{checkedName} is ready to register.</p>
            </div>
          </div>
        )}

        {availability === "taken" && !nameChanged && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800">
            <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400">This name is already taken.</p>
              <p className="text-xs text-red-600/80 dark:text-red-500/80 mt-0.5">Please choose a different company name.</p>
            </div>
          </div>
        )}

        {availability === "error" && !nameChanged && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800">
            <RefreshCw className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">Could not verify availability.</p>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-500/80 mt-0.5">Please try again or proceed with this name.</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-2">State of Formation</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full h-11 px-3 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm font-medium focus:border-[#FFC107] focus:outline-none"
          >
            {usStates.map((s) => (
              <option key={s.code} value={s.name}>
                {s.name} {s.recommended ? "★ Recommended" : ""}
              </option>
            ))}
          </select>
        </div>

        {state && (
          <div className="p-4 rounded-xl bg-[#FFC107]/10 border-2 border-[#FFC107]/30">
            <p className="text-xs font-bold text-black dark:text-white mb-1">Formation State: {state}</p>
            <p className="text-xs text-black/60 dark:text-white/60">
              {usStates.find((s) => s.name === state)?.description || "Professional formation services included."}
            </p>
            <p className="text-xs font-semibold text-black dark:text-white mt-1">
              State fee: ${usStates.find((s) => s.name === state)?.fee?.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={() => canProceed && onNext(name.trim(), state)}
        nextDisabled={!canProceed}
      />
    </div>
  );
}

function FormationPackageStep({
  selectedPlan,
  onNext,
  onBack,
}: {
  selectedPlan: string;
  onNext: (planId: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState(selectedPlan || "formation-starter");

  return (
    <div>
      <StepHeader title="Formation Package" subtitle="Select the package that best fits your business needs." />

      <div className="space-y-3 mb-8">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-[#FFC107] bg-[#FFC107]/8"
                  : "border-black/15 dark:border-white/15 hover:border-[#FFC107]/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-black dark:text-white">{plan.name}</p>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FFC107] text-black text-xs font-black">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black/60 dark:text-white/60 mb-2">{plan.tagline}</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.coreFeatures.slice(0, 3).map((f) => (
                      <span key={f} className="flex items-center gap-1 text-xs text-black/60 dark:text-white/60">
                        <Check className="h-3 w-3 text-[#FFC107] flex-shrink-0" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-xl font-black text-black dark:text-white">
                    {plan.price === 0 ? "Free" : `$${plan.price.toLocaleString()}`}
                  </p>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-[#FFC107] bg-[#FFC107]" : "border-black/30 dark:border-white/30"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <NavButtons onBack={onBack} onNext={() => onNext(selected)} />
    </div>
  );
}

const BUSINESS_CATEGORIES = [
  "Accommodations", "Construction", "Consulting",
  "Finance", "Food Services", "Health Care",
  "Insurance", "Manufacturing", "Organization",
  "Real Estate", "Rental & Leasing", "Repair",
  "Retail", "Sell Goods", "Service",
  "Social Assistance", "Transportation", "Warehousing",
  "Wholesale", "Other",
];

function PrincipalActivityStep({
  businessCategory,
  businessPurpose,
  onNext,
  onBack,
}: {
  businessCategory: string;
  businessPurpose: string;
  onNext: (category: string, purpose: string) => void;
  onBack: () => void;
}) {
  const [category, setCategory] = useState(businessCategory);
  const [purpose, setPurpose] = useState(businessPurpose);

  return (
    <div>
      <StepHeader title="Principal Activity" subtitle="What products or services will your business provide?" />

      <div className="space-y-6 mb-8">
        <div>
          <p className="text-sm font-bold text-black dark:text-white mb-3">Business category</p>
          <div className="grid grid-cols-3 gap-2">
            {BUSINESS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left text-xs font-semibold transition-all ${
                  category === cat
                    ? "border-[#FFC107] bg-[#FFC107]/10 text-black dark:text-white"
                    : "border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:border-[#FFC107]/50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    category === cat ? "border-[#FFC107] bg-[#FFC107]" : "border-black/30 dark:border-white/30"
                  }`}
                >
                  {category === cat && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
                </div>
                {cat}
              </button>
            ))}
          </div>
          <p className="text-xs text-black/50 dark:text-white/50 mt-2">
            Select the option that best describes the category of your business.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-black dark:text-white mb-2">Business purpose</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Description..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none resize-none"
          />
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Indicate principal line of merchandise sold, specific construction work done, products produced, or services provided.
          </p>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={() => category && onNext(category, purpose)} nextDisabled={!category} />
    </div>
  );
}

function BusinessAddressStep({
  data,
  onNext,
  onBack,
}: {
  data: FormData;
  onNext: (updates: Partial<FormData>) => void;
  onBack: () => void;
}) {
  const [street, setStreet] = useState(data.principalStreet);
  const [city, setCity] = useState(data.principalCity);
  const [state, setState] = useState(data.principalState);
  const [zip, setZip] = useState(data.principalZip);
  const [sameAsPrincipal, setSameAsPrincipal] = useState(data.mailingSameAsPrincipal);
  const [mStreet, setMStreet] = useState(data.mailingStreet);
  const [mCity, setMCity] = useState(data.mailingCity);
  const [mState, setMState] = useState(data.mailingState);
  const [mZip, setMZip] = useState(data.mailingZip);

  const canContinue = street.trim() && city.trim() && state && zip.trim();

  return (
    <div>
      <StepHeader title="Business Address" subtitle="Where is your principal place of business?" />

      <div className="space-y-6 mb-8">
        <div>
          <p className="text-sm font-black text-black dark:text-white mb-3">Principal Address</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Street</label>
              <AddressAutocomplete
                value={street}
                onChange={setStreet}
                onAddressSelect={(parts) => {
                  setStreet(parts.street);
                  if (parts.city) setCity(parts.city);
                  if (parts.state) setState(parts.state);
                  if (parts.zip) setZip(parts.zip);
                }}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-10 px-2 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none"
                >
                  <option value="">State</option>
                  {usStates.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Zip code</label>
                <Input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="10001"
                  className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black text-black dark:text-white">Mailing Address</p>
            <button
              onClick={() => setSameAsPrincipal(!sameAsPrincipal)}
              className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                sameAsPrincipal ? "text-[#FFC107]" : "text-black/60 dark:text-white/60"
              }`}
            >
              <div
                className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                  sameAsPrincipal ? "bg-[#FFC107]" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${
                    sameAsPrincipal ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              Same as principal
            </button>
          </div>

          {!sameAsPrincipal && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Street</label>
                <AddressAutocomplete
                  value={mStreet}
                  onChange={setMStreet}
                  onAddressSelect={(parts) => {
                    setMStreet(parts.street);
                    if (parts.city) setMCity(parts.city);
                    if (parts.state) setMState(parts.state);
                    if (parts.zip) setMZip(parts.zip);
                  }}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">City</label>
                  <Input value={mCity} onChange={(e) => setMCity(e.target.value)} placeholder="New York" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">State</label>
                  <select value={mState} onChange={(e) => setMState(e.target.value)} className="w-full h-10 px-2 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none">
                    <option value="">State</option>
                    {usStates.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Zip code</label>
                  <Input value={mZip} onChange={(e) => setMZip(e.target.value)} placeholder="10001" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
                </div>
              </div>
            </div>
          )}

          {sameAsPrincipal && street && (
            <div className="grid grid-cols-3 gap-3 opacity-50 pointer-events-none">
              <div className="col-span-3">
                <Input value={street} readOnly className="border-2 border-black/10 h-10 bg-black/5" />
              </div>
              <Input value={city} readOnly className="border-2 border-black/10 h-10 bg-black/5" />
              <Input value={state} readOnly className="border-2 border-black/10 h-10 bg-black/5" />
              <Input value={zip} readOnly className="border-2 border-black/10 h-10 bg-black/5" />
            </div>
          )}
        </div>
      </div>

      <NavButtons
        onBack={onBack}
        onNext={() =>
          onNext({
            principalStreet: street,
            principalCity: city,
            principalState: state,
            principalZip: zip,
            mailingSameAsPrincipal: sameAsPrincipal,
            mailingStreet: sameAsPrincipal ? street : mStreet,
            mailingCity: sameAsPrincipal ? city : mCity,
            mailingState: sameAsPrincipal ? state : mState,
            mailingZip: sameAsPrincipal ? zip : mZip,
          })
        }
        nextDisabled={!canContinue}
      />
    </div>
  );
}

const OFFICER_TITLES = ["Managing Member", "President", "CEO", "CFO", "COO", "Secretary", "Director", "Manager"];

function ControllingOfficersStep({
  data,
  onNext,
  onBack,
}: {
  data: FormData;
  onNext: (updates: Partial<FormData>) => void;
  onBack: () => void;
}) {
  const [type, setType] = useState(data.officerType || "Person");
  const [title, setTitle] = useState(data.officerTitle || "Managing Member");
  const [firstName, setFirstName] = useState(data.officerFirstName);
  const [lastName, setLastName] = useState(data.officerLastName);
  const [phone, setPhone] = useState(data.officerPhone || "");
  const [email, setEmail] = useState(data.officerEmail || "");
  const [street, setStreet] = useState(data.officerStreet || data.principalStreet);
  const [city, setCity] = useState(data.officerCity || data.principalCity);
  const [state, setState] = useState(data.officerState || data.principalState);
  const [zip, setZip] = useState(data.officerZip || data.principalZip);

  const usePrincipal = () => {
    setStreet(data.principalStreet);
    setCity(data.principalCity);
    setState(data.principalState);
    setZip(data.principalZip);
  };

  const canContinue = firstName.trim() && lastName.trim() && phone.trim() && email.trim();

  return (
    <div>
      <StepHeader title="Controlling Officers" subtitle="Who is authorized to manage and control this entity?" />

      <div className="border-2 border-black/10 dark:border-white/10 rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b-2 border-black/10 dark:border-white/10 bg-[#FFC107]">
          <span className="text-sm font-black text-black">Primary Officer</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-2">Type</label>
              <div className="flex gap-2">
                {["Person", "Company"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                      type === t
                        ? "border-[#FFC107] bg-[#FFC107] text-black"
                        : "border-black/15 dark:border-white/15 text-black/70 dark:text-white/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-2">Title</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-2 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none"
              >
                {OFFICER_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">First name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Last name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Phone number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" type="tel" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Email address</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" type="email" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-black/60 dark:text-white/60">Street</label>
              <button onClick={usePrincipal} className="text-xs font-semibold text-[#FFC107] hover:underline">
                Use Principal Address
              </button>
            </div>
            <AddressAutocomplete
              value={street}
              onChange={setStreet}
              onAddressSelect={(parts) => {
                setStreet(parts.street);
                if (parts.city) setCity(parts.city);
                if (parts.state) setState(parts.state);
                if (parts.zip) setZip(parts.zip);
              }}
              placeholder="123 Main Street, Suite 100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Anytown" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full h-10 px-2 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white text-sm focus:border-[#FFC107] focus:outline-none">
                <option value="">Select</option>
                {usStates.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1">Zip code</label>
              <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="12345" className="border-2 border-black/15 dark:border-white/15 focus:border-[#FFC107] h-10" />
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 border-2 border-dashed border-black/20 dark:border-white/20 rounded-xl text-sm font-semibold text-black/60 dark:text-white/60 hover:border-[#FFC107] hover:text-[#FFC107] transition-all flex items-center justify-center gap-2 mb-8">
        <Plus className="h-4 w-4" /> Add Officer
      </button>

      <NavButtons
        onBack={onBack}
        onNext={() =>
          onNext({ officerType: type, officerTitle: title, officerFirstName: firstName, officerLastName: lastName, officerPhone: phone, officerEmail: email, officerStreet: street, officerCity: city, officerState: state, officerZip: zip })
        }
        nextDisabled={!canContinue}
      />
    </div>
  );
}

function AnnualReportStep({
  enrolled,
  onNext,
  onBack,
}: {
  enrolled: boolean;
  onNext: (enrolled: boolean) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(enrolled ? true : null);

  const options = [
    {
      value: true,
      title: "Yes, enroll me in annual reporting",
      desc: "We'll file your annual state report automatically each year. Avoid fines and stay compliant without lifting a finger.",
      badge: "Recommended",
    },
    {
      value: false,
      title: "No, I'll handle it myself",
      desc: "You'll be responsible for filing your annual state report by the due date each year.",
      badge: null,
    },
  ];

  return (
    <div>
      <StepHeader title="Annual Report" subtitle="Would you like to enroll in annual reporting service?" />

      <div className="space-y-3 mb-8">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => setSelected(opt.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selected === opt.value
                ? "border-[#FFC107] bg-[#FFC107]/8"
                : "border-black/15 dark:border-white/15 hover:border-[#FFC107]/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-black dark:text-white text-sm">{opt.title}</p>
                  {opt.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFC107] text-black text-xs font-black">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-black/60 dark:text-white/60">{opt.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  selected === opt.value ? "border-[#FFC107] bg-[#FFC107]" : "border-black/30 dark:border-white/30"
                }`}
              >
                {selected === opt.value && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
              </div>
            </div>
          </button>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={() => selected !== null && onNext(selected)} nextDisabled={selected === null} />
    </div>
  );
}

function ReviewSubmitStep({
  formData,
  totalAmount,
  saving,
  onGoToStep,
  onSubmit,
  onBack,
  paymentError,
  redirectingToPayment,
}: {
  formData: FormData;
  totalAmount: number;
  saving: boolean;
  onGoToStep: (step: StepId) => void;
  onSubmit: () => void;
  onBack: () => void;
  paymentError?: string | null;
  redirectingToPayment?: boolean;
}) {
  const plan = plans.find((p) => p.id === formData.selectedPlan);
  const suffix = formData.entityType === "C-Corp" ? "Inc." : "LLC";

  const sections = [
    {
      title: "Entity Information",
      step: 1 as StepId,
      rows: [
        { label: "Entity type", value: formData.entityType === "C-Corp" ? "C Corporation" : "Limited Liability Company" },
        { label: "Structure type", value: formData.managementStructure },
        { label: "State of formation", value: formData.formationState },
        { label: "Legal name", value: `${formData.companyName} ${suffix}` },
      ],
    },
    {
      title: "Principal Activity",
      step: 4 as StepId,
      rows: [
        { label: "Category", value: formData.businessCategory },
        { label: "Purpose", value: formData.businessPurpose || "—" },
      ],
    },
    {
      title: "Business Address",
      step: 5 as StepId,
      rows: [
        { label: "Principal address", value: `${formData.principalStreet}, ${formData.principalCity}, ${formData.principalState} ${formData.principalZip}` },
        { label: "Mailing address", value: formData.mailingSameAsPrincipal ? `${formData.principalStreet}, ${formData.principalCity}, ${formData.principalState} ${formData.principalZip}` : `${formData.mailingStreet}, ${formData.mailingCity}, ${formData.mailingState} ${formData.mailingZip}` },
      ],
    },
    {
      title: "Controlling Officers",
      step: 6 as StepId,
      rows: [
        { label: "Type", value: formData.officerType },
        { label: "Title", value: formData.officerTitle },
        { label: "Name", value: `${formData.officerFirstName} ${formData.officerLastName}` },
        { label: "Phone", value: formData.officerPhone },
        { label: "Email", value: formData.officerEmail },
      ],
    },
  ];

  return (
    <div>
      <StepHeader title="Review & Submit" subtitle="Review all information and form your entity." />

      <div className="space-y-4 mb-8">
        {sections.map((sec) => (
          <div key={sec.title} className="border-2 border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black/10 dark:border-white/10 bg-black/3 dark:bg-white/3">
              <p className="font-black text-black dark:text-white text-sm">{sec.title}</p>
              <button
                onClick={() => onGoToStep(sec.step)}
                className="flex items-center gap-1 text-xs font-semibold text-[#FFC107] hover:underline"
              >
                <Edit className="h-3 w-3" /> Edit
              </button>
            </div>
            <div className="px-4 py-3 space-y-2">
              {sec.rows.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-xs text-black/50 dark:text-white/50 w-32 flex-shrink-0">{row.label}:</span>
                  <span className="text-xs font-semibold text-black dark:text-white">{row.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-[#0a0a0a] border-t-2 border-black/10 dark:border-white/10 py-4 -mx-8 px-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-black text-black dark:text-white">
            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-black/60 dark:text-white/60">
            {plan?.name} plan + $103.75 State Fees
          </p>
          <p className="text-xs font-semibold text-black dark:text-white">
            {formData.entityType === "C-Corp" ? "C Corporation" : "Limited Liability Company"} — {formData.formationState}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {paymentError && (
            <p className="text-xs text-red-600 dark:text-red-400 max-w-xs text-right">{paymentError}</p>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="outline" disabled={saving} className="border-2 border-black/20 dark:border-white/20 font-semibold">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button
              onClick={onSubmit}
              disabled={saving}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-black px-8 gap-2"
            >
              {redirectingToPayment ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Payment...</>
              ) : saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <>Pay & Form Company <ChevronRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}