"use client";

import { useState, useEffect } from "react";
import { Package, TriangleAlert as AlertTriangle, TrendingUp, Boxes, Landmark, Loader as Loader2, ArrowRight, RefreshCw, ChartBar as BarChart2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";

type InventoryItem = {
  id: string;
  sku: string | null;
  name: string;
  category: string | null;
  platform: string;
  price: number;
  cost: number;
  quantity_in_stock: number;
  quantity_sold_mtd: number;
  quantity_sold_ytd: number;
  reorder_point: number;
  status: string;
  image_url: string | null;
};

type InventoryStats = {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  totalSoldMtd: number;
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify",
  amazon: "Amazon",
  etsy: "Etsy",
  stripe: "Stripe",
  woocommerce: "WooCommerce",
  manual: "Manual",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  inactive: { label: "Inactive", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800" },
  archived: { label: "Archived", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
};

function NoBankConnected() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
      <div className="h-16 w-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-4">
        <Landmark className="h-8 w-8 text-[#FFC107]" />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-2">Connect Your Bank to Sync Inventory</h3>
      <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mb-6">
        Link your bank account to automatically pull your product catalog and track stock levels in real time.
      </p>
      <div className="flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
        <ArrowRight className="h-3.5 w-3.5" />
        Go to Banking section to connect
      </div>
    </div>
  );
}

function StockIndicator({ qty, reorder }: { qty: number; reorder: number }) {
  if (qty === 0) {
    return <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">Out of stock</span>;
  }
  if (qty <= reorder) {
    return <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{qty} left</span>;
  }
  return <span className="text-xs font-semibold text-black/50 dark:text-white/50">{qty} in stock</span>;
}

export default function InventorySection() {
  const { user, company } = useAuth();
  const { trackEvent } = useAnalytics();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalSoldMtd: 0,
  });
  const [hasBankConnected, setHasBankConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "sold">("name");

  useEffect(() => {
    trackEvent("analytics_inventory_viewed", { company_id: company?.id });
    loadData();
  }, [user, company]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    try {
      const [inventoryRes, connectionsRes] = await Promise.all([
        supabase
          .from("ecommerce_inventory")
          .select("id, sku, name, category, platform, price, cost, quantity_in_stock, quantity_sold_mtd, quantity_sold_ytd, reorder_point, status, image_url")
          .eq("user_id", user.id)
          .order("name", { ascending: true }),
        supabase
          .from("bank_connections")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ]);

      setHasBankConnected((connectionsRes.data?.length ?? 0) > 0);

      const allItems: InventoryItem[] = (inventoryRes.data || []).map((i) => ({
        id: i.id,
        sku: i.sku,
        name: i.name,
        category: i.category,
        platform: i.platform,
        price: i.price / 100,
        cost: i.cost / 100,
        quantity_in_stock: i.quantity_in_stock,
        quantity_sold_mtd: i.quantity_sold_mtd,
        quantity_sold_ytd: i.quantity_sold_ytd,
        reorder_point: i.reorder_point,
        status: i.status,
        image_url: i.image_url,
      }));

      const totalValue = allItems.reduce((sum, i) => sum + i.price * i.quantity_in_stock, 0);
      const lowStock = allItems.filter((i) => i.quantity_in_stock <= i.reorder_point && i.status === "active").length;
      const soldMtd = allItems.reduce((sum, i) => sum + i.quantity_sold_mtd, 0);

      setItems(allItems);
      setStats({
        totalProducts: allItems.length,
        totalValue,
        lowStockCount: lowStock,
        totalSoldMtd: soldMtd,
      });
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = items
    .filter((i) => selectedStatus === "all" || i.status === selectedStatus)
    .sort((a, b) => {
      if (sortBy === "stock") return a.quantity_in_stock - b.quantity_in_stock;
      if (sortBy === "sold") return b.quantity_sold_mtd - a.quantity_sold_mtd;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-lg">
            <Boxes className="h-7 w-7 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Inventory</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              {hasBankConnected ? "Products synced from your store" : "Connect your bank to sync inventory"}
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border-2 border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black/60 dark:text-white/60 hover:border-[#FFC107] hover:text-black dark:hover:text-white transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFC107]" />
        </div>
      ) : !hasBankConnected ? (
        <NoBankConnected />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-black dark:bg-white border-2 border-black dark:border-white rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-white/80 dark:text-black/80">Total Products</span>
              </div>
              <p className="text-3xl font-bold text-white dark:text-black">{stats.totalProducts}</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-[#FFB300] rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-black" />
                <span className="text-sm font-medium text-black/80">Inventory Value</span>
              </div>
              <p className="text-3xl font-bold text-black">
                ${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className={`p-6 border-2 rounded-xl ${stats.lowStockCount > 0 ? "bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700" : "bg-white dark:bg-black border-black/20 dark:border-white/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-5 w-5 ${stats.lowStockCount > 0 ? "text-amber-500" : "text-[#FFC107]"}`} />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Low Stock</span>
              </div>
              <p className={`text-3xl font-bold ${stats.lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-black dark:text-white"}`}>
                {stats.lowStockCount}
              </p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-1">products need restocking</p>
            </div>

            <div className="p-6 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Sold This Month</span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">{stats.totalSoldMtd}</p>
              <p className="text-xs text-black/40 dark:text-white/40 mt-1">units</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex gap-2 flex-wrap">
              {["all", "active", "inactive", "archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    selectedStatus === s
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-black/40 dark:text-white/40 self-center">Sort by:</span>
              {[
                { key: "name" as const, label: "Name" },
                { key: "stock" as const, label: "Stock" },
                { key: "sold" as const, label: "Sold MTD" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sortBy === opt.key
                      ? "bg-[#FFC107] text-black"
                      : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-black dark:border-white rounded-xl overflow-hidden bg-white dark:bg-black">
            <div className="px-6 py-4 border-b-2 border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white">Product Catalog</h3>
              <span className="text-sm text-black/50 dark:text-white/50">{filtered.length} products</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-base font-semibold text-black dark:text-white mb-1">No products yet</p>
                <p className="text-sm text-black/50 dark:text-white/50 max-w-xs mx-auto">
                  Your product inventory will sync automatically once your bank is connected
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filtered.map((item) => {
                  const statusConf = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["inactive"];
                  const margin = item.cost > 0 ? ((item.price - item.cost) / item.price) * 100 : null;
                  return (
                    <div
                      key={item.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-[#FFC107]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-black dark:text-white text-sm truncate">{item.name}</p>
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${statusConf.color} ${statusConf.bg}`}>
                            {statusConf.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          {item.sku && (
                            <span className="text-xs text-black/40 dark:text-white/40">SKU: {item.sku}</span>
                          )}
                          {item.category && (
                            <span className="text-xs text-black/40 dark:text-white/40">{item.category}</span>
                          )}
                          <span className="text-xs bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 px-1.5 py-0.5 rounded capitalize">
                            {PLATFORM_LABELS[item.platform] ?? item.platform}
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-6 text-right shrink-0">
                        <div>
                          <p className="text-xs text-black/40 dark:text-white/40">Price</p>
                          <p className="text-sm font-bold text-black dark:text-white">${item.price.toFixed(2)}</p>
                          {margin !== null && (
                            <p className="text-xs text-green-600 dark:text-green-400">{margin.toFixed(0)}% margin</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-black/40 dark:text-white/40">Sold MTD</p>
                          <p className="text-sm font-bold text-black dark:text-white">{item.quantity_sold_mtd}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <StockIndicator qty={item.quantity_in_stock} reorder={item.reorder_point} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
