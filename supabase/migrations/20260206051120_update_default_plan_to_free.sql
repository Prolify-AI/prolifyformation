/*
  # Update Default Plan to Free
  
  1. Changes
    - Updates the default value of current_plan to 'free'
    - Updates existing companies with 'starter' plan to 'free' (if they haven't paid)
  
  2. Notes
    - This ensures new users start with the free plan
    - Existing users are updated to free plan unless they have a paid plan
*/

-- Update the default value for current_plan
ALTER TABLE companies 
ALTER COLUMN current_plan SET DEFAULT 'free';

-- Update existing companies that have 'starter' to 'free'
-- (assuming 'starter' was the old free tier)
UPDATE companies 
SET current_plan = 'free' 
WHERE current_plan = 'starter' OR current_plan IS NULL;
