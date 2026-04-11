/*
  # Create service_orders table (v2 - safe)

  Adds missing columns and indexes if the table partially exists.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'service_orders'
  ) THEN
    CREATE TABLE service_orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
      rainc_company_id text,
      services jsonb NOT NULL DEFAULT '[]',
      status text NOT NULL DEFAULT 'pending',
      rainc_response jsonb,
      error_message text,
      total_amount numeric(10, 2) NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'service_orders' AND indexname = 'service_orders_user_id_idx'
  ) THEN
    CREATE INDEX service_orders_user_id_idx ON service_orders(user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'service_orders' AND indexname = 'service_orders_status_idx'
  ) THEN
    CREATE INDEX service_orders_status_idx ON service_orders(status);
  END IF;
END $$;
