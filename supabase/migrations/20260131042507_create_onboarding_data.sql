/*
  # Create Onboarding Data Table

  ## Overview
  This migration creates a table to store user onboarding responses during the business formation process.

  ## New Tables
  
  ### `onboarding_data`
  Stores user responses during the onboarding questionnaire.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key to auth.users) - Associated user
  - `country_of_residence` (text) - User's country of residence
  - `business_goal` (text) - Either "form_new" or "grow_existing"
  - `entity_type` (text) - Either "LLC" or "C-Corp"
  - `company_name` (text) - Desired company name
  - `quiz_completed` (boolean) - Whether the user completed the quiz
  - `quiz_recommendation` (text) - Quiz result recommendation
  - `completed` (boolean) - Whether onboarding is completed
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ## Security
  - Enable RLS on onboarding_data table
  - Users can only access their own onboarding data
  
  ## Important Notes
  - Users can update their onboarding data until completion
  - Quiz recommendation helps guide entity type selection
*/

-- Create onboarding_data table
CREATE TABLE IF NOT EXISTS onboarding_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  country_of_residence text,
  business_goal text,
  entity_type text,
  company_name text,
  quiz_completed boolean DEFAULT false,
  quiz_recommendation text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own onboarding data"
  ON onboarding_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data"
  ON onboarding_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data"
  ON onboarding_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding_data(user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_onboarding_data_updated_at ON onboarding_data;
CREATE TRIGGER update_onboarding_data_updated_at
  BEFORE UPDATE ON onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();