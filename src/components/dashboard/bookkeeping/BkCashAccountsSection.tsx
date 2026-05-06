"use client";

import { useState, useEffect, useCallback } from "react";
import { Landmark, RefreshCw, TrendingUp, TrendingDown, ChevronDown, ChevronUp, CircleCheck as CheckCircle, Wifi, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type FCTransaction = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  transacted_at: number;
  status: string;
};

type ConnectedAccount = {
  id: string;
  display_name: string | null;
  institution_name: string;
  last4: string | null;
  category: string;
  balance: {
    current?: { usd?: number } | null;
    available?: { usd?: number } | null;
  } | null;
  transactions: FCTransaction[];
  showTransactions: boolean;
  savedToDb: boolean;
};

const fmtBalance = (cents?: number | null) => {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
};

const fmtTxAmt = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(Math.abs(amount) / 100);

export default function BkCashAccountsSection() {
  const { user, company } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  const loadSaved = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bank_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setAccounts(data.map((row) => ({
        id: row.stripe_account_id,
        display_name: row.display_name,
        institution_name: row.institution_name,
        last4: row.last4,
        category: row.category,
        balance: row.balance_current != null
          ? { current: { usd: row.balance_current }, available: row.balance_available != null ? { usd: row.balance_available } : null }
          : null,
        transactions: [],
        showTransactions: false,
        savedToDb: true,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const saveToDb = async (account: ConnectedAccount) => {
    if (!user) return;
    await supabase.from("bank_connections").upsert({
      user_id: user.id,
      company_id: company?.id ?? null,
      stripe_account_id: account.id,
      institution_name: account.institution_name,
      display_name: account.display_name,
      last4: account.last4,
      category: account.category,
      balance_current: account.balance?.current?.usd ?? null,
      balance_available: account.balance?.available?.usd ?? null,
      currency: "usd",
      status: "active",
      synced_at: new Date().toISOString(),
    }, { onConflict: "user_id,stripe_account_id" });
  };

  const loadAccountDetails = async (
    accountId: string,
    token: string,
    base?: { display_name?: string | null; institution_name: string; last4?: string | null; category: string }
  ) => {
    setLoadingAccount(accountId);
    try {
      const res = await fetch(`/api/stripe/fc-accounts?accountId=${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updated: ConnectedAccount = {
        id: accountId,
        display_name: data.account?.display_name ?? base?.display_name ?? null,
        institution_name: data.account?.institution_name ?? base?.institution_name ?? "Bank",
        last4: data.account?.last4 ?? base?.last4 ?? null,
        category: data.account?.category ?? base?.category ?? "checking",
        balance: data.balances ?? null,
        transactions: (data.transactions ?? []).map((t: FCTransaction) => ({
          id: t.id,
          description: t.description,
          amount: t.amount,
          currency: t.currency,
          transacted_at: t.transacted_at,
          status: t.status,
        })),
        showTransactions: false,
        savedToDb: false,
      };

      await saveToDb(updated);
      updated.savedToDb = true;

      setAccounts((prev) => {
        const exists = prev.find((a) => a.id === accountId);
        if (exists) return prev.map((a) => a.id === accountId ? { ...updated, showTransactions: exists.showTransactions } : a);
        return [...prev, updated];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load account");
    } finally {
      setLoadingAccount(null);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("/api/stripe/fc-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error("Stripe failed to load");

      const result = await stripe.collectFinancialConnectionsAccounts({ clientSecret: data.clientSecret });
      if (result.error) throw new Error(result.error.message);

      for (const acct of result.financialConnectionsSession?.accounts ?? []) {
        await loadAccountDetails(acct.id, session.access_token, acct);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const refreshAccount = async (accountId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await loadAccountDetails(accountId, session.access_token);
  };

  const toggleTxns = (id: string) =>
    setAccounts((prev) => prev.map((a) => a.id === id ? { ...a, showTransactions: !a.showTransactions } : a));

  const totalCash = accounts.reduce((s, a) => s + (a.balance?.current?.usd ?? 0), 0) / 100;
  const connected = accounts.length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#111111]">Accounts</h1>
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="h-9 px-4 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] text-sm font-semibold rounded-lg gap-2"
        >
          {connecting ? (
            <><RefreshCw className="h-4 w-4 animate-spin" />Connecting...</>
          ) : (
            <><Plus className="h-4 w-4" />{connected > 0 ? "Add account" : "Connect bank account"}</>
          )}
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1">Total Cash</p>
          <p className={cn("text-2xl font-bold", totalCash >= 0 ? "text-[#16A34A]" : "text-[#DC2626]")}>
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalCash)}
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1">Accounts Connected</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#111111]">{connected}</p>
            {connected > 0 && <Wifi className="h-4 w-4 text-[#16A34A]" />}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#E5E7EB] rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center mb-4">
            <Landmark className="h-7 w-7 text-[#FACC15]" />
          </div>
          <p className="text-[#374151] font-semibold text-sm mb-1">No bank accounts connected</p>
          <p className="text-[#9CA3AF] text-xs mb-5">Connect via Stripe Financial Connections — secure, read-only access.</p>
          <Button
            onClick={handleConnect}
            disabled={connecting}
            className="h-9 px-5 bg-[#111111] text-[#FACC15] font-semibold text-sm rounded-lg"
          >
            {connecting ? "Connecting..." : "Connect bank account"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const isLoading = loadingAccount === account.id;
            const current = account.balance?.current?.usd;
            const available = account.balance?.available?.usd;

            return (
              <div key={account.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111111] flex items-center gap-2 text-sm">
                        {account.display_name || account.institution_name}
                        {account.last4 && <span className="text-[#9CA3AF] font-normal">···{account.last4}</span>}
                        {account.savedToDb && <CheckCircle className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5 capitalize">{account.institution_name} · {account.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Current</p>
                      <p className="font-bold text-[#111111] text-sm">{isLoading ? "…" : fmtBalance(current)}</p>
                    </div>
                    {available != null && (
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Available</p>
                        <p className="font-semibold text-[#16A34A] text-sm">{isLoading ? "…" : fmtBalance(available)}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => refreshAccount(account.id)}
                        disabled={isLoading}
                        className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                        title="Refresh"
                      >
                        <RefreshCw className={cn("h-4 w-4 text-[#6B7280]", isLoading && "animate-spin")} />
                      </button>
                      <button
                        onClick={() => toggleTxns(account.id)}
                        className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                      >
                        {account.showTransactions
                          ? <ChevronUp className="h-4 w-4 text-[#6B7280]" />
                          : <ChevronDown className="h-4 w-4 text-[#6B7280]" />}
                      </button>
                    </div>
                  </div>
                </div>

                {account.showTransactions && (
                  <div className="border-t border-[#E5E7EB]">
                    <div className="px-4 py-2 bg-[#F9FAFB]">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Recent Transactions</p>
                    </div>
                    {account.transactions.length === 0 ? (
                      <div className="px-4 py-5 text-center text-sm text-[#9CA3AF]">
                        No transactions — click refresh to load.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F3F4F6]">
                        {account.transactions.map((tx) => {
                          const isCredit = tx.amount > 0;
                          return (
                            <div key={tx.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", isCredit ? "bg-[#DCFCE7]" : "bg-red-50")}>
                                  {isCredit
                                    ? <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
                                    : <TrendingDown className="h-3.5 w-3.5 text-[#DC2626]" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#111111] line-clamp-1">{tx.description}</p>
                                  <p className="text-xs text-[#9CA3AF]">{format(new Date(tx.transacted_at * 1000), "MMM d, yyyy")}</p>
                                </div>
                              </div>
                              <p className={cn("text-sm font-semibold", isCredit ? "text-[#16A34A]" : "text-[#DC2626]")}>
                                {isCredit ? "+" : "-"}{fmtTxAmt(tx.amount, tx.currency)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
