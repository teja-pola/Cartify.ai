import axios from "axios"; // If you see install errors, try: npm install axios --legacy-peer-deps

export interface SerpApiProduct {
  title: string
  price: number
  thumbnail: string
  link: string
  rating?: number
  reviews?: number
  source?: string
  // ...other fields from SerpAPI
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  stock_quantity: number
  rating: number
  review_count: number
  brand: string
  sku?: string
  is_featured?: boolean
}

export async function fetchWalmartProducts(query: string, page: number = 1): Promise<Product[]> {
  // Call the local proxy server instead of SerpAPI directly
  const url = `http://localhost:5175/api/serpapi?query=${encodeURIComponent(query)}&page=${page}`;
  const response = await axios.get(url);
  const results = response.data?.organic_results || [];
  // Map SerpAPI results to Product interface
  return results.map((item: any, idx: number) => ({
    id: item.product_id || item.position?.toString() || `${page}-${idx}`,
    name: item.title,
    description: item.title,
    price: item.primary_offer?.offer_price ?? 0, // <-- fix here
    image_url: item.thumbnail,
    category_id: item.category_id || 'walmart',
    stock_quantity: item.out_of_stock ? 0 : 100,
    rating: item.rating || 0,
    review_count: item.reviews || 0,
    brand: item.seller_name || 'Walmart',
    sku: item.us_item_id || undefined,
    is_featured: false
  }))
} 