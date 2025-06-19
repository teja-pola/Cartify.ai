import React, { useState, useEffect } from 'react'
import { Bot, X } from 'lucide-react'
import { useStore } from '../store/useStore'

export const FloatingCartifyButton: React.FC = () => {
  const { setCartifyOpen } = useStore()
  const [showTooltip, setShowTooltip] = useState(true)
  const [messages] = useState([
    "🛒 Need help shopping? I'm your AI assistant!",
    "🧠 Tell me your mood, I'll find perfect products!",
    "💰 Shopping on a budget? Let me help you save!"
  ])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    // Show initial tooltip for 4 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false)
    }, 4000)

    // Cycle through messages every 10 seconds
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 4000)
    }, 10000)

    return () => {
      clearTimeout(tooltipTimer)
      clearInterval(messageTimer)
    }
  }, [])

  return (
    <div className="fixed bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 z-40">
      {/* Enhanced Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 bg-white rounded-xl shadow-2xl border-2 border-[#0071ce] p-3 sm:p-4 w-72 sm:w-72 animate-bounce-slow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#0071ce] to-[#004c91] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <p className="text-xs  text-gray-800 font-semibold break-words line-clamp-2">
                {messages[currentMessageIndex]}
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2 p-1"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-0 right-6 sm:right-8 transform translate-y-1/2 rotate-45 w-3 h-3 sm:w-4 sm:h-4 bg-white border-r-2 border-b-2 border-[#0071ce]"></div>
        </div>
      )}

      {/* Modern AI Assistant Button */}
      <button
        onClick={() => setCartifyOpen(true)}
        className="bg-gradient-to-r from-[#0071ce] to-[#004c91] text-white p-3 sm:p-4 lg:p-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative group border-2 border-white"
      >
        {/* Animated pulse rings */}
        <div className="absolute inset-0 bg-[#0071ce] rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 bg-[#0071ce] rounded-full animate-ping opacity-10 animation-delay-1000"></div>
        
        {/* Bot Icon */}
        <Bot className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 relative z-10" />
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
      </button>
    </div>
  )
}