/*
  # Add Default Compliance Dates Function

  ## Overview
  Creates a function and trigger to automatically add default compliance dates when a company is created.

  ## Changes
  
  ### New Functions
  - `create_default_compliance_dates()` - Adds standard compliance deadlines for new companies
    - Annual Report Filing (varies by state, defaulting to March 1)
    - Federal Tax Filing (April 15)
    - Quarterly Tax Estimates (quarterly dates)
    - Business License Renewal (annual)
  
  ### New Triggers
  - Automatically calls function when a new company is inserted
  
  ## Important Notes
  - Default dates are based on current year
  - All dates are set as recurring annually
  - Users can modify or delete these dates as needed
  - Additional state-specific dates should be added manually
*/

-- Create function to add default compliance dates
CREATE OR REPLACE FUNCTION create_default_compliance_dates()
RETURNS TRIGGER AS $$
DECLARE
  current_year INT := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
  -- Add Annual Report Filing (typically March 1st for most states)
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Annual Report Filing',
    'File your annual report with the state to maintain good standing',
    DATE(current_year || '-03-01'),
    'filing',
    'upcoming',
    true
  );

  -- Add Federal Tax Filing (April 15th)
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Federal Tax Return Filing',
    'File your federal business tax return (Form 1120 or 1120-S)',
    DATE(current_year || '-04-15'),
    'tax',
    'upcoming',
    true
  );

  -- Add Q1 Estimated Tax Payment
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Q1 Estimated Tax Payment',
    'Pay estimated quarterly taxes for Q1',
    DATE(current_year || '-04-15'),
    'tax',
    'upcoming',
    true
  );

  -- Add Q2 Estimated Tax Payment
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Q2 Estimated Tax Payment',
    'Pay estimated quarterly taxes for Q2',
    DATE(current_year || '-06-15'),
    'tax',
    'upcoming',
    true
  );

  -- Add Q3 Estimated Tax Payment
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Q3 Estimated Tax Payment',
    'Pay estimated quarterly taxes for Q3',
    DATE(current_year || '-09-15'),
    'tax',
    'upcoming',
    true
  );

  -- Add Q4 Estimated Tax Payment
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Q4 Estimated Tax Payment',
    'Pay estimated quarterly taxes for Q4',
    DATE((current_year + 1) || '-01-15'),
    'tax',
    'upcoming',
    true
  );

  -- Add Business License Renewal (December 31st)
  INSERT INTO compliance_dates (
    company_id,
    title,
    description,
    due_date,
    category,
    status,
    recurring
  ) VALUES (
    NEW.id,
    'Business License Renewal',
    'Renew your business license and permits',
    DATE(current_year || '-12-31'),
    'license',
    'upcoming',
    true
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add compliance dates
DROP TRIGGER IF EXISTS trigger_create_default_compliance_dates ON companies;
CREATE TRIGGER trigger_create_default_compliance_dates
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION create_default_compliance_dates();