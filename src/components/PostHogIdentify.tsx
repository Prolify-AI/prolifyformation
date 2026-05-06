"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { supabase } from "@/lib/supabase/client";

export function PostHogIdentify() {
  const posthog = usePostHog();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          posthog?.identify(session.user.id, {
            email: session.user.email,
            created_at: session.user.created_at,
          });
        }

        if (event === "SIGNED_OUT") {
          posthog?.reset();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [posthog]);

  return null;
}
