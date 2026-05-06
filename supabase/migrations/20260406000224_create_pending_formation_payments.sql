/*
  # Create pending_formation_payments table

  ## Purpose
  Tracks Stripe checkout sessions for the formation onboarding flow.
  A formation order is only finalized (onboarding marked complete) AFTER
  Stripe confirms payment_status = "paid". This prevents accounts from
  being registered without a completed payment.

  ## New Tables
  - `pending_formation_payments`
    - `id` (uuid, primary key)
    - `user_id` (uuid) - the authenticated user who initiated checkout
    - `email` (text) - user email for Stripe
    - `checkout_session_id` (text) - Stripe session ID, set after session creation
    - `formation_state` (text) - full state name e.g. "Wyoming"
    - `state_code` (text) - 2-letter state code e.g. "WY"
    - `entity_type` (text) - "LLC" or "C-Corp"
    - `company_name` (text)
    - `plan_id` (text) - e.g. "formation-starter"
    - `prolify_fee` (numeric) - Prolify service fee portion
    - `state_fee` (numeric) - state filing fee portion
    - `expedited_ein_fee` (numeric) - expedited EIN fee, 0 if not selected
    - `total_amount` (numeric) - grand total charged
    - `onboarding_snapshot` (jsonb) - snapshot of full onboarding form data
    - `status` (text) - "pending_payment" | "payment_completed" | "formation_started" | "expired"
    - `expires_at` (timestamptz) - session expiry (2 hours from creation)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Users can only read their own records
  - Insert/update handled by service role (edge function)
*/

CREATE TABLE IF NOT EXISTS pending_formation_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  checkout_session_id text,
  formation_state text NOT NULL DEFAULT '',
  state_code text NOT NULL DEFAULT '',
  entity_type text NOT NULL DEFAULT 'LLC',
  company_name text NOT NULL DEFAULT '',
  plan_id text NOT NULL DEFAULT '',
  prolify_fee numeric NOT NULL DEFAULT 0,
  state_fee numeric NOT NULL DEFAULT 0,
  expedited_ein_fee numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  onboarding_snapshot jsonb,
  status text NOT NULL DEFAULT 'pending_payment',
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pending_formation_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own formation payments"
  ON pending_formation_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
