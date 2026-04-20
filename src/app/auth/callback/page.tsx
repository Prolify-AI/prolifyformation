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
      // Explicitly consume OAuth tokens from URL hash when present.
      // This avoids relying only on implicit auto-detection timing.
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!isMounted) return;

        if (!setSessionError) {
          redirectToDashboard();
          return;
        }
      }

      // Support PKCE callback mode (?code=...) as fallback.
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!isMounted) return;
        if (!exchangeError) {
          redirectToDashboard();
          return;
        }
      }

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