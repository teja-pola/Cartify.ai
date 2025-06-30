-- Grant select on serpapi_id column in products to anon and authenticated
GRANT SELECT(serpapi_id) ON products TO anon, authenticated;
