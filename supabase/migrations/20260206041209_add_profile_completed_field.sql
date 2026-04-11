/*
  # Add Profile Completion Tracking

  1. Changes
    - Add `profile_completed` boolean field to profiles table (default false)
    - Add `onboarding_type` field to track how user signed up ('new_business' or 'existing_business')
    - Add `plan_selected` boolean to track if user has selected a plan
    
  2. Purpose
    - Track whether user has completed their profile information
    - Track the type of business flow the user selected
    - Enable showing profile completion prompts in dashboard
    
  3. Security
    - Existing RLS policies on profiles table will apply to new fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_completed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_type text DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_selected'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan_selected boolean DEFAULT false;
  END IF;
END $$;