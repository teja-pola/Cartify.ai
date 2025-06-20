import React from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'

interface CartModalProps {
  onClose: () => void
}

export const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cartItems, updateCartQuantity, removeFromCart, user } = useStore()

  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
    } else {
      updateCartQuantity(cartItemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to continue to checkout')
      return
    }
    // Open checkout in new window/tab
    const checkoutUrl = `/checkout?items=${encodeURIComponent(JSON.stringify(cartItems))}`
    window.open(checkoutUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">Add items to get started</p>
              <button
                onClick={onClose}
                className="bg-[#0071ce] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#004c91] transition-colors font-bold text-base sm:text-lg"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 p-4 sm:p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.brand}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <span className="text-xl sm:text-2xl font-bold text-[#0071ce]">
                        ${((item.price ?? 0).toFixed(2))}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${(((item.price ?? 0) * 1.25).toFixed(2))}
                      </span>
                      <span className="text-sm text-green-600 font-bold">
                        Save {Math.round(20)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:space-y-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, (item.quantity ?? 0) - 1)}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="px-4 sm:px-6 py-2 sm:py-3 font-bold text-base sm:text-lg">{item.quantity ?? 0}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, (item.quantity ?? 0) + 1)}
                        className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.cart_item_id)}
                      className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-lg sm:text-xl font-bold">Subtotal ({cartItemCount} items):</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#0071ce]">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#ffc220] text-black py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold text-base sm:text-lg hover:bg-yellow-300 transition-colors shadow-lg"
              >
                {user ? 'Continue to Checkout' : 'Sign in to Checkout'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border-2 border-[#0071ce] text-[#0071ce] py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}