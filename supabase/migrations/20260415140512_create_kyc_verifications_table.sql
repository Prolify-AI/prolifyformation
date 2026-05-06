/*
  # Create KYC Verifications Table

  ## Purpose
  Stores identity verification sessions created via Didit.me for each user.

  ## New Tables
  - `kyc_verifications`
    - `id` (uuid, primary key)
    - `user_id` (uuid, FK to auth.users)
    - `session_id` (text) - Didit session ID
    - `session_token` (text) - Didit session token
    - `session_url` (text) - URL to redirect user to for verification
    - `status` (text) - Current verification status (pending, approved, declined, in_review, expired)
    - `workflow_id` (text) - Didit workflow ID used
    - `vendor_data` (text) - Our internal reference (user_id)
    - `decision` (jsonb) - Full decision payload from webhook
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Users can only read their own verifications
  - Only service role can insert/update (via edge functions)
*/

CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL UNIQUE,
  session_token text,
  session_url text,
  status text NOT NULL DEFAULT 'pending',
  workflow_id text,
  vendor_data text,
  decision jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_session_id ON kyc_verifications(session_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);

ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC verifications"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_kyc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kyc_verifications_updated_at
  BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_kyc_updated_at();
