"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CompanySettings {
  company_name: string;
  ein_masked: string;
  fiscal_year_end: string;
  accounting_method: "cash" | "accrual";
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function BkSettingsSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: "",
    ein_masked: "",
    fiscal_year_end: "December",
    accounting_method: "cash",
  });

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("bk_company_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setSettings({
        company_name: data.company_name || "",
        ein_masked: data.ein_masked || "",
        fiscal_year_end: data.fiscal_year_end || "December",
        accounting_method: data.accounting_method || "cash",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("bk_company_settings").upsert({
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-[#111111]">Bookkeeping Settings</h1>

      {/* Company Info Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-[#111111] text-sm">Company Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Company Name</label>
            <Input
              value={settings.company_name}
              onChange={(e) => setSettings(s => ({ ...s, company_name: e.target.value }))}
              className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]"
              placeholder="Your LLC Name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">EIN (masked)</label>
            <Input
              value={settings.ein_masked}
              onChange={(e) => setSettings(s => ({ ...s, ein_masked: e.target.value }))}
              className="h-9 text-sm border-[#E5E7EB] focus:border-[#FACC15]"
              placeholder="XX-XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Fiscal Year End</label>
            <Select
              value={settings.fiscal_year_end}
              onValueChange={(v) => setSettings(s => ({ ...s, fiscal_year_end: v }))}
            >
              <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
              <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Accounting Method</label>
            <Select
              value={settings.accounting_method}
              onValueChange={(v: "cash" | "accrual") => setSettings(s => ({ ...s, accounting_method: v }))}
            >
              <SelectTrigger className="h-9 text-sm border-[#E5E7EB]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash Basis</SelectItem>
                <SelectItem value="accrual">Accrual Basis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-5 bg-[#111111] hover:bg-[#111111]/90 text-[#FACC15] font-semibold text-sm rounded-lg"
          >
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Connected Accounts Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#111111] text-sm">Connected Accounts</h2>
          <Button variant="outline" className="h-8 px-3 text-xs border-[#E5E7EB] font-semibold">
            + Add account
          </Button>
        </div>
        <div className="border border-dashed border-[#E5E7EB] rounded-lg p-6 text-center">
          <p className="text-sm text-[#6B7280]">No accounts connected yet.</p>
          <p className="text-xs text-[#9CA3AF] mt-1">Connect via the Cash → Accounts section.</p>
        </div>
      </div>

      {/* Integrations Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#111111] text-sm">Integrations</h2>
          <Button variant="outline" className="h-8 px-3 text-xs border-[#E5E7EB] font-semibold">
            + Add integration
          </Button>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
              <span className="text-xs font-bold text-[#635BFF]">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">Stripe</p>
              <p className="text-xs text-[#9CA3AF]">Payment processing</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#374151]">Not connected</span>
        </div>
      </div>
    </div>
  );
}
