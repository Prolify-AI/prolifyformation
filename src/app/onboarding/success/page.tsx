"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircleCheck as CheckCircle, Loader as Loader2, Circle as XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "loading" | "finalizing" | "success" | "error" | "awaiting_payment" | "expired";

function OnboardingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const formationPaymentId = searchParams.get("formation_payment_id");
    const cancelled = searchParams.get("cancelled");

    if (cancelled === "true") {
      router.replace("/onboarding");
      return;
    }

    if (!formationPaymentId) {
      router.replace("/onboarding");
      return;
    }

    processFormationPayment(formationPaymentId);
  }, [searchParams]);

  const processFormationPayment = async (formationPaymentId: string) => {
    setStatus("loading");

    try {
      const checkRes = await fetch(`/api/formation/finalize?formation_payment_id=${formationPaymentId}`);
      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        if (checkRes.status === 410) {
          setStatus("expired");
          return;
        }
        setStatus("error");
        setErrorMessage(checkData.error || "Payment record not found");
        return;
      }

      if (checkData.status === "formation_started") {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2000);
        return;
      }

      if (checkData.status === "pending_payment") {
        setStatus("awaiting_payment");
        return;
      }

      setStatus("finalizing");

      const finalizeRes = await fetch("/api/formation/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formation_payment_id: formationPaymentId }),
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
        setErrorMessage(finalizeData.error || "Failed to complete formation");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong");
    }
  };

  if (status === "loading" || status === "finalizing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-[#FFC107] animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">
            {status === "loading" ? "Verifying payment..." : "Setting up your formation..."}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {status === "loading"
              ? "We're confirming your payment with Stripe."
              : "Your payment is confirmed. Saving your formation details."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Payment confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your formation order is saved. Redirecting to your dashboard...
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-black px-6 py-3 rounded-xl"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
              const id = searchParams.get("formation_payment_id");
              if (id) processFormationPayment(id);
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
            Your payment session has expired. Please go back to complete payment.
          </p>
          <Button
            onClick={() => router.push("/onboarding")}
            className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-black px-6 py-3 rounded-xl"
          >
            Back to onboarding <ArrowRight className="ml-2 h-4 w-4" />
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
          <a href="mailto:support@prolify.co" className="text-[#FFC107] hover:underline">
            support@prolify.co
          </a>{" "}
          and we'll sort it out immediately.
        </p>
        <Button
          onClick={() => router.push("/onboarding")}
          className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-xl"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense>
      <OnboardingSuccessContent />
    </Suspense>
  );
}
