# Supabase Auth Email Setup (Option 1 + Option 3)

This guide configures signup verification emails correctly with Supabase Auth and branded templates.

## 1) Enable and verify Email Auth

In Supabase Dashboard:

- `Authentication` -> `Providers` -> `Email`
  - Enable Email provider.
  - Keep **Confirm email** enabled for production.

## 2) Configure URL settings

In Supabase Dashboard:

- `Authentication` -> `URL Configuration`
  - **Site URL**:
    - Production: `https://prolify.co`
    - Local dev can remain `http://localhost:3000`
  - **Redirect URLs** (add all needed):
    - `https://prolify.co/auth/callback`
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3001/auth/callback`

## 3) Configure branded auth email templates (Option 3)

In Supabase Dashboard:

- `Authentication` -> `Email Templates`
  - Update at minimum:
    - Confirm signup
    - Reset password
  - Use Prolify branding:
    - From name style: `Prolify`
    - Voice: clear, short, actionable
  - Ensure confirmation template includes Supabase confirmation URL variable.

## 4) SMTP for Supabase Auth emails (recommended)

Important: Supabase verification emails are sent by Supabase Auth, not your app SMTP route.

In Supabase Dashboard:

- `Authentication` -> `SMTP Settings`
  - Configure sender and SMTP credentials for your domain.
  - Test delivery using a real inbox.

## 5) App behavior now implemented

Code changes already added:

- Signup now passes `emailRedirectTo: <origin>/auth/callback`.
- If Supabase requires email verification (no session returned on signup), UI shows:
  - “Check your inbox to verify your email before signing in.”

Files updated:

- `src/app/signup/page.tsx`
- `src/contexts/AuthContext.tsx`

## 6) Quick test checklist

1. Create a new account with a fresh email.
2. Confirm verification email is received.
3. Click verification link and confirm redirect to `/auth/callback`.
4. Sign in successfully.
5. Repeat in production domain and local dev.
