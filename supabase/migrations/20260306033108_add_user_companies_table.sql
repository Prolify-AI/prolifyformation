/*
  # Add user_companies table for multiple company support

  1. New Tables
    - `user_companies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `entity_type` (text)
      - `formation_state` (text)
      - `ein` (text, nullable)
      - `formation_date` (text, nullable)
      - `address` (text)
      - `officer_first_name` (text)
      - `officer_last_name` (text)
      - `officer_title` (text, nullable)
      - `officer_email` (text, nullable)
      - `registered_agent` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_companies` table
    - Users can only view and manage their own companies
*/

CREATE TABLE IF NOT EXISTS user_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  entity_type text NOT NULL DEFAULT '',
  formation_state text NOT NULL DEFAULT '',
  ein text,
  formation_date text,
  address text NOT NULL DEFAULT '',
  officer_first_name text NOT NULL DEFAULT '',
  officer_last_name text NOT NULL DEFAULT '',
  officer_title text,
  officer_email text,
  registered_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companies"
  ON user_companies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies"
  ON user_companies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
  ON user_companies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
  ON user_companies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
