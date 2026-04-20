"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const redirectToDashboard = () => {
      window.history.replaceState(null, "", "/dashboard");
      router.replace("/dashboard");
    };

    const redirectToLogin = () => {
      window.history.replaceState(null, "", "/login");
      router.replace("/login");
    };

    const waitForSession = async (timeoutMs: number) => {
      const start = Date.now();

      while (Date.now() - start < timeoutMs) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) return true;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      return false;
    };

    const handleCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session) {
        redirectToDashboard();
        return;
      }

      if (error) {
        redirectToLogin();
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
        if (!isMounted) return;

        // Ignore transient null sessions during callback initialization.
        if (!currentSession) {
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
          subscription.unsubscribe();
          redirectToDashboard();
        }
      });

      const hasSession = await waitForSession(5000);
      if (!isMounted) {
        subscription.unsubscribe();
        return;
      }

      subscription.unsubscribe();
      if (hasSession) {
        redirectToDashboard();
      } else {
        redirectToLogin();
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
    </div>
  );
}