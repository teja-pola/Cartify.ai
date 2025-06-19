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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
              <div className="h-32 sm:h-40 lg:h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 sm:h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No products found</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            {searchQuery ? `No results for "${searchQuery}"` : 'No products available in this category'}
          </p>
          <div className="text-xs sm:text-sm text-gray-500">
            Try adjusting your search or browse our categories
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}