"use client";

import * as React from "react";
import { Building2, User, FileText, Calendar, Percent, BookOpen, ChartBar as BarChart3, Rocket, Gift, Settings, Hop as Home, Bot, Store, GraduationCap, Crown, List, ChartPie as PieChart, Layers, ShoppingBag, Package, Sparkles, Megaphone, ChevronRight, LogOut, Mail, Phone, LayoutGrid, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useI18n } from "@/contexts/I18nContext";

const FREE_PLAN_ID = "free";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  | "services"
  | "kyc";

interface DashboardSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export function DashboardSidebar({
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  const { user, profile, company, signOut } = useAuth();
  const { state } = useSidebar();
  const { trackEvent } = useAnalytics();
  const { t } = useI18n();

  const handleSectionChange = (section: ActiveSection) => {
    trackEvent("dashboard_section_viewed", { section });
    onSectionChange(section);
  };
  const currentPlan = company?.current_plan || FREE_PLAN_ID;
  const isPaidPlan = currentPlan !== FREE_PLAN_ID && currentPlan !== "free";

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const mainNavItems: NavItem[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: Home },
    { id: "co-founders", label: t.dashboard.coFounders, icon: User },
    { id: "company", label: t.dashboard.company, icon: Building2 },
    { id: "documents", label: t.dashboard.documents, icon: FileText },
    { id: "compliance", label: t.dashboard.compliance, icon: Calendar },
    { id: "taxes", label: t.dashboard.taxes, icon: Percent },
    { id: "mail-phone", label: t.dashboard.mailPhone, icon: Mail },
    { id: "services", label: t.dashboard.services, icon: LayoutGrid },
  ];

  const bookkeepingItems: NavItem[] = [
    { id: "transactions", label: t.dashboard.transactions, icon: List },
    { id: "invoices", label: t.dashboard.invoices, icon: FileText },
    { id: "reports", label: t.dashboard.reports, icon: PieChart },
    { id: "chart-of-accounts", label: t.dashboard.chartOfAccounts, icon: Layers },
  ];

  const analyticsItems: NavItem[] = [
    { id: "orders", label: t.dashboard.orders, icon: ShoppingBag },
    { id: "inventory", label: t.dashboard.inventory, icon: Package },
    { id: "financials", label: t.dashboard.financials, icon: Sparkles },
    { id: "ads", label: t.dashboard.ads, icon: Megaphone },
  ];

  const growthNavItems: NavItem[] = [
    { id: "ai-chief", label: t.dashboard.aiChiefOfStaff, icon: Bot, badge: "AI" },
    { id: "marketplace", label: t.dashboard.marketplace, icon: Store },
    { id: "learn", label: t.dashboard.learn, icon: GraduationCap },
    { id: "vip", label: t.dashboard.vipClub, icon: Crown, badge: "VIP" },
  ];

  const bottomNavItems: NavItem[] = [
    { id: "kyc", label: t.dashboard.identityVerification, icon: ShieldCheck },
    { id: "upgrade-plan", label: t.dashboard.upgradePlan, icon: Rocket, highlight: true },
    { id: "settings", label: t.dashboard.settings, icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-gray-200 dark:border-gray-800">
      <SidebarHeader className="border-b-2 border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Prolify
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t.dashboard.businessPlatform}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t.dashboard.main}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => handleSectionChange(item.id)}
                    tooltip={item.label}
                    className={
                      activeSection === item.id
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            {t.dashboard.finance}
            {!isPaidPlan && <Lock className="h-3 w-3 text-amber-500" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t.dashboard.bookkeeping}
                      className={isPaidPlan ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "opacity-60 hover:bg-gray-100 dark:hover:bg-gray-800"}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>{t.dashboard.bookkeeping}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {bookkeepingItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            isActive={activeSection === item.id}
                            onClick={() => handleSectionChange(item.id)}
                            className={
                              activeSection === item.id
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium"
                                : isPaidPlan ? "" : "opacity-60"
                            }
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            {!isPaidPlan && state === "expanded" && <Lock className="ml-auto h-3 w-3 text-amber-500" />}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t.dashboard.analytics}
                      className={isPaidPlan ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "opacity-60 hover:bg-gray-100 dark:hover:bg-gray-800"}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>{t.dashboard.analytics}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {analyticsItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            isActive={activeSection === item.id}
                            onClick={() => handleSectionChange(item.id)}
                            className={
                              activeSection === item.id
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium"
                                : isPaidPlan ? "" : "opacity-60"
                            }
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            {!isPaidPlan && state === "expanded" && <Lock className="ml-auto h-3 w-3 text-amber-500" />}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            {t.dashboard.growth}
            {!isPaidPlan && <Lock className="h-3 w-3 text-amber-500" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {growthNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => handleSectionChange(item.id)}
                    tooltip={item.label}
                    className={
                      activeSection === item.id
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500"
                        : isPaidPlan
                        ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "opacity-60 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {!isPaidPlan && state === "expanded" ? (
                      <Lock className="ml-auto h-3 w-3 text-amber-500" />
                    ) : item.badge && state === "expanded" ? (
                      <span className="ml-auto rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-bold text-gray-900 shadow-sm">
                        {item.badge}
                      </span>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => handleSectionChange(item.id)}
                    tooltip={item.label}
                    className={
                      item.highlight
                        ? activeSection === item.id
                          ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950 text-amber-700 dark:text-amber-400 font-semibold border-l-2 border-amber-500"
                          : "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900 dark:hover:to-yellow-900 text-amber-700 dark:text-amber-400 font-medium shadow-sm"
                        : activeSection === item.id
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.highlight && state === "expanded" && (
                      <Gift className="ml-auto h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-gray-200 dark:border-gray-800 p-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8 border-2 border-emerald-500 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <>
              <div className="flex flex-1 flex-col items-start text-left text-sm min-w-0">
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
                  {userName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-auto h-7 w-7 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
