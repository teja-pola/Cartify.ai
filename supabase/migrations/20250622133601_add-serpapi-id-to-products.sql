-- Add serpapi_id column to products table
ALTER TABLE products ADD COLUMN serpapi_id text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_serpapi_id ON products(serpapi_id);
