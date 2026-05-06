/*
  # Create Co-Founder Profiles Table

  ## Overview
  Creates a table for users to create public profiles in the VIP Club section
  to connect with other potential co-founders.

  ## New Tables
    - `cofounder_profiles`
      - `id` (uuid, primary key) - Unique identifier for the profile
      - `user_id` (uuid, foreign key to auth.users) - Owner of the profile
      - `full_name` (text, required) - Co-founder's full name
      - `email` (text, required) - Contact email
      - `phone` (text, optional) - Contact phone number
      - `bio` (text, optional) - Brief biography/introduction
      - `skills` (text array, optional) - List of skills and expertise
      - `industry_experience` (text array, optional) - Industries worked in
      - `looking_for` (text, optional) - What they're looking for in a co-founder
      - `location` (text, optional) - Geographic location
      - `linkedin_url` (text, optional) - LinkedIn profile URL
      - `website_url` (text, optional) - Personal or company website
      - `avatar_url` (text, optional) - Profile picture URL
      - `availability` (text, optional) - Availability status (available, busy, not_looking)
      - `is_visible` (boolean, default true) - Whether profile is publicly visible
      - `created_at` (timestamptz) - When profile was created
      - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - Enable RLS on `cofounder_profiles` table
    - Users can view all visible profiles
    - Users can only create/update/delete their own profile
*/

CREATE TABLE IF NOT EXISTS cofounder_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  bio text,
  skills text[] DEFAULT '{}',
  industry_experience text[] DEFAULT '{}',
  looking_for text,
  location text,
  linkedin_url text,
  website_url text,
  avatar_url text,
  availability text DEFAULT 'available',
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE cofounder_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view visible profiles
CREATE POLICY "Anyone can view visible cofounder profiles"
  ON cofounder_profiles
  FOR SELECT
  USING (is_visible = true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can create own cofounder profile"
  ON cofounder_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own cofounder profile"
  ON cofounder_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own cofounder profile"
  ON cofounder_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cofounder_profiles_user_id ON cofounder_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cofounder_profiles_visibility ON cofounder_profiles(is_visible) WHERE is_visible = true;
