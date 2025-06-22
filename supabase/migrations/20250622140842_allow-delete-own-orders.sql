-- Allow users to delete their own orders
CREATE POLICY "Allow delete for own orders" ON orders
  FOR DELETE
  TO authenticated, anon
  USING (user_id = auth.uid());
