import React, { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Lock, Truck, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export const CheckoutPage: React.FC = () => {
  const { cartItems, user, setCartItems } = useStore()
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
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // If there's no user or the cart is empty, redirect to home
    if (!user || cartItems.length === 0) {
      navigate('/')
    }
  }, [user, cartItems, navigate])

  useEffect(() => {
    if (paymentSuccess) {
      setCartItems([]);
      if (window.localStorage) {
        window.localStorage.removeItem('cartify-cart');
      }
    }
  }, [paymentSuccess, setCartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 35 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return;
    setIsProcessing(true)
    // Simulate payment processing delay
    setTimeout(async () => {
      // Save order to Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'paid',
        })
        .select()
        .single()
      if (!error && order) {
        setOrderId(order.id)
        // Fetch a valid category_id for new products
        let categoryId: string | null = null;
        const { data: defaultCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'Grocery & Essentials')
          .single();
        if (defaultCategory?.id) {
          categoryId = defaultCategory.id;
        } else {
          // fallback: get the first available category
          const { data: anyCategory } = await supabase
            .from('categories')
            .select('id')
            .limit(1)
            .single();
          categoryId = anyCategory?.id || null;
        }
        const orderItems = [];
        for (const item of cartItems) {
          // Try to find the product by serpapi_id
          let { data: existing, error: findError } = await supabase
            .from('products')
            .select('id')
            .eq('serpapi_id', item.id)
            .single();
          let productId;
          if (findError || !existing) {
            // Insert the product if not found
            const { data: newProduct, error: insertError } = await supabase
              .from('products')
              .insert({
                serpapi_id: item.id, // store SerpAPI product id here
                name: item.name,
                description: item.description || item.name,
                price: item.price,
                image_url: item.image_url,
                category_id: categoryId, // always use a valid category_id
                stock_quantity: item.stock_quantity ?? 100,
                rating: item.rating ?? 0,
                review_count: item.review_count ?? 0,
                brand: item.brand || 'Walmart',
              })
              .select('id')
              .single();
            if (insertError) {
              alert('Failed to save product: ' + item.name)
              setIsProcessing(false)
              return;
            }
            productId = newProduct.id;
          } else {
            productId = existing.id;
          }
          orderItems.push({
            order_id: order.id,
            product_id: productId,
            quantity: item.quantity,
            price: item.price,
          });
        }
        await supabase.from('order_items').insert(orderItems)
        // Delete all cart_items for this user after successful checkout
        await supabase.from('cart_items').delete().eq('user_id', user.id);
        setPaymentSuccess(true)
      } else {
        alert('Payment failed. Please try again!')
      }
      setIsProcessing(false)
    }, 1500)
  }

  if (paymentSuccess && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#0071ce] mb-2">Payment Successful!</h2>
          <p className="text-gray-700 mb-4 text-center">Thank you for your purchase. Your order has been placed and is being processed.</p>
          <div className="w-full border-t pt-4 mt-4">
            <h3 className="font-bold text-lg mb-2">Order Summary</h3>
            <ul className="mb-2">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-base">
              <span>Total:</span>
              <span className="text-[#0071ce]">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-[#ffc220] text-black py-2 px-4 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors shadow"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
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
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}