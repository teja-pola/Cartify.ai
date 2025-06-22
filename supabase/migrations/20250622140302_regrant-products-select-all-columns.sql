-- Grant select, insert, update on all columns in products to anon and authenticated
GRANT SELECT, INSERT, UPDATE ON products TO anon, authenticated;
-- Re-apply permissive RLS policy for safety (will error if already exists, but that's fine for idempotency)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow all for products'
  ) THEN
    CREATE POLICY "Allow all for products" ON products
      FOR ALL
      TO authenticated, anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
