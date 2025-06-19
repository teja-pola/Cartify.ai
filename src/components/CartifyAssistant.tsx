import React, { useState, useRef, useEffect } from 'react'
import { X, Mic, Send, ShoppingCart, Trash2, Plus, Minus, Bot, Sparkles, MicOff } from 'lucide-react'
import { useStore } from '../store/useStore'

interface CartifyProduct {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  reason?: string
}

interface QuickOption {
  id: string
  title: string
  description: string
  icon: string
}

export const CartifyAssistant: React.FC = () => {
  const { cartifyOpen, setCartifyOpen, addToCart, products } = useStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', content: string }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestedProducts, setSuggestedProducts] = useState<CartifyProduct[]>([])
  const [isListening, setIsListening] = useState(false)
  const [showQuickOptions, setShowQuickOptions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickOptions: QuickOption[] = [
    {
      id: 'biryani',
      title: 'Cook Hyderabadi Biryani',
      description: 'Get all ingredients for authentic biryani',
      icon: '🍛'
    },
    {
      id: 'mood-boost',
      title: 'Feeling Low - Pick Me Up',
      description: 'Comfort items under $50',
      icon: '💝'
    },
    {
      id: 'diwali-prep',
      title: 'Diwali Preparation',
      description: 'Cleaning & decoration essentials',
      icon: '🪔'
    },
    {
      id: 'winter-prep',
      title: 'Winter Home Prep',
      description: 'Keep your home warm & cozy',
      icon: '❄️'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (cartifyOpen) {
      setMessages([
        {
          type: 'bot',
          content: "Hi! I'm Cartify, your AI shopping assistant! 🛒✨\n\nI understand your needs, mood, and budget to find perfect products for you.\n\nChoose a quick option below or tell me what you need!"
        }
      ])
      setShowQuickOptions(true)
      setSuggestedProducts([])
    }
  }, [cartifyOpen])

  const handleQuickOption = (optionId: string) => {
    const option = quickOptions.find(opt => opt.id === optionId)
    if (option) {
      setInput(option.title)
      setShowQuickOptions(false)
      handleSendMessage(option.title)
    }
  }

  // Enhanced product search function
  const searchProducts = (query: string): CartifyProduct[] => {
    const queryLower = query.toLowerCase()
    const searchTerms = queryLower.split(' ')
    
    // Score products based on relevance
    const scoredProducts = products.map(product => {
      let score = 0
      const productText = `${product.name} ${product.description} ${product.brand}`.toLowerCase()
      
      // Exact phrase match gets highest score
      if (productText.includes(queryLower)) {
        score += 10
      }
      
      // Individual term matches
      searchTerms.forEach(term => {
        if (productText.includes(term)) {
          score += 3
        }
        if (product.name.toLowerCase().includes(term)) {
          score += 5 // Name matches are more important
        }
      })
      
      return { product, score }
    })
    
    // Filter and sort by score
    const relevantProducts = scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6) // Limit to 6 products
      .map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url,
        quantity: 1,
        reason: `Matches your search for "${query}"`
      }))
    
    return relevantProducts
  }

  // Enhanced AI processing with real product search
  const processWithAI = async (input: string): Promise<CartifyProduct[]> => {
    const inputLower = input.toLowerCase()
    
    // First try to find products using search
    let foundProducts = searchProducts(input)
    
    // If no products found, try category-based search
    if (foundProducts.length === 0) {
      const categoryKeywords = {
        'food': ['rice', 'bread', 'milk', 'chocolate', 'tea', 'coffee'],
        'electronics': ['phone', 'tv', 'laptop', 'headphones', 'tablet'],
        'home': ['candle', 'blanket', 'heater', 'vacuum', 'sheets'],
        'beauty': ['cream', 'mascara', 'lotion'],
        'clothing': ['shirt', 'jeans', 'shoes', 'jacket']
      }
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => inputLower.includes(keyword))) {
          foundProducts = products
            .filter(product => 
              keywords.some(keyword => 
                product.name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword)
              )
            )
            .slice(0, 4)
            .map(product => ({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
              reason: `Perfect for ${category} needs`
            }))
          break
        }
      }
    }
    
    // If still no products, show popular items
    if (foundProducts.length === 0) {
      foundProducts = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: 1,
          reason: 'Popular item you might like'
        }))
    }
    
    return foundProducts
  }

  const handleSendMessage = async (customInput?: string) => {
    const userMessage = customInput || input.trim()
    if (!userMessage) return

    setInput('')
    setIsProcessing(true)
    setShowQuickOptions(false)

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get product suggestions using AI
      const suggestions = await processWithAI(userMessage)
      setSuggestedProducts(suggestions)

      const totalCost = suggestions.reduce((sum, p) => sum + (p.price * p.quantity), 0)
      
      let response = `Perfect! I found ${suggestions.length} items that match your needs:\n\n`
      
      suggestions.forEach((product, index) => {
        response += `${index + 1}. ${product.name} - $${product.price.toFixed(2)}\n   ${product.reason}\n\n`
      })

      response += `💰 Total: $${totalCost.toFixed(2)}\n\nYou can adjust quantities or remove items you don't need. Click "Add All to Cart" when ready!`

      // Add bot response
      setMessages(prev => [...prev, { type: 'bot', content: response }])
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error processing your request. Please try again!' 
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    setIsListening(true)
    recognition.start()

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSuggestedProducts(prev => prev.filter(p => p.id !== productId))
    } else {
      setSuggestedProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, quantity: newQuantity } : p)
      )
    }
  }

  const removeProduct = (productId: string) => {
    setSuggestedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const addAllToCart = () => {
    suggestedProducts.forEach(product => {
      // Find the actual product from our products store
      const fullProduct = products.find(p => p.id === product.id)
      if (fullProduct) {
        addToCart(fullProduct, product.quantity)
      }
    })
    
    setMessages(prev => [...prev, { 
      type: 'bot', 
      content: `🎉 Perfect! I've added all ${suggestedProducts.length} items to your cart. Happy shopping! 🛒✨\n\nIs there anything else I can help you find?` 
    }])
    setSuggestedProducts([])
    setShowQuickOptions(true)
  }

  if (!cartifyOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-6xl h-[95vh] sm:h-[85vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#0071ce]">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#0071ce] to-[#004c91] text-white p-4 sm:p-6 lg:p-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Cartify AI Assistant</h2>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Your intelligent shopping companion</p>
            </div>
          </div>
          <button
            onClick={() => setCartifyOpen(false)}
            className="p-2 sm:p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl whitespace-pre-line shadow-lg text-sm sm:text-base ${
                      message.type === 'user'
                        ? 'bg-[#0071ce] text-white'
                        : 'bg-white text-gray-900 border-2 border-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Quick Options */}
              {showQuickOptions && messages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {quickOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleQuickOption(option.id)}
                      className="p-3 sm:p-4 lg:p-6 border-2 sm:border-3 border-gray-200 rounded-xl sm:rounded-2xl hover:border-[#0071ce] hover:bg-blue-50 transition-all text-left group shadow-lg bg-white"
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <span className="text-xl sm:text-2xl lg:text-3xl">{option.icon}</span>
                        <div>
                          <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 group-hover:text-[#0071ce]">
                            {option.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#0071ce] animate-spin" />
                      <span className="text-sm text-gray-600 font-medium">Cartify is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Input Section */}
            <div className="border-t bg-white p-3 sm:p-4 lg:p-6 flex-shrink-0 shadow-lg">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tell me what you need... (e.g., 'I want to cook biryani under $50')"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-sm sm:text-base lg:text-lg"
                    disabled={isProcessing}
                  />
                </div>
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening || isProcessing}
                  className={`p-3 sm:p-4 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isProcessing}
                  className="bg-[#0071ce] text-white p-3 sm:p-4 rounded-full hover:bg-[#004c91] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Products Panel */}
          {suggestedProducts.length > 0 && (
            <div className="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l bg-gray-50 flex flex-col max-h-96 lg:max-h-none">
              <div className="p-4 sm:p-6 border-b bg-white flex-shrink-0">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900">Suggested Products</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Total: ${suggestedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                {suggestedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-4 relative shadow-lg">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-16 sm:h-20 lg:h-24 object-cover rounded-lg mb-3"
                    />
                    
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 mb-2 pr-6 sm:pr-8">
                      {product.name}
                    </h4>
                    
                    {product.reason && (
                      <p className="text-xs text-gray-600 mb-3">{product.reason}</p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-[#0071ce] text-sm sm:text-base lg:text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="text-sm font-bold px-2">{product.quantity}</span>
                        <button
                          onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 sm:p-6 border-t bg-white flex-shrink-0">
                <button
                  onClick={addAllToCart}
                  className="w-full bg-[#ffc220] text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg text-sm sm:text-base lg:text-lg"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <span>Add All to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}