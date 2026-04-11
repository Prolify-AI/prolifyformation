"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Check, Clock, TriangleAlert as AlertTriangle, Trash2, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, isPast, isToday, differenceInDays } from "date-fns";

type ComplianceDate = {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  category: string;
  status: string;
  recurring: boolean;
  completed_at: string | null;
  created_at: string;
};

export default function ComplianceDatesSection() {
  const { company, user } = useAuth();
  const [dates, setDates] = useState<ComplianceDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    category: "filing",
    recurring: false,
  });

  useEffect(() => {
    loadComplianceDates();
  }, [company]);

  const loadComplianceDates = async () => {
    if (!company) return;
    try {
      const { data, error } = await supabase
        .from("compliance_dates")
        .select("*")
        .eq("company_id", company.id)
        .order("due_date", { ascending: true });
      if (error) throw error;
      setDates(data || []);
    } catch (error) {
      console.error("Error loading compliance dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    try {
      const dueDate = new Date(formData.due_date);
      const status = isPast(dueDate) ? "overdue" : "upcoming";
      const { error } = await supabase.from("compliance_dates").insert({
        company_id: company.id,
        title: formData.title,
        description: formData.description || null,
        due_date: formData.due_date,
        category: formData.category,
        status,
        recurring: formData.recurring,
      });
      if (error) throw error;
      setFormData({ title: "", description: "", due_date: "", category: "filing", recurring: false });
      setShowAddForm(false);
      loadComplianceDates();
    } catch (error) {
      console.error("Error adding compliance date:", error);
    }
  };

  const handleComplete = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("compliance_dates")
        .update({ status: "completed", completed_at: new Date().toISOString(), completed_by: user.id })
        .eq("id", id);
      if (error) throw error;
      loadComplianceDates();
    } catch (error) {
      console.error("Error completing compliance date:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this compliance date?")) return;
    try {
      const { error } = await supabase.from("compliance_dates").delete().eq("id", id);
      if (error) throw error;
      loadComplianceDates();
    } catch (error) {
      console.error("Error deleting compliance date:", error);
    }
  };

  const getStatusConfig = (date: ComplianceDate) => {
    if (date.status === "completed") {
      return {
        label: "Completed",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
        badgeClass: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        icon: Check,
      };
    }
    const dueDate = new Date(date.due_date);
    const daysUntil = differenceInDays(dueDate, new Date());
    if (isPast(dueDate) && !isToday(dueDate)) {
      return {
        label: "Overdue",
        dotColor: "bg-red-500",
        textColor: "text-red-600 dark:text-red-400",
        badgeClass: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        icon: AlertTriangle,
      };
    }
    if (daysUntil <= 7) {
      return {
        label: "Due Soon",
        dotColor: "bg-[#FFC107]",
        textColor: "text-amber-600 dark:text-[#FFC107]",
        badgeClass: "bg-[#FFC107]/10 text-amber-700 dark:text-[#FFC107] border-[#FFC107]/30",
        icon: Clock,
      };
    }
    return {
      label: "Upcoming",
      dotColor: "bg-black/30 dark:bg-white/30",
      textColor: "text-black/50 dark:text-white/50",
      badgeClass: "bg-black/5 dark:bg-white/8 text-black/50 dark:text-white/50 border-black/10 dark:border-white/10",
      icon: Clock,
    };
  };

  const upcomingCount = dates.filter(d => d.status !== "completed" && !isPast(new Date(d.due_date))).length;
  const overdueCount = dates.filter(d => d.status !== "completed" && isPast(new Date(d.due_date)) && !isToday(new Date(d.due_date))).length;
  const completedCount = dates.filter(d => d.status === "completed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#FFC107] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#FFC107]" />
            Compliance Dates
          </h2>
          <p className="text-sm text-black/40 dark:text-white/40 mt-0.5">Track deadlines and stay compliant</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold text-sm shadow-none h-9 px-4"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Deadline
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Upcoming", value: upcomingCount, dotColor: "bg-black/20 dark:bg-white/20" },
          { label: "Overdue", value: overdueCount, dotColor: "bg-red-500" },
          { label: "Completed", value: completedCount, dotColor: "bg-emerald-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-4">
            <p className="text-2xl font-bold text-black dark:text-white">{stat.value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`h-1.5 w-1.5 rounded-full ${stat.dotColor}`} />
              <p className="text-xs text-black/40 dark:text-white/40 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-bold text-black dark:text-white mb-4">New Compliance Deadline</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Annual Report Filing"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Due Date</label>
                <Input
                  required
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 bg-black/3 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50"
                >
                  <option value="tax">Tax</option>
                  <option value="filing">Filing</option>
                  <option value="license">License</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wide mb-1.5">Description (optional)</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details"
                  className="h-10 bg-black/3 dark:bg-white/5 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.recurring}
                      onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${formData.recurring ? "bg-[#FFC107]" : "bg-black/10 dark:bg-white/10"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.recurring ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className={`h-3.5 w-3.5 ${formData.recurring ? "text-[#FFC107]" : "text-black/30 dark:text-white/30"}`} />
                    <span className="text-sm font-medium text-black/60 dark:text-white/60">Recurring annually</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold shadow-none h-9">
                Add Deadline
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="h-9 border-black/10 dark:border-white/10 text-black/60 dark:text-white/60">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {dates.length === 0 ? (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#FFC107]/10 flex items-center justify-center">
            <Calendar className="h-7 w-7 text-[#FFC107]" />
          </div>
          <h3 className="text-base font-bold text-black dark:text-white mb-1">No deadlines yet</h3>
          <p className="text-sm text-black/40 dark:text-white/40 mb-5">Add important compliance dates to stay on track</p>
          <Button onClick={() => setShowAddForm(true)} className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold shadow-none h-9">
            Add First Deadline
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111] border border-black/8 dark:border-white/8 rounded-xl overflow-hidden">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {dates.map((date) => {
              const cfg = getStatusConfig(date);
              const StatusIcon = cfg.icon;
              const dueDate = new Date(date.due_date);
              const daysUntil = differenceInDays(dueDate, new Date());

              return (
                <div key={date.id} className="flex items-center gap-4 px-5 py-4 hover:bg-black/2 dark:hover:bg-white/2 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-black/4 dark:bg-white/6 flex items-center justify-center">
                    <StatusIcon className={`h-4.5 w-4.5 ${cfg.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-black dark:text-white">{date.title}</p>
                      {date.recurring && <RefreshCw className="h-3 w-3 text-black/25 dark:text-white/25" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(dueDate, "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-black/30 dark:text-white/30 capitalize">{date.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badgeClass}`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
                      {cfg.label}
                    </span>
                    {date.status !== "completed" && (
                      <button
                        onClick={() => handleComplete(date.id)}
                        className="h-8 w-8 rounded-lg bg-black/4 dark:bg-white/6 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-center transition-colors"
                        title="Mark complete"
                      >
                        <Check className="h-3.5 w-3.5 text-black/30 dark:text-white/30 hover:text-emerald-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(date.id)}
                      className="h-8 w-8 rounded-lg bg-black/4 dark:bg-white/6 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-black/30 dark:text-white/30 hover:text-red-500" />
                    </button>
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
