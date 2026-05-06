"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, RefreshCw, Star, Check, ArrowRight, Building2 } from "lucide-react";
import { SERVICES } from "@/lib/services-catalog";
import type { Service } from "@/lib/services-catalog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ServicePurchasePanelProps {
  serviceIds: string[];
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
}

interface UserCompany {
  rainc_company_id: string;
  name: string;
}

export default function ServicePurchasePanel({
  serviceIds,
  title,
  description,
  icon: Icon,
  iconBgClass,
  iconColorClass,
}: ServicePurchasePanelProps) {
  const { user, company } = useAuth();
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const services = serviceIds
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter(Boolean) as Service[];

  useEffect(() => {
    if (!user) return;
    async function loadCompanies() {
      const results: UserCompany[] = [];
      const seen = new Set<string>();

      const { data: ucRows } = await supabase
        .from("user_companies")
        .select("rainc_company_id, name")
        .eq("user_id", user!.id)
        .not("rainc_company_id", "is", null);

      for (const r of (ucRows || []) as { rainc_company_id: string; name: string }[]) {
        if (r.rainc_company_id && !seen.has(r.rainc_company_id)) {
          seen.add(r.rainc_company_id);
          results.push({ rainc_company_id: r.rainc_company_id, name: r.name });
        }
      }

      const { data: onboardingRows } = await supabase
        .from("onboarding_data")
        .select("rainc_company_id, company_name")
        .eq("user_id", user!.id)
        .not("rainc_company_id", "is", null);

      for (const r of (onboardingRows || []) as { rainc_company_id: string; company_name: string }[]) {
        if (r.rainc_company_id && !seen.has(r.rainc_company_id)) {
          seen.add(r.rainc_company_id);
          results.push({ rainc_company_id: r.rainc_company_id, name: r.company_name });
        }
      }

      setCompanies(results);
      if (results.length > 0) setSelectedCompanyId(results[0].rainc_company_id);
    }
    loadCompanies();
  }, [user]);

  function toggleCart(id: string) {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCheckout() {
    const selected = services.filter((s) => cart.has(s.id));
    if (selected.length === 0) {
      toast.error("Select at least one service to continue.");
      return;
    }
    if (!selectedCompanyId) {
      toast.error("Please select a company to apply these services to.");
      return;
    }
    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const origin = window.location.origin;

      const res = await fetch(`${supabaseUrl}/functions/v1/services-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          raincCompanyId: selectedCompanyId,
          services: selected.map((s) => ({
            id: s.id,
            name: s.name,
            price: s.price,
            raincServiceType: s.raincServiceType,
          })),
          successUrl: `${origin}/dashboard?payment=success`,
          cancelUrl: `${origin}/dashboard?payment=cancelled`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err) {
      toast.error(String(err));
      setLoading(false);
    }
  }

  const selectedServices = services.filter((s) => cart.has(s.id));
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${iconBgClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${iconColorClass}`} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white">{title}</h2>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Company selector */}
      {companies.length > 0 ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8">
          <Building2 className="h-4 w-4 text-black/40 dark:text-white/40 flex-shrink-0" />
          <span className="text-xs font-bold text-black/60 dark:text-white/60 flex-shrink-0">Apply to:</span>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-black dark:text-white focus:outline-none cursor-pointer"
          >
            {companies.map((c) => (
              <option key={c.rainc_company_id} value={c.rainc_company_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="px-4 py-3 rounded-xl bg-[#FFC107]/10 border border-[#FFC107]/30">
          <p className="text-xs font-medium text-black/60 dark:text-white/60">
            You need a registered company to order services. Complete your company formation first.
          </p>
        </div>
      )}

      {/* Service cards */}
      <div className="space-y-3">
        {services.map((service) => {
          const inCart = cart.has(service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleCart(service.id)}
              className={`relative rounded-xl border cursor-pointer transition-all duration-200 p-4 ${
                inCart
                  ? "border-[#FFC107] bg-[#FFC107]/5 dark:bg-[#FFC107]/8 shadow-md shadow-[#FFC107]/10"
                  : "border-black/8 dark:border-white/8 bg-white dark:bg-[#111] hover:border-[#FFC107]/40 hover:shadow-sm"
              }`}
            >
              {service.popular && (
                <span className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 bg-[#FFC107] text-black text-[10px] font-bold rounded-full">
                  <Star className="h-2.5 w-2.5" strokeWidth={3} />
                  Popular
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  inCart ? "bg-[#FFC107] border-[#FFC107]" : "border-black/20 dark:border-white/20"
                }`}>
                  {inCart && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black dark:text-white text-sm leading-tight pr-16">{service.name}</h3>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1 leading-relaxed">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-black text-black dark:text-white">${service.price}</span>
                    {service.recurring && (
                      <span className="flex items-center gap-1 text-[11px] text-black/40 dark:text-white/40">
                        <RefreshCw className="h-3 w-3" />
                        {service.recurringLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout bar */}
      <div className={`sticky bottom-4 rounded-xl border transition-all duration-200 overflow-hidden ${
        cart.size > 0
          ? "border-[#FFC107]/40 bg-white dark:bg-[#111] shadow-lg shadow-black/10"
          : "border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/3"
      }`}>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            {cart.size > 0 ? (
              <>
                <p className="text-sm font-bold text-black dark:text-white">
                  {cart.size} service{cart.size > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-black/50 dark:text-white/50">Total: ${total}</p>
              </>
            ) : (
              <p className="text-sm text-black/40 dark:text-white/40">Select a service above to continue</p>
            )}
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.size === 0 || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              cart.size > 0 && !loading
                ? "bg-[#FFC107] hover:bg-[#FFB300] text-black"
                : "bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed"
            }`}
          >
            {loading ? "Redirecting..." : "Purchase"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
