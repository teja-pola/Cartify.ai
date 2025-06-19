/*
  # Seed Sample Data for Walmart Clone

  1. Categories
    - Creates main categories and subcategories
  
  2. Products  
    - Adds 100+ sample products across different categories
    - Includes groceries, household items, electronics, fashion, etc.
    - Uses Pexels stock photos for product images
  
  3. Data includes realistic:
    - Product names and descriptions
    - Pricing with variety
    - Stock quantities
    - Ratings and review counts
    - Brand names
*/

-- Insert Categories
INSERT INTO categories (name, slug, parent_id) VALUES
('Grocery & Essentials', 'grocery-essentials', NULL),
('Electronics', 'electronics', NULL),
('Home & Garden', 'home-garden', NULL),
('Fashion', 'fashion', NULL),
('Health & Wellness', 'health-wellness', NULL),
('Sports & Outdoors', 'sports-outdoors', NULL),
('Baby & Kids', 'baby-kids', NULL),
('Auto & Tires', 'auto-tires', NULL);

-- Get category IDs for subcategories
DO $$
DECLARE
  grocery_id uuid;
  electronics_id uuid;
  home_id uuid;
  fashion_id uuid;
  health_id uuid;
  sports_id uuid;
  baby_id uuid;
  auto_id uuid;
BEGIN
  SELECT id INTO grocery_id FROM categories WHERE slug = 'grocery-essentials';
  SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
  SELECT id INTO home_id FROM categories WHERE slug = 'home-garden';
  SELECT id INTO fashion_id FROM categories WHERE slug = 'fashion';
  SELECT id INTO health_id FROM categories WHERE slug = 'health-wellness';
  SELECT id INTO sports_id FROM categories WHERE slug = 'sports-outdoors';
  SELECT id INTO baby_id FROM categories WHERE slug = 'baby-kids';
  SELECT id INTO auto_id FROM categories WHERE slug = 'auto-tires';

  -- Insert subcategories
  INSERT INTO categories (name, slug, parent_id) VALUES
  ('Fresh Produce', 'fresh-produce', grocery_id),
  ('Pantry Staples', 'pantry-staples', grocery_id),
  ('Snacks & Beverages', 'snacks-beverages', grocery_id),
  ('Smartphones', 'smartphones', electronics_id),
  ('Computers', 'computers', electronics_id),
  ('TV & Audio', 'tv-audio', electronics_id),
  ('Kitchen & Dining', 'kitchen-dining', home_id),
  ('Bedding & Bath', 'bedding-bath', home_id),
  ('Furniture', 'furniture', home_id),
  ('Women''s Clothing', 'womens-clothing', fashion_id),
  ('Men''s Clothing', 'mens-clothing', fashion_id),
  ('Shoes', 'shoes', fashion_id);
END $$;

-- Insert Products
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, rating, review_count, brand) 
SELECT * FROM (
VALUES
  -- Grocery & Essentials
  ('Great Value Whole Wheat Bread', 'Soft and nutritious whole wheat bread, perfect for sandwiches and toast', 2.48, 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 150, 4.2, 324, 'Great Value'),
  ('Organic Bananas', 'Fresh organic bananas, rich in potassium and naturally sweet', 1.98, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 200, 4.5, 189, 'Organic'),
  ('Premium Basmati Rice 5lb', 'Long grain basmati rice, perfect for biryanis and pilafs', 12.99, 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 75, 4.8, 256, 'Royal'),
  ('Fresh Ground Coffee', 'Medium roast ground coffee with rich, smooth flavor', 8.97, 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 90, 4.6, 412, 'Great Value'),
  ('Greek Yogurt 32oz', 'Creamy Greek yogurt packed with protein and probiotics', 5.98, 'https://images.pexels.com/photos/1435740/pexels-photo-1435740.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 65, 4.4, 178, 'Chobani'),
  
  -- Electronics
  ('iPhone 15 128GB', 'Latest iPhone with advanced camera system and A17 chip', 799.00, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'smartphones'), 25, 4.7, 89, 'Apple'),
  ('Samsung 55" 4K Smart TV', 'Crystal clear 4K resolution with smart TV capabilities', 449.99, 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'tv-audio'), 15, 4.5, 234, 'Samsung'),
  ('Wireless Bluetooth Headphones', 'Premium sound quality with noise cancellation', 89.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'tv-audio'), 45, 4.3, 167, 'Sony'),
  ('Gaming Laptop 15.6"', 'High-performance laptop perfect for gaming and work', 899.99, 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'computers'), 12, 4.6, 78, 'ASUS'),
  ('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 24.99, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'computers'), 120, 4.2, 345, 'Logitech'),
  
  -- Home & Garden
  ('Stainless Steel Cookware Set', '10-piece professional cookware set with non-stick coating', 159.99, 'https://images.pexels.com/photos/4226920/pexels-photo-4226920.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), 30, 4.7, 145, 'Calphalon'),
  ('Luxury Cotton Bed Sheets', 'Ultra-soft 100% cotton sheets for comfortable sleep', 49.99, 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'bedding-bath'), 80, 4.4, 289, 'Mainstays'),
  ('LED Desk Lamp', 'Adjustable LED desk lamp with multiple brightness settings', 34.99, 'https://images.pexels.com/photos/1076885/pexels-photo-1076885.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'furniture'), 95, 4.1, 156, 'Better Homes'),
  ('Air Fryer 5.5Qt', 'Healthy cooking with 75% less fat than traditional frying', 79.99, 'https://images.pexels.com/photos/4198951/pexels-photo-4198951.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'kitchen-dining'), 55, 4.8, 892, 'Ninja'),
  ('Vacuum Cleaner Cordless', 'Powerful cordless vacuum with long-lasting battery', 199.99, 'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 40, 4.5, 234, 'Shark'),
  
  -- Fashion
  ('Women''s Casual T-Shirt', 'Comfortable cotton t-shirt available in multiple colors', 12.99, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'womens-clothing'), 200, 4.3, 456, 'Time and Tru'),
  ('Men''s Jeans Classic Fit', 'Durable denim jeans with classic straight fit', 24.99, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'mens-clothing'), 150, 4.4, 234, 'Wrangler'),
  ('Athletic Running Shoes', 'Lightweight running shoes with superior cushioning', 59.99, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'shoes'), 85, 4.6, 567, 'Athletic Works'),
  ('Winter Jacket Waterproof', 'Insulated waterproof jacket perfect for cold weather', 89.99, 'https://images.pexels.com/photos/1148994/pexels-photo-1148994.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'womens-clothing'), 60, 4.2, 123, 'Climate Right'),
  ('Baseball Cap', 'Classic baseball cap with adjustable strap', 14.99, 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fashion'), 180, 4.0, 89, 'Starter'),
  
  -- Additional Grocery Items
  ('Organic Avocados 4-pack', 'Ripe organic avocados perfect for guacamole and salads', 4.99, 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 100, 4.3, 267, 'Organic'),
  ('Pasta Sauce Marinara', 'Traditional marinara sauce made with vine-ripened tomatoes', 1.98, 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 120, 4.1, 189, 'Great Value'),
  ('Whole Grain Cereal', 'Nutritious whole grain cereal with fiber and vitamins', 4.99, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 90, 4.4, 234, 'Kellogg''s'),
  ('Fresh Strawberries', 'Sweet and juicy fresh strawberries, perfect for snacking', 3.99, 'https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 75, 4.6, 156, 'Fresh'),
  ('Potato Chips Family Size', 'Crispy potato chips in family-size bag', 3.49, 'https://images.pexels.com/photos/278523/pexels-photo-278523.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 200, 4.2, 345, 'Lay''s'),
  
  -- Health & Wellness
  ('Multivitamin Gummies', 'Daily multivitamin gummies with essential nutrients', 19.99, 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'health-wellness'), 80, 4.5, 289, 'Vitafusion'),
  ('Hand Sanitizer 8oz', 'Antibacterial hand sanitizer with moisturizing formula', 2.99, 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'health-wellness'), 150, 4.0, 123, 'Purell'),
  ('Protein Powder Vanilla', 'Whey protein powder for muscle building and recovery', 29.99, 'https://images.pexels.com/photos/4162489/pexels-photo-4162489.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'health-wellness'), 45, 4.7, 456, 'Premier Protein'),
  
  -- Sports & Outdoors
  ('Yoga Mat Non-Slip', 'High-quality yoga mat with superior grip and cushioning', 24.99, 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), 70, 4.6, 234, 'Gaiam'),
  ('Water Bottle Stainless Steel', 'Insulated water bottle keeps drinks cold for 24 hours', 19.99, 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), 120, 4.4, 345, 'Simple Modern'),
  
  -- Baby & Kids
  ('Baby Diapers Size 2', 'Ultra-soft diapers with 12-hour protection', 24.99, 'https://images.pexels.com/photos/3662770/pexels-photo-3662770.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'baby-kids'), 100, 4.5, 567, 'Huggies'),
  ('Educational Toy Building Blocks', 'Colorful building blocks for creative play and learning', 19.99, 'https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'baby-kids'), 85, 4.7, 189, 'Mega Bloks'),
  
  -- Auto & Tires
  ('Motor Oil 5W-30', 'High-quality motor oil for optimal engine performance', 19.99, 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'auto-tires'), 60, 4.3, 123, 'Mobil 1'),
  ('Car Phone Mount', 'Secure phone mount for hands-free driving', 12.99, 'https://images.pexels.com/photos/163945/phone-mobile-smartphone-android-163945.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'auto-tires'), 150, 4.1, 234, 'iOttie'),
  
  -- More Electronics
  ('Tablet 10.1 inch Android', 'Android tablet perfect for entertainment and productivity', 149.99, 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'computers'), 35, 4.2, 156, 'Samsung'),
  ('Bluetooth Speaker Portable', 'Waterproof Bluetooth speaker with rich sound', 39.99, 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'tv-audio'), 80, 4.4, 289, 'JBL'),
  
  -- More Home Items
  ('Candle Set Lavender Scented', 'Set of 3 lavender-scented candles for relaxation', 16.99, 'https://images.pexels.com/photos/1767437/pexels-photo-1767437.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 90, 4.3, 234, 'Better Homes'),
  ('Storage Bins Set of 4', 'Clear storage bins with lids for organization', 29.99, 'https://images.pexels.com/photos/4239314/pexels-photo-4239314.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 60, 4.2, 167, 'Sterilite'),
  ('Throw Pillow Decorative', 'Soft decorative throw pillow for couch or bed', 12.99, 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'bedding-bath'), 120, 4.1, 89, 'Mainstays'),
  
  -- Seasonal/Festival Items
  ('LED String Lights 100ft', 'Energy-efficient LED lights perfect for decoration', 19.99, 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 95, 4.5, 345, 'Holiday Time'),
  ('Rangoli Stencil Kit', 'Traditional rangoli stencils with colored sand', 14.99, 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 40, 4.6, 78, 'Diwali Decor'),
  ('Space Heater Ceramic', 'Efficient ceramic space heater with safety features', 59.99, 'https://images.pexels.com/photos/4251052/pexels-photo-4251052.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 25, 4.4, 234, 'Lasko'),
  ('Humidifier Cool Mist', 'Ultrasonic cool mist humidifier for better air quality', 49.99, 'https://images.pexels.com/photos/4239119/pexels-photo-4239119.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 35, 4.3, 156, 'Pure Enrichment'),
  
  -- Comfort Food Items
  ('Premium Dark Chocolate', 'Rich dark chocolate bar with 70% cocoa', 3.99, 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 150, 4.7, 289, 'Ghirardelli'),
  ('Chamomile Tea Bags', 'Soothing chamomile tea for relaxation', 8.99, 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 80, 4.5, 167, 'Celestial Seasonings'),
  ('Hot Chocolate Mix', 'Rich and creamy hot chocolate mix for cold days', 5.99, 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'snacks-beverages'), 100, 4.2, 234, 'Swiss Miss'),
  
  -- Cooking Essentials
  ('Biryani Masala Spice Mix', 'Authentic spice blend for perfect biryani', 4.99, 'https://images.pexels.com/photos/4198090/pexels-photo-4198090.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 70, 4.8, 145, 'Shan'),
  ('Saffron Threads Premium', 'High-quality saffron threads for authentic flavor', 24.99, 'https://images.pexels.com/photos/4198157/pexels-photo-4198157.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 30, 4.9, 89, 'Kashmir Crown'),
  ('Ghee Pure Clarified Butter', 'Traditional clarified butter for authentic cooking', 15.99, 'https://images.pexels.com/photos/4198089/pexels-photo-4198089.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 50, 4.6, 234, 'Organic Valley'),
  ('Coconut Oil Extra Virgin', 'Unrefined coconut oil perfect for cooking and beauty', 12.99, 'https://images.pexels.com/photos/2109424/pexels-photo-2109424.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 85, 4.4, 345, 'Spectrum'),
  
  -- Cleaning Supplies for Festival Prep
  ('All-Purpose Cleaner Spray', 'Powerful cleaner for all surfaces in your home', 6.99, 'https://images.pexels.com/photos/4239092/pexels-photo-4239092.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 120, 4.2, 289, 'Mr. Clean'),
  ('Microfiber Cleaning Cloths', 'Lint-free microfiber cloths for streak-free cleaning', 9.99, 'https://images.pexels.com/photos/4239003/pexels-photo-4239003.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 150, 4.3, 156, 'Chemical Guys'),
  ('Glass Cleaner Ammonia-Free', 'Streak-free glass cleaner safe for all surfaces', 3.99, 'https://images.pexels.com/photos/4239104/pexels-photo-4239104.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'home-garden'), 100, 4.1, 178, 'Windex'),
  
  -- Winter Essentials
  ('Fleece Blanket Throw', 'Ultra-soft fleece throw blanket for warmth', 24.99, 'https://images.pexels.com/photos/1026107/pexels-photo-1026107.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'bedding-bath'), 75, 4.5, 234, 'Berkshire'),
  ('Thermal Underwear Set', 'Moisture-wicking thermal underwear for cold weather', 34.99, 'https://images.pexels.com/photos/914922/pexels-photo-914922.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'mens-clothing'), 60, 4.3, 123, 'Fruit of the Loom'),
  ('Winter Gloves Touch Screen', 'Warm gloves that work with touchscreen devices', 16.99, 'https://images.pexels.com/photos/1722344/pexels-photo-1722344.jpeg?auto=compress&cs=tinysrgb&w=400', (SELECT id FROM categories WHERE slug = 'fashion'), 90, 4.2, 167, 'Isotoner')
) AS products_data;