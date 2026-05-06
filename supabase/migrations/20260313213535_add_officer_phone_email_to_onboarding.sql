/*
  # Add officer phone and email to onboarding_data

  1. Modified Tables
    - `onboarding_data`
      - `officer_phone` (text) — phone number of the primary officer, required by RAINC API for service info
      - `officer_email` (text) — email address of the primary officer, required by RAINC API for service info

  2. Notes
    - Both columns are nullable to preserve backward compatibility with existing rows
    - These fields are submitted to RAINC POST /services/:id/info as contact_person.phone_number and contact_person.email_address
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'officer_phone'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'officer_email'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_email text;
  END IF;
END $$;
