-- Grant select on price column in products to anon and authenticated
GRANT SELECT(price) ON products TO anon, authenticated;
