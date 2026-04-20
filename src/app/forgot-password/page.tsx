"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { buildSiteUrl } from "@/lib/site-url";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: buildSiteUrl("/reset-password"),
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-br from-[#FFC107]/10 via-white to-white dark:from-[#FFD54F]/5 dark:via-[#0a0a0a] dark:to-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-[#FFC107] border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] mb-6">
            <span className="text-3xl font-black text-black tracking-tight">Prolify</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {sent
              ? "Check your inbox for a reset link"
              : "We'll send you a link to reset your password"}
          </p>
        </div>

        <div className="bg-white dark:bg-[#171717] rounded-2xl border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] p-8">
          {sent ? (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white mb-2">Email Sent!</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="font-semibold text-black dark:text-white">{email}</span>.
                  Check your inbox and follow the instructions.
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Didn't receive it?{" "}
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-[#FFC107] hover:underline font-semibold"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-black dark:text-white">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-2 border-black dark:border-white"
                    placeholder="john@example.com"
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
                {loading ? "Sending..." : "Send Reset Link"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
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
