/*
  # Payment-First Registration: pending_registrations table

  ## Purpose
  Stores user registration data temporarily while they complete payment.
  Account is only created after Stripe confirms payment success.

  ## New Tables
  - `pending_registrations`
    - `id` (uuid, primary key) — used as the checkout `client_reference_id`
    - `email` (text) — user's email
    - `full_name` (text) — user's full name
    - `phone` (text) — user's phone number
    - `hashed_password` (text) — bcrypt-hashed password, stored securely until account creation
    - `newsletter_subscribed` (boolean) — newsletter preference
    - `terms_accepted` (boolean) — terms acceptance
    - `plan_id` (text) — selected plan identifier (e.g. "formation-growth")
    - `price_id` (text) — Stripe price ID for the selected plan
    - `checkout_session_id` (text) — Stripe checkout session ID, populated when session is created
    - `status` (text) — 'pending_payment' | 'payment_completed' | 'account_created' | 'expired'
    - `expires_at` (timestamptz) — records expire after 2 hours to clean up abandoned checkouts
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled — no direct client access needed (all writes go through service role)
  - No authenticated user policies (records exist before user account)
*/

CREATE TABLE IF NOT EXISTS pending_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  hashed_password text NOT NULL,
  newsletter_subscribed boolean DEFAULT false,
  terms_accepted boolean DEFAULT true,
  plan_id text NOT NULL DEFAULT '',
  price_id text NOT NULL DEFAULT '',
  checkout_session_id text DEFAULT NULL,
  status text NOT NULL DEFAULT 'pending_payment',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pending_registrations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS pending_registrations_email_idx ON pending_registrations (email);
CREATE INDEX IF NOT EXISTS pending_registrations_checkout_session_idx ON pending_registrations (checkout_session_id);
CREATE INDEX IF NOT EXISTS pending_registrations_status_idx ON pending_registrations (status);
