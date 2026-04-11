/*
  # Create Founders, Documents, and Compliance Tables

  ## Overview
  This migration creates tables to manage co-founders, company documents, and compliance deadlines.

  ## New Tables
  
  ### `co_founders`
  Stores information about company co-founders.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `user_id` (uuid, nullable, foreign key to auth.users) - Linked user account if exists
  - `full_name` (text) - Founder's full name
  - `email` (text) - Founder's email address
  - `phone` (text, nullable) - Founder's phone number
  - `ownership_percentage` (numeric) - Ownership stake in company
  - `role` (text) - Role in the company (CEO, CTO, CFO, etc.)
  - `invited_at` (timestamptz) - When they were invited
  - `joined_at` (timestamptz, nullable) - When they accepted the invitation
  - `status` (text) - Status: 'pending', 'active', 'inactive'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `company_documents`
  Stores company documents and files.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `document_name` (text) - Name of the document
  - `document_type` (text) - Type: 'formation', 'tax', 'contract', 'license', 'other'
  - `file_url` (text, nullable) - URL to the stored file
  - `file_size` (integer, nullable) - File size in bytes
  - `uploaded_by` (uuid, foreign key to auth.users) - User who uploaded
  - `description` (text, nullable) - Document description
  - `tags` (text[], nullable) - Searchable tags
  - `created_at` (timestamptz) - Upload timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `compliance_dates`
  Stores important compliance deadlines and dates.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `title` (text) - Deadline title
  - `description` (text, nullable) - Detailed description
  - `due_date` (date) - When the deadline is due
  - `category` (text) - Category: 'tax', 'filing', 'license', 'other'
  - `status` (text) - Status: 'upcoming', 'completed', 'overdue'
  - `recurring` (boolean) - Whether this repeats annually
  - `completed_at` (timestamptz, nullable) - When it was completed
  - `completed_by` (uuid, nullable, foreign key to auth.users) - Who completed it
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access data for their company
  - Based on company_id in their profile
  
  ## Important Notes
  - Co-founders can be invited before they create accounts
  - Documents are organized by type for easy filtering
  - Compliance dates auto-update status based on due_date
*/

-- Create co_founders table
CREATE TABLE IF NOT EXISTS co_founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  ownership_percentage numeric(5, 2) DEFAULT 0.00,
  role text DEFAULT 'Co-Founder',
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create company_documents table
CREATE TABLE IF NOT EXISTS company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  document_name text NOT NULL,
  document_type text DEFAULT 'other',
  file_url text,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  description text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create compliance_dates table
CREATE TABLE IF NOT EXISTS compliance_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  category text DEFAULT 'other',
  status text DEFAULT 'upcoming',
  recurring boolean DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE co_founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_dates ENABLE ROW LEVEL SECURITY;

-- Policies for co_founders
CREATE POLICY "Users can view co-founders of their company"
  ON co_founders
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert co-founders to their company"
  ON co_founders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update co-founders of their company"
  ON co_founders
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete co-founders of their company"
  ON co_founders
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies for company_documents
CREATE POLICY "Users can view documents of their company"
  ON company_documents
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents to their company"
  ON company_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents of their company"
  ON company_documents
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of their company"
  ON company_documents
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies for compliance_dates
CREATE POLICY "Users can view compliance dates of their company"
  ON compliance_dates
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert compliance dates to their company"
  ON compliance_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update compliance dates of their company"
  ON compliance_dates
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete compliance dates of their company"
  ON compliance_dates
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_co_founders_company_id ON co_founders(company_id);
CREATE INDEX IF NOT EXISTS idx_co_founders_user_id ON co_founders(user_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_company_id ON company_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_compliance_dates_company_id ON compliance_dates(company_id);
CREATE INDEX IF NOT EXISTS idx_compliance_dates_due_date ON compliance_dates(due_date);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_co_founders_updated_at ON co_founders;
CREATE TRIGGER update_co_founders_updated_at
  BEFORE UPDATE ON co_founders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_documents_updated_at ON company_documents;
CREATE TRIGGER update_company_documents_updated_at
  BEFORE UPDATE ON company_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_dates_updated_at ON compliance_dates;
CREATE TRIGGER update_compliance_dates_updated_at
  BEFORE UPDATE ON compliance_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();