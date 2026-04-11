/*
  # Create company_services table

  1. New Tables
    - `company_services`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `rainc_company_id` (text) — the Corporate Tools API company ID
      - `service_type` (text) — "mail" or "phone"
      - `jurisdiction` (text) — state/jurisdiction of the company
      - `status` (text) — "active", "pending", "failed"
      - `activated_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `company_services` table
    - Users can only view and manage their own service records
*/

CREATE TABLE IF NOT EXISTS company_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rainc_company_id text NOT NULL,
  service_type text NOT NULL DEFAULT '',
  jurisdiction text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  activated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company services"
  ON company_services FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company services"
  ON company_services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company services"
  ON company_services FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own company services"
  ON company_services FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
