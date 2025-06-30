-- Allow all actions on products for authenticated and anon users
CREATE POLICY "Allow all for products" ON products
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
