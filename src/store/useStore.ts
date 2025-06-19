import { create } from 'zustand'
import { supabase } from '../lib/supabase'

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

export const useStore = create<AppState>((set, get) => ({
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
    const { user } = get()
    if (!user) return

    try {
      // First, ensure cart is loaded from database
      await get().loadCartItems()
      
      // Check if item already exists in cart after loading
      const existingItem = get().cartItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity
        await get().updateCartQuantity(existingItem.cart_item_id, existingItem.quantity + quantity)
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity
          })
          .select()
          .single()

        if (error) {
          console.error('Error adding to cart:', error)
          throw error
        }

        const newCartItem: CartItem = {
          ...product,
          quantity,
          cart_item_id: data.id
        }

        set((state) => ({
          cartItems: [...state.cartItems, newCartItem]
        }))
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
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
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ products: data || [] })
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  loadCartItems: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        ...item.products,
        quantity: item.quantity,
        cart_item_id: item.id
      }))

      set({ cartItems })
    } catch (error) {
      console.error('Error loading cart items:', error)
    }
  }
}))