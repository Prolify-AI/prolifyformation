"use client";

import { useState, useEffect } from "react";
import { Check, CircleAlert as AlertCircle, ExternalLink, Save, RefreshCw, Key } from "lucide-react";

interface PriceEntry {
  plan_key: string;
  plan_name: string;
  price_id: string;
  mode: string;
}

const ADMIN_KEY = "prolify-admin-2026";

const GROUP_LABELS: Record<string, string> = {
  formation: "Formation Packages (one-time payment)",
  management: "Management Plans (subscription)",
};

export default function StripeConfigPage() {
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stripe-config");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setEntries(json.data || []);
      const initial: Record<string, string> = {};
      for (const e of json.data || []) {
        initial[e.plan_key] = e.price_id;
      }
      setEdits(initial);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const updates = Object.entries(edits).map(([plan_key, price_id]) => ({ plan_key, price_id }));
      const res = await fetch("/api/admin/stripe-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ updates }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Save failed");
      setSavedKeys(new Set(Object.keys(edits)));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchConfig();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const isValid = (priceId: string) => priceId.startsWith("price_1");

  const grouped = entries.reduce<Record<string, PriceEntry[]>>((acc, e) => {
    const group = e.plan_key.startsWith("formation") ? "formation" : "management";
    if (!acc[group]) acc[group] = [];
    acc[group].push(e);
    return acc;
  }, {});

  const allConfigured = entries.length > 0 && entries.every((e) => isValid(edits[e.plan_key] ?? ""));
  const managementConfigured = (grouped.management || []).every((e) => isValid(edits[e.plan_key] ?? ""));

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFC107] flex items-center justify-center">
              <Key className="h-5 w-5 text-black" />
            </div>
            <h1 className="text-2xl font-black text-black">Stripe Price ID Configuration</h1>
          </div>
          <p className="text-black/60 text-sm ml-13">
            Paste the Price IDs from your Stripe Dashboard. Find them at{" "}
            <a
              href="https://dashboard.stripe.com/products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFC107] font-semibold hover:underline inline-flex items-center gap-1"
            >
              dashboard.stripe.com/products <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        {!managementConfigured && !loading && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Management plans not yet configured</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Fill in the Stripe Price IDs below to enable plan upgrades in the dashboard.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-semibold">All Price IDs saved successfully.</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {(["formation", "management"] as const).map((group) => (
              <div key={group} className="bg-white rounded-2xl border-2 border-black/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-black/10 bg-black/[0.02]">
                  <h2 className="font-bold text-black text-sm uppercase tracking-wide">
                    {GROUP_LABELS[group]}
                  </h2>
                </div>
                <div className="divide-y divide-black/5">
                  {(grouped[group] || []).map((entry) => {
                    const val = edits[entry.plan_key] ?? "";
                    const valid = isValid(val);
                    const changed = val !== entry.price_id;
                    return (
                      <div key={entry.plan_key} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black">{entry.plan_name}</p>
                          <p className="text-xs text-black/40 font-mono mt-0.5">{entry.plan_key}</p>
                        </div>
                        <div className="relative flex-1 max-w-xs">
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              setEdits((prev) => ({ ...prev, [entry.plan_key]: e.target.value }))
                            }
                            placeholder="price_1..."
                            className={`w-full text-sm font-mono px-3 py-2 rounded-lg border-2 outline-none transition-colors ${
                              val === ""
                                ? "border-amber-300 bg-amber-50 placeholder-amber-400"
                                : valid
                                ? "border-green-300 bg-green-50"
                                : "border-red-300 bg-red-50"
                            } focus:border-[#FFC107]`}
                          />
                          {valid && (
                            <Check className="absolute right-2.5 top-2.5 h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="w-20 text-right">
                          {changed && !valid && val !== "" && (
                            <span className="text-xs text-red-500 font-medium">Invalid ID</span>
                          )}
                          {valid && changed && (
                            <span className="text-xs text-amber-600 font-medium">Unsaved</span>
                          )}
                          {valid && !changed && (
                            <span className="text-xs text-green-600 font-medium">Saved</span>
                          )}
                          {val === "" && (
                            <span className="text-xs text-amber-500 font-medium">Missing</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={fetchConfig}
                className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Reload from database
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] text-black font-black px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save All Price IDs</>
                )}
              </button>
            </div>

            <div className="bg-black/[0.03] border border-black/10 rounded-xl px-5 py-4 text-xs text-black/50 space-y-1">
              <p className="font-semibold text-black/70">How to find your Price IDs in Stripe:</p>
              <p>1. Go to <strong>dashboard.stripe.com/products</strong></p>
              <p>2. Click on a product (e.g. "Management Growth Monthly")</p>
              <p>3. Under <strong>Pricing</strong>, copy the Price ID — it starts with <code className="bg-black/10 px-1 rounded">price_1</code></p>
              <p>4. Paste it in the field above and click Save</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
