import React from 'react'
import { Star, Heart, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  rating: number
  review_count: number
  brand: string
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
  onQuickAdd?: () => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickAdd }) => {
  const { addToCart } = useStore()

  const handleAddToCart = () => {
    addToCart(product, 1)
    if (onQuickAdd) onQuickAdd()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const originalPrice = product.price * 1.25
  const savings = originalPrice - product.price
  const savingsPercent = Math.round((savings / originalPrice) * 100)

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Wishlist Button */}
      <button className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="h-3 w-3 text-gray-600 hover:text-red-500" />
      </button>

      {/* Product Image */}
      <div className="relative h-24 sm:h-32 lg:h-36 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Only {product.stock_quantity} left
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Out of Stock
          </div>
        )}
        {savingsPercent > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Save {savingsPercent}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2">
        {/* Brand */}
        <div className="text-xs text-gray-600 mb-1 font-medium">{product.brand}</div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-[#0071ce] transition-colors cursor-pointer text-xs leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {savingsPercent > 0 && (
              <span className="text-xs text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {savingsPercent > 0 && (
            <div className="text-xs text-green-600 font-bold">
              You save ${savings.toFixed(2)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className={`w-full py-2 px-2 rounded-full font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-1 ${
            product.stock_quantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#0071ce] text-white hover:bg-[#004c91] active:scale-95 shadow'
          }`}
        >
          <Plus className="h-3 w-3" />
          <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>

        {/* Delivery Info */}
        <div className="mt-2 text-xs text-gray-600 text-center">
          <div className="font-semibold text-green-600">Free delivery tomorrow</div>
          <div className="text-[#0071ce] font-medium">Pickup available</div>
        </div>
      </div>
    </div>
  )
}