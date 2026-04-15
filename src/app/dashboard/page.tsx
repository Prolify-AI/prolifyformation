"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CircleAlert as AlertCircle,
  ArrowRight,
  DollarSign,
  Banknote,
  Target,
  Crown,
  Rocket,
  BookOpen,
  Percent,
  FileText,
  Lock,
  Building2,
  Check,
  ChevronRight,
  Search,
  Package,
  Briefcase,
  MapPin,
  Users,
  ClipboardList,
  Plus,
  Shield,
  Award,
  TrendingUp,
  Activity,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
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
  | "taxes"
  | "transactions"
  | "expenses"
  | "invoices"
  | "reports"
  | "chart-of-accounts"
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
  | "services";

const RESTRICTED_SECTIONS: ActiveSection[] = [
  "transactions",
  "expenses",
  "invoices",
  "reports",
  "chart-of-accounts",
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
              Complete your company formation
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              {completedSteps.size}/{totalSteps} steps · {progressPercent}% done
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
            Continue <ChevronRight className="h-3 w-3" />
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
    if (action === "annual-report") {
      setShowAnnualReportModal(true);
      return;
    }
    const sectionMap: Record<string, ActiveSection> = {
      "form-company": "company",
      "registered-agent": "compliance",
      "ein": "company",
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
        Upgrade to Unlock
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-8 text-sm">
        This feature is available on paid plans. Upgrade to access advanced business tools.
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => setActiveSection("upgrade-plan")}
          className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold rounded-xl"
        >
          <Crown className="w-4 h-4 mr-2" />
          View Plans
        </Button>
        <Button
          onClick={() => setActiveSection("dashboard")}
          variant="outline"
          className="rounded-xl"
        >
          Back to Dashboard
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
    <SidebarProvider defaultOpen>
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-black/8 dark:border-white/8 bg-white/95 dark:bg-black/95 backdrop-blur-sm px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-black dark:text-white truncate">
                Welcome back, <span className="text-[#FFC107]">{userName}</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => {
                setStartFreshWizard(true);
                setShowOnboardingWizard(true);
              }}
              className="h-8 px-3 bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold text-xs rounded-lg border border-[#FFB300] shadow-sm"
            >
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Form a Company</span>
              <span className="sm:hidden">Form</span>
            </Button>
            <Button
              onClick={() => setShowEINModal(true)}
              variant="outline"
              className="h-8 px-3 font-semibold text-xs rounded-lg border border-black/15 dark:border-white/15"
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">Request EIN</span>
              <span className="sm:hidden">EIN</span>
            </Button>
          </div>
        </header>

        <div className="border-b border-black/8 dark:border-white/8 bg-white dark:bg-black px-4 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { action: "add-company", label: "Add Existing Company", icon: Plus },
              { action: "annual-report", label: "File Annual Report", icon: FileText },
              { action: "registered-agent", label: "Registered Agent", icon: Shield },
              { action: "good-standing", label: "Good Standing", icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.action}
                  onClick={() => handleGetStartedAction(item.action)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black hover:border-[#FFC107] hover:bg-[#FFC107]/5 transition-all text-xs font-semibold text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white whitespace-nowrap"
                >
                  <Icon className="h-3.5 w-3.5 text-[#FFC107]" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

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
                Complete Your Company Profile
              </DialogTitle>
              <DialogDescription>
                To get started, please complete your company information first.
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
                Complete Company Information
              </Button>
              <Button
                onClick={() => {
                  setShowProfileAlert(false);
                  setProfileAlertDismissed(true);
                }}
                variant="outline"
                className="w-full"
              >
                I&apos;ll do this later
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex flex-1 flex-col gap-5 p-4 md:p-5">
          {showAccessRestriction ? (
            <AccessRestrictedMessage />
          ) : (
            <>
              {activeSection === "dashboard" && (
                <>
                  {onboardingChecked && incompleteDraft && !showOnboardingWizard && (
                    <ProfileCompletionBanner
                      onboardingData={incompleteDraft}
                      onResume={() => {
                        setStartFreshWizard(false);
                        setShowOnboardingWizard(true);
                      }}
                    />
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#FFC107] rounded-xl p-4 col-span-2 md:col-span-1 flex flex-col justify-between min-h-[110px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-8 w-8 rounded-lg bg-black/15 flex items-center justify-center">
                          <Crown className="h-4 w-4 text-black" />
                        </div>
                        <span className="text-xs font-bold bg-black/10 px-2 py-0.5 rounded-full text-black/70">Plan</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-black capitalize leading-none mb-1">
                          {onboardingData?.selected_plan || company?.current_plan || "Free"}
                        </p>
                        <button
                          onClick={() => setActiveSection("upgrade-plan")}
                          className="text-xs font-semibold text-black/70 hover:text-black flex items-center gap-1 transition-colors"
                        >
                          Upgrade <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {[
                      { icon: DollarSign, label: "Revenue MTD", value: "$0", sub: "This month" },
                      { icon: FileText, label: "Documents", value: "0", sub: "Files stored" },
                      { icon: Activity, label: "Tasks Due", value: "3", sub: "Action needed" },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-4 flex flex-col justify-between min-h-[110px] hover:border-[#FFC107]/50 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-[#FFC107]/15 flex items-center justify-center">
                            <card.icon className="h-4 w-4 text-[#FFC107]" />
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-black dark:text-white leading-none mb-0.5">{card.value}</p>
                          <p className="text-xs text-black/40 dark:text-white/40">{card.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(onboardingData || company || userCompanies.length > 0) && (
                    <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-black/6 dark:border-white/6 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
                          Your Companies
                        </h2>
                        <button
                          onClick={() => setShowAddCompanyModal(true)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#FFC107] hover:text-[#FFB300] transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add company
                        </button>
                      </div>

                      <div className="divide-y divide-black/5 dark:divide-white/5">
                        {(onboardingData || company) && (
                          <div className="px-5 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-[#FFC107]/15 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4.5 w-4.5 text-[#FFC107]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-black dark:text-white truncate">
                                  {onboardingData?.company_name || company?.name || "My Company"}
                                </p>
                                <p className="text-xs text-black/40 dark:text-white/40 truncate">
                                  {onboardingData
                                    ? `${onboardingData.entity_type} · ${onboardingData.formation_state}`
                                    : company?.business_type || ""}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveSection("company")}
                              className="text-xs font-semibold text-black/40 dark:text-white/40 hover:text-[#FFC107] transition-colors flex-shrink-0"
                            >
                              Manage
                            </button>
                          </div>
                        )}

                        {userCompanies.map((uc) => (
                          <div key={uc.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-4.5 w-4.5 text-gray-500 dark:text-white/40" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-black dark:text-white truncate">{uc.name}</p>
                                <p className="text-xs text-black/40 dark:text-white/40 truncate">
                                  {uc.entity_type} · {uc.formation_state}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/40 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                              Added
                            </span>
                          </div>
                        ))}

                        {!onboardingData && !company && userCompanies.length === 0 && (
                          <div className="px-5 py-6 text-center">
                            <p className="text-sm text-black/40 dark:text-white/40">No companies yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-black/6 dark:border-white/6 flex items-center justify-between">
                      <h2 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
                        Services & Tools
                      </h2>
                      <span className="text-xs text-black/30 dark:text-white/30 font-medium">8 available</span>
                    </div>

                    <div className="divide-y divide-black/5 dark:divide-white/5">
                      {[
                        {
                          icon: BookOpen,
                          title: "Bookkeeping",
                          description: "Track expenses, invoices, and payments in one place.",
                          badge: "$30/mo",
                          badgeStyle: "bg-[#FFC107]/15 text-black dark:text-[#FFC107] border border-[#FFC107]/30",
                          action: "transactions" as ActiveSection,
                        },
                        {
                          icon: Percent,
                          title: "Sales Tax Registration",
                          description: "Register for sales tax across multiple states automatically.",
                          badge: "Compliance",
                          badgeStyle: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
                          action: "taxes" as ActiveSection,
                        },
                        {
                          icon: Banknote,
                          title: "Business Bank Account",
                          description: "Open a US business bank account with our partner banks.",
                          badge: "Coming soon",
                          badgeStyle: "bg-gray-100 dark:bg-white/8 text-gray-400 dark:text-white/30 border border-black/8 dark:border-white/8",
                          action: null,
                        },
                        {
                          icon: TrendingUp,
                          title: "TikTok Ads",
                          description: "Reach millions of customers with targeted ad campaigns.",
                          badge: "Growth",
                          badgeStyle: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800",
                          action: "ads" as ActiveSection,
                        },
                        {
                          icon: FileText,
                          title: "Annual Report Filing",
                          description: "Automated compliance filings so you never miss a deadline.",
                          badge: "Compliance",
                          badgeStyle: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
                          action: "compliance" as ActiveSection,
                        },
                        {
                          icon: DollarSign,
                          title: "Tax Preparation & Filing",
                          description: "Professional business tax preparation and filing services.",
                          badge: "Tax",
                          badgeStyle: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
                          action: "taxes" as ActiveSection,
                        },
                        {
                          icon: Mail,
                          title: "Virtual Mail",
                          description: "Receive and manage your business mail digitally — scan, forward, and store.",
                          badge: "Service",
                          badgeStyle: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800",
                          action: "mail-phone" as ActiveSection,
                        },
                        {
                          icon: Phone,
                          title: "Business Phone",
                          description: "Get a dedicated business phone number with call forwarding and voicemail.",
                          badge: "Service",
                          badgeStyle: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800",
                          action: "mail-phone" as ActiveSection,
                        },
                      ].map((service) => (
                        <div
                          key={service.title}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group cursor-pointer"
                          onClick={() => {
                            if (service.action) handleSectionChange(service.action);
                            else alert("Coming soon!");
                          }}
                        >
                          <div className="h-9 w-9 rounded-lg bg-black/4 dark:bg-white/6 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC107]/12 transition-colors">
                            <service.icon className="h-4 w-4 text-black/50 dark:text-white/50 group-hover:text-[#FFC107] transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black dark:text-white">{service.title}</p>
                            <p className="text-xs text-black/40 dark:text-white/40 truncate">{service.description}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:block ${service.badgeStyle}`}>
                              {service.badge}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-black/20 dark:text-white/20 group-hover:text-[#FFC107] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#FFC107] rounded-xl border border-[#FFB300] p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-black/8 rounded-full -mr-8 -mt-8" />
                      <div className="relative z-10">
                        <Crown className="h-8 w-8 text-black mb-3" />
                        <h3 className="text-lg font-bold text-black mb-1">Upgrade Your Plan</h3>
                        <p className="text-black/70 text-sm mb-4">Unlock premium features and scale faster.</p>
                        <Button
                          onClick={() => handleSectionChange("upgrade-plan")}
                          className="bg-black text-white hover:bg-black/90 font-bold text-sm h-9 px-5 rounded-lg"
                        >
                          View Plans <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-black dark:bg-[#111] rounded-xl border border-black dark:border-white/10 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC107]/10 rounded-full -mr-8 -mt-8" />
                      <div className="relative z-10">
                        <Rocket className="h-8 w-8 text-[#FFC107] mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">Need Help?</h3>
                        <p className="text-white/60 text-sm mb-4">Our team helps with formation, compliance, and growth.</p>
                        <Button
                          onClick={() => handleSectionChange("ai-chief")}
                          className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-sm h-9 px-5 rounded-lg"
                        >
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "co-founders" && (
                <CoFoundersSection onNavigateToVIPClub={() => setActiveSection("vip")} />
              )}
              {activeSection === "company" && (
                <CompanySection onSaved={handleCompanySaved} />
              )}
              {activeSection === "documents" && <DocumentsSection />}
              {activeSection === "compliance" && <ComplianceDatesSection />}
              {activeSection === "taxes" && <TaxesSection />}
              {activeSection === "transactions" && <TransactionsSection />}
              {activeSection === "expenses" && <ExpensesSection />}
              {activeSection === "invoices" && <InvoicesSection />}
              {activeSection === "reports" && <ReportsSection />}
              {activeSection === "chart-of-accounts" && <ChartOfAccountsSection />}
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
      </SidebarInset>

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
    </SidebarProvider>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}