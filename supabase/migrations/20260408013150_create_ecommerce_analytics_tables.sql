/*
  # Create E-Commerce Analytics Integration Tables

  ## Overview
  Adds tables to support an e-commerce analytics platform that automatically syncs
  business data once a user connects their bank account.

  ## New Tables

  ### `bank_connections`
  Tracks which users have connected bank accounts via Stripe Financial Connections.
  - `id` - primary key
  - `user_id` - links to auth.users
  - `company_id` - links to companies
  - `stripe_account_id` - the Stripe Financial Connections account ID
  - `institution_name` - name of the bank
  - `display_name` - account display name
  - `last4` - last 4 digits of account number
  - `category` - account category (checking, savings, etc.)
  - `status` - connection status (active, disconnected)
  - `synced_at` - last successful sync timestamp
  - `created_at`, `updated_at`

  ### `ecommerce_orders`
  Stores synced e-commerce order data linked to a user's bank transactions.
  - `id` - primary key
  - `user_id` - links to auth.users
  - `company_id` - links to companies
  - `bank_connection_id` - which bank connection this came from
  - `external_order_id` - order ID from external platform
  - `platform` - source platform (shopify, amazon, etsy, stripe, manual, etc.)
  - `customer_name`, `customer_email` - customer info
  - `status` - order status
  - `subtotal`, `tax_amount`, `shipping_amount`, `discount_amount`, `total_amount` - financials in cents
  - `currency`
  - `order_date`
  - `items` - JSONB array of line items
  - `metadata` - flexible extra data
  - `created_at`, `updated_at`

  ### `ecommerce_inventory`
  Stores product/inventory data for e-commerce businesses.
  - `id` - primary key
  - `user_id` - links to auth.users
  - `company_id` - links to companies
  - `external_product_id` - product ID from external platform
  - `platform` - source platform
  - `sku` - stock keeping unit
  - `name` - product name
  - `description`
  - `category`
  - `price`, `cost` - in cents
  - `currency`
  - `quantity_in_stock`
  - `quantity_sold_mtd`, `quantity_sold_ytd` - month/year to date sales
  - `reorder_point` - low stock threshold
  - `status` - (active, inactive, archived)
  - `image_url`
  - `metadata`
  - `created_at`, `updated_at`

  ## Security
  - RLS enabled on all three tables
  - Users can only read/write their own data
  - All policies check `auth.uid() = user_id`
*/

-- ─── bank_connections ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bank_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  stripe_account_id text NOT NULL,
  institution_name text NOT NULL DEFAULT '',
  display_name text,
  last4 text,
  category text NOT NULL DEFAULT 'checking',
  status text NOT NULL DEFAULT 'active',
  balance_current bigint,
  balance_available bigint,
  currency text NOT NULL DEFAULT 'usd',
  synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, stripe_account_id)
);

ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bank connections"
  ON bank_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank connections"
  ON bank_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank connections"
  ON bank_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank connections"
  ON bank_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_company_id ON bank_connections(company_id);

-- ─── ecommerce_orders ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ecommerce_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  bank_connection_id uuid REFERENCES bank_connections(id) ON DELETE SET NULL,
  external_order_id text,
  platform text NOT NULL DEFAULT 'manual',
  customer_name text,
  customer_email text,
  status text NOT NULL DEFAULT 'completed',
  subtotal bigint NOT NULL DEFAULT 0,
  tax_amount bigint NOT NULL DEFAULT 0,
  shipping_amount bigint NOT NULL DEFAULT 0,
  discount_amount bigint NOT NULL DEFAULT 0,
  total_amount bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  order_date timestamptz NOT NULL DEFAULT now(),
  items jsonb NOT NULL DEFAULT '[]',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ecommerce orders"
  ON ecommerce_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ecommerce orders"
  ON ecommerce_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ecommerce orders"
  ON ecommerce_orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ecommerce orders"
  ON ecommerce_orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_user_id ON ecommerce_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_company_id ON ecommerce_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_order_date ON ecommerce_orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_status ON ecommerce_orders(status);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_platform ON ecommerce_orders(platform);

-- ─── ecommerce_inventory ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ecommerce_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  external_product_id text,
  platform text NOT NULL DEFAULT 'manual',
  sku text,
  name text NOT NULL,
  description text,
  category text,
  price bigint NOT NULL DEFAULT 0,
  cost bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  quantity_in_stock integer NOT NULL DEFAULT 0,
  quantity_sold_mtd integer NOT NULL DEFAULT 0,
  quantity_sold_ytd integer NOT NULL DEFAULT 0,
  reorder_point integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active',
  image_url text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ecommerce_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory"
  ON ecommerce_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON ecommerce_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON ecommerce_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON ecommerce_inventory FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ecommerce_inventory_user_id ON ecommerce_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_inventory_company_id ON ecommerce_inventory(company_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_inventory_status ON ecommerce_inventory(status);
CREATE INDEX IF NOT EXISTS idx_ecommerce_inventory_sku ON ecommerce_inventory(sku);
