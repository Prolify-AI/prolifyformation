"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, Phone, Briefcase, Percent, Check, X, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type CoFounder = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  ownership_percentage: number;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
};

type CoFoundersSectionProps = {
  onNavigateToVIPClub?: () => void;
};

export default function CoFoundersSection({ onNavigateToVIPClub }: CoFoundersSectionProps) {
  const { company } = useAuth();
  const [coFounders, setCoFounders] = useState<CoFounder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    ownership_percentage: "",
    role: "",
  });

  useEffect(() => {
    loadCoFounders();
  }, [company]);

  const loadCoFounders = async () => {
    if (!company) return;
    try {
      const { data, error } = await supabase
        .from("co_founders")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCoFounders(data || []);
    } catch (error) {
      console.error("Error loading co-founders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    try {
      const { error } = await supabase.from("co_founders").insert({
        company_id: company.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        ownership_percentage: parseFloat(formData.ownership_percentage) || 0,
        role: formData.role,
        status: "pending",
      });
      if (error) throw error;
      setFormData({ full_name: "", email: "", phone: "", ownership_percentage: "", role: "" });
      setShowAddForm(false);
      loadCoFounders();
    } catch (error) {
      console.error("Error adding co-founder:", error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; badgeClass: string; dotColor: string }> = {
      pending: {
        icon: Clock,
        label: "Pending",
        badgeClass: "bg-[#FFC107]/10 text-amber-700 dark:text-[#FFC107] border-[#FFC107]/30",
        dotColor: "bg-[#FFC107]",
      },
      active: {
        icon: Check,
        label: "Active",
        badgeClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        dotColor: "bg-emerald-500",
      },
      inactive: {
        icon: X,
        label: "Inactive",
        badgeClass: "bg-black/5 dark:bg-white/8 text-black/40 dark:text-white/40 border-black/10 dark:border-white/10",
        dotColor: "bg-black/20 dark:bg-white/20",
      },
    };
    return configs[status] || configs.pending;
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#FFC107] animate-spin" />
      </div>
    );
  }

  const totalOwnership = coFounders.reduce((sum, f) => sum + f.ownership_percentage, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FFC107]" />
            Co-Founders
          </h2>
          <p className="text-sm text-black/40 dark:text-white/40 mt-0.5">Manage ownership and team structure</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToVIPClub?.()}
            className="h-9 px-3 rounded-lg border border-black/10 dark:border-white/10 text-xs font-semibold text-black/60 dark:text-white/60 hover:border-[#FFC107]/50 hover:text-black dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FFC107]" />
            Find a Co-Founder
          </button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold text-sm shadow-none h-9 px-4"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>

      {coFounders.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-4">
            <p className="text-2xl font-bold text-black dark:text-white">{coFounders.length}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
              <p className="text-xs text-black/40 dark:text-white/40 font-medium">Co-founders</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-4">
            <p className="text-2xl font-bold text-black dark:text-white">{totalOwnership.toFixed(0)}%</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-black/20 dark:bg-white/20" />
              <p className="text-xs text-black/40 dark:text-white/40 font-medium">Total allocated</p>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-bold text-black dark:text-white mb-4">Add Co-Founder</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Full Name</label>
                <Input
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Jane Doe"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Ownership %</label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.ownership_percentage}
                  onChange={(e) => setFormData({ ...formData, ownership_percentage: e.target.value })}
                  placeholder="25.00"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Role / Title</label>
                <Input
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="CTO, CMO, COO..."
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold shadow-none h-9">
                Add Co-Founder
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="h-9 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {coFounders.length === 0 ? (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#FFC107]/10 flex items-center justify-center">
            <UserPlus className="h-7 w-7 text-[#FFC107]" />
          </div>
          <h3 className="text-base font-bold text-black dark:text-white mb-1">No co-founders yet</h3>
          <p className="text-sm text-black/40 dark:text-white/40 mb-5">Add co-founders to manage your ownership structure</p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={() => setShowAddForm(true)} className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold shadow-none h-9">
              Add Co-Founder
            </Button>
            <button
              onClick={() => onNavigateToVIPClub?.()}
              className="h-9 px-4 rounded-lg border border-black/10 dark:border-white/10 text-sm font-semibold text-black/60 dark:text-white/60 hover:border-[#FFC107]/50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFC107]" />
              Find one
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl overflow-hidden">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {coFounders.map((founder) => {
              const cfg = getStatusConfig(founder.status);

              return (
                <div key={founder.id} className="flex items-center gap-4 px-5 py-4 hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-white dark:text-black">
                      {getInitials(founder.full_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-black dark:text-white">{founder.full_name}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {founder.role}
                      </span>
                      <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {founder.email}
                      </span>
                      {founder.phone && (
                        <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {founder.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-black dark:text-white">{founder.ownership_percentage}%</p>
                      <p className="text-xs text-black/30 dark:text-white/30">ownership</p>
                    </div>
                    <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badgeClass}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {coFounders.length > 0 && (
            <div className="px-5 py-3 border-t border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/40 dark:text-white/40">Ownership breakdown</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 h-2 w-32 rounded-full overflow-hidden bg-black/8 dark:bg-white/8">
                    {coFounders.map((f, i) => {
                      const colors = ["bg-[#FFC107]", "bg-black dark:bg-white", "bg-black/40 dark:bg-white/40", "bg-black/20 dark:bg-white/20"];
                      return (
                        <div
                          key={f.id}
                          className={`h-full ${colors[i % colors.length]}`}
                          style={{ width: `${Math.min(f.ownership_percentage, 100)}%` }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60">
                    {totalOwnership.toFixed(0)}% allocated
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
