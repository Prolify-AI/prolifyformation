"use client";

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import posthog from 'posthog-js';
import { buildSiteUrl } from "@/lib/site-url";

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  company_id: string;
  newsletter_subscribed: boolean;
  terms_accepted: boolean;
  profile_completed: boolean;
  onboarding_type: string | null;
  plan_selected: boolean;
  created_at: string;
  updated_at: string;
};

type Company = {
  id: string;
  name: string;
  business_type: string;
  address: string;
  siret: string | null;
  website: string | null;
  employee_count: string;
  annual_revenue: string | null;
  logo_url: string | null;
  current_plan: string;
  plan_name?: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (isSignup?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const welcomeTriggeredRef = useRef<Set<string>>(new Set());

  const maybeSendGoogleWelcomeEmail = async (currentUser: User) => {
    if (typeof window === "undefined") return;
    if (!currentUser.email) return;

    const providers = Array.isArray(currentUser.app_metadata?.providers)
      ? currentUser.app_metadata.providers
      : [];
    const primaryProvider = currentUser.app_metadata?.provider;
    const isGoogleAccount = primaryProvider === "google" || providers.includes("google");
    if (!isGoogleAccount) return;

    const createdAt = currentUser.created_at ? Date.parse(currentUser.created_at) : NaN;
    const lastSignedInAt = currentUser.last_sign_in_at ? Date.parse(currentUser.last_sign_in_at) : NaN;
    const now = Date.now();
    const createdRecently = Number.isFinite(createdAt) && now - createdAt <= 15 * 60 * 1000;
    const firstLoginWindow =
      Number.isFinite(createdAt) &&
      Number.isFinite(lastSignedInAt) &&
      Math.abs(lastSignedInAt - createdAt) <= 15 * 60 * 1000;

    // Only trigger near account creation to avoid sending on normal logins.
    if (!createdRecently && !firstLoginWindow) return;

    const dedupeKey = `welcome-email-sent:${currentUser.id}`;
    if (welcomeTriggeredRef.current.has(currentUser.id) || localStorage.getItem(dedupeKey) === "1") {
      return;
    }

    welcomeTriggeredRef.current.add(currentUser.id);

    try {
      const fullName =
        (currentUser.user_metadata?.full_name as string | undefined) ||
        (currentUser.user_metadata?.name as string | undefined) ||
        undefined;

      await fetch("/api/email/post-signup-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email.toLowerCase().trim(),
          fullName,
        }),
      });
      localStorage.setItem(dedupeKey, "1");
    } catch (error) {
      console.warn("[auth] welcome email trigger failed", error);
      welcomeTriggeredRef.current.delete(currentUser.id);
    }
  };

  const loadUserData = async (currentUser: User) => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select(`
          *,
          companies (*)
        `)
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileData) {
        const { companies, ...profile } = profileData as any;
        setProfile(profile);

        posthog.identify(currentUser.id, {
          email: currentUser.email,
          full_name: profile.full_name,
          plan: companies?.current_plan,
          company_name: companies?.name,
        });

        if (companies) {
          setCompany(companies);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const refreshUserData = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await loadUserData(currentUser);
    }
  };

  useEffect(() => {
    const waitForSessionHydration = async (timeoutMs = 5000) => {
      const start = Date.now();

      while (Date.now() - start < timeoutMs) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return session.user;
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      return null;
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          void maybeSendGoogleWelcomeEmail(session.user);
          await loadUserData(session.user);
        } else if (typeof window !== "undefined") {
          const isOAuthCallback =
            window.location.pathname === "/auth/callback" ||
            window.location.hash.includes("access_token=");

          if (isOAuthCallback) {
            const hydratedUser = await waitForSessionHydration();
            if (hydratedUser) {
              setUser(hydratedUser);
              void maybeSendGoogleWelcomeEmail(hydratedUser);
              await loadUserData(hydratedUser);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          (async () => {
            void maybeSendGoogleWelcomeEmail(session.user);
            await loadUserData(session.user);
          })();
        } else {
          setProfile(null);
          setCompany(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectTo = buildSiteUrl("/auth/callback");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async (isSignup?: boolean) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildSiteUrl("/auth/callback"),
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      posthog.reset();
      setUser(null);
      setProfile(null);
      setCompany(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prolify-auth');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
      setProfile(null);
      setCompany(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prolify-auth');
      }
    }
  };

  const value = {
    user,
    profile,
    company,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
