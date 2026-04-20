"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, CircleAlert as AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";
import { TermsModal } from "@/components/TermsModal";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signIn(formData.email, formData.password);

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid") || authError.message.toLowerCase().includes("credentials") || authError.message.toLowerCase().includes("password")) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
        setLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-br from-[#FFC107]/10 via-white to-white dark:from-[#FFD54F]/5 dark:via-[#0a0a0a] dark:to-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-[#FFC107] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] mb-6">
            <span className="text-3xl font-black text-black tracking-tight">Prolify</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sign in to your Prolify account
          </p>
        </div>

        <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-black dark:text-white">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border-2 border-black dark:border-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
                <Link href="/forgot-password" className="text-sm text-[#FFC107] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 border-2 border-black dark:border-white"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold py-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-[#171717] text-gray-500 dark:text-gray-400 font-medium">
                OR
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white font-semibold py-6 border-2 border-gray-300 dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] transition-all"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#FFC107] hover:underline font-semibold">
                Create one for free
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <TermsModal className="text-[#FFC107] hover:underline">
                Terms of Service
              </TermsModal>{" "}
              and{" "}
              <PrivacyPolicyModal className="text-[#FFC107] hover:underline">
                Privacy Policy
              </PrivacyPolicyModal>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
