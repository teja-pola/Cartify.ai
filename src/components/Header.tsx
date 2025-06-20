import React, { useState } from 'react'
import { Search, ShoppingCart, User, Menu, MapPin, Heart, ChevronDown, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { AuthModal } from './AuthModal'
import { CartModal } from './CartModal'

export const Header: React.FC = () => {
  const { cartItems, searchQuery, setSearchQuery, user, signOut } = useStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 0)), 0)

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setShowUserMenu(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <>
      <header className="bg-[#0071ce] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Location */}
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="https://images.icon-icons.com/2699/PNG/512/walmart_logo_icon_170230.png" 
                  alt="Walmart Logo" 
                  className="w-6 h-6 sm:w-8 sm:w-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              
              {/* Location - Hidden on mobile */}
              <div className="hidden lg:flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-white" />
                <div>
                  <div className="text-xs text-blue-200">Deliver to</div>
                  <div className="font-semibold text-white">Sacramento, 95829</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-2 sm:mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search everything at Walmart"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-black rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#ffc220] text-sm font-medium"
                />
                <button className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#0071ce] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#004c91] transition-colors">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-blue-700 rounded-full transition-colors"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Reorder - Hidden on mobile */}
              <div className="hidden lg:flex flex-col items-center text-xs cursor-pointer hover:text-[#ffc220] transition-colors">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                <span className="font-medium">Reorder</span>
                <span className="text-blue-200">My Items</span>
              </div>

              {/* Account */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex flex-col items-center text-xs hover:text-[#ffc220] transition-colors"
                >
                  <User className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="font-medium">{user ? 'Account' : 'Sign In'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                  {user && <span className="hidden sm:block text-blue-200 text-xs truncate max-w-16">{user.full_name || 'Account'}</span>}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white text-black rounded-lg shadow-2xl border z-50">
                    <div className="p-4 sm:p-6">
                      {user ? (
                        <>
                          <div className="border-b pb-4 mb-4">
                            <div className="font-bold text-lg text-gray-900">{user.full_name || 'User'}</div>
                            <div className="text-sm text-gray-600 truncate">{user.email}</div>
                          </div>
                          <div className="space-y-2">
                            <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded font-medium">Purchase History</button>
                            <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded font-medium">Walmart+</button>
                            <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded font-medium">Account</button>
                            <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded font-medium">Lists</button>
                            <button className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded font-medium">Registries</button>
                            <hr className="my-3" />
                            <button 
                              onClick={handleSignOut}
                              className="w-full text-left px-3 py-3 hover:bg-red-50 rounded text-red-600 font-medium"
                            >
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <button 
                            onClick={() => handleAuthClick('signin')}
                            className="w-full bg-[#0071ce] text-white py-3 px-4 rounded-full font-bold hover:bg-[#004c91] transition-colors"
                          >
                            Sign In
                          </button>
                          <button 
                            onClick={() => handleAuthClick('signup')}
                            className="w-full border-2 border-[#0071ce] text-[#0071ce] py-3 px-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
                          >
                            Create Account
                          </button>
                          <div className="text-sm text-gray-600 space-y-2 pt-2">
                            <div className="font-medium">• Purchase History</div>
                            <div className="font-medium">• Track an Order</div>
                            <div className="font-medium">• Walmart+</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => setShowCartModal(true)}
                className="relative flex flex-col items-center text-xs hover:text-[#ffc220] transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ffc220] text-black text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="font-bold text-xs sm:text-sm">${cartTotal.toFixed(2)}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-blue-600 py-4">
              <div className="space-y-3">
                <button className="flex items-center space-x-3 w-full text-left py-2 hover:text-[#ffc220] transition-colors">
                  <Menu className="h-4 w-4" />
                  <span>Departments</span>
                </button>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Services</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors font-bold">Grocery & Essentials</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Fashion</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Home</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Electronics</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Auto & Tires</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Pharmacy</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Trending</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Registry</a>
                <a href="#" className="block py-2 hover:text-[#ffc220] transition-colors">Walmart+</a>
              </div>
            </div>
          )}

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 py-3 text-sm border-t border-blue-600">
            <div className="flex items-center space-x-2 hover:text-[#ffc220] transition-colors cursor-pointer font-medium">
              <Menu className="h-4 w-4" />
              <span>Departments</span>
            </div>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Services</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-bold">Grocery & Essentials</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Fashion</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Home</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Electronics</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Auto & Tires</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Pharmacy</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Trending</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Registry</a>
            <a href="#" className="hover:text-[#ffc220] transition-colors font-medium">Walmart+</a>
          </nav>
        </div>
      </header>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      {showCartModal && (
        <CartModal onClose={() => setShowCartModal(false)} />
      )}
    </>
  )
}