/*
  # Add Formation Fields to Onboarding Data

  ## Overview
  Adds additional fields to the onboarding_data table to support the complete business formation flow.

  ## Changes
  
  ### Modified Tables
  - `onboarding_data`
    - Add `formation_state` (text) - Selected US state for formation
    - Add `selected_plan` (text) - Selected subscription plan (Starter, Tax and Compliance, Business-in-a-Box)
    - Add `expedited_ein` (boolean) - Whether user selected expedited EIN service
    - Add `state_fee` (numeric) - State filing fee
    - Add `plan_price` (numeric) - Selected plan price
    - Add `expedited_ein_fee` (numeric) - Expedited EIN service fee if selected
    - Add `total_amount` (numeric) - Total amount to pay
  
  ## Important Notes
  - All monetary fields use numeric type for precision
  - State recommendations can be based on country of residence
  - Total amount is calculated from all selected services
*/

-- Add new columns to onboarding_data table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'formation_state'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN formation_state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'selected_plan'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN selected_plan text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'expedited_ein'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN expedited_ein boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'state_fee'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN state_fee numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'plan_price'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN plan_price numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'expedited_ein_fee'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN expedited_ein_fee numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_data' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE onboarding_data ADD COLUMN total_amount numeric(10, 2);
  END IF;
END $$;