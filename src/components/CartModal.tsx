import React from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'

interface CartModalProps {
  onClose: () => void
}

export const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cartItems, updateCartQuantity, removeFromCart, user } = useStore()
  const navigate = useNavigate()

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
    onClose()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-2">
      <div className="bg-white rounded-2xl w-full max-w-screen-sm h-[80vh] max-h-screen flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-14 w-14 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4 text-sm">Add items to get started</p>
              <button
                onClick={onClose}
                className="bg-[#0071ce] text-white px-6 py-2 rounded-full hover:bg-[#004c91] transition-colors font-bold text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-2 border rounded-xl hover:shadow transition-shadow">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{item.brand}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <span className="text-lg font-bold text-[#0071ce]">
                        ${((item.price ?? 0).toFixed(2))}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        ${(((item.price ?? 0) * 1.25).toFixed(2))}
                      </span>
                      <span className="text-xs text-green-600 font-bold">
                        Save {Math.round(20)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:space-y-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, (item.quantity ?? 0) - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 font-bold text-sm">{item.quantity ?? 0}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cart_item_id, (item.quantity ?? 0) + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.cart_item_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold">Subtotal ({cartItemCount} items):</span>
              <span className="text-xl font-bold text-[#0071ce]">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#ffc220] text-black py-2 px-4 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors shadow"
              >
                {user ? 'Continue to Checkout' : 'Sign in to Checkout'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-[#0071ce] text-[#0071ce] py-2 px-4 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
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