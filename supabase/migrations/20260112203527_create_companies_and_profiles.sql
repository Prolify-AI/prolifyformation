/*
  # Create Companies and User Profiles Tables

  ## Overview
  This migration creates the database schema for user authentication and company management.

  ## New Tables
  
  ### `companies`
  Stores detailed information about registered companies.
  - `id` (uuid, primary key) - Unique company identifier
  - `name` (text) - Company name
  - `business_type` (text) - Type of business activity
  - `address` (text) - Complete company address
  - `siret` (text, optional) - SIRET/SIREN number
  - `website` (text, optional) - Company website URL
  - `employee_count` (text) - Number of employees (range)
  - `annual_revenue` (text, optional) - Approximate annual revenue
  - `created_at` (timestamptz) - Timestamp of company creation
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ### `profiles`
  Stores user profile information linked to auth.users.
  - `id` (uuid, primary key, foreign key to auth.users) - User ID
  - `full_name` (text) - User's full name
  - `phone` (text) - User's phone number
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `newsletter_subscribed` (boolean) - Newsletter subscription status
  - `terms_accepted` (boolean) - Terms and conditions acceptance
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Profile update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only view and update their own profile
  - Users can only view and update their company data

  ## Important Notes
  - All tables use RLS for data security
  - Profiles are linked to Supabase Auth users
  - Companies can have multiple users (future expansion)
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_type text NOT NULL,
  address text NOT NULL,
  siret text,
  website text,
  employee_count text NOT NULL,
  annual_revenue text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  newsletter_subscribed boolean DEFAULT false,
  terms_accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();