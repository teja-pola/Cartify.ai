import React, { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Lock, Truck, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Link, useNavigate } from 'react-router-dom'

export const CheckoutPage: React.FC = () => {
  const { cartItems, user } = useStore()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  })
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  useEffect(() => {
    // If there's no user or the cart is empty, redirect to home
    if (!user || cartItems.length === 0) {
      navigate('/')
    }
  }, [user, cartItems, navigate])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 35 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with Stripe or another payment processor
    alert('Payment processing would be implemented here with Stripe!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-screen-md mx-auto px-2 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="flex items-center space-x-1 text-[#0071ce] hover:text-[#004c91] font-medium text-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Continue Shopping</span>
              </Link>
              <div className="text-lg font-bold text-gray-900">Checkout</div>
            </div>
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto px-2 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-5 w-5 text-[#0071ce]" />
                <h2 className="text-base font-bold text-gray-900">Shipping Information</h2>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                    required
                  />
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow p-3">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="h-5 w-5 text-[#0071ce]" />
                <h2 className="text-base font-bold text-gray-900">Payment Information</h2>
                <Lock className="h-4 w-4 text-green-500" />
              </div>

              <div className="mb-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-2 border rounded-lg font-medium text-xs transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#0071ce] bg-blue-50 text-[#0071ce]'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Credit/Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 p-2 border rounded-lg font-medium text-xs transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-[#0071ce] bg-blue-50 text-[#0071ce]'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    PayPal
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs"
                      required
                    />
                  </div>
                </form>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-6">
                  <div className="text-gray-600 mb-2 text-xs">You will be redirected to PayPal to complete your payment</div>
                  <div className="text-3xl">💳</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-xl shadow p-3 space-y-3">
            <h2 className="text-base font-bold text-gray-900 mb-2">Order Summary</h2>
            <div className="flex items-center justify-between text-xs">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex items-center justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-[#0071ce]">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#ffc220] text-black py-2 px-4 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors shadow"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}