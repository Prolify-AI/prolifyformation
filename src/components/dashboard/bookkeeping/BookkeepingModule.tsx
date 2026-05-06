"use client";

import { useState } from "react";
import {
  LayoutDashboard, FileText, List, Layers, Landmark, TrendingDown, CreditCard,
  Receipt, Settings, ChevronDown, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BookkeepingSection =
  | "bk-dashboard"
  | "bk-financial-statements"
  | "bk-transactions"
  | "bk-chart-of-accounts"
  | "bk-cash-accounts"
  | "bk-cash-change"
  | "bk-cash-spend"
  | "bk-bank-transactions"
  | "bk-settings";

interface BookkeepingModuleProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

interface NavGroup {
  label: string;
  defaultOpen: boolean;
  items: { id: BookkeepingSection; label: string; icon: React.ElementType }[];
}

const TOP_ITEM = { id: "bk-dashboard" as BookkeepingSection, label: "Overview", icon: LayoutDashboard };

const GROUPS: NavGroup[] = [
  {
    label: "Books",
    defaultOpen: true,
    items: [
      { id: "bk-financial-statements", label: "Financial Statements", icon: FileText },
      { id: "bk-transactions", label: "Transactions", icon: List },
      { id: "bk-chart-of-accounts", label: "Chart of Accounts", icon: Layers },
    ],
  },
  {
    label: "Cash",
    defaultOpen: true,
    items: [
      { id: "bk-cash-accounts", label: "Accounts", icon: Landmark },
      { id: "bk-cash-change", label: "Change in Cash", icon: TrendingDown },
      { id: "bk-cash-spend", label: "Cash Spend", icon: CreditCard },
    ],
  },
];

const SINGLES: { id: BookkeepingSection; label: string; icon: React.ElementType }[] = [
  { id: "bk-bank-transactions", label: "Bank Transactions", icon: Receipt },
  { id: "bk-settings", label: "Settings", icon: Settings },
];

function BookkeepingSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (s: string) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map((g) => [g.label, g.defaultOpen]))
  );

  const toggle = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const itemCls = (id: string) =>
    cn(
      "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none",
      activeSection === id
        ? "bg-[#FEF9C3] text-[#111111] font-semibold border-l-[3px] border-[#FACC15] pl-[9px]"
        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111] border-l-[3px] border-transparent"
    );

  return (
    <nav className="w-[220px] shrink-0 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col overflow-y-auto">
      <div className="p-3 space-y-1">
        {/* Overview top item */}
        <div className="mb-2">
          <button onClick={() => onSectionChange(TOP_ITEM.id)} className={itemCls(TOP_ITEM.id)}>
            <TOP_ITEM.icon className="h-4 w-4 shrink-0" />
            <span>{TOP_ITEM.label}</span>
          </button>
        </div>

        {/* Grouped items */}
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggle(group.label)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#111111] transition-colors"
            >
              <span>{group.label}</span>
              {openGroups[group.label] ? (
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />
              )}
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                openGroups[group.label] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="space-y-0.5 mt-0.5">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => onSectionChange(item.id)} className={itemCls(item.id)}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-[#E5E7EB] space-y-0.5 mt-2">
          {SINGLES.map((item) => (
            <button key={item.id} onClick={() => onSectionChange(item.id)} className={itemCls(item.id)}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

const ALL_ITEMS = [TOP_ITEM, ...GROUPS.flatMap(g => g.items), ...SINGLES];

export default function BookkeepingModule({ activeSection, onSectionChange, children }: BookkeepingModuleProps) {
  return (
    <div className="flex h-full min-h-0">
      {/* Mobile tab bar */}
      <div className="md:hidden w-full border-b border-[#E5E7EB] bg-[#F9FAFB] overflow-x-auto flex gap-1 px-3 py-2 absolute top-0 left-0 right-0 z-10">
        {ALL_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              activeSection === item.id
                ? "bg-[#FEF9C3] text-[#111111] font-semibold"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <BookkeepingSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-y-auto md:mt-0 mt-12">
        {children}
      </div>
    </div>
  );
}
