"use client";

import * as React from "react";
import { Building2, FileText, Calendar, ShieldCheck, Bot, Rocket, Hop as Home, ChevronRight, LogOut, Mail, LayoutGrid, BadgeCheck, RefreshCw, FileCheck, TriangleAlert as AlertTriangle, Landmark, CreditCard, Hash, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";

const FREE_PLAN_ID = "free";

type ActiveSection =
  | "dashboard" | "co-founders" | "company" | "documents" | "compliance"
  | "annual-report" | "boi-report" | "registered-agent" | "good-standing"
  | "licenses" | "insurance" | "reinstatement" | "ein" | "taxes"
  | "transactions" | "expenses" | "invoices" | "reports" | "chart-of-accounts"
  | "bk-financial-statements" | "bk-transactions" | "bk-chart-of-accounts"
  | "bk-cash-accounts" | "bk-cash-change" | "bk-cash-spend"
  | "bk-bank-transactions" | "bk-settings" | "orders" | "inventory"
  | "financials" | "ads" | "revenue" | "ai-chief" | "marketplace"
  | "learn" | "vip" | "upgrade-plan" | "settings" | "mail-phone"
  | "services" | "kyc";

interface DashboardSidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

function NavLink({
  item,
  active,
  onClick,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "bg-[#FFC107] text-black shadow-sm"
          : "text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8"
      )}
    >
      <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
      {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className={cn(
          "text-[10px] font-black px-1.5 py-0.5 rounded-full",
          active ? "bg-black/20 text-black" : "bg-[#FFC107]/20 text-[#FFC107]"
        )}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

function NavGroup({
  label,
  icon: Icon,
  children,
  defaultOpen,
  collapsed,
  active,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
  active?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);

  if (collapsed) {
    return (
      <div className="relative group/tooltip">
        <button
          className={cn(
            "w-full flex items-center justify-center p-2.5 rounded-xl transition-all",
            active ? "bg-[#FFC107]/20 text-[#FFC107]" : "text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8"
          )}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
          active ? "text-black dark:text-white" : "text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-3 mt-0.5 pl-3 border-l border-black/10 dark:border-white/10 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubNavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
        active
          ? "bg-[#FFC107]/15 text-[#FFC107]"
          : "text-black/70 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/6"
      )}
    >
      <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { user, profile, company, signOut } = useAuth();
  const { trackEvent } = useAnalytics();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleNav = (section: ActiveSection) => {
    trackEvent("dashboard_section_viewed", { section });
    onSectionChange(section);
  };

  const currentPlan = company?.current_plan || FREE_PLAN_ID;
  const isPaidPlan = currentPlan !== FREE_PLAN_ID && currentPlan !== "free";
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const companyItems: NavItem[] = [
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "co-founders", label: t.dashboard.coFounders, icon: User },
    { id: "documents", label: t.dashboard.documents, icon: FileText },
    { id: "mail-phone", label: t.dashboard.mailPhone, icon: Mail },
    { id: "ein", label: "EIN", icon: Hash },
  ];

  const complianceItems: NavItem[] = [
    { id: "compliance", label: "Overview", icon: Calendar },
    { id: "annual-report", label: "Annual Report", icon: FileCheck },
    { id: "boi-report", label: "BOI Report", icon: AlertTriangle },
    { id: "registered-agent", label: "Registered Agent", icon: ShieldCheck },
    { id: "good-standing", label: "Good Standing", icon: BadgeCheck },
    { id: "licenses", label: "Licenses & Permits", icon: Landmark },
    { id: "insurance", label: "Business Insurance", icon: CreditCard },
    { id: "reinstatement", label: "Reinstatement", icon: RefreshCw },
  ];

  const isInCompany = companyItems.some(i => i.id === activeSection);
  const isInCompliance = complianceItems.some(i => i.id === activeSection);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-[#0A0A0A] border-r border-black/8 dark:border-white/6 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 px-4 border-b border-black/8 dark:border-white/6", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFC107] flex-shrink-0">
          <span className="text-sm font-black text-black">P</span>
        </div>
        {!collapsed && (
          <span className="text-base font-black text-black dark:text-white tracking-tight">Prolify</span>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="ml-auto text-black/20 dark:text-white/20 hover:text-black/60 dark:hover:text-white/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center py-2 text-black/20 dark:text-white/20 hover:text-black/60 dark:hover:text-white/60 transition-colors border-b border-black/8 dark:border-white/6"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5 scrollbar-hide">
        {/* Main */}
        <NavLink item={{ id: "dashboard", label: "Home", icon: Home }} active={activeSection === "dashboard"} onClick={() => handleNav("dashboard")} collapsed={collapsed} />
        <NavLink item={{ id: "services", label: t.dashboard.services, icon: LayoutGrid }} active={activeSection === "services"} onClick={() => handleNav("services")} collapsed={collapsed} />

        {/* Divider */}
        <div className="my-3 border-t border-black/8 dark:border-white/6" />

        {/* Company group */}
        <NavGroup
          label="Company"
          icon={Building2}
          defaultOpen={isInCompany}
          collapsed={collapsed}
          active={isInCompany}
        >
          {companyItems.map(item => (
            <SubNavLink key={item.id} item={item} active={activeSection === item.id} onClick={() => handleNav(item.id)} />
          ))}
        </NavGroup>

        {/* Compliance group */}
        <NavGroup
          label="Compliance"
          icon={ShieldCheck}
          defaultOpen={isInCompliance}
          collapsed={collapsed}
          active={isInCompliance}
        >
          {complianceItems.map(item => (
            <SubNavLink key={item.id} item={item} active={activeSection === item.id} onClick={() => handleNav(item.id)} />
          ))}
        </NavGroup>

        <div className="my-3 border-t border-black/8 dark:border-white/6" />

        {/* Prolite */}
        <NavLink
          item={{ id: "ai-chief", label: "Prolite", icon: Bot, badge: "AI" }}
          active={activeSection === "ai-chief"}
          onClick={() => handleNav("ai-chief")}
          collapsed={collapsed}
        />

        <div className="my-3 border-t border-black/8 dark:border-white/6" />

        {/* Upgrade */}
        <NavLink
          item={{ id: "upgrade-plan", label: "Upgrade Plan", icon: Rocket }}
          active={activeSection === "upgrade-plan"}
          onClick={() => handleNav("upgrade-plan")}
          collapsed={collapsed}
        />
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-black/8 dark:border-white/6 p-3", collapsed ? "flex justify-center" : "")}>
        {collapsed ? (
          <button
            onClick={async () => { await signOut(); window.location.href = "/"; }}
            className="p-2 rounded-xl text-black/30 dark:text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#FFC107]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-[#FFC107]">{userInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-black dark:text-white truncate">{userName}</p>
              <p className="text-[10px] text-black/30 dark:text-white/30 truncate">{userEmail}</p>
            </div>
            <button
              onClick={async () => { await signOut(); window.location.href = "/"; }}
              className="p-1.5 rounded-lg text-black/20 dark:text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
