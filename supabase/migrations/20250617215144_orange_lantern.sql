/*
  # Complete Database Setup for Walmart Clone with Cartify AI

  1. New Tables
    - `users` - User profiles extending Supabase auth
    - `categories` - Product categories
    - `products` - Product catalog
    - `cart_items` - Shopping cart items
    - `orders` - Order records
    - `order_items` - Individual order line items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for products and categories

  3. Sample Data
    - 10 product categories
    - 25+ products including special items for Cartify AI scenarios
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create categories table (matching existing schema)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Create products table (matching existing schema exactly)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  category_id uuid REFERENCES categories(id),
  stock_quantity integer DEFAULT 0,
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  brand text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (only if not already enabled)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'users' AND rowsecurity = true
  ) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'categories' AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'products' AND rowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'cart_items' AND rowsecurity = true
  ) THEN
    ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'orders' AND rowsecurity = true
  ) THEN
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'order_items' AND rowsecurity = true
  ) THEN
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies (with conflict handling)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Categories are viewable by everyone'
  ) THEN
    CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT TO public USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Products are viewable by everyone'
  ) THEN
    CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT TO public USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'cart_items' AND policyname = 'Users can manage their own cart items'
  ) THEN
    CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Users can view their own orders'
  ) THEN
    CREATE POLICY "Users can view their own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Users can create orders'
  ) THEN
    CREATE POLICY "Users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Users can view order items for their orders'
  ) THEN
    CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
  END IF;
END $$;

-- Create indexes (with conflict handling)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Insert sample categories (matching existing schema)
INSERT INTO categories (name, slug) VALUES
('Departments', 'departments'),
('Grocery & Essentials', 'grocery-essentials'),
('Fashion', 'fashion'),
('Home', 'home'),
('Electronics', 'electronics'),
('Auto & Tires', 'auto-tires'),
('Pharmacy', 'pharmacy'),
('Beauty', 'beauty'),
('Sports & Outdoors', 'sports-outdoors'),
('Toys', 'toys')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products (matching existing schema - no original_price, sku, is_featured)
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, rating, review_count, brand) VALUES
-- Grocery items
('Great Value Whole Milk, 1 Gallon', 'Fresh whole milk from local farms', 3.48, 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 50, 4.5, 1250, 'Great Value'),
('Bananas, 3 lbs', 'Fresh yellow bananas', 1.48, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 100, 4.3, 890, 'Fresh'),
('Wonder Bread Classic White', 'Soft white sandwich bread', 1.28, 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 75, 4.2, 567, 'Wonder'),
('Coca-Cola, 12 Pack Cans', 'Classic Coca-Cola 12 oz cans', 5.98, 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 200, 4.7, 2340, 'Coca-Cola'),

-- Electronics
('Apple iPhone 15 Pro, 128GB', 'Latest iPhone with A17 Pro chip', 999.00, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', (SELECT id FROM categories WHERE slug = 'electronics'), 25, 4.8, 1567, 'Apple'),
('Samsung 55" 4K Smart TV', '55-inch 4K UHD Smart TV with HDR', 398.00, 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg', (SELECT id FROM categories WHERE slug = 'electronics'), 15, 4.6, 890, 'Samsung'),
('Apple AirPods Pro (2nd Gen)', 'Wireless earbuds with active noise cancellation', 199.00, 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg', (SELECT id FROM categories WHERE slug = 'electronics'), 40, 4.7, 2100, 'Apple'),

-- Fashion
('Levis 501 Original Jeans', 'Classic straight leg jeans', 59.50, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', (SELECT id FROM categories WHERE slug = 'fashion'), 60, 4.4, 1200, 'Levis'),
('Nike Air Max 270', 'Comfortable running shoes', 130.00, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', (SELECT id FROM categories WHERE slug = 'fashion'), 35, 4.6, 890, 'Nike'),
('Hanes ComfortSoft T-Shirt 6-Pack', 'Soft cotton t-shirts', 24.98, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg', (SELECT id FROM categories WHERE slug = 'fashion'), 80, 4.3, 567, 'Hanes'),

-- Home
('Instant Pot Duo 7-in-1', 'Multi-use pressure cooker', 79.00, 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 30, 4.8, 3400, 'Instant Pot'),
('Dyson V8 Cordless Vacuum', 'Lightweight cordless vacuum cleaner', 299.99, 'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 20, 4.7, 1890, 'Dyson'),
('Better Homes & Gardens Sheets Set', 'Soft microfiber sheet set', 19.97, 'https://images.pexels.com/photos/1026107/pexels-photo-1026107.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 45, 4.2, 678, 'Better Homes & Gardens'),

-- Beauty
('Olay Regenerist Micro-Sculpting Cream', 'Anti-aging moisturizer', 28.97, 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg', (SELECT id FROM categories WHERE slug = 'beauty'), 55, 4.5, 1234, 'Olay'),
('LOreal Paris Mascara', 'Voluminous lash mascara', 8.97, 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg', (SELECT id FROM categories WHERE slug = 'beauty'), 70, 4.4, 890, 'LOreal'),

-- Toys
('LEGO Classic Creative Bricks', 'Building blocks for creative play', 49.97, 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg', (SELECT id FROM categories WHERE slug = 'toys'), 25, 4.8, 567, 'LEGO'),
('Barbie Dreamhouse', 'Multi-story dollhouse with accessories', 199.00, 'https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg', (SELECT id FROM categories WHERE slug = 'toys'), 15, 4.6, 890, 'Barbie'),

-- Additional Grocery Items for Cartify AI scenarios
('Premium Basmati Rice 5lb', 'Long grain aromatic rice perfect for biryani', 12.99, 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 40, 4.6, 234, 'Royal'),
('Biryani Masala Spice Mix', 'Authentic spice blend for biryani', 4.99, 'https://images.pexels.com/photos/4198090/pexels-photo-4198090.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 60, 4.7, 156, 'Shan'),
('Premium Saffron Threads', 'Pure saffron for authentic flavor and color', 24.99, 'https://images.pexels.com/photos/4198157/pexels-photo-4198157.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 25, 4.8, 89, 'Kashmir Crown'),
('Pure Desi Ghee 16oz', 'Traditional clarified butter', 15.99, 'https://images.pexels.com/photos/4198089/pexels-photo-4198089.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 35, 4.5, 167, 'Amul'),

-- Comfort/Mood Items
('Premium Dark Chocolate Bar', 'Rich 70% cocoa dark chocolate', 3.99, 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 80, 4.4, 345, 'Lindt'),
('Chamomile Relaxing Tea', 'Soothing herbal tea for relaxation', 8.99, 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 50, 4.3, 234, 'Celestial Seasonings'),
('Lavender Scented Candle', 'Aromatherapy candle for relaxation', 12.99, 'https://images.pexels.com/photos/1767437/pexels-photo-1767437.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 30, 4.6, 178, 'Yankee Candle'),
('Mindfulness Journal', 'Guided journal for reflection and positivity', 14.99, 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 40, 4.5, 123, 'Moleskine'),

-- Festival/Cleaning Items
('LED String Lights 100ft', 'Warm white LED lights for decoration', 19.99, 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 45, 4.7, 567, 'Brightech'),
('Colorful Rangoli Kit', 'Traditional art supplies for floor decoration', 14.99, 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg', (SELECT id FROM categories WHERE slug = 'toys'), 20, 4.4, 89, 'Arteza'),
('Traditional Clay Diyas Set of 12', 'Handmade clay oil lamps', 9.99, 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 60, 4.8, 234, 'Handicrafts'),

-- Winter Items
('Portable Space Heater', 'Ceramic space heater with safety features', 59.99, 'https://images.pexels.com/photos/4251052/pexels-photo-4251052.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 25, 4.5, 456, 'Lasko'),
('Soft Fleece Blanket', 'Ultra-soft throw blanket', 24.99, 'https://images.pexels.com/photos/1026107/pexels-photo-1026107.jpeg', (SELECT id FROM categories WHERE slug = 'home'), 55, 4.6, 789, 'Bedsure'),
('Premium Hot Chocolate Mix', 'Rich and creamy hot chocolate', 8.99, 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg', (SELECT id FROM categories WHERE slug = 'grocery-essentials'), 70, 4.4, 234, 'Swiss Miss');