-- Allow all actions on order_items for authenticated and anon users
CREATE POLICY "Allow all for order_items" ON order_items
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
