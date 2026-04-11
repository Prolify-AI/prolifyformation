/*
  # Add Formation Detail Fields to Onboarding Data

  Adds new columns to onboarding_data to support the expanded company
  formation wizard steps:
  - Principal Activity: business category and purpose
  - Business Address: principal and mailing addresses
  - Controlling Officers: officer type, title, name, and address
  - Annual Report: enrollment preference
  - Management structure type
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'business_category') THEN
    ALTER TABLE onboarding_data ADD COLUMN business_category text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'business_purpose') THEN
    ALTER TABLE onboarding_data ADD COLUMN business_purpose text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'management_structure') THEN
    ALTER TABLE onboarding_data ADD COLUMN management_structure text DEFAULT 'Member Managed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'principal_street') THEN
    ALTER TABLE onboarding_data ADD COLUMN principal_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'principal_city') THEN
    ALTER TABLE onboarding_data ADD COLUMN principal_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'principal_state') THEN
    ALTER TABLE onboarding_data ADD COLUMN principal_state text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'principal_zip') THEN
    ALTER TABLE onboarding_data ADD COLUMN principal_zip text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'mailing_same_as_principal') THEN
    ALTER TABLE onboarding_data ADD COLUMN mailing_same_as_principal boolean DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'mailing_street') THEN
    ALTER TABLE onboarding_data ADD COLUMN mailing_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'mailing_city') THEN
    ALTER TABLE onboarding_data ADD COLUMN mailing_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'mailing_state') THEN
    ALTER TABLE onboarding_data ADD COLUMN mailing_state text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'mailing_zip') THEN
    ALTER TABLE onboarding_data ADD COLUMN mailing_zip text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_type') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_type text DEFAULT 'Person';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_title') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_title text DEFAULT 'Managing Member';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_first_name') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_first_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_last_name') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_last_name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_street') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_street text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_city') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_state') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_state text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'officer_zip') THEN
    ALTER TABLE onboarding_data ADD COLUMN officer_zip text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_data' AND column_name = 'annual_report_enrolled') THEN
    ALTER TABLE onboarding_data ADD COLUMN annual_report_enrolled boolean DEFAULT false;
  END IF;
END $$;
