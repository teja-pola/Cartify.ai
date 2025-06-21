import React from 'react'
import { ProductCard } from './ProductCard'
import { useStore } from '../store/useStore'

export const ProductGrid: React.FC = () => {
  const { products, isLoading, searchQuery, selectedCategory } = useStore()

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === '' || product.category_id === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-1 sm:px-2 py-2 sm:py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
              <div className="h-28 sm:h-32 lg:h-40 bg-gray-300 rounded-t-lg"></div>
              <div className="p-2 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-1 sm:px-2 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-3xl sm:text-5xl mb-3">🔍</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">No products found</h2>
          <p className="text-gray-600 mb-4 text-xs sm:text-sm">
            {searchQuery ? `No results for "${searchQuery}"` : 'No products available in this category'}
          </p>
          <div className="text-xs text-gray-500">
            Try adjusting your search or browse our categories
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-1 sm:px-2 py-2 sm:py-4">
      <div className="mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}