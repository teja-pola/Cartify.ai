import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { fetchWalmartProducts } from '../lib/serpapi'

interface User {
  id: string
  email: string
  full_name?: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  category_id: string
  stock_quantity: number
  rating: number
  review_count: number
  brand: string
  sku?: string
  is_featured?: boolean
}

interface CartItem extends Product {
  quantity: number
  cart_item_id: string
}

interface AppState {
  user: User | null
  products: Product[]
  cartItems: CartItem[]
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  cartifyOpen: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProducts: (products: Product[]) => void
  setCartItems: (items: CartItem[]) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setLoading: (loading: boolean) => void
  setCartifyOpen: (open: boolean) => void
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (cartItemId: string) => void
  updateCartQuantity: (cartItemId: string, quantity: number) => void
  loadProducts: () => Promise<void>
  loadCartItems: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
}

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      products: [],
      cartItems: [],
      searchQuery: '',
      selectedCategory: '',
      isLoading: false,
      cartifyOpen: false,

      setUser: (user) => {
        set({ user })
        if (user) {
          get().loadCartItems()
        } else {
          set({ cartItems: [] })
        }
      },
      setProducts: (products) => set({ products }),
      setCartItems: (cartItems) => set({ cartItems }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setLoading: (isLoading) => set({ isLoading }),
      setCartifyOpen: (cartifyOpen) => set({ cartifyOpen }),

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        if (data.user) {
          const user = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name
          }
          set({ user })
          get().loadCartItems()
        }
      },

      signUp: async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Insert user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email || '',
              full_name: fullName
            })
          
          if (profileError) console.error('Profile creation error:', profileError)
          
          const user = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName
          }
          set({ user })
        }
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        set({ user: null, cartItems: [] })
      },

      addToCart: async (product, quantity) => {
        const { user } = get();
        if (!user) return;

        try {
          // Check if item already exists in the database
          const { data: existingItems, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', product.id);

          if (fetchError) throw fetchError;

          if (existingItems && existingItems.length > 0) {
            // Update quantity
            const existingItem = existingItems[0];
            await get().updateCartQuantity(existingItem.id, existingItem.quantity + quantity);
          } else {
            // Add new item with all product info
            const { data, error } = await supabase
              .from('cart_items')
              .insert({
                user_id: user.id,
                product_id: product.id,
                quantity,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                brand: product.brand,
              })
              .select()
              .single();

            if (error) {
              console.error('Error adding to cart:', error);
              throw error;
            }

            const newCartItem: CartItem = {
              id: data.product_id,
              name: data.name,
              price: data.price,
              image_url: data.image_url,
              brand: data.brand,
              quantity: data.quantity,
              cart_item_id: data.id,
              description: '',
              category_id: '',
              stock_quantity: 100,
              rating: 0,
              review_count: 0,
              sku: undefined,
              is_featured: false,
              original_price: undefined,
            };

            set((state) => ({
              cartItems: [...state.cartItems, newCartItem]
            }));
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      },

      removeFromCart: async (cartItemId) => {
        try {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId)

          if (error) throw error

          set((state) => ({
            cartItems: state.cartItems.filter(item => item.cart_item_id !== cartItemId)
          }))
        } catch (error) {
          console.error('Error removing from cart:', error)
        }
      },

      updateCartQuantity: async (cartItemId, quantity) => {
        try {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId)

          if (error) throw error

          set((state) => ({
            cartItems: state.cartItems.map(item =>
              item.cart_item_id === cartItemId ? { ...item, quantity } : item
            )
          }))
        } catch (error) {
          console.error('Error updating cart quantity:', error)
        }
      },

      loadProducts: async () => {
        set({ isLoading: true });
        try {
          const categories = ['electronics', 'groceries', 'clothing', 'toys', 'kitchen', 'snacks'];
          let allProducts: Product[] = [];
          for (const cat of categories) {
            const products = await fetchWalmartProducts(cat);
            allProducts = allProducts.concat(products.slice(0, 10)); // Take top 20 from each
          }
          // Shuffle the combined array
          allProducts = shuffleArray(allProducts);
          const uniqueProducts = Array.from(
            new Map(allProducts.map(p => [p.id, p])).values()
          );
          set({ products: uniqueProducts });
        } catch (error) {
          console.error('Error loading products:', error);
          set({ products: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      loadCartItems: async () => {
        const { user } = get()
        if (!user) return

        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)

          if (error) throw error

          const cartItems: CartItem[] = (data || []).map((item: any) => ({
            id: item.product_id,
            name: item.name,
            price: item.price,
            image_url: item.image_url,
            brand: item.brand,
            quantity: item.quantity,
            cart_item_id: item.id,
            description: '',
            category_id: '',
            stock_quantity: 100,
            rating: 0,
            review_count: 0,
            sku: undefined,
            is_featured: false,
            original_price: undefined,
          }))

          set({ cartItems })
        } catch (error) {
          console.error('Error loading cart items:', error)
        }
      }
    }),
    {
      name: 'cartify-cart',
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    }
  )
)