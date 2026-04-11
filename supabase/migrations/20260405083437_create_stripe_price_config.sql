/*
  # Create stripe_price_config table

  ## Purpose
  Stores the Stripe Price IDs for all plans, editable by admins from the dashboard
  without needing to touch the codebase.

  ## New Table
  - `stripe_price_config`
    - `id` (uuid, primary key)
    - `plan_key` (text, unique) — e.g. "formation-starter", "management-growth-monthly"
    - `plan_name` (text) — human-readable label
    - `price_id` (text) — the Stripe price_1... ID
    - `mode` (text) — "payment" or "subscription"
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Anyone authenticated can SELECT (needed for checkout flows)
  - Only service role can INSERT/UPDATE (admin page uses service role via API route)
*/

CREATE TABLE IF NOT EXISTS stripe_price_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key text UNIQUE NOT NULL,
  plan_name text NOT NULL DEFAULT '',
  price_id text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'payment',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_price_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read price config"
  ON stripe_price_config FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO stripe_price_config (plan_key, plan_name, price_id, mode) VALUES
  ('formation-starter',            'Formation Starter',              'price_1TBnMePfALVp6q7WOMOjzA6F', 'payment'),
  ('formation-growth',             'Formation Growth',               'price_1TBnTMPfALVp6q7WAoCASehf', 'payment'),
  ('formation-elite',              'Formation Elite',                'price_1TBnVLPfALVp6q7WUslzqose', 'payment'),
  ('management-starter-monthly',   'Management Starter Monthly',     '', 'subscription'),
  ('management-starter-annual',    'Management Starter Annual',      '', 'subscription'),
  ('management-growth-monthly',    'Management Growth Monthly',      '', 'subscription'),
  ('management-growth-annual',     'Management Growth Annual',       '', 'subscription'),
  ('management-elite-monthly',     'Management Elite Monthly',       '', 'subscription'),
  ('management-elite-annual',      'Management Elite Annual',        '', 'subscription')
ON CONFLICT (plan_key) DO NOTHING;
