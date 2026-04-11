"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Building2, RefreshCw, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Landmark, CircleCheck as CheckCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

export default function ConnectBankAccount() {
  const { user, company } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadSavedConnections();
  }, [user]);

  const loadSavedConnections = async () => {
    if (!user) return;
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
  };

  const saveConnectionToDb = async (account: ConnectedAccount) => {
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

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("/api/stripe/fc-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create session");

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error("Stripe failed to load");

      const result = await stripe.collectFinancialConnectionsAccounts({
        clientSecret: data.clientSecret,
      });

      if (result.error) throw new Error(result.error.message);

      const connectedAccounts = result.financialConnectionsSession?.accounts ?? [];

      for (const acct of connectedAccounts) {
        await loadAccountDetails(acct.id, session.access_token, acct);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const loadAccountDetails = async (
    accountId: string,
    token: string,
    baseAccount?: { display_name?: string | null; institution_name: string; last4?: string | null; category: string }
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
        display_name: data.account?.display_name ?? baseAccount?.display_name ?? null,
        institution_name: data.account?.institution_name ?? baseAccount?.institution_name ?? "Bank",
        last4: data.account?.last4 ?? baseAccount?.last4 ?? null,
        category: data.account?.category ?? baseAccount?.category ?? "checking",
        balance: data.balances ?? null,
        transactions: (data.transactions ?? []).map((t: {
          id: string;
          description: string;
          amount: number;
          currency: string;
          transacted_at: number;
          status: string;
        }) => ({
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

      await saveConnectionToDb(updated);
      updated.savedToDb = true;

      setAccounts((prev) => {
        const exists = prev.find((a) => a.id === accountId);
        if (exists) return prev.map((a) => (a.id === accountId ? { ...updated, showTransactions: exists.showTransactions } : a));
        return [...prev, updated];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load account");
    } finally {
      setLoadingAccount(null);
    }
  };

  const refreshAccount = async (accountId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await loadAccountDetails(accountId, session.access_token);
  };

  const toggleTransactions = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId ? { ...a, showTransactions: !a.showTransactions } : a
      )
    );
  };

  const formatBalance = (cents?: number | null) => {
    if (cents == null) return "—";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  };

  const formatTxAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(Math.abs(amount) / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Landmark className="h-6 w-6 text-black dark:text-white" />
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Connected Bank Accounts</h3>
            {accounts.length > 0 && (
              <p className="text-xs text-black/50 dark:text-white/50 flex items-center gap-1">
                <Wifi className="h-3 w-3 text-green-500" />
                {accounts.length} account{accounts.length !== 1 ? "s" : ""} synced
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-black dark:bg-white text-white dark:text-black"
        >
          {connecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4 mr-2" />
              {accounts.length > 0 ? "Add Account" : "Connect Bank Account"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {accounts.length === 0 && !error && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <Landmark className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            No bank accounts connected yet
          </p>
          <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
            Connect your bank to automatically sync orders, inventory and financials
          </p>
        </div>
      )}

      {accounts.map((account) => {
        const currentBalance = account.balance?.current?.usd;
        const availableBalance = account.balance?.available?.usd;
        const isLoading = loadingAccount === account.id;

        return (
          <div
            key={account.id}
            className="border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white flex items-center gap-2">
                    {account.display_name || account.institution_name}
                    {account.last4 && (
                      <span className="text-gray-400 dark:text-gray-500 text-sm font-normal">
                        ••••{account.last4}
                      </span>
                    )}
                    {account.savedToDb && (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                    {account.institution_name} · {account.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                  <p className="font-bold text-black dark:text-white">
                    {isLoading ? "..." : formatBalance(currentBalance)}
                  </p>
                </div>
                {availableBalance != null && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {isLoading ? "..." : formatBalance(availableBalance)}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refreshAccount(account.id)}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw
                      className={`h-4 w-4 text-gray-500 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => toggleTransactions(account.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title={account.showTransactions ? "Hide transactions" : "Show transactions"}
                  >
                    {account.showTransactions ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {account.showTransactions && (
              <div className="border-t-2 border-gray-200 dark:border-gray-800">
                <div className="px-5 py-3 bg-gray-50 dark:bg-[#141414]">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Transactions
                  </p>
                </div>
                {account.transactions.length === 0 ? (
                  <div className="px-5 py-6 text-center text-sm text-gray-400 dark:text-gray-600">
                    No transactions available — click refresh to load
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {account.transactions.map((tx) => {
                      const isCredit = tx.amount > 0;
                      return (
                        <div
                          key={tx.id}
                          className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCredit
                                  ? "bg-green-100 dark:bg-green-900/20"
                                  : "bg-red-100 dark:bg-red-900/20"
                              }`}
                            >
                              {isCredit ? (
                                <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black dark:text-white line-clamp-1">
                                {tx.description}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {format(new Date(tx.transacted_at * 1000), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <p
                            className={`text-sm font-semibold ${
                              isCredit
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {isCredit ? "+" : "-"}
                            {formatTxAmount(tx.amount, tx.currency)}
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
  );
}
