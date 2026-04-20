"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(false);

  useEffect(() => {
    if (loading || user) return;

    let cancelled = false;

    const verifySessionBeforeRedirect = async () => {
      setCheckingSession(true);
      const startedAt = Date.now();

      while (!cancelled && Date.now() - startedAt < 2500) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setCheckingSession(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (!cancelled) {
        setCheckingSession(false);
        router.replace('/login');
      }
    };

    verifySessionBeforeRedirect();

    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  if (loading || checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFC107] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
