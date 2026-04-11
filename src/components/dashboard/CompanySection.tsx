"use client";

import { useState, useEffect } from "react";
import {
  Building2, MapPin, Globe, Users, DollarSign, Pencil, Save, X,
  Upload, Image as ImageIcon, Briefcase, Calendar, Hash, User,
  Mail, Shield, ChevronDown, ChevronUp, CircleCheck as CheckCircle2,
  Clock, CircleAlert as AlertCircle, FileText, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usStates } from "@/lib/us-states";

interface CompanySectionProps {
  onSaved?: () => void;
  autoEdit?: boolean;
}

type UserCompany = {
  id: string;
  name: string;
  entity_type: string;
  formation_state: string;
  ein: string | null;
  formation_date: string | null;
  address: string;
  officer_first_name: string;
  officer_last_name: string;
  officer_title: string | null;
  officer_email: string | null;
  registered_agent: string | null;
  rainc_company_id: string | null;
  status: string;
  plan: string | null;
  created_at: string;
  source: "user_companies" | "onboarding";
};

const BUSINESS_TYPES = [
  "E-commerce", "SaaS / Software", "Consulting / Coaching",
  "Digital Marketing Agency", "Content Creator / Influencer",
  "Online Course / Education", "Real Estate", "Retail / Physical Products",
  "Food & Beverage", "Healthcare Services", "Financial Services",
  "Manufacturing", "Construction",
  "Professional Services (Legal, Accounting, etc.)", "Non-Profit",
  "Technology / IT Services", "Entertainment / Media",
  "Transportation / Logistics", "Hospitality / Tourism", "Other",
];

const EMPLOYEE_COUNTS = [
  "Just me (1)", "2-5", "6-10", "11-20", "21-50", "51-100", "101-250", "250+",
];

function toStateCode(stateNameOrCode: string): string {
  if (!stateNameOrCode) return stateNameOrCode;
  if (stateNameOrCode.length === 2) return stateNameOrCode.toUpperCase();
  const match = usStates.find((s) => s.name.toLowerCase() === stateNameOrCode.toLowerCase());
  return match ? match.code : stateNameOrCode;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
        <Clock className="h-3 w-3" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
      <AlertCircle className="h-3 w-3" />
      {status}
    </span>
  );
}

function CompanyCard({ company }: { company: UserCompany }) {
  const [expanded, setExpanded] = useState(false);

  const details = [
    { label: "Entity Type", value: company.entity_type, icon: FileText },
    { label: "State", value: toStateCode(company.formation_state), icon: MapPin },
    { label: "Address", value: company.address, icon: MapPin, span: true },
    { label: "EIN", value: company.ein || "—", icon: Hash },
    {
      label: "Formation Date",
      value: company.formation_date
        ? new Date(company.formation_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "—",
      icon: Calendar,
    },
    {
      label: "Officer",
      value: [company.officer_first_name, company.officer_last_name].filter(Boolean).join(" ") || "—",
      icon: User,
    },
    { label: "Title", value: company.officer_title || "—", icon: Briefcase },
    { label: "Officer Email", value: company.officer_email || "—", icon: Mail },
    { label: "Registered Agent", value: company.registered_agent || "—", icon: Shield, span: true },
    ...(company.rainc_company_id
      ? [{ label: "Company ID", value: company.rainc_company_id, icon: Hash, span: true }]
      : []),
    ...(company.plan ? [{ label: "Plan", value: company.plan, icon: Sparkles }] : []),
  ];

  return (
    <div className="group bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden transition-all duration-200 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#FFC107] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Building2 className="h-5 w-5 text-black" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-black dark:text-white truncate leading-tight">{company.name}</h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StatusBadge status={company.status} />
                  {company.entity_type && (
                    <span className="text-[11px] font-medium text-black/40 dark:text-white/40">{company.entity_type}</span>
                  )}
                  {company.formation_state && (
                    <span className="text-[11px] font-medium text-black/40 dark:text-white/40">{toStateCode(company.formation_state)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-black/4 dark:bg-white/4 hover:bg-[#FFC107]/15 flex items-center justify-center transition-colors"
              >
                {expanded
                  ? <ChevronUp className="h-4 w-4 text-black/50 dark:text-white/50" />
                  : <ChevronDown className="h-4 w-4 text-black/50 dark:text-white/50" />}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "EIN", value: company.ein || "Not set" },
                { label: "State", value: toStateCode(company.formation_state) || "—" },
                {
                  label: "Since",
                  value: new Date(company.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/3 dark:bg-white/4 rounded-xl p-2.5 text-center">
                  <p className="text-[9px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-xs font-bold text-black dark:text-white truncate">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-black/6 dark:border-white/6 bg-black/1.5 dark:bg-white/1.5 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {details.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.label}
                  className={`flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 ${(d as { span?: boolean }).span ? "sm:col-span-2" : ""}`}
                >
                  <div className="w-6 h-6 rounded-lg bg-[#FFC107]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-3 w-3 text-[#FFC107]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-0.5">{d.label}</p>
                    <p className="text-xs font-semibold text-black dark:text-white break-words">{d.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompanySection({ onSaved, autoEdit = false }: CompanySectionProps) {
  const { company, profile, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(autoEdit);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [allCompanies, setAllCompanies] = useState<UserCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [formData, setFormData] = useState({
    name: company?.name || "",
    business_type: company?.business_type || "",
    address: company?.address || "",
    website: company?.website || "",
    employee_count: company?.employee_count || "",
    annual_revenue: company?.annual_revenue || "",
  });
  const { user } = useAuth();

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        business_type: company.business_type || "",
        address: company.address || "",
        website: company.website || "",
        employee_count: company.employee_count || "",
        annual_revenue: company.annual_revenue || "",
      });
    }
  }, [company]);

  useEffect(() => {
    async function loadLogoUrl() {
      if (company?.logo_url) {
        const { data } = await supabase.storage
          .from("documents")
          .createSignedUrl(company.logo_url, 3600);
        if (data?.signedUrl) setLogoUrl(data.signedUrl);
      } else {
        setLogoUrl(null);
      }
    }
    loadLogoUrl();
  }, [company?.logo_url]);

  useEffect(() => {
    if (profile && !profile.profile_completed && company) {
      setIsEditing(true);
    }
  }, [profile, company]);

  useEffect(() => {
    if (!user) return;
    loadAllCompanies();
  }, [user]);

  async function loadAllCompanies() {
    if (!user) return;
    setLoadingCompanies(true);
    try {
      const [{ data: ucRows }, { data: onboardingRows }] = await Promise.all([
        supabase
          .from("user_companies")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("onboarding_data")
          .select("id, company_name, entity_type, formation_state, rainc_company_id, completed, created_at")
          .eq("user_id", user.id)
          .eq("completed", true)
          .not("company_name", "is", null),
      ]);

      const seen = new Set<string>();
      const list: UserCompany[] = [];

      for (const r of (ucRows || []) as UserCompany[]) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          list.push({ ...r, source: "user_companies" });
        }
      }

      for (const r of (onboardingRows || []) as {
        id: string; company_name: string; entity_type: string;
        formation_state: string; rainc_company_id: string | null;
        completed: boolean; created_at: string;
      }[]) {
        const exists = list.some(
          (c) => c.rainc_company_id && c.rainc_company_id === r.rainc_company_id
        );
        if (!exists) {
          list.push({
            id: r.id,
            name: r.company_name,
            entity_type: r.entity_type || "",
            formation_state: r.formation_state || "",
            ein: null,
            formation_date: null,
            address: "",
            officer_first_name: "",
            officer_last_name: "",
            officer_title: null,
            officer_email: null,
            registered_agent: null,
            rainc_company_id: r.rainc_company_id,
            status: "active",
            plan: null,
            created_at: r.created_at,
            source: "onboarding",
          });
        }
      }

      setAllCompanies(list);
    } finally {
      setLoadingCompanies(false);
    }
  }

  const handleSave = async () => {
    if (!company) return;
    setUploading(true);
    try {
      let logo_url = company.logo_url;
      if (selectedLogo) {
        const fileExt = selectedLogo.name.split(".").pop();
        const fileName = `${company.id}/logo.${fileExt}`;
        if (company.logo_url) {
          await supabase.storage.from("documents").remove([company.logo_url]);
        }
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, selectedLogo, { upsert: true });
        if (uploadError) throw uploadError;
        logo_url = fileName;
      }
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          business_type: formData.business_type,
          address: formData.address,
          website: formData.website || null,
          employee_count: formData.employee_count,
          annual_revenue: formData.annual_revenue || null,
          logo_url,
        })
        .eq("id", company.id);
      if (error) throw error;
      await refreshUserData();
      setIsEditing(false);
      setSelectedLogo(null);
      if (onSaved) {
        onSaved();
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company information. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: company?.name || "",
      business_type: company?.business_type || "",
      address: company?.address || "",
      website: company?.website || "",
      employee_count: company?.employee_count || "",
      annual_revenue: company?.annual_revenue || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black dark:text-white">Companies</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">
            {loadingCompanies ? "Loading..." : `${allCompanies.length} registered compan${allCompanies.length === 1 ? "y" : "ies"}`}
          </p>
        </div>
        {company && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#FFC107]/15 border border-black/8 dark:border-white/8 text-sm font-semibold text-black dark:text-white transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {isEditing && company && (
        <div className="bg-white dark:bg-[#0f0f0f] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/6 dark:border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center">
                <Pencil className="h-3.5 w-3.5 text-black" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">Edit Business Profile</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-black/80 dark:hover:bg-white/90 transition-colors disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-3">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 flex items-center justify-center bg-black/2 dark:bg-white/2 overflow-hidden flex-shrink-0">
                  {logoUrl && !selectedLogo ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-black/20 dark:text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 hover:border-[#FFC107]/50 cursor-pointer transition-colors group">
                    <Upload className="h-4 w-4 text-black/40 dark:text-white/40 group-hover:text-[#FFC107] transition-colors" />
                    <span className="text-sm text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {selectedLogo ? selectedLogo.name : "Choose image..."}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)} />
                  </label>
                  <p className="text-xs text-black/30 dark:text-white/30 mt-1.5">JPG or PNG, square preferred</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Company Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Acme Inc." className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Business Type</label>
                <Select value={formData.business_type} onValueChange={(v) => setFormData({ ...formData, business_type: v })}>
                  <SelectTrigger className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Address</label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, City, State, ZIP" className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Website</label>
                <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://example.com" className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Team Size</label>
                <Select value={formData.employee_count} onValueChange={(v) => setFormData({ ...formData, employee_count: v })}>
                  <SelectTrigger className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_COUNTS.map((count) => <SelectItem key={count} value={count}>{count}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-2">Annual Revenue</label>
                <Input value={formData.annual_revenue} onChange={(e) => setFormData({ ...formData, annual_revenue: e.target.value })} placeholder="e.g. $100K–$500K" className="border border-black/12 dark:border-white/12 focus:border-[#FFC107] h-10 text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {company && !isEditing && (
        <div className="bg-white dark:bg-[#0f0f0f] border border-black/8 dark:border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 dark:border-white/5">
            <div className="w-8 h-8 rounded-lg bg-black/4 dark:bg-white/4 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-black/50 dark:text-white/50" />
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white">Business Profile</h3>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-3">
            {[
              { label: "Business Type", value: company.business_type, icon: Briefcase },
              { label: "Team Size", value: company.employee_count, icon: Users },
              { label: "Address", value: company.address, icon: MapPin, span: true },
              ...(company.website ? [{ label: "Website", value: company.website, icon: Globe }] : []),
              ...(company.annual_revenue ? [{ label: "Annual Revenue", value: company.annual_revenue, icon: DollarSign }] : []),
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 p-3.5 rounded-xl bg-black/2 dark:bg-white/2 ${(item as { span?: boolean }).span ? "md:col-span-2" : ""}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FFC107]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-[#FFC107]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-black dark:text-white truncate">{item.value || "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">
            Registered Companies
          </h3>
          <span className="text-xs font-bold text-black/30 dark:text-white/30">
            {loadingCompanies ? "..." : allCompanies.length}
          </span>
        </div>

        {loadingCompanies ? (
          <div className="flex items-center justify-center py-14">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#FFC107]/30 border-t-[#FFC107] animate-spin" />
          </div>
        ) : allCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-[#0f0f0f] border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mb-4">
              <Building2 className="h-7 w-7 text-[#FFC107]" />
            </div>
            <p className="text-sm font-bold text-black dark:text-white mb-1">No companies yet</p>
            <p className="text-xs text-black/40 dark:text-white/40 max-w-xs">
              Form your first company through the onboarding process or add an existing one.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {allCompanies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
