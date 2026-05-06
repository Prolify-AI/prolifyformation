/*
  # Bookkeeping Module Tables

  ## Overview
  Creates all tables needed for the Prolify bookkeeping module.

  ## New Tables

  1. `bk_accounts` — Chart of Accounts
     - id, user_id, code (account number), name, type (asset/liability/equity/income/expense), subtype, balance, description
  
  2. `bk_transactions` — General ledger transactions
     - id, user_id, date, description, category_id, amount, type (credit/debit), status (cleared/pending), account_id, notes
  
  3. `bk_bank_accounts` — Connected bank/credit card accounts
     - id, user_id, institution, account_name, last_four, type (checking/savings/credit), balance, status (active/inactive)
  
  4. `bk_bank_transactions` — Raw imported bank transactions
     - id, user_id, bank_account_id, date, description, amount, type (credit/debit), status (categorized/uncategorized), category, notes
  
  5. `bk_journal_entries` — Double-entry journal entries
     - id, user_id, date, description, debit_account_id, credit_account_id, amount
  
  6. `bk_company_settings` — Per-user bookkeeping settings
     - id, user_id, company_name, ein_masked, fiscal_year_end, accounting_method

  ## Security
  - RLS enabled on all tables
  - All policies restrict to auth.uid() = user_id
*/

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS bk_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'income', 'expense')),
  subtype text NOT NULL DEFAULT '',
  balance numeric(14,2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_accounts select own"
  ON bk_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_accounts insert own"
  ON bk_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_accounts update own"
  ON bk_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_accounts delete own"
  ON bk_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions
CREATE TABLE IF NOT EXISTS bk_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  amount numeric(14,2) NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'debit' CHECK (type IN ('credit', 'debit')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('cleared', 'pending')),
  account_id uuid REFERENCES bk_accounts(id) ON DELETE SET NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_transactions select own"
  ON bk_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_transactions insert own"
  ON bk_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_transactions update own"
  ON bk_transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_transactions delete own"
  ON bk_transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS bk_bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  last_four text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'checking' CHECK (type IN ('checking', 'savings', 'credit', 'other')),
  balance numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_bank_accounts select own"
  ON bk_bank_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_bank_accounts insert own"
  ON bk_bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_bank_accounts update own"
  ON bk_bank_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_bank_accounts delete own"
  ON bk_bank_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bank Transactions (raw imported)
CREATE TABLE IF NOT EXISTS bk_bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_account_id uuid REFERENCES bk_bank_accounts(id) ON DELETE SET NULL,
  date date NOT NULL,
  description text NOT NULL DEFAULT '',
  amount numeric(14,2) NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'debit' CHECK (type IN ('credit', 'debit')),
  status text NOT NULL DEFAULT 'uncategorized' CHECK (status IN ('categorized', 'uncategorized')),
  category text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_bank_transactions select own"
  ON bk_bank_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_bank_transactions insert own"
  ON bk_bank_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_bank_transactions update own"
  ON bk_bank_transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_bank_transactions delete own"
  ON bk_bank_transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Journal Entries
CREATE TABLE IF NOT EXISTS bk_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL DEFAULT '',
  debit_account_id uuid REFERENCES bk_accounts(id) ON DELETE SET NULL,
  credit_account_id uuid REFERENCES bk_accounts(id) ON DELETE SET NULL,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_journal_entries select own"
  ON bk_journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_journal_entries insert own"
  ON bk_journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_journal_entries update own"
  ON bk_journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_journal_entries delete own"
  ON bk_journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Company Settings
CREATE TABLE IF NOT EXISTS bk_company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT '',
  ein_masked text NOT NULL DEFAULT '',
  fiscal_year_end text NOT NULL DEFAULT 'December',
  accounting_method text NOT NULL DEFAULT 'cash' CHECK (accounting_method IN ('cash', 'accrual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bk_company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bk_company_settings select own"
  ON bk_company_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bk_company_settings insert own"
  ON bk_company_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bk_company_settings update own"
  ON bk_company_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS bk_transactions_user_date ON bk_transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS bk_bank_transactions_user_date ON bk_bank_transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS bk_accounts_user_type ON bk_accounts(user_id, type);
