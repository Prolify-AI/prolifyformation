"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleAlert as AlertCircle, DollarSign, Banknote, Crown, BookOpen, Percent, FileText, Lock, Building2, Check, ChevronRight, Search, Package, Briefcase, MapPin, Users, ClipboardList, Plus, Shield, Award, TrendingUp, Activity, Mail, Phone, TriangleAlert as AlertTriangle, Landmark, CreditCard, RefreshCw, ShieldCheck, Zap, ArrowUpRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/lib/supabase/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamicImport from "next/dynamic";

export const dynamic = 'force-dynamic';

const CoFoundersSection = dynamicImport(() => import("@/components/dashboard/CoFoundersSection"));
const CompanySection = dynamicImport(() => import("@/components/dashboard/CompanySection"));
const DocumentsSection = dynamicImport(() => import("@/components/dashboard/DocumentsSection"));
const ComplianceDatesSection = dynamicImport(() => import("@/components/dashboard/ComplianceDatesSection"));
const TaxesSection = dynamicImport(() => import("@/components/dashboard/TaxesSection"));
const ExpensesSection = dynamicImport(() => import("@/components/dashboard/ExpensesSection"));
const InvoicesSection = dynamicImport(() => import("@/components/dashboard/InvoicesSection"));
const RevenueAnalyticsSection = dynamicImport(() => import("@/components/dashboard/RevenueAnalyticsSection"));
const AIChiefOfStaffSection = dynamicImport(() => import("@/components/dashboard/AIChiefOfStaffSection"));
const MarketplaceSection = dynamicImport(() => import("@/components/dashboard/MarketplaceSection"));
const LearnSection = dynamicImport(() => import("@/components/dashboard/LearnSection"));
const VIPClubSection = dynamicImport(() => import("@/components/dashboard/VIPClubSection"));
const SettingsSection = dynamicImport(() => import("@/components/dashboard/SettingsSection"));
const UpgradePlanSection = dynamicImport(() => import("@/components/dashboard/UpgradePlanSection"));
const TransactionsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/TransactionsSection"));
const ReportsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/ReportsSection"));
const ChartOfAccountsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/ChartOfAccountsSection"));
const BookkeepingModule = dynamicImport(() => import("@/components/dashboard/bookkeeping/BookkeepingModule"));
const BkDashboardSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkDashboardSection"));
const FinancialStatementsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/FinancialStatementsSection"));
const BkTransactionsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkTransactionsSection"));
const BkChartOfAccountsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkChartOfAccountsSection"));
const BkCashAccountsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkCashAccountsSection"));
const BkCashChangeSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkCashChangeSection"));
const BkCashSpendSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkCashSpendSection"));
const BkBankTransactionsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkBankTransactionsSection"));
const BkSettingsSection = dynamicImport(() => import("@/components/dashboard/bookkeeping/BkSettingsSection"));
const OrdersSection = dynamicImport(() => import("@/components/dashboard/analytics/OrdersSection"));
const InventorySection = dynamicImport(() => import("@/components/dashboard/analytics/InventorySection"));
const FinancialsSection = dynamicImport(() => import("@/components/dashboard/analytics/FinancialsSection"));
const AdsSection = dynamicImport(() => import("@/components/dashboard/analytics/AdsSection"));
const PlanSelectionModal = dynamicImport(() => import("@/components/dashboard/PlanSelectionModal"));
const OnboardingWizard = dynamicImport(() => import("@/components/dashboard/OnboardingWizard"));
const GetStartedModal = dynamicImport(() => import("@/components/dashboard/GetStartedModal"));
const EINRequestModal = dynamicImport(() => import("@/components/dashboard/EINRequestModal"));
const GoodStandingModal = dynamicImport(() => import("@/components/dashboard/GoodStandingModal"));
const AnnualReportModal = dynamicImport(() => import("@/components/dashboard/AnnualReportModal"));
const AddExistingCompanyModal = dynamicImport(() => import("@/components/dashboard/AddExistingCompanyModal"));
const MailPhoneSection = dynamicImport(() => import("@/components/dashboard/MailPhoneSection"));
const ServicesSection = dynamicImport(() => import("@/components/dashboard/ServicesSection"));
const KYCVerificationSection = dynamicImport(() => import("@/components/dashboard/KYCVerificationSection"));
const ServicePurchasePanel = dynamicImport(() => import("@/components/dashboard/ServicePurchasePanel"));

type OnboardingData = {
  company_name: string;
  entity_type: string;
  formation_state: string;
  selected_plan: string;
  total_amount: number;
  completed: boolean;
  current_step: number;
  management_structure: string;
  business_category: string;
  business_purpose: string;
  principal_street: string;
  principal_city: string;
  principal_state: string;
  principal_zip: string;
  officer_first_name: string;
  officer_last_name: string;
  annual_report_enrolled: boolean | null;
};

type UserCompany = {
  id: string;
  name: string;
  entity_type: string;
  formation_state: string;
  address: string;
  created_at: string;
};

type ActiveSection =
  | "dashboard"
  | "co-founders"
  | "company"
  | "documents"
  | "compliance"
  | "annual-report"
  | "boi-report"
  | "registered-agent"
  | "good-standing"
  | "licenses"
  | "insurance"
  | "reinstatement"
  | "ein"
  | "taxes"
  | "transactions"
  | "expenses"
  | "invoices"
  | "reports"
  | "chart-of-accounts"
  | "bk-dashboard"
  | "bk-financial-statements"
  | "bk-transactions"
  | "bk-chart-of-accounts"
  | "bk-cash-accounts"
  | "bk-cash-change"
  | "bk-cash-spend"
  | "bk-bank-transactions"
  | "bk-settings"
  | "orders"
  | "inventory"
  | "financials"
  | "ads"
  | "revenue"
  | "ai-chief"
  | "marketplace"
  | "learn"
  | "vip"
  | "upgrade-plan"
  | "settings"
  | "mail-phone"
  | "services"
  | "kyc";

const RESTRICTED_SECTIONS: ActiveSection[] = [
  "transactions",
  "expenses",
  "invoices",
  "reports",
  "chart-of-accounts",
  "bk-dashboard",
  "bk-financial-statements",
  "bk-transactions",
  "bk-chart-of-accounts",
  "bk-cash-accounts",
  "bk-cash-change",
  "bk-cash-spend",
  "bk-bank-transactions",
  "bk-settings",
  "orders",
  "inventory",
  "financials",
  "ads",
  "revenue",
  "ai-chief",
  "marketplace",
  "learn",
  "vip",
];

const BK_SECTIONS: ActiveSection[] = [
  "bk-dashboard",
  "bk-financial-statements",
  "bk-transactions",
  "bk-chart-of-accounts",
  "bk-cash-accounts",
  "bk-cash-change",
  "bk-cash-spend",
  "bk-bank-transactions",
  "bk-settings",
];

const FREE_PLAN_ID = "free";

const ONBOARDING_STEPS = [
  { id: 1, label: "Structure Type", icon: Building2 },
  { id: 2, label: "Name Search", icon: Search },
  { id: 3, label: "Formation Package", icon: Package },
  { id: 4, label: "Principal Activity", icon: Briefcase },
  { id: 5, label: "Business Address", icon: MapPin },
  { id: 6, label: "Controlling Officers", icon: Users },
  { id: 7, label: "Annual Report", icon: ClipboardList },
  { id: 8, label: "Review & Submit", icon: FileText },
];

function getCompletedOnboardingSteps(data: OnboardingData | null): Set<number> {
  if (!data) return new Set();
  const completed = new Set<number>();
  const step = data.current_step || 1;
  for (let i = 1; i < step; i++) {
    completed.add(i);
  }
  return completed;
}

function ProfileCompletionBanner({
  onboardingData,
  onResume,
}: {
  onboardingData: OnboardingData | null;
  onResume: () => void;
}) {
  const { t } = useI18n();
  const completedSteps = getCompletedOnboardingSteps(onboardingData);
  const currentStep = onboardingData?.current_step || 1;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPercent = Math.round((completedSteps.size / totalSteps) * 100);

  return (
    <div className="rounded-xl border border-[#FFC107]/30 bg-[#FFC107]/8 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between gap-4 border-b border-[#FFC107]/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-black" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-black dark:text-white">
              {t.dashboard.completeFormation}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              {completedSteps.size}/{totalSteps} {t.dashboard.stepsProgress} · {progressPercent}% {t.dashboard.done}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-24 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full bg-[#FFC107] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            {t.dashboard.continueBtn} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {ONBOARDING_STEPS.map((step) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = step.id === currentStep;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isCompleted
                    ? "bg-[#FFC107]/20 text-black dark:text-white"
                    : isCurrent
                    ? "bg-[#FFC107]/10 border border-[#FFC107]/40 text-black dark:text-white"
                    : "bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-2.5 w-2.5 text-[#FFC107]" strokeWidth={3} />
                ) : (
                  <span className={`w-3 h-3 rounded-full text-[8px] font-black flex items-center justify-center ${isCurrent ? "bg-[#FFC107] text-black" : "bg-black/20 dark:bg-white/20 text-black/50 dark:text-white/50"}`}>
                    {step.id}
                  </span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, profile, company, refreshUserData } = useAuth();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paramsConsumed, setParamsConsumed] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [incompleteDraft, setIncompleteDraft] = useState<OnboardingData | null>(null);
  const [userCompanies, setUserCompanies] = useState<UserCompany[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [profileAlertDismissed, setProfileAlertDismissed] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [showEINModal, setShowEINModal] = useState(false);
  const [showGoodStandingModal, setShowGoodStandingModal] = useState(false);
  const [showAnnualReportModal, setShowAnnualReportModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [startFreshWizard, setStartFreshWizard] = useState(false);
  const [wizardPaymentSuccess, setWizardPaymentSuccess] = useState(false);

  useEffect(() => {
    if (paramsConsumed) return;

    const formationPayment = searchParams.get("formation_payment");
    if (formationPayment === "success") {
      setParamsConsumed(true);
      setStartFreshWizard(false);
      setWizardPaymentSuccess(true);
      setShowOnboardingWizard(true);
      router.replace("/dashboard", { scroll: false });
      return;
    }

    const startFormation = searchParams.get("start_formation");
    if (startFormation === "true") {
      setParamsConsumed(true);
      setStartFreshWizard(true);
      setShowOnboardingWizard(true);
      router.replace("/dashboard", { scroll: false });
      return;
    }

    const addCompany = searchParams.get("add_company");
    if (addCompany === "true") {
      setParamsConsumed(true);
      setShowAddCompanyModal(true);
      router.replace("/dashboard", { scroll: false });
      return;
    }

    const newUser = searchParams.get("new_user");
    if (newUser === "true") {
      setParamsConsumed(true);
      setShowGetStartedModal(true);
      router.replace("/dashboard", { scroll: false });
      return;
    }

    const completeProfile = searchParams.get("complete_profile");
    if (completeProfile === "true" && profile?.onboarding_type === "existing_business" && !profileAlertDismissed && !profile?.profile_completed) {
      setParamsConsumed(true);
      setShowProfileAlert(true);
      setActiveSection("company");
      router.replace("/dashboard", { scroll: false });
      return;
    }

    const payment = searchParams.get("payment");
    if (payment === "success") {
      setParamsConsumed(true);
      setActiveSection("services");
      import("sonner").then(({ toast }) => {
        toast.success("Payment successful! Your services have been ordered.");
      });
      router.replace("/dashboard", { scroll: false });
      (async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            await fetch("/api/kyc/trigger-verification", {
              method: "POST",
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
          }
        } catch (err) {
          console.warn("[kyc trigger] non-blocking error:", err);
        }
      })();
      return;
    }

    const section = searchParams.get("section") as ActiveSection | null;
    const checkout = searchParams.get("checkout");
    if (section) {
      setParamsConsumed(true);
      setActiveSection(section);
      if (checkout === "success") {
        import("sonner").then(({ toast }) => {
          toast.success("Payment successful! Your services have been ordered.");
        });
      }
      router.replace("/dashboard", { scroll: false });
    }
  }, [searchParams, profile, profileAlertDismissed, paramsConsumed, router]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const [{ data: onboardingRows }, { data: companiesRows }] = await Promise.all([
          supabase
            .from("onboarding_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("user_companies")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        const rows = onboardingRows || [];
        const completedRow = rows.find((r: OnboardingData) => r.completed);
        const incompleteRow = rows.find((r: OnboardingData) => !r.completed);

        if (completedRow) setOnboardingData(completedRow);
        else if (incompleteRow) setOnboardingData(incompleteRow);
        setIncompleteDraft(incompleteRow || null);

        setUserCompanies(companiesRows || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setOnboardingChecked(true);
      }
    }

    if (profile !== undefined) loadData();
  }, [user, profile]);

  const loadUserCompanies = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_companies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setUserCompanies(data || []);
  };

  const handleCompanySaved = async () => {
    setProfileAlertDismissed(true);
    setShowProfileAlert(false);
    setActiveSection("dashboard");

    if (!profile?.profile_completed) {
      await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", user?.id);

      await refreshUserData();
      setShowPlanModal(true);
    }
  };

  const handlePlanSelected = () => {
    setShowPlanModal(false);
  };

  const handleGetStartedAction = (action: string) => {
    setShowGetStartedModal(false);
    if (action === "good-standing") {
      setShowGoodStandingModal(true);
      return;
    }
    if (action === "add-company") {
      setShowAddCompanyModal(true);
      return;
    }
    if (action === "form-company") {
      setStartFreshWizard(true);
      setShowOnboardingWizard(true);
      return;
    }
    if (action === "annual-report") {
      setShowAnnualReportModal(true);
      return;
    }
    const sectionMap: Record<string, ActiveSection> = {
      "registered-agent": "compliance",
      "ein": "ein",
      "chat": "ai-chief",
    };
    const target = sectionMap[action];
    if (target) setActiveSection(target);
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
  };

  const currentPlan = company?.current_plan || FREE_PLAN_ID;
  const isPaidPlan = currentPlan !== FREE_PLAN_ID && currentPlan !== "free";
  const isRestrictedSection = RESTRICTED_SECTIONS.includes(activeSection);
  const showAccessRestriction = isRestrictedSection && !isPaidPlan;

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  const AccessRestrictedMessage = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        {t.dashboard.upgradeToUnlock}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-8 text-sm">
        {t.dashboard.upgradeDescription}
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => setActiveSection("upgrade-plan")}
          className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-xl"
        >
          <Crown className="w-4 h-4 mr-2" />
          {t.dashboard.viewPlans}
        </Button>
        <Button
          onClick={() => setActiveSection("dashboard")}
          variant="outline"
          className="rounded-xl"
        >
          {t.dashboard.backToDashboard}
        </Button>
      </div>
    </div>
  );

  if (showOnboardingWizard && user && (onboardingChecked || startFreshWizard)) {
    return (
      <OnboardingWizard
        userId={user.id}
        userName={userName}
        startFresh={startFreshWizard}
        paymentSuccess={wizardPaymentSuccess}
        onComplete={async () => {
          setShowOnboardingWizard(false);
          setStartFreshWizard(false);
          setWizardPaymentSuccess(false);
          await refreshUserData();
          const { data: rows } = await supabase
            .from("onboarding_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          const allRows = rows || [];
          const completed = allRows.find((r: OnboardingData) => r.completed);
          const incomplete = allRows.find((r: OnboardingData) => !r.completed);
          if (completed) setOnboardingData(completed);
          else if (incomplete) setOnboardingData(incomplete);
          setIncompleteDraft(incomplete || null);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0D0D0D]">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/6 dark:border-white/6 bg-white dark:bg-[#0D0D0D] px-5">
          <div className="text-sm font-semibold text-black/40 dark:text-white/30 capitalize">
            {activeSection === "dashboard" ? "Overview" : activeSection.replace(/-/g, " ")}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowEINModal(true)}
              variant="outline"
              className="h-8 px-3 font-semibold text-xs rounded-lg border border-black/12 dark:border-white/12 bg-transparent"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">{t.dashboard.requestEIN}</span>
            </Button>
            <Button
              onClick={() => { setStartFreshWizard(true); setShowOnboardingWizard(true); }}
              className="h-8 px-3 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-xs rounded-lg"
            >
              <Building2 className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">{t.dashboard.formCompany}</span>
            </Button>
          </div>
        </header>

        <EINRequestModal
          open={showEINModal}
          onClose={() => setShowEINModal(false)}
          companyName={onboardingData?.company_name || company?.name}
        />

        <GoodStandingModal
          open={showGoodStandingModal}
          onClose={() => setShowGoodStandingModal(false)}
          companyName={onboardingData?.company_name || company?.name}
        />

        <AnnualReportModal
          open={showAnnualReportModal}
          onClose={() => setShowAnnualReportModal(false)}
          defaultCompanyName={onboardingData?.company_name || company?.name}
        />

        {showAddCompanyModal && (
          <AddExistingCompanyModal
            onClose={() => setShowAddCompanyModal(false)}
            onSuccess={async () => {
              setShowAddCompanyModal(false);
              await loadUserCompanies();
            }}
          />
        )}

        <Dialog
          open={showProfileAlert}
          onOpenChange={(open) => {
            if (!open) {
              setShowProfileAlert(false);
              setProfileAlertDismissed(true);
            }
          }}
        >
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-600" />
                {t.dashboard.completeCompanyProfile}
              </DialogTitle>
              <DialogDescription>
                {t.dashboard.completeProfileDesc}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setShowProfileAlert(false);
                  setActiveSection("company");
                }}
                className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold"
              >
                <Building2 className="mr-2 h-4 w-4" />
                {t.dashboard.completeCompanyInfo}
              </Button>
              <Button
                onClick={() => {
                  setShowProfileAlert(false);
                  setProfileAlertDismissed(true);
                }}
                variant="outline"
                className="w-full"
              >
                {t.dashboard.doThisLater}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0D0D0D]">
          {showAccessRestriction ? (
            <div className="p-6"><AccessRestrictedMessage /></div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
                  {onboardingChecked && incompleteDraft && !showOnboardingWizard && (
                    <ProfileCompletionBanner
                      onboardingData={incompleteDraft}
                      onResume={() => { setStartFreshWizard(false); setShowOnboardingWizard(true); }}
                    />
                  )}

                  {/* Greeting */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-black/30 dark:text-white/25 mb-1">Good day</p>
                    <h2 className="text-3xl font-black text-black dark:text-white tracking-tight leading-tight">
                      {userName}<span className="text-[#FFC107]">.</span>
                    </h2>
                  </div>

                  {/* Top row: plan card + 3 stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveSection("upgrade-plan")}
                      className="bg-[#FFC107] rounded-2xl p-5 flex flex-col justify-between min-h-[130px] hover:bg-[#FFB300] transition-colors text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <Crown className="h-5 w-5 text-black/60" />
                        <ArrowUpRight className="h-4 w-4 text-black/40 group-hover:text-black/70 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-black/50 uppercase tracking-wider mb-0.5">Plan</p>
                        <p className="text-2xl font-black text-black capitalize leading-none">
                          {onboardingData?.selected_plan || company?.current_plan || "Free"}
                        </p>
                      </div>
                    </button>
                    {[
                      { icon: DollarSign, label: "Revenue MTD", value: "$0", sub: "this month" },
                      { icon: FileText, label: "Documents", value: "0", sub: "stored" },
                      { icon: Activity, label: "Tasks", value: "3", sub: "pending" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white dark:bg-[#141414] border border-black/6 dark:border-white/6 rounded-2xl p-5 flex flex-col justify-between min-h-[130px]">
                        <div className="h-8 w-8 rounded-xl bg-black/4 dark:bg-white/6 flex items-center justify-center">
                          <s.icon className="h-4 w-4 text-black/40 dark:text-white/30" />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-black dark:text-white leading-none">{s.value}</p>
                          <p className="text-xs text-black/35 dark:text-white/30 mt-0.5 font-medium">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Companies */}
                  <CompaniesCard
                    onboardingData={onboardingData}
                    company={company}
                    userCompanies={userCompanies}
                    onSelectCompany={() => setActiveSection("company")}
                    onAddCompany={() => setShowAddCompanyModal(true)}
                    onFormCompany={() => { setStartFreshWizard(true); setShowOnboardingWizard(true); }}
                    t={t}
                  />

                  {/* Bank */}
                  <ConnectBankCard onNavigate={() => setActiveSection("bk-dashboard" as ActiveSection)} />

                  {/* Services grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-black/35 dark:text-white/30 uppercase tracking-widest">Services</p>
                      <span className="text-xs text-black/25 dark:text-white/20">8 available</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { icon: BookOpen, title: "Bookkeeping", desc: "Track income & expenses", badge: "$30/mo", action: "transactions" as ActiveSection, accent: "text-[#FFC107]", bg: "bg-[#FFC107]/8 dark:bg-[#FFC107]/10" },
                        { icon: Percent, title: "Sales Tax", desc: "Stay compliant", badge: "Compliance", action: "taxes" as ActiveSection, accent: "text-blue-500", bg: "bg-blue-500/8 dark:bg-blue-500/10" },
                        { icon: FileText, title: "Annual Report", desc: "File on time", badge: "Compliance", action: "compliance" as ActiveSection, accent: "text-emerald-500", bg: "bg-emerald-500/8 dark:bg-emerald-500/10" },
                        { icon: Mail, title: "Virtual Mail", desc: "US business address", badge: "Service", action: "mail-phone" as ActiveSection, accent: "text-sky-500", bg: "bg-sky-500/8 dark:bg-sky-500/10" },
                        { icon: TrendingUp, title: "TikTok Ads", desc: "Scale with ads", badge: "Growth", action: "ads" as ActiveSection, accent: "text-pink-500", bg: "bg-pink-500/8 dark:bg-pink-500/10" },
                        { icon: DollarSign, title: "Tax Prep", desc: "Expert filing", badge: "Tax", action: "taxes" as ActiveSection, accent: "text-emerald-500", bg: "bg-emerald-500/8 dark:bg-emerald-500/10" },
                        { icon: Phone, title: "Business Phone", desc: "Virtual number", badge: "Service", action: "mail-phone" as ActiveSection, accent: "text-sky-500", bg: "bg-sky-500/8 dark:bg-sky-500/10" },
                        { icon: Banknote, title: "Bank Account", desc: "Coming soon", badge: "Soon", action: null, accent: "text-black/30 dark:text-white/20", bg: "bg-black/4 dark:bg-white/4" },
                      ].map((s) => (
                        <button
                          key={s.title}
                          onClick={() => { if (s.action) handleSectionChange(s.action); }}
                          className="bg-white dark:bg-[#141414] border border-black/6 dark:border-white/6 rounded-2xl p-4 flex flex-col gap-3 text-left hover:border-black/15 dark:hover:border-white/12 hover:shadow-sm transition-all"
                        >
                          <div className={`h-8 w-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                            <s.icon className={`h-4 w-4 ${s.accent}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-black dark:text-white">{s.title}</p>
                            <p className="text-[11px] text-black/35 dark:text-white/25 mt-0.5">{s.desc}</p>
                          </div>
                          <span className="text-[10px] font-bold text-black/25 dark:text-white/20 uppercase tracking-wider">{s.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "co-founders" && (
                <div className="p-6"><CoFoundersSection onNavigateToVIPClub={() => setActiveSection("vip")} /></div>
              )}
              {activeSection === "company" && (
                <CompanySection onSaved={handleCompanySaved} />
              )}
              {activeSection === "documents" && <DocumentsSection />}
              {activeSection === "compliance" && <ComplianceDatesSection />}
              {activeSection === "annual-report" && (
                <ServicePurchasePanel
                  serviceIds={["renewal", "initial-report", "amended-annual-report"]}
                  title="Annual Report"
                  description="Keep your business in good standing by filing your annual report on time. Select the service that applies to your situation and we handle the filing."
                  icon={FileText}
                  iconBgClass="bg-[#FFC107]/15"
                  iconColorClass="text-[#FFC107]"
                />
              )}
              {activeSection === "boi-report" && (
                <ServicePurchasePanel
                  serviceIds={["beneficial-ownership", "beneficial-ownership-amendment"]}
                  title="BOI Report"
                  description="The Beneficial Ownership Information (BOI) report is required by FinCEN under the Corporate Transparency Act. We file it accurately and on time."
                  icon={AlertTriangle}
                  iconBgClass="bg-amber-100 dark:bg-amber-900/30"
                  iconColorClass="text-amber-600 dark:text-amber-400"
                />
              )}
              {activeSection === "registered-agent" && (
                <ServicePurchasePanel
                  serviceIds={["registered-agent-service", "change-registered-agent", "registered-agent-resignation", "boc3"]}
                  title="Registered Agent"
                  description="Your registered agent receives official legal and government documents on your behalf. Stay compliant and protect your privacy."
                  icon={ShieldCheck}
                  iconBgClass="bg-[#FFC107]/15"
                  iconColorClass="text-[#FFC107]"
                />
              )}
              {activeSection === "good-standing" && (
                <ServicePurchasePanel
                  serviceIds={["good-standing"]}
                  title="Good Standing"
                  description="A certificate of good standing proves your business is active and compliant with the state. Required by banks, investors, and partners."
                  icon={Award}
                  iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
                  iconColorClass="text-emerald-600 dark:text-emerald-400"
                />
              )}
              {activeSection === "licenses" && (
                <ServicePurchasePanel
                  serviceIds={["foreign-registration", "apostille"]}
                  title="Licenses & Permits"
                  description="Operating legally requires the right licenses, permits, and registrations. We help you get compliant fast."
                  icon={Landmark}
                  iconBgClass="bg-blue-100 dark:bg-blue-900/30"
                  iconColorClass="text-blue-600 dark:text-blue-400"
                />
              )}
              {activeSection === "insurance" && (
                <ServicePurchasePanel
                  serviceIds={["virtual-office-mail-scanning", "virtual-office-pro", "virtual-office-unlimited"]}
                  title="Business Insurance"
                  description="Protect your business with professional coverage options. General liability, virtual office, and more — all in one place."
                  icon={CreditCard}
                  iconBgClass="bg-sky-100 dark:bg-sky-900/30"
                  iconColorClass="text-sky-600 dark:text-sky-400"
                />
              )}
              {activeSection === "reinstatement" && (
                <ServicePurchasePanel
                  serviceIds={["business-reinstatement", "dissolution", "withdrawal"]}
                  title="Reinstatement"
                  description="If your business was dissolved or revoked, we can help reinstate it and get you back to operating legally as quickly as possible."
                  icon={RefreshCw}
                  iconBgClass="bg-orange-100 dark:bg-orange-900/30"
                  iconColorClass="text-orange-600 dark:text-orange-400"
                />
              )}
              {activeSection === "ein" && (
                <ServicePurchasePanel
                  serviceIds={["ein", "ein-non-us", "ein-amendment", "s-corp-election"]}
                  title="EIN — Employer Identification Number"
                  description="Your EIN is your business tax ID. Required for opening a bank account, hiring employees, and filing taxes. Select the option that fits your situation."
                  icon={FileText}
                  iconBgClass="bg-[#FFC107]/15"
                  iconColorClass="text-[#FFC107]"
                />
              )}
              {activeSection === "taxes" && <TaxesSection />}
              {activeSection === "transactions" && <TransactionsSection />}
              {activeSection === "expenses" && <ExpensesSection />}
              {activeSection === "invoices" && <InvoicesSection />}
              {activeSection === "reports" && <ReportsSection />}
              {activeSection === "chart-of-accounts" && <ChartOfAccountsSection />}
              {BK_SECTIONS.includes(activeSection) && (
                <div className="-m-4 md:-m-5 flex-1 flex flex-col overflow-hidden">
                  <BookkeepingModule
                    activeSection={activeSection as string}
                    onSectionChange={(s: string) => setActiveSection(s as ActiveSection)}
                  >
                    {activeSection === "bk-dashboard" && <BkDashboardSection onNavigate={(s) => setActiveSection(s as ActiveSection)} />}
                    {activeSection === "bk-financial-statements" && <FinancialStatementsSection />}
                    {activeSection === "bk-transactions" && <BkTransactionsSection />}
                    {activeSection === "bk-chart-of-accounts" && <BkChartOfAccountsSection />}
                    {activeSection === "bk-cash-accounts" && <BkCashAccountsSection />}
                    {activeSection === "bk-cash-change" && <BkCashChangeSection />}
                    {activeSection === "bk-cash-spend" && <BkCashSpendSection />}
                    {activeSection === "bk-bank-transactions" && <BkBankTransactionsSection />}
                    {activeSection === "bk-settings" && <BkSettingsSection />}
                  </BookkeepingModule>
                </div>
              )}
              {activeSection === "orders" && <OrdersSection />}
              {activeSection === "inventory" && <InventorySection />}
              {activeSection === "financials" && <FinancialsSection />}
              {activeSection === "ads" && <AdsSection />}
              {activeSection === "revenue" && <RevenueAnalyticsSection />}
              {activeSection === "ai-chief" && <AIChiefOfStaffSection />}
              {activeSection === "marketplace" && <MarketplaceSection />}
              {activeSection === "learn" && <LearnSection />}
              {activeSection === "vip" && <VIPClubSection onNavigateToUpgrade={() => setActiveSection("upgrade-plan")} />}
              {activeSection === "upgrade-plan" && <UpgradePlanSection />}
              {activeSection === "settings" && <SettingsSection />}
              {activeSection === "mail-phone" && <MailPhoneSection />}
              {activeSection === "services" && <ServicesSection />}
              {activeSection === "kyc" && <KYCVerificationSection />}
            </>
          )}
        </div>
      </div>

      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={handlePlanSelected}
      />

      {showGetStartedModal && (
        <GetStartedModal
          userName={userName}
          onClose={() => setShowGetStartedModal(false)}
          onAction={handleGetStartedAction}
        />
      )}
    </div>
  );
}

function ConnectBankCard({ onNavigate }: { onNavigate: () => void }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { count } = await supabase
        .from("bank_connections")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");
      setConnected(count || 0);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return null;

  return (
    <div
      onClick={onNavigate}
      className="bg-white dark:bg-[#141414] border border-black/6 dark:border-white/6 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-[#FFC107]/50 hover:shadow-sm transition-all group"
    >
      <div className="h-11 w-11 rounded-xl bg-[#FFC107]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FFC107]/20 transition-colors">
        <Landmark className="h-5 w-5 text-[#FFC107]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-black dark:text-white">
          {connected > 0 ? "Bookkeeping & Bank Accounts" : "Connect Your Bank Account"}
        </p>
        <p className="text-xs text-black/35 dark:text-white/30 mt-0.5">
          {connected > 0
            ? `${connected} account${connected !== 1 ? "s" : ""} connected · Sync balances & transactions`
            : "Sync live balances and transactions via Stripe Financial Connections"}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {connected > 0 ? (
          <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
            {connected} connected
          </span>
        ) : (
          <span className="text-xs font-bold bg-[#FFC107]/10 text-black dark:text-[#FFC107] px-2.5 py-1 rounded-full">
            Connect
          </span>
        )}
        <ArrowUpRight className="h-4 w-4 text-black/20 dark:text-white/20 group-hover:text-[#FFC107] transition-all" />
      </div>
    </div>
  );
}

function CompaniesCard({
  onboardingData,
  company,
  userCompanies,
  onSelectCompany,
  onAddCompany,
  onFormCompany,
  t,
}: {
  onboardingData: OnboardingData | null;
  company: { name?: string; current_plan?: string; business_type?: string } | null | undefined;
  userCompanies: UserCompany[];
  onSelectCompany: () => void;
  onAddCompany: () => void;
  onFormCompany: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const [open, setOpen] = useState(false);
  const hasCompanies = !!(onboardingData || company) || userCompanies.length > 0;
  const totalCount = (onboardingData || company ? 1 : 0) + userCompanies.length;

  return (
    <div className="bg-white dark:bg-[#141414] border border-black/6 dark:border-white/6 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Building2 className="h-4 w-4 text-black/40 dark:text-white/30" />
          <span className="text-sm font-bold text-black dark:text-white">Companies</span>
          {totalCount > 0 && (
            <span className="text-[10px] font-bold bg-black/6 dark:bg-white/8 text-black/40 dark:text-white/30 px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddCompany(); }}
            className="flex items-center gap-1 text-xs font-semibold text-[#FFC107] hover:text-[#FFB300] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
          <ChevronRight className={`h-4 w-4 text-black/25 dark:text-white/25 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-black/4 dark:border-white/4 divide-y divide-black/4 dark:divide-white/4">
          {(onboardingData || company) && (
            <div className="px-5 py-4 flex items-center gap-3 group hover:bg-black/[0.015] dark:hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={onSelectCompany}>
              <div className="h-10 w-10 rounded-xl bg-[#FFC107] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-black">
                  {(onboardingData?.company_name || company?.name || "C").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black dark:text-white truncate">
                  {onboardingData?.company_name || company?.name || t.dashboard.myCompany}
                </p>
                <p className="text-xs text-black/35 dark:text-white/30 truncate mt-0.5">
                  {onboardingData ? `${onboardingData.entity_type} · ${onboardingData.formation_state}` : company?.business_type || ""}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-black/15 dark:text-white/15 group-hover:text-[#FFC107] transition-colors flex-shrink-0" />
            </div>
          )}
          {userCompanies.map((uc) => (
            <div key={uc.id} className="px-5 py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/6 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-black/40 dark:text-white/30">{uc.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black dark:text-white truncate">{uc.name}</p>
                <p className="text-xs text-black/35 dark:text-white/30 truncate mt-0.5">{uc.entity_type} · {uc.formation_state}</p>
              </div>
              <span className="text-[10px] font-bold bg-black/5 dark:bg-white/6 text-black/30 dark:text-white/25 px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">added</span>
            </div>
          ))}
          {!hasCompanies && (
            <div className="px-5 py-10 text-center">
              <div className="h-12 w-12 rounded-2xl bg-black/4 dark:bg-white/4 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-5 w-5 text-black/20 dark:text-white/20" />
              </div>
              <p className="text-sm font-semibold text-black/30 dark:text-white/25">No companies yet</p>
              <button onClick={onFormCompany} className="mt-3 text-xs font-bold text-[#FFC107] hover:text-[#FFB300] transition-colors">
                Form your first company →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}