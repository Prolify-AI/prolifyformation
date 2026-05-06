/*
  # Add current_step to onboarding_data

  ## Summary
  Adds a `current_step` column to `onboarding_data` so the wizard can resume
  exactly where the user left off, even after closing the browser.

  ## Changes
  - `onboarding_data`: add `current_step` integer column (default 1)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'current_step'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN current_step integer DEFAULT 1;
  END IF;
END $$;
