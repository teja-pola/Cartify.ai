-- Expose serpapi_id and all columns in products to REST API
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON products TO anon, authenticated;
-- If you have a sequence for id, grant usage (safe even if not present)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'products_id_seq') THEN
    GRANT USAGE, SELECT ON SEQUENCE products_id_seq TO anon, authenticated;
  END IF;
END $$;
