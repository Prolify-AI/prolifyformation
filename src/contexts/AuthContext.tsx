"use client";

import { createContext, useContext, useEffect, useState } from 'react';
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
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
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
