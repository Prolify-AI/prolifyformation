/*
  # Add Logo and Plan to Companies Table

  1. Changes
    - Add `logo_url` column to store company logo path in Supabase Storage
    - Add `current_plan` column to track the user's subscription plan (starter, growth, elite)

  2. Notes
    - logo_url stores the file path in the 'documents' bucket
    - current_plan defaults to 'starter'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE companies ADD COLUMN logo_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'current_plan'
  ) THEN
    ALTER TABLE companies ADD COLUMN current_plan text DEFAULT 'starter';
  END IF;
END $$;
