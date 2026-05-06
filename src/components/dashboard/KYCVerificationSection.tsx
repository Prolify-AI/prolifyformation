"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, CircleCheck as CheckCircle, Clock, Circle as XCircle, CircleAlert as AlertCircle, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

type KYCStatus = "none" | "pending" | "approved" | "declined" | "in_review" | "expired" | "loading";

interface KYCSession {
  session_id: string;
  session_url: string | null;
  status: string;
  decision?: Record<string, unknown>;
  created_at?: string;
}

export default function KYCVerificationSection() {
  const { user } = useAuth();
  const [status, setStatus] = useState<KYCStatus>("loading");
  const [session, setSession] = useState<KYCSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("kyc_verifications")
      .select("session_id, session_url, status, decision, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setSession(data);
      setStatus(data.status as KYCStatus);
    } else {
      setStatus("none");
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleStartVerification = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const token = authSession?.access_token;
      if (!token) throw new Error("Not authenticated — no access token");

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");

      const endpoint = `${supabaseUrl}/functions/v1/didit-create-session`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const rawText = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`HTTP ${res.status} — invalid JSON response: ${rawText.slice(0, 300)}`);
      }

      if (!res.ok) {
        const detail = data.details ? ` | details: ${data.details}` : "";
        throw new Error(`HTTP ${res.status}: ${data.error || "Unknown error"}${detail} | raw: ${rawText.slice(0, 300)}`);
      }

      const session = data.session as { session_url?: string } | undefined;
      if (session?.session_url) {
        setSession(data.session as KYCSession);
        setStatus("pending");
        window.open(session.session_url, "_blank", "noopener,noreferrer");
      } else if (data.status === "approved") {
        setStatus("approved");
        await fetchStatus();
      } else {
        throw new Error(`Unexpected response: ${rawText.slice(0, 300)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const statusConfig = {
    none: {
      icon: Shield,
      iconClass: "text-gray-400",
      bgClass: "bg-gray-50 border-gray-200",
      badgeClass: "bg-gray-100 text-gray-600",
      badgeLabel: "Not Started",
      title: "Verify Your Identity",
      description: "Complete identity verification to unlock full access to all Prolify features, including business formation and financial services.",
    },
    pending: {
      icon: Clock,
      iconClass: "text-yellow-500",
      bgClass: "bg-yellow-50 border-yellow-200",
      badgeClass: "bg-yellow-100 text-yellow-800",
      badgeLabel: "In Progress",
      title: "Verification In Progress",
      description: "Your identity verification is underway. If you haven't completed the steps yet, click the button below to continue.",
    },
    in_review: {
      icon: AlertCircle,
      iconClass: "text-yellow-600",
      bgClass: "bg-yellow-50 border-yellow-300",
      badgeClass: "bg-yellow-100 text-yellow-800",
      badgeLabel: "Under Review",
      title: "Under Manual Review",
      description: "Our team is reviewing your verification submission. You'll be notified once the review is complete.",
    },
    approved: {
      icon: CheckCircle,
      iconClass: "text-yellow-500",
      bgClass: "bg-yellow-50 border-yellow-200",
      badgeClass: "bg-yellow-100 text-yellow-800",
      badgeLabel: "Verified",
      title: "Identity Verified",
      description: "Your identity has been successfully verified. You have full access to all Prolify services.",
    },
    declined: {
      icon: XCircle,
      iconClass: "text-red-500",
      bgClass: "bg-red-50 border-red-200",
      badgeClass: "bg-red-100 text-red-700",
      badgeLabel: "Declined",
      title: "Verification Declined",
      description: "Your verification was not successful. You can try again with updated documents or contact support for assistance.",
    },
    expired: {
      icon: AlertCircle,
      iconClass: "text-orange-500",
      bgClass: "bg-orange-50 border-orange-200",
      badgeClass: "bg-orange-100 text-orange-700",
      badgeLabel: "Expired",
      title: "Session Expired",
      description: "Your verification session has expired. Please start a new verification to complete the process.",
    },
    loading: {
      icon: Shield,
      iconClass: "text-gray-300",
      bgClass: "bg-gray-50 border-gray-200",
      badgeClass: "bg-gray-100 text-gray-400",
      badgeLabel: "Loading...",
      title: "Loading...",
      description: "",
    },
  };

  const config = statusConfig[status] ?? statusConfig.none;
  const StatusIcon = config.icon;

  const canRetry = status === "declined" || status === "expired" || status === "none";
  const canContinue = status === "pending" && session?.session_url;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Didit</p>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 ${config.bgClass}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <StatusIcon className={`w-8 h-8 ${config.iconClass}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{config.title}</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                {config.badgeLabel}
              </span>
            </div>
            {status !== "loading" && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{config.description}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {status !== "loading" && status !== "approved" && (
          <div className="mt-5 flex flex-wrap gap-3">
            {canContinue && (
              <Button
                onClick={() => window.open(session!.session_url!, "_blank", "noopener,noreferrer")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Continue Verification
              </Button>
            )}
            {canRetry && (
              <Button
                onClick={handleStartVerification}
                disabled={isCreating}
                className="bg-black hover:bg-gray-800 text-white font-semibold rounded-xl"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    {status === "none" ? "Start Verification" : "Try Again"}
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={fetchStatus}
              className="rounded-xl border-gray-300 text-gray-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: "Document Verification", desc: "Government-issued ID accepted from 220+ countries" },
          { icon: ShieldCheck, label: "Liveness Detection", desc: "Biometric check to confirm you're a real person" },
          { icon: CheckCircle, label: "AML Screening", desc: "Compliance screening against global watchlists" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Identity verification is powered by{" "}
        <a href="https://didit.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
          Didit
        </a>
        . Your data is encrypted and handled in compliance with GDPR and applicable privacy laws.
      </p>
    </div>
  );
}
