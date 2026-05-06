"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, Building2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/corporatetools";
import { usStates } from "@/lib/us-states";

type ServiceType = "mail" | "phone";

type ServiceRecord = {
  id: string;
  rainc_company_id: string;
  service_type: ServiceType;
  jurisdiction: string;
  status: "active" | "pending" | "failed";
  activated_at: string | null;
};

type CompanyOption = {
  rainc_company_id: string;
  name: string;
  formation_state: string;
};

type ServiceState = {
  loading: boolean;
  success: boolean;
  error: string | null;
};

const INITIAL_SERVICE_STATE: ServiceState = { loading: false, success: false, error: null };

function toStateCode(stateNameOrCode: string): string {
  if (!stateNameOrCode) return stateNameOrCode;
  if (stateNameOrCode.length === 2) return stateNameOrCode.toUpperCase();
  const match = usStates.find(
    (s) => s.name.toLowerCase() === stateNameOrCode.toLowerCase()
  );
  return match ? match.code : stateNameOrCode;
}

export default function MailPhoneSection() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mailState, setMailState] = useState<ServiceState>(INITIAL_SERVICE_STATE);
  const [phoneState, setPhoneState] = useState<ServiceState>(INITIAL_SERVICE_STATE);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    setLoadingData(true);
    try {
      const [{ data: ucRows }, { data: onboardingRows }, { data: svcRows }] = await Promise.all([
        supabase
          .from("user_companies")
          .select("rainc_company_id, name, formation_state")
          .eq("user_id", user.id)
          .not("rainc_company_id", "is", null),
        supabase
          .from("onboarding_data")
          .select("rainc_company_id, company_name, formation_state")
          .eq("user_id", user.id)
          .eq("completed", true)
          .not("rainc_company_id", "is", null),
        supabase
          .from("company_services")
          .select("*")
          .eq("user_id", user.id),
      ]);

      const seen = new Set<string>();
      const companyList: CompanyOption[] = [];

      for (const r of (ucRows || []) as { rainc_company_id: string; name: string; formation_state: string }[]) {
        if (r.rainc_company_id && !seen.has(r.rainc_company_id)) {
          seen.add(r.rainc_company_id);
          companyList.push({
            rainc_company_id: r.rainc_company_id,
            name: r.name,
            formation_state: r.formation_state,
          });
        }
      }

      for (const r of (onboardingRows || []) as { rainc_company_id: string; company_name: string; formation_state: string }[]) {
        if (r.rainc_company_id && !seen.has(r.rainc_company_id)) {
          seen.add(r.rainc_company_id);
          companyList.push({
            rainc_company_id: r.rainc_company_id,
            name: r.company_name,
            formation_state: r.formation_state,
          });
        }
      }

      setCompanies(companyList);
      if (companyList.length > 0) setSelectedCompanyId(companyList[0].rainc_company_id);
      setServices((svcRows || []) as ServiceRecord[]);
    } finally {
      setLoadingData(false);
    }
  }

  const selectedCompany = companies.find((c) => c.rainc_company_id === selectedCompanyId);

  function getServiceRecord(type: ServiceType) {
    return services.find(
      (s) => s.rainc_company_id === selectedCompanyId && s.service_type === type
    );
  }

async function activateService(type: ServiceType) {
  if (!selectedCompany || !user) return;

  const setState = type === "mail" ? setMailState : setPhoneState;
  setState({ loading: true, success: false, error: null });

  const companyId = selectedCompany.rainc_company_id;
  const rawState = selectedCompany.formation_state;

  if (!companyId) {
    setState({ loading: false, success: false, error: "Missing company ID — please refresh." });
    return;
  }
  if (!rawState) {
    setState({ loading: false, success: false, error: "Missing formation state — please refresh." });
    return;
  }

  const stateName = rawState.length === 2
    ? (usStates.find((s) => s.code.toLowerCase() === rawState.toLowerCase())?.name ?? rawState)
    : rawState;

  const body = {
    company_id: companyId,
    jurisdictions: [stateName],
  };

    try {
      try {
        await apiRequest("POST", "/services", body);
      } catch (postErr: unknown) {
        const rawMsg = postErr instanceof Error ? postErr.message : String(postErr);
        if (!rawMsg.toLowerCase().includes("already exists")) {
          throw postErr;
        }
        await apiRequest("GET", "/services", { company_id: companyId });
      }

      const now = new Date().toISOString();

      const existing = getServiceRecord(type);
      if (existing) {
        await supabase
          .from("company_services")
          .update({ status: "active", activated_at: now })
          .eq("id", existing.id);
        setServices((prev) =>
          prev.map((s) =>
            s.id === existing.id ? { ...s, status: "active", activated_at: now } : s
          )
        );
      } else {
        const { data: inserted } = await supabase
          .from("company_services")
          .insert({
            user_id: user.id,
            rainc_company_id: companyId,
            service_type: type,
            jurisdiction: stateName,
            status: "active",
            activated_at: now,
          })
          .select()
          .single();
        if (inserted) {
          setServices((prev) => [...prev, inserted as ServiceRecord]);
        }
      }

      setState({ loading: false, success: true, error: null });
    } catch (err: unknown) {
      let message = "Failed to activate service.";
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          message = parsed?.error?.result?.message || parsed?.error?.message || err.message;
        } catch {
          message = err.message;
        }
      }
      setState({ loading: false, success: false, error: message });
    }
  }

  const mailRecord = getServiceRecord("mail");
  const phoneRecord = getServiceRecord("phone");

  const serviceCards: {
    type: ServiceType;
    icon: typeof Mail;
    title: string;
    description: string;
    state: ServiceState;
    record: ServiceRecord | undefined;
  }[] = [
    {
      type: "mail",
      icon: Mail,
      title: "Virtual Mail",
      description: "Receive and manage your business mail digitally. Scan, forward, and store all correspondence.",
      state: mailState,
      record: mailRecord,
    },
    {
      type: "phone",
      icon: Phone,
      title: "Business Phone",
      description: "Get a dedicated business phone number with call forwarding, voicemail, and SMS.",
      state: phoneState,
      record: phoneRecord,
    },
  ];

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#FFC107]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-black dark:text-white mb-1">Mail & Phone Services</h2>
        <p className="text-sm text-black/50 dark:text-white/50">
          Activate virtual mail and business phone services for your companies.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
            <Building2 className="h-7 w-7 text-black/30 dark:text-white/30" />
          </div>
          <p className="text-sm font-semibold text-black dark:text-white mb-1">No companies found</p>
          <p className="text-xs text-black/40 dark:text-white/40 max-w-xs">
            You need at least one formed company to activate mail or phone services.
          </p>
        </div>
      ) : (
        <>
          {companies.length > 1 && (
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2">Select Company</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => {
                  setSelectedCompanyId(e.target.value);
                  setMailState(INITIAL_SERVICE_STATE);
                  setPhoneState(INITIAL_SERVICE_STATE);
                }}
                className="w-full h-11 px-3 bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white text-sm font-medium focus:border-[#FFC107] focus:outline-none"
              >
                {companies.map((c) => (
                  <option key={c.rainc_company_id} value={c.rainc_company_id}>
                    {c.name} — {toStateCode(c.formation_state)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCompany && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/3 dark:bg-white/4 border border-black/8 dark:border-white/8">
              <Building2 className="h-4 w-4 text-[#FFC107] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-black dark:text-white truncate">{selectedCompany.name}</p>
                <p className="text-xs text-black/40 dark:text-white/40">
                  Company ID: {selectedCompany.rainc_company_id} &middot; {toStateCode(selectedCompany.formation_state)}
                </p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {serviceCards.map(({ type, icon: Icon, title, description, state, record }) => {
              const isActive = record?.status === "active";
              return (
                <div
                  key={type}
                  className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-green-100 dark:bg-green-900/30" : "bg-black/5 dark:bg-white/6"}`}>
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-600 dark:text-green-400" : "text-black/50 dark:text-white/50"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-black dark:text-white">{title}</p>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">{description}</p>
                    </div>
                  </div>

                  {state.success && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                        Service activated successfully!
                      </p>
                    </div>
                  )}

                  {state.error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600 dark:text-red-400 break-words">{state.error}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => activateService(type)}
                    disabled={state.loading || (isActive && !state.error)}
                    className={`w-full h-10 rounded-xl font-bold text-sm transition-all ${
                      isActive && !state.error
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 cursor-default"
                        : state.error
                        ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80"
                        : "bg-[#FFC107] hover:bg-[#FFB300] text-black"
                    }`}
                  >
                    {state.loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Activating...
                      </span>
                    ) : isActive && !state.error ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Active
                      </span>
                    ) : state.error ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                      </span>
                    ) : (
                      `Activate ${title}`
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
