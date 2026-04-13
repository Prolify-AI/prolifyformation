"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleCheck as CheckCircle, Loader as Loader2, Circle as XCircle, ArrowRight, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";

type Status = "loading" | "creating" | "success" | "already_exists" | "error" | "expired" | "awaiting_payment";

function CompleteRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trackSignup, trackOrderCompleted } = useAnalytics();
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [planId, setPlanId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const registrationId = searchParams.get("registration_id");
    const cancelled = searchParams.get("cancelled");

    if (cancelled === "true") {
      router.replace("/signup");
      return;
    }

    if (!registrationId) {
      router.replace("/signup");
      return;
    }

    processRegistration(registrationId);
  }, [searchParams]);

  const processRegistration = async (registrationId: string) => {
    setStatus("loading");

    try {
      const checkRes = await fetch(`/api/registration/finalize?registration_id=${registrationId}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        if (checkRes.status === 410) {
          setStatus("expired");
          return;
        }
        setStatus("error");
        setErrorMessage(checkData.error || "Registration not found");
        return;
      }

      setEmail(checkData.email ?? "");
      setPlanId(checkData.plan_id ?? "");

      if (checkData.status === "account_created") {
        setStatus("already_exists");
        return;
      }

      if (checkData.status === "pending_payment") {
        setStatus("awaiting_payment");
        return;
      }

      setStatus("creating");
      const finalizeRes = await fetch("/api/registration/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: registrationId }),
      });

      const finalizeData = await finalizeRes.json();

      if (!finalizeRes.ok) {
        if (finalizeRes.status === 402) {
          setStatus("awaiting_payment");
          return;
        }
        if (finalizeRes.status === 410) {
          setStatus("expired");
          return;
        }
        setStatus("error");
        setErrorMessage(finalizeData.error || "Failed to create account");
        return;
      }

      setStatus("success");
      trackSignup({ email: checkData.email ?? "", plan: checkData.plan_id ?? "" });
      trackOrderCompleted({
        order_id: registrationId,
        revenue: 0,
        llc_state: checkData.plan_id ?? "unknown",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      setSigningIn(false);
    } else {
      router.push("/dashboard");
    }
  };

  const planLabel = planId
    ? planId.replace("formation-", "").replace("management-", "").replace(/^\w/, (c) => c.toUpperCase())
    : "your plan";

  if (status === "loading" || status === "creating") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-[#FFC107] animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">
            {status === "loading" ? "Verifying payment..." : "Creating your account..."}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {status === "loading"
              ? "We're confirming your payment with Stripe."
              : "Setting up your Prolify workspace. This takes just a moment."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Account created!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Welcome to Prolify. Your <strong className="text-black dark:text-white">{planLabel}</strong> plan is active.
          </p>
          {email && (
            <p className="text-sm text-gray-400 dark:text-gray-600 mb-8">
              Signed up as <span className="font-medium">{email}</span>
            </p>
          )}

          <form onSubmit={handleSignIn} className="space-y-3 mb-6">
            <div>
              <input
                type="password"
                placeholder="Enter your password to sign in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-[#FFC107] outline-none text-sm"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={signingIn || !password}
              className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000] text-black font-black py-5 rounded-xl"
            >
              {signingIn ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                <>Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span>Check your email for a confirmation link as well.</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "already_exists") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-[#FFC107]" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">You're all set!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your account is ready. Sign in to access your dashboard.
          </p>
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white focus:border-[#FFC107] outline-none text-sm"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <Button
              type="submit"
              disabled={signingIn}
              className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000] text-black font-black py-5 rounded-xl"
            >
              {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "awaiting_payment") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Payment pending</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We haven't received payment confirmation yet. This can take a moment.
          </p>
          <Button
            onClick={() => {
              const id = searchParams.get("registration_id");
              if (id) processRegistration(id);
            }}
            className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl"
          >
            Check again
          </Button>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Session expired</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your registration session has expired. Please start again — it only takes a minute.
          </p>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-black px-6 py-3 rounded-xl"
          >
            Start over <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-black dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{errorMessage || "An unexpected error occurred."}</p>
        <p className="text-sm text-gray-400 dark:text-gray-600 mb-6">
          If you completed payment, please contact{" "}
          <a href="mailto:support@prolify.com" className="text-[#FFC107] hover:underline">
            support@prolify.com
          </a>{" "}
          and we'll sort it out immediately.
        </p>
        <Button
          onClick={() => router.push("/signup")}
          className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense>
      <CompleteRegistrationContent />
    </Suspense>
  );
}
