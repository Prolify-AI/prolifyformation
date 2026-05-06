"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag, TrendingUp, Clock, Package, Landmark,
  CircleCheck as CheckCircle, Circle as XCircle, Loader as Loader2,
  ArrowRight, RefreshCw, Store
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { format } from "date-fns";

type EcommerceOrder = {
  id: string;
  external_order_id: string | null;
  platform: string;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  total_amount: number;
  currency: string;
  order_date: string;
  items: { name?: string; quantity?: number; price?: number }[];
};

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
};

type BankConnection = {
  id: string;
  institution_name: string;
  display_name: string | null;
  last4: string | null;
  synced_at: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  completed: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  paid: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  pending: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  processing: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  failed: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  cancelled: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800",
  refunded: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify",
  amazon: "Amazon",
  etsy: "Etsy",
  stripe: "Stripe",
  woocommerce: "WooCommerce",
  manual: "Manual",
};

function StatusBadge({ status }: { status: string }) {
  const classes = STATUS_COLORS[status] ?? STATUS_COLORS["cancelled"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${classes}`}>
      {["completed", "paid"].includes(status) ? (
        <CheckCircle className="h-3 w-3" />
      ) : ["failed", "cancelled"].includes(status) ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {status}
    </span>
  );
}

function NoBankConnected({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
      <div className="h-16 w-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-4">
        <Landmark className="h-8 w-8 text-[#FFC107]" />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-2">Connect Your Bank to Sync Orders</h3>
      <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mb-6">
        Link your bank account to automatically import and track all your e-commerce orders in one place.
      </p>
      {onNavigate && (
        <button
          onClick={onNavigate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold text-sm rounded-xl transition-colors"
        >
          Connect Bank Account <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function OrdersSection() {
  const { user, company } = useAuth();
  const { trackEvent } = useAnalytics();
  const [orders, setOrders] = useState<EcommerceOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
  });
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  useEffect(() => {
    trackEvent("analytics_orders_viewed", { company_id: company?.id });
    loadData();
  }, [user, company]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    try {
      const [ordersRes, connectionsRes] = await Promise.all([
        supabase
          .from("ecommerce_orders")
          .select("id, external_order_id, platform, customer_name, customer_email, status, total_amount, currency, order_date, items")
          .eq("user_id", user.id)
          .order("order_date", { ascending: false }),
        supabase
          .from("bank_connections")
          .select("id, institution_name, display_name, last4, synced_at")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ]);

      const allOrders: EcommerceOrder[] = (ordersRes.data || []).map((o) => ({
        id: o.id,
        external_order_id: o.external_order_id,
        platform: o.platform,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        status: o.status,
        total_amount: o.total_amount / 100,
        currency: o.currency,
        order_date: o.order_date,
        items: Array.isArray(o.items) ? o.items : [],
      }));

      setBankConnections(connectionsRes.data || []);

      const completed = allOrders.filter((o) => ["completed", "paid"].includes(o.status));
      const totalRevenue = completed.reduce((sum, o) => sum + o.total_amount, 0);
      const pending = allOrders.filter((o) => ["pending", "processing"].includes(o.status)).length;

      setOrders(allOrders);
      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        averageOrderValue: completed.length > 0 ? totalRevenue / completed.length : 0,
        pendingOrders: pending,
      });
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const platforms = ["all", ...Array.from(new Set(orders.map((o) => o.platform)))];
  const filtered = selectedPlatform === "all" ? orders : orders.filter((o) => o.platform === selectedPlatform);

  const hasBankConnected = bankConnections.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
            <ShoppingBag className="h-7 w-7 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Orders</h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              {hasBankConnected
                ? `Synced from ${bankConnections.length} bank account${bankConnections.length !== 1 ? "s" : ""}`
                : "Connect your bank to sync orders"}
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
                <ShoppingBag className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-white/80 dark:text-black/80">Total Orders</span>
              </div>
              <p className="text-3xl font-bold text-white dark:text-black">{stats.totalOrders}</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#FFC107] to-[#FFB300] border-2 border-[#FFB300] rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-black" />
                <span className="text-sm font-medium text-black/80">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-black">${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="p-6 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[#FFC107]" />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Avg Order Value</span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">
                ${stats.averageOrderValue.toFixed(2)}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl hover:border-[#FFC107] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-black/70 dark:text-white/70">Pending</span>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white">{stats.pendingOrders}</p>
            </div>
          </div>

          {bankConnections.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {bankConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-full text-xs font-semibold text-green-700 dark:text-green-400"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {conn.display_name || conn.institution_name}
                  {conn.last4 && <span className="text-green-500">••{conn.last4}</span>}
                </div>
              ))}
            </div>
          )}

          {platforms.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPlatform === p
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
                >
                  {p === "all" ? "All Platforms" : (PLATFORM_LABELS[p] ?? p)}
                </button>
              ))}
            </div>
          )}

          <div className="border-2 border-black dark:border-white rounded-xl overflow-hidden bg-white dark:bg-black">
            <div className="px-6 py-4 border-b-2 border-black/10 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white">Recent Orders</h3>
              <span className="text-sm text-black/50 dark:text-white/50">{filtered.length} orders</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-base font-semibold text-black dark:text-white mb-1">No orders yet</p>
                <p className="text-sm text-black/50 dark:text-white/50 max-w-xs mx-auto">
                  Orders from your connected bank accounts will appear here automatically
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {filtered.slice(0, 20).map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-[#FFC107]/10 flex items-center justify-center flex-shrink-0">
                        <Store className="h-4 w-4 text-[#FFC107]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-black dark:text-white text-sm truncate">
                          {order.customer_name || (order.items[0]?.name ?? "Order")}
                          {order.external_order_id && (
                            <span className="ml-2 text-black/40 dark:text-white/40 text-xs">#{order.external_order_id}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-black/50 dark:text-white/50">
                            {format(new Date(order.order_date), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 px-1.5 py-0.5 rounded capitalize">
                            {PLATFORM_LABELS[order.platform] ?? order.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={order.status} />
                      <span className="font-bold text-black dark:text-white text-sm tabular-nums">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
