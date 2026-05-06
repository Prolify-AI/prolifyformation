"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        window.history.replaceState(null, "", "/dashboard");
        router.replace("/dashboard");
      } else if (error) {
        router.replace("/login");
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          subscription.unsubscribe();
          if (session) {
            window.history.replaceState(null, "", "/dashboard");
            router.replace("/dashboard");
          } else {
            router.replace("/login");
          }
        });
      }
    };
    handleCallback();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
    </div>
  );
}