"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingCart, Search, Package, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, getServicesByCategory } from "@/lib/services-catalog";
import type { Service, ServiceCategory } from "@/lib/services-catalog";
import ServiceCard from "./services/ServiceCard";
import CartDrawer from "./services/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";

interface UserCompany {
  rainc_company_id: string;
  name: string;
}

function ServiceGrid({ services, cartIds, onToggleCart }: {
  services: Service[];
  cartIds: Set<string>;
  onToggleCart: (s: Service) => void;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          inCart={cartIds.has(service.id)}
          onToggleCart={onToggleCart}
        />
      ))}
    </div>
  );
}

export default function ServicesSection() {
  const { user, company } = useAuth();
  const { trackServiceSelected, trackCheckoutStarted } = useAnalytics();
  const [cart, setCart] = useState<Service[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);

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

  // ===== BOUTON TEST TEMPORAIRE =====
  async function testConstants() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/rainc-proxy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
     body: JSON.stringify({ method: "GET", path: "/services", body: null })
    });
    const d = await res.json();
    console.log("=== CONSTANTS RESULT ===");
    console.log(JSON.stringify(d, null, 2));
    console.log("========================");
  }
  // ==================================

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? SERVICES : getServicesByCategory(activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const grouped = useMemo(() => {
    if (activeCategory !== "all" || search.trim()) return null;
    return SERVICE_CATEGORIES.map((cat) => ({
      ...cat,
      services: getServicesByCategory(cat.id),
    })).filter((g) => g.services.length > 0);
  }, [activeCategory, search]);

  const cartIds = new Set(cart.map((s) => s.id));

  function toggleCart(service: Service) {
    const alreadyInCart = cart.find((s) => s.id === service.id);
    if (!alreadyInCart) {
      trackServiceSelected({
        service_type: service.raincServiceType ?? service.id,
        llc_state: company?.address ?? "unknown",
        price: service.price,
      });
    }
    setCart((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleCheckout() {
    if (cart.length === 0) return;
    if (!selectedCompanyId) {
      toast.error("Please select a company to apply these services to.");
      return;
    }
    setCheckoutLoading(true);
    setOrderResult(null);
    trackCheckoutStarted({
      cart_total: cart.reduce((sum, s) => sum + s.price, 0),
      items_count: cart.length,
      llc_state: company?.address ?? "unknown",
    });
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
          services: cart.map((s) => ({
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

      if (!res.ok || data.error) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      toast.error(String(err));
      setCheckoutLoading(false);
    }
  }

  const total = cart.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">

     

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-black dark:text-white">Services</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">
            Business formation, compliance, and management services
          </p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:bg-black/80 transition-colors self-start sm:self-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFC107] text-black text-[10px] font-black rounded-full flex items-center justify-center shadow">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {orderResult && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
          orderResult.success
            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
        }`}>
          {orderResult.success
            ? <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          }
          <p className={`text-sm font-medium ${
            orderResult.success ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
          }`}>
            {orderResult.message}
          </p>
        </div>
      )}

      {companies.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8">
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
      )}

      {companies.length === 0 && (
        <div className="px-4 py-3 rounded-xl bg-[#FFC107]/10 border border-[#FFC107]/30">
          <p className="text-xs font-medium text-black/60 dark:text-white/60">
            You need a registered company to order services. Complete your company formation first.
          </p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FFC107]/10 border border-[#FFC107]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFC107] flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-4 w-4 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-black dark:text-white">
                {cart.length} service{cart.length > 1 ? "s" : ""} in cart
              </p>
              <p className="text-xs text-black/50 dark:text-white/50">Total: ${total}</p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-xs rounded-lg transition-colors"
          >
            View Cart
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 dark:text-white/30" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 rounded-xl text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-[#FFC107]/50 focus:ring-1 focus:ring-[#FFC107]/20 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveCategory("all"); setSearch(""); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeCategory === "all"
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
          }`}
        >
          All Services
        </button>
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeCategory === cat.id
                ? "bg-[#FFC107] text-black"
                : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {grouped ? (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.id}>
              <div className="mb-4 pb-3 border-b border-black/6 dark:border-white/6">
                <h2 className="text-lg font-black text-black dark:text-white">{group.label}</h2>
                <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{group.description}</p>
              </div>
              <ServiceGrid services={group.services} cartIds={cartIds} onToggleCart={toggleCart} />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <ServiceGrid services={filtered} cartIds={cartIds} onToggleCart={toggleCart} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <Package className="h-6 w-6 text-black/30 dark:text-white/30" />
          </div>
          <p className="text-sm font-semibold text-black/40 dark:text-white/40">
            No services found
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="text-xs text-[#FFC107] font-bold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        items={cart}
        onRemove={removeFromCart}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        loading={checkoutLoading}
      />
    </div>
  );
}
