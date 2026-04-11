/*
  # Create Automatic User Setup on Signup
  
  ## Overview
  This migration creates a database trigger that automatically creates a company and profile
  for new users when they sign up, solving RLS policy issues during the signup flow.
  
  ## Changes
  1. Create a function to handle new user setup
  2. Create a trigger on auth.users table
  
  ## Security
  - Function runs with SECURITY DEFINER (elevated privileges)
  - Only creates records for newly signed up users
  - Ensures data consistency
  
  ## Important Notes
  - This trigger runs automatically when a user signs up
  - Creates a default company and links it to the user's profile
  - The user can update these details later through the onboarding flow
*/

-- Function to automatically create company and profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Create a default company for the new user
  INSERT INTO public.companies (name, business_type, address, employee_count)
  VALUES ('My Company', 'Other', '', '1-10')
  RETURNING id INTO new_company_id;
  
  -- Create the user profile linked to the company
  INSERT INTO public.profiles (id, full_name, phone, company_id, newsletter_subscribed, terms_accepted)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    new_company_id,
    false,
    true
  );
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
