/*
  # Add RAInc company_id to user_companies table

  1. Changes
    - `user_companies`
      - Add `rainc_company_id` (text, nullable) — stores the external company ID returned by Registered Agents Inc API
      - Add `status` (text, default 'active') — formation status (active, pending, failed)
      - Add `plan` (text, nullable) — the selected formation plan

  2. Notes
    - No destructive operations
    - All existing rows unaffected (nullable columns)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_companies' AND column_name = 'rainc_company_id'
  ) THEN
    ALTER TABLE user_companies ADD COLUMN rainc_company_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_companies' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_companies ADD COLUMN status text NOT NULL DEFAULT 'active';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_companies' AND column_name = 'plan'
  ) THEN
    ALTER TABLE user_companies ADD COLUMN plan text;
  END IF;
END $$;
