/*
  # Create Business Operations Tables

  ## Overview
  This migration creates tables for managing business operations including expenses, 
  invoices, clients, tax records, learning resources, and marketplace services.

  ## New Tables
  
  ### `expenses`
  Tracks business expenses and transactions.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `user_id` (uuid, foreign key to auth.users) - User who created expense
  - `amount` (numeric) - Expense amount
  - `currency` (text) - Currency code (USD, EUR, etc.)
  - `category` (text) - Expense category (office, travel, software, etc.)
  - `description` (text) - Expense description
  - `vendor` (text) - Vendor/supplier name
  - `date` (date) - Transaction date
  - `payment_method` (text) - Payment method used
  - `receipt_url` (text, nullable) - URL to receipt/proof
  - `tax_deductible` (boolean) - Whether expense is tax deductible
  - `status` (text) - Status: pending, approved, rejected
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `invoices`
  Manages customer invoices and billing.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `invoice_number` (text) - Unique invoice number
  - `client_id` (uuid, nullable, foreign key to clients) - Associated client
  - `client_name` (text) - Client name
  - `client_email` (text) - Client email
  - `amount` (numeric) - Invoice total amount
  - `currency` (text) - Currency code
  - `status` (text) - Status: draft, sent, paid, overdue, cancelled
  - `issue_date` (date) - Invoice issue date
  - `due_date` (date) - Payment due date
  - `paid_date` (date, nullable) - Date invoice was paid
  - `description` (text) - Invoice description/items
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `clients`
  Stores client/customer information.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `name` (text) - Client name
  - `email` (text) - Client email
  - `phone` (text, nullable) - Client phone
  - `address` (text, nullable) - Client address
  - `company_name` (text, nullable) - Client company name
  - `tax_id` (text, nullable) - Client tax ID
  - `notes` (text, nullable) - Additional notes
  - `total_revenue` (numeric) - Total revenue from this client
  - `status` (text) - Status: active, inactive
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `tax_records`
  Tracks tax filings and payments.
  - `id` (uuid, primary key) - Unique identifier
  - `company_id` (uuid, foreign key to companies) - Associated company
  - `tax_year` (integer) - Tax year
  - `tax_quarter` (integer, nullable) - Quarter (1-4) if quarterly
  - `tax_type` (text) - Type: federal, state, sales, payroll, etc.
  - `amount_owed` (numeric) - Amount owed
  - `amount_paid` (numeric) - Amount paid
  - `filing_date` (date, nullable) - Date filed
  - `payment_date` (date, nullable) - Date paid
  - `status` (text) - Status: pending, filed, paid
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `learning_resources`
  Stores educational content and courses.
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Resource title
  - `description` (text) - Resource description
  - `category` (text) - Category: formation, taxes, compliance, growth, etc.
  - `type` (text) - Type: video, article, course, webinar
  - `content_url` (text, nullable) - URL to content
  - `thumbnail_url` (text, nullable) - Thumbnail image
  - `duration_minutes` (integer, nullable) - Duration in minutes
  - `level` (text) - Difficulty: beginner, intermediate, advanced
  - `is_premium` (boolean) - Whether content requires premium access
  - `order_index` (integer) - Display order
  - `published` (boolean) - Whether resource is published
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `user_learning_progress`
  Tracks user progress in learning resources.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key to auth.users) - User
  - `resource_id` (uuid, foreign key to learning_resources) - Resource
  - `progress_percentage` (integer) - Progress (0-100)
  - `completed` (boolean) - Whether completed
  - `completed_at` (timestamptz, nullable) - Completion date
  - `last_accessed` (timestamptz) - Last access date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ### `marketplace_services`
  Lists available marketplace services.
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Service name
  - `description` (text) - Service description
  - `category` (text) - Category: banking, tax, legal, marketing, etc.
  - `provider` (text) - Service provider name
  - `price` (numeric, nullable) - Base price
  - `price_model` (text) - Pricing model: one-time, monthly, annual, custom
  - `features` (text[]) - List of features
  - `image_url` (text, nullable) - Service image
  - `external_url` (text, nullable) - External link
  - `is_featured` (boolean) - Whether service is featured
  - `order_index` (integer) - Display order
  - `published` (boolean) - Whether service is published
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access data for their company
  - Learning resources and marketplace are readable by all authenticated users
  
  ## Important Notes
  - All monetary amounts use numeric type for precision
  - Dates and statuses help track compliance and business health
  - Learning progress is tracked per user
*/

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  category text NOT NULL,
  description text NOT NULL,
  vendor text,
  date date NOT NULL,
  payment_method text,
  receipt_url text,
  tax_deductible boolean DEFAULT true,
  status text DEFAULT 'approved',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  invoice_number text NOT NULL,
  client_id uuid,
  client_name text NOT NULL,
  client_email text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'draft',
  issue_date date NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  description text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, invoice_number)
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  company_name text,
  tax_id text,
  notes text,
  total_revenue numeric(10, 2) DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tax_records table
CREATE TABLE IF NOT EXISTS tax_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  tax_year integer NOT NULL,
  tax_quarter integer,
  tax_type text NOT NULL,
  amount_owed numeric(10, 2) DEFAULT 0,
  amount_paid numeric(10, 2) DEFAULT 0,
  filing_date date,
  payment_date date,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  content_url text,
  thumbnail_url text,
  duration_minutes integer,
  level text DEFAULT 'beginner',
  is_premium boolean DEFAULT false,
  order_index integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_learning_progress table
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id uuid REFERENCES learning_resources(id) ON DELETE CASCADE NOT NULL,
  progress_percentage integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create marketplace_services table
CREATE TABLE IF NOT EXISTS marketplace_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  provider text NOT NULL,
  price numeric(10, 2),
  price_model text DEFAULT 'custom',
  features text[],
  image_url text,
  external_url text,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;

-- Policies for expenses
CREATE POLICY "Users can view expenses of their company"
  ON expenses FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert expenses to their company"
  ON expenses FOR INSERT TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update expenses of their company"
  ON expenses FOR UPDATE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete expenses of their company"
  ON expenses FOR DELETE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Policies for invoices
CREATE POLICY "Users can view invoices of their company"
  ON invoices FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert invoices to their company"
  ON invoices FOR INSERT TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update invoices of their company"
  ON invoices FOR UPDATE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete invoices of their company"
  ON invoices FOR DELETE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Policies for clients
CREATE POLICY "Users can view clients of their company"
  ON clients FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert clients to their company"
  ON clients FOR INSERT TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update clients of their company"
  ON clients FOR UPDATE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete clients of their company"
  ON clients FOR DELETE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Policies for tax_records
CREATE POLICY "Users can view tax records of their company"
  ON tax_records FOR SELECT TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert tax records to their company"
  ON tax_records FOR INSERT TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update tax records of their company"
  ON tax_records FOR UPDATE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete tax records of their company"
  ON tax_records FOR DELETE TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- Policies for learning_resources (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view published learning resources"
  ON learning_resources FOR SELECT TO authenticated
  USING (published = true);

-- Policies for user_learning_progress
CREATE POLICY "Users can view own learning progress"
  ON user_learning_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own learning progress"
  ON user_learning_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own learning progress"
  ON user_learning_progress FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for marketplace_services (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view published marketplace services"
  ON marketplace_services FOR SELECT TO authenticated
  USING (published = true);

-- Add foreign key for client_id in invoices
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_client
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients(company_id);
CREATE INDEX IF NOT EXISTS idx_tax_records_company_id ON tax_records(company_id);
CREATE INDEX IF NOT EXISTS idx_tax_records_year ON tax_records(tax_year);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_category ON learning_resources(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_category ON marketplace_services(category);

-- Create update triggers
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tax_records_updated_at ON tax_records;
CREATE TRIGGER update_tax_records_updated_at
  BEFORE UPDATE ON tax_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_learning_resources_updated_at ON learning_resources;
CREATE TRIGGER update_learning_resources_updated_at
  BEFORE UPDATE ON learning_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_learning_progress_updated_at ON user_learning_progress;
CREATE TRIGGER update_user_learning_progress_updated_at
  BEFORE UPDATE ON user_learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_services_updated_at ON marketplace_services;
CREATE TRIGGER update_marketplace_services_updated_at
  BEFORE UPDATE ON marketplace_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();