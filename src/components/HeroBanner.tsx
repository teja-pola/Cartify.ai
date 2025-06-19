import React from 'react'

export const HeroBanner: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Main Hero Grid - Responsive Layout */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {/* Main Hero - Mobile */}
          <div className="h-64 sm:h-80 bg-gradient-to-r from-[#0071ce] to-[#004c91] rounded-lg overflow-hidden relative">
            <div className="absolute inset-0">
              <img 
                src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Summer fashion model"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-center">
              <div className="text-white">
                <div className="text-xs sm:text-sm font-medium mb-2">Get faves to your door</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                  Delivery in as<br />fast as 1 hour*
                </h2>
                <button className="bg-white text-[#0071ce] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-gray-50 transition-colors shadow-lg">
                  Shop now
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Cards - Mobile */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="h-40 sm:h-48 bg-gradient-to-br from-red-50 to-blue-50 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/1776930/pexels-photo-1776930.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="July 4th celebration"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-sm sm:text-lg font-bold text-yellow-500 mb-2 leading-tight">
                    Everything for<br />July 4th
                  </h2>
                  <button className="bg-white text-[#0071ce] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors shadow-lg">
                    Shop now
                  </button>
                </div>
              </div>
            </div>

            <div className="h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Jurassic World toys"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-sm sm:text-lg font-bold text-white mb-2">
                    New Jurassic<br />World movie
                  </h2>
                  <button className="bg-white text-[#007ee6] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                    Shop toys
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Left Column - July 4th */}
            <div className="col-span-3 bg-gradient-to-br from-red-50 to-blue-50 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/1776930/pexels-photo-1776930.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="July 4th celebration"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-yellow-500 mb-2 leading-tight">
                    Everything for<br />July 4th
                  </h2>
                  <button className="bg-white text-[#0071ce] px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-lg">
                    Shop now
                  </button>
                </div>
              </div>
            </div>

            {/* Center Large - Main Hero */}
            <div className="col-span-6 bg-gradient-to-r from-[#0071ce] to-[#004c91] rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Summer fashion model"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="text-white max-w-md">
                  <div className="text-sm font-medium mb-2">Get faves to your door</div>
                  <h2 className="text-5xl font-bold mb-6 leading-tight">
                    Delivery in as<br />fast as 1 hour*
                  </h2>
                  <button className="bg-white text-[#0071ce] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">
                    Shop now
                  </button>
                  <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center">
                    <div className="text-[#ffc220] mr-2">⚡</div>
                    <span className="font-bold">Express Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Split into 2 */}
            <div className="col-span-3 space-y-4">
              {/* Top Right - Jurassic World */}
              <div className="h-[290px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Jurassic World toys"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      New Jurassic<br />World movie, 7/2
                    </h2>
                    <button className="bg-white text-[#007ee6] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                      Shop toys & more
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Right - Only at Walmart */}
              <div className="h-[290px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Exclusive fashion"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Only at Walmart<br />—Baby Evie toys<br />& more
                    </h2>
                    <button className="bg-white text-[#007ee6] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                      Shop new arrivals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-12 gap-4 mt-4 h-[300px]">
            {/* Summer Home Trends */}
            <div className="col-span-3 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Summer home decor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Summer home<br />trends
                  </h2>
                  <button className="bg-white text-[#0071ce] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                    Shop home
                  </button>
                </div>
              </div>
            </div>

            {/* Hot New Beauty */}
            <div className="col-span-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Beauty products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Hot, new beauty<br />from $10
                  </h2>
                  <button className="bg-white text-[#0071ce] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                    Shop now
                  </button>
                  <div className="mt-3">
                    <span className="bg-[#0071ce] text-white px-2 py-1 rounded text-xs font-bold">
                      New Arrivals
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Deals */}
            <div className="col-span-3 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Electronics deals"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Up to 35% off
                  </h2>
                  <div className="text-4xl font-bold text-gray-900 mb-4">
                    Flash<br />Deals
                  </div>
                  <button className="bg-white text-[#0071ce] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                    Shop now
                  </button>
                </div>
              </div>
            </div>

            {/* Pet Supplies */}
            <div className="col-span-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0">
                <img 
                  src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Pet supplies"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Save big on<br />hundreds of pet<br />picks!
                  </h2>
                  <button className="bg-white text-[#0071ce] px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-md">
                    Shop now
                  </button>
                  <div className="mt-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Rollbacks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - Large Banner */}
          <div className="mt-4 h-[200px] bg-gradient-to-r from-[#0071ce] to-[#004c91] rounded-lg overflow-hidden relative">
            <div className="absolute inset-0">
              <img 
                src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1400" 
                alt="Grocery delivery"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="relative z-10 p-8 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <h2 className="text-4xl font-bold mb-4">Get groceries & more delivered free</h2>
                <p className="text-xl mb-6">No membership required. Restrictions apply.</p>
                <button className="bg-[#ffc220] text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg">
                  Start shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Second Row */}
        <div className="block lg:hidden mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="h-32 sm:h-40 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0">
              <img 
                src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Beauty products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">
                  Hot, new beauty<br />from $10
                </h2>
                <button className="bg-white text-[#0071ce] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-md">
                  Shop now
                </button>
              </div>
            </div>
          </div>

          <div className="h-32 sm:h-40 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0">
              <img 
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Electronics deals"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
            <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  Up to 35% off
                </h2>
                <div className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Flash Deals
                </div>
                <button className="bg-white text-[#0071ce] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-md">
                  Shop now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Banner */}
        <div className="block lg:hidden mt-4 h-40 sm:h-48 bg-gradient-to-r from-[#0071ce] to-[#004c91] rounded-lg overflow-hidden relative">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Grocery delivery"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="relative z-10 p-4 sm:p-6 h-full flex items-center">
            <div className="text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Get groceries & more delivered free</h2>
              <p className="text-sm sm:text-base mb-4">No membership required. Restrictions apply.</p>
              <button className="bg-[#ffc220] text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-yellow-300 transition-colors shadow-lg">
                Start shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}