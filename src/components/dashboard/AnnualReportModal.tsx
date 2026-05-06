"use client";

import { useState, useEffect } from "react";
import { X, Globe, FileText, Users, MapPin, Search, Hop as Home, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usStates } from "@/lib/us-states";

type Step = "select-company" | "select-services";

interface ServiceSelection {
  [state: string]: {
    foreignQualification: boolean;
    annualReport: boolean;
    registeredAgent: boolean;
    changeOfAgent: boolean;
  };
}

interface UserCompany {
  id: string;
  name: string;
  formation_state: string;
}

interface AnnualReportModalProps {
  open: boolean;
  onClose: () => void;
  defaultCompanyName?: string;
}

const SERVICE_COLUMNS = [
  { key: "foreignQualification", label: "Foreign Qualification", icon: Globe },
  { key: "annualReport", label: "Annual Report", icon: FileText },
  { key: "registeredAgent", label: "Registered Agent", icon: Users },
  { key: "changeOfAgent", label: "Change of Agent", icon: Users },
] as const;

const INFO_CARDS = [
  {
    icon: Globe,
    title: "Foreign Qualification",
    description: "Required if you plan to do business in a state other than your formation state.",
  },
  {
    icon: FileText,
    title: "Annual Report",
    description: "Ensure the state has your company's latest info—name, address, and managers—to stay compliant.",
  },
  {
    icon: Users,
    title: "Registered Agent",
    description: "Required for receiving legal documents and state communications on behalf of your business.",
  },
];

export default function AnnualReportModal({ open, onClose, defaultCompanyName }: AnnualReportModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("select-company");
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<UserCompany | null>(null);
  const [search, setSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [services, setServices] = useState<ServiceSelection>({});
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  useEffect(() => {
    if (open && user) {
      loadCompanies();
    }
    if (!open) {
      setStep("select-company");
      setSelectedCompany(null);
      setSearch("");
      setStateSearch("");
      setServices({});
    }
  }, [open, user]);

  const loadCompanies = async () => {
    if (!user) return;
    setLoadingCompanies(true);
    try {
      const { data } = await supabase
        .from("user_companies")
        .select("id, name, formation_state")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setCompanies(data || []);
      if (defaultCompanyName && data) {
        const match = data.find((c) => c.name.toLowerCase().includes(defaultCompanyName.toLowerCase()));
        if (match) setSelectedCompany(match);
      }
    } finally {
      setLoadingCompanies(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStates = usStates.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const homeState = selectedCompany
    ? usStates.find(
        (s) =>
          s.code === selectedCompany.formation_state ||
          s.name.toLowerCase() === selectedCompany.formation_state.toLowerCase()
      )
    : null;

  const toggleService = (stateName: string, serviceKey: keyof ServiceSelection[string]) => {
    setServices((prev) => ({
      ...prev,
      [stateName]: {
        ...(prev[stateName] || { foreignQualification: false, annualReport: false, registeredAgent: false, changeOfAgent: false }),
        [serviceKey]: !(prev[stateName]?.[serviceKey] ?? false),
      },
    }));
  };

  const countSelected = () =>
    Object.values(services).reduce(
      (acc, s) =>
        acc + (s.foreignQualification ? 1 : 0) + (s.annualReport ? 1 : 0) + (s.registeredAgent ? 1 : 0) + (s.changeOfAgent ? 1 : 0),
      0
    );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#0a0a0a] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 dark:border-white/8">
        <button
          onClick={step === "select-services" ? () => setStep("select-company") : onClose}
          className="flex items-center gap-2 text-sm font-semibold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-[#FFC107]/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "select-services" ? "Back" : "Exit"}
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {step === "select-company" ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Select a Company</h1>
            <p className="text-sm text-black/50 dark:text-white/50 mb-8">
              Select a company for which we can help you file Annual Reports and elect a Registered Agent.
            </p>

            <div className="space-y-3 mb-8">
              {INFO_CARDS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="border border-[#FFC107]/40 rounded-xl p-4 bg-white dark:bg-[#111]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFC107] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{title}</p>
                      <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">{description}</p>
                      <button className="text-xs font-semibold text-[#FFC107] mt-1.5 hover:underline">
                        See More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-black dark:text-white">Select Company</h2>
              <Button className="bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black font-semibold shadow-none h-9 px-4 text-sm">
                <span className="text-lg leading-none mr-1">+</span>
                Add Company
              </Button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 dark:text-white/30" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a company..."
                className="pl-9 h-11 bg-white dark:bg-[#111] border-black/10 dark:border-white/10 focus:border-[#FFC107] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>

            {loadingCompanies ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#FFC107] animate-spin" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="border border-black/8 dark:border-white/8 rounded-xl p-8 text-center">
                <p className="text-sm text-black/40 dark:text-white/40">No companies found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(selectedCompany?.id === company.id ? null : company)}
                    className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedCompany?.id === company.id
                        ? "border-[#FFC107] bg-[#FFC107]/8"
                        : "border-black/8 dark:border-white/8 bg-white dark:bg-[#111] hover:border-[#FFC107]/40"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        selectedCompany?.id === company.id
                          ? "border-[#FFC107] bg-[#FFC107]"
                          : "border-black/20 dark:border-white/20"
                      }`}
                    >
                      {selectedCompany?.id === company.id && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-black dark:text-white">{company.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-6 border-t border-black/5 dark:border-white/5">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedCompany && setStep("select-services")}
                disabled={!selectedCompany}
                className="flex-1 h-11 bg-[#FFC107] hover:bg-[#FFB300] disabled:opacity-40 text-black font-bold shadow-none"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-black dark:text-white mb-1">Available Services</h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-5">
                Choose any combination of the services below for the states where you need compliance support.
              </p>
              <div className="space-y-4">
                {INFO_CARDS.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{title}</p>
                      <p className="text-sm text-black/50 dark:text-white/50">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-6">
              <h2 className="text-base font-bold text-black dark:text-white mb-4">Find your state</h2>

              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 dark:text-white/30" />
                <Input
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder="Type to search states..."
                  className="pl-9 h-10 w-72 bg-white dark:bg-[#0a0a0a] border-black/10 dark:border-white/10 focus:border-[#FFC107] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-black/8 dark:border-white/8">
                      <th className="text-left py-3 pr-4 text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider min-w-[160px]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          State
                        </div>
                      </th>
                      {SERVICE_COLUMNS.map(({ key, label, icon: Icon }) => (
                        <th key={key} className="text-center py-3 px-4 text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider min-w-[140px]">
                          <div className="flex items-center justify-center gap-1.5">
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {filteredStates.map((state) => {
                      const isHome = homeState?.code === state.code;
                      const stateServices = services[state.name] || {
                        foreignQualification: false,
                        annualReport: false,
                        registeredAgent: false,
                        changeOfAgent: false,
                      };
                      return (
                        <tr key={state.code} className="group hover:bg-[#FFC107]/4 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-black dark:text-white">{state.name}</span>
                              {isHome && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-[#FFC107] text-black">
                                  <Home className="h-3 w-3" />
                                  Home State
                                </span>
                              )}
                            </div>
                          </td>
                          {SERVICE_COLUMNS.map(({ key }) => (
                            <td key={key} className="py-3 px-4 text-center">
                              <button
                                onClick={() => toggleService(state.name, key as keyof ServiceSelection[string])}
                                className={`w-5 h-5 rounded border-2 mx-auto flex items-center justify-center transition-all ${
                                  stateServices[key as keyof typeof stateServices]
                                    ? "border-[#FFC107] bg-[#FFC107]"
                                    : "border-black/20 dark:border-white/20 hover:border-[#FFC107]"
                                }`}
                              >
                                {stateServices[key as keyof typeof stateServices] && (
                                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={onClose}
                disabled={countSelected() === 0}
                className="flex-1 h-11 bg-[#FFC107] hover:bg-[#FFB300] disabled:opacity-40 text-black font-bold shadow-none"
              >
                Continue{countSelected() > 0 ? ` (${countSelected()} selected)` : ""}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
