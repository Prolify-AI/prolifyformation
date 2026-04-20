"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";
import { TermsModal } from "@/components/TermsModal";
import { ArrowRight, Mail, Lock, Phone, User, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import GetStartedModal from "@/components/dashboard/GetStartedModal";
import { formationPlans } from "@/lib/plans";
import { buildSiteUrl } from "@/lib/site-url";

const ACTION_SECTION_MAP: Record<string, string> = {
  "add-company": "company",
  "annual-report": "compliance",
  "registered-agent": "compliance",
  "ein": "company",
  "good-standing": "compliance",
  "chat": "ai-chief",
};

function SignupContent() {
  const { signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  const planId = searchParams.get("plan") ?? "";
  const priceId = searchParams.get("price_id") ?? "";
  const isPaymentFirst = Boolean(planId && priceId);

  const selectedPlanDetails = isPaymentFirst
    ? formationPlans.find((p) => p.id === planId) ?? null
    : null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    termsAccepted: false,
    newsletterSubscribed: false,
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\+\-\(\)]+$/;
    return phone.length >= 10 && re.test(phone);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentFirstSubmit = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const res = await fetch(`${supabaseUrl}/functions/v1/preregistration-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${anonKey}`,
        "Apikey": anonKey,
      },
      body: JSON.stringify({
        email: formData.email.toLowerCase().trim(),
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        hashed_password: formData.password,
        newsletter_subscribed: formData.newsletterSubscribed,
        terms_accepted: formData.termsAccepted,
        plan_id: planId,
        price_id: priceId,
        success_url: `${window.location.origin}/signup/complete`,
        cancel_url: `${window.location.origin}/signup?plan=${planId}&price_id=${priceId}&cancelled=true`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        setErrors({
          submit: "An account with this email already exists. Please sign in instead.",
        });
      } else {
        setErrors({ submit: data.error || "Failed to initiate checkout" });
      }
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleFreeSubmit = async () => {
    const redirectTo = buildSiteUrl("/auth/callback");
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      },
    });

    if (authError) {
      if (
        authError.message.toLowerCase().includes("already") ||
        authError.message.toLowerCase().includes("exist")
      ) {
        setErrors({
          submit: "This email is already registered. Please sign in instead or use a different email.",
        });
      } else {
        setErrors({ submit: authError.message });
      }
      return;
    }

    if (authData.user) {
      const createdUserId = authData.user.id;
      const createdUserEmail = formData.email.trim().toLowerCase();

      if (!authData.session) {
        // In some Supabase setups, signup succeeds but no session is returned immediately.
        // Try an immediate sign-in so onboarding can continue without inbox verification.
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (!signInData.session) {
          setEmailVerificationPending(true);
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.newsletterSubscribed) {
        await supabase
          .from("profiles")
          .update({ newsletter_subscribed: true })
          .eq("id", authData.user.id);
      }

      // Trigger lifecycle welcome email after account creation.
      try {
        await fetch("/api/email/post-signup-welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: createdUserEmail,
            fullName: formData.fullName,
          }),
        });
      } catch (emailError) {
        console.warn("[signup] welcome email trigger failed", emailError);
      }

      setRegisteredName(formData.fullName);
      setShowGetStarted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isPaymentFirst) {
        await handlePaymentFirstSubmit();
      } else {
        await handleFreeSubmit();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during registration";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle(true);
      if (error) setErrors({ submit: error.message });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGetStartedAction = (action: string) => {
    setShowGetStarted(false);
    if (action === "form-company") {
      window.location.href = "/dashboard?start_formation=true";
      return;
    }
    const section = ACTION_SECTION_MAP[action];
    const url = section ? `/dashboard?section=${section}` : "/dashboard";
    window.location.href = url;
  };

  const handleGetStartedClose = () => {
    setShowGetStarted(false);
    window.location.href = "/dashboard";
  };

  const submitLabel = isPaymentFirst
    ? loading
      ? "Redirecting to payment..."
      : `Pay & Create Account — $${selectedPlanDetails?.price ?? ""}`
    : loading
    ? "Creating Your Account..."
    : "Create Account";

  return (
    <div className="min-h-screen flex overflow-hidden bg-white dark:bg-black">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#FFC107] via-[#FFB300] to-[#FFA000] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#FFC107]" />
            </div>
            <span className="text-2xl font-black text-black">Prolify</span>
          </div>

          {isPaymentFirst && selectedPlanDetails ? (
            <>
              <div className="inline-flex items-center gap-2 bg-black/10 text-black font-bold text-sm px-3 py-1.5 rounded-full mb-4">
                <ShieldCheck className="h-4 w-4" />
                {selectedPlanDetails.name} Plan — ${selectedPlanDetails.price} one-time
              </div>
              <h2 className="text-4xl font-black text-black mb-4 leading-tight">
                One step away from your US business.
              </h2>
              <p className="text-black/80 text-lg mb-8">
                Enter your details, then complete payment securely via Stripe. Your account is created instantly after.
              </p>
              <div className="space-y-3">
                {["Fill in your details below", "Complete secure Stripe payment", "Account created automatically", "Start forming your business"].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black text-[#FFC107] font-black text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-black font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-black text-black mb-4 leading-tight">
                Start your US<br />business today.
              </h2>
              <p className="text-black/80 text-lg mb-8">
                Join thousands of founders from 150+ countries who've launched with Prolify.
              </p>
              <div className="space-y-4">
                {[
                  "Form LLC or C-Corp in any US state",
                  "Get your EIN in 10-15 business days",
                  "Manage compliance, taxes & invoices",
                  "Dedicated expert support included",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-[#FFC107]" />
                    </div>
                    <span className="text-black font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 p-4 bg-black rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#FFC107] flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">"Setup was incredibly easy. Had my LLC in 2 weeks!"</p>
              <p className="text-white/60 text-xs mt-0.5">Sarah M. — E-commerce founder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <span className="text-2xl font-black text-black dark:text-white">Prolify</span>
          </div>

          {isPaymentFirst && selectedPlanDetails && (
            <div className="mb-6 p-4 rounded-2xl border-2 border-[#FFC107]/30 bg-[#FFC107]/5 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#FFC107] flex-shrink-0" />
              <div>
                <p className="font-black text-sm text-black dark:text-white">
                  {selectedPlanDetails.name} Plan — ${selectedPlanDetails.price} one-time
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Payment collected securely via Stripe after this step
                </p>
              </div>
              <Link
                href="/signup/plan"
                className="ml-auto text-xs text-gray-400 hover:text-[#FFC107] transition-colors whitespace-nowrap"
              >
                Change plan
              </Link>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-black text-black dark:text-white mb-2">
              {isPaymentFirst ? "Your details" : "Create your account"}
            </h1>
            <p className="text-black/70 dark:text-white/70">
              Already have one?{" "}
              <Link href="/login" className="text-[#FFC107] font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {emailVerificationPending && (
            <div className="mb-6 p-4 rounded-2xl border-2 border-[#FFC107]/40 bg-[#FFC107]/10">
              <p className="text-sm font-semibold text-black dark:text-white">
                Account created, but automatic login is still pending.
              </p>
              <p className="text-xs text-black/70 dark:text-white/70 mt-1">
                Try signing in directly now. If needed, check your inbox at <strong>{formData.email}</strong>.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-bold text-black dark:text-white">Full Name *</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  className="pl-10 border-2 border-black/20 dark:border-white/20 focus:border-[#FFC107] h-12"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-bold text-black dark:text-white">Email Address *</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="pl-10 border-2 border-black/20 dark:border-white/20 focus:border-[#FFC107] h-12"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-bold text-black dark:text-white">Phone Number *</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="pl-10 border-2 border-black/20 dark:border-white/20 focus:border-[#FFC107] h-12"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-bold text-black dark:text-white">Password *</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="pl-10 border-2 border-black/20 dark:border-white/20 focus:border-[#FFC107] h-12"
                  placeholder="Min. 8 characters"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-bold text-black dark:text-white">Confirm Password *</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 dark:text-white/40" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="pl-10 border-2 border-black/20 dark:border-white/20 focus:border-[#FFC107] h-12"
                  placeholder="Re-enter password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t-2 border-black/10 dark:border-white/10">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData("termsAccepted", checked as boolean)}
                  className="mt-1 border-2 border-black/30 data-[state=checked]:bg-[#FFC107] data-[state=checked]:border-[#FFC107]"
                />
                <Label htmlFor="termsAccepted" className="text-sm text-black/80 dark:text-white/80 cursor-pointer">
                  I accept the{" "}
                  <TermsModal className="text-[#FFC107] hover:underline font-semibold">Terms</TermsModal>{" "}
                  and{" "}
                  <PrivacyPolicyModal className="text-[#FFC107] hover:underline font-semibold">Privacy Policy</PrivacyPolicyModal>{" "}
                  *
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletterSubscribed"
                  checked={formData.newsletterSubscribed}
                  onCheckedChange={(checked) => updateFormData("newsletterSubscribed", checked as boolean)}
                  className="mt-1 border-2 border-black/30 data-[state=checked]:bg-[#FFC107] data-[state=checked]:border-[#FFC107]"
                />
                <Label htmlFor="newsletterSubscribed" className="text-sm text-black/80 dark:text-white/80 cursor-pointer">
                  Subscribe for updates, tips, and exclusive offers
                </Label>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errors.submit}
                  {(errors.submit.toLowerCase().includes("already") ||
                    errors.submit.toLowerCase().includes("exist")) && (
                    <>
                      {" "}
                      <Link href="/login" className="text-[#FFC107] hover:underline font-semibold">
                        Sign in instead
                      </Link>
                    </>
                  )}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000] text-black font-black py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-base"
            >
              {submitLabel} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {isPaymentFirst && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secured by Stripe — your payment info never touches our servers
              </p>
            )}

            {!isPaymentFirst && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-black/10 dark:border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-black text-black/50 dark:text-white/50 font-medium">OR</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white font-semibold py-6 border-2 border-black/20 dark:border-white/20 hover:border-[#FFC107] rounded-xl shadow-sm transition-all"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}
          </form>
        </div>
      </div>

      {showGetStarted && (
        <GetStartedModal
          userName={registeredName}
          onClose={handleGetStartedClose}
          onAction={handleGetStartedAction}
        />
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
