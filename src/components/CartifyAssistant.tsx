import React, { useState, useRef, useEffect } from 'react'
import { X, Mic, Send, ShoppingCart, Trash2, Plus, Minus, Bot, Sparkles, MicOff, BarChart3, MessageSquare, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { AgentAnalyticsTool } from './AgentAnalyticsTool'
import { useNavigate } from 'react-router-dom'

interface CartifyProduct {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  reason?: string
  brand?: string
}

interface QuickOption {
  id: string
  title: string
  description: string
  icon: string
}

export const CartifyAssistant: React.FC = () => {
  const { cartifyOpen, setCartifyOpen, addToCart, products, user } = useStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', content: string }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestedProducts, setSuggestedProducts] = useState<CartifyProduct[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [showQuickOptions, setShowQuickOptions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [viewMode, setViewMode] = useState<'chat' | 'analytics' | 'history'>('chat')
  const [orderHistory, setOrderHistory] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [orderProducts, setOrderProducts] = useState<any[]>([])
  const [isReordering, setIsReordering] = useState(false)
  const navigate = useNavigate();

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
      setViewMode('chat')
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

  useEffect(() => {
    if (viewMode === 'history' && user) {
      (async () => {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (!error && orders) setOrderHistory(orders)
      })()
    }
  }, [viewMode, user])

  useEffect(() => {
    if (selectedOrder) {
      (async () => {
        const { data: items, error } = await supabase
          .from('order_items')
          .select('*, product:products(id, name, image_url, brand, price, serpapi_id)')
          .eq('order_id', selectedOrder.id)
        if (!error && items) {
          setOrderProducts(items)
        }
      })()
    } else {
      setOrderProducts([])
    }
  }, [selectedOrder])

  const handleQuickOption = (optionId: string) => {
    const option = quickOptions.find(opt => opt.id === optionId)
    if (option) {
      setInput(option.title)
      setShowQuickOptions(false)
      handleSendMessage(option.title)
    }
  }

  const handleVoiceInput = async () => {
    if (isListening) {
      mediaRecorder?.stop()
      setIsListening(false)
      setIsTranscribing(true)
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      
      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }

      recorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const formData = new FormData();
        formData.append('audio', audioBlob);
        try {
          const response = await fetch('https://cmpgbcxxekyjtvvcabbw.supabase.co/functions/v1/speech-to-text', {
            method: 'POST',
          body: formData,
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcGdiY3h4ZWt5anR2dmNhYmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODY2MDksImV4cCI6MjA2NTc2MjYwOX0.viqdQCnqYnkJ_cgH_tTZoTqXAv9j2gfF1z8Er7F98OE'
            }
          });
          const data = await response.json();
          setIsTranscribing(false);
          if (!response.ok) {
            console.error('Error from speechToText:', data.error)
            alert(`Transcription failed: ${data.error}`)
            return;
        }
          setInput(data.transcription);
        } catch (error) {
          setIsTranscribing(false);
          console.error('Error from speechToText:', error);
          alert('Transcription failed.');
        }
      }

      recorder.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please ensure you have given permission.')
    }
  }

  // Helper to call the Cartify AI Agent edge function
  async function fetchCartifyAgentResponse(query: string) {
    const res = await fetch('https://cmpgbcxxekyjtvvcabbw.functions.supabase.co/cartify-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to fetch agent response');
    return await res.json();
  }

  const handleSendMessage = async (customInput?: string) => {
    const userMessage = customInput || input.trim();
    if (!userMessage) return;

    setInput('');
    setIsProcessing(true);
    setShowQuickOptions(false);

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const data = await fetchCartifyAgentResponse(userMessage);
      // Deduplicate by id and limit to max 3 per name
      const nameCounts: Record<string, number> = {};
      const seenIds = new Set();
      const uniqueLimitedProducts: any[] = [];
      for (const p of (data.products || [])) {
        const name = p.name.toLowerCase();
        if (!seenIds.has(p.id)) {
          if (!nameCounts[name]) nameCounts[name] = 0;
          if (nameCounts[name] < 3) {
            uniqueLimitedProducts.push(p);
            nameCounts[name]++;
            seenIds.add(p.id);
          }
        }
      }
      setSuggestedProducts(
        uniqueLimitedProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
          brand: p.brand,
        quantity: 1,
          reason: `Matches your request: ${userMessage}`,
        }))
      );
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: data.message || 'Here are the best products for you!' },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: 'Sorry, I encountered an error processing your request. Please try again!' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

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
      const productForCart = {
        ...product,
        description: product.name,
        category_id: 'walmart',
        stock_quantity: 100,
        rating: 0,
        review_count: 0,
        brand: product.brand || 'Walmart',
        sku: undefined,
        is_featured: false,
        original_price: undefined,
      };
      addToCart(productForCart, product.quantity);
    });
    setMessages(prev => [...prev, { 
      type: 'bot', 
      content: `🎉 Perfect! I've added all ${suggestedProducts.length} items to your cart. Happy shopping! 🛒✨\n\nIs there anything else I can help you find?` 
    }])
    setSuggestedProducts([])
    setShowQuickOptions(true)
  }

  const handleClearHistory = async () => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to clear your entire order history? This cannot be undone.')) return;
    await supabase.from('orders').delete().eq('user_id', user.id);
    setOrderHistory([]);
    setSelectedOrder(null);
    setOrderProducts([]);
  };

  if (!cartifyOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-2">
      <div className="bg-white rounded-2xl w-full max-w-screen-md h-[80vh] max-h-screen flex flex-col overflow-hidden shadow-2xl border-2 border-[#0071ce]">
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#0071ce] to-[#004c91] text-white px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Cartify AI Agent</h2>
              <p className="text-blue-100 text-xs sm:text-sm">Your intelligent shopping assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode(viewMode === 'chat' ? 'analytics' : 'chat')}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title={viewMode === 'chat' ? 'Show Analytics' : 'Show Chat'}
            >
              {viewMode === 'chat' ? <BarChart3 className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'history' ? 'chat' : 'history')}
              className={`p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors ${viewMode === 'history' ? 'bg-white bg-opacity-20' : ''}`}
              title="Show Purchase History"
            >
              <Clock className="h-5 w-5" />
            </button>
          <button
            onClick={() => setCartifyOpen(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
              <X className="h-5 w-5" />
          </button>
          </div>
        </div>

        {/* Content Area - Conditional Rendering */}
        {viewMode === 'chat' ? (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Chat Section */}
            <div className="flex-1 flex flex-col min-h-0 lg:border-r">
            {/* Messages - Scrollable */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                      className={`max-w-xs sm:max-w-md px-2 sm:px-3 py-2 sm:py-3 rounded-xl whitespace-pre-line shadow text-xs sm:text-sm ${
                      message.type === 'user'
                        ? 'bg-[#0071ce] text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Quick Options */}
              {showQuickOptions && messages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                  {quickOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleQuickOption(option.id)}
                        className="p-2 border border-gray-200 rounded-xl hover:border-[#0071ce] hover:bg-blue-50 transition-all text-left group shadow bg-white"
                    >
                        <div className="flex items-start space-x-2">
                          <span className="text-lg sm:text-xl">{option.icon}</span>
                        <div>
                            <div className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#0071ce]">
                            {option.title}
                          </div>
                            <div className="text-xs text-gray-600 mt-1">
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
                    <div className="bg-white px-3 py-2 rounded-xl shadow border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-[#0071ce] animate-spin" />
                        <span className="text-xs text-gray-600 font-medium">Cartify AI Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Input Section */}
              <div className="border-t bg-white p-2 sm:p-3 flex-shrink-0 shadow">
                <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tell me what you need... (e.g., 'I want to cook biryani under $50')"
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071ce] focus:border-transparent text-xs sm:text-sm"
                    disabled={isProcessing}
                  />
                </div>
                <button
                  onClick={handleVoiceInput}
                    disabled={isProcessing || isTranscribing}
                    className={`p-2 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                        : isTranscribing
                        ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : isTranscribing ? (
                      <Sparkles className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isProcessing}
                    className="bg-[#0071ce] text-white p-2 rounded-full hover:bg-[#004c91] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                >
                    <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Products Panel */}
          {suggestedProducts.length > 0 && (
              <div className="w-full lg:w-2/5 xl:w-1/3 bg-gray-50 flex flex-col border-t lg:border-t-0">
                <div className="p-3 border-b bg-white flex-shrink-0">
                  <h3 className="font-bold text-base text-gray-900">Suggested For You</h3>
                  <p className="text-xs text-gray-600 mt-1">
                  Total: ${suggestedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                </p>
              </div>
              
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {suggestedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-2 flex space-x-2 items-center shadow">
                    <img
                      src={product.image_url}
                      alt={product.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                    />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h4>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0071ce] text-xs sm:text-sm">
                        ${product.price.toFixed(2)}
                      </span>
                          <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded"
                        >
                              <Minus className="h-3 w-3" />
                        </button>
                            <span className="text-xs font-bold px-1">{product.quantity}</span>
                        <button
                          onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded"
                        >
                              <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                      </div>
                       <button
                        onClick={() => removeProduct(product.id)}
                        className="text-gray-400 hover:text-red-500 self-start"
                      >
                        <X className="h-4 w-4" />
                      </button>
                  </div>
                ))}
              </div>
              
                <div className="p-3 border-t bg-white flex-shrink-0">
                <button
                  onClick={addAllToCart}
                    className="w-full bg-[#ffc220] text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2 shadow text-xs sm:text-sm"
                >
                    <ShoppingCart className="h-4 w-4" />
                  <span>Add All to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
        ) : viewMode === 'analytics' ? (
          <div className="flex-1 overflow-y-auto">
            <AgentAnalyticsTool />
          </div>
        ) : (
          <div className="flex-1 flex flex-row min-h-0">
            {/* Left: Orders List */}
            <div className="w-2/5 bg-gray-50 border-r flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between p-3 border-b bg-white">
                <h3 className="font-bold text-base text-gray-900">Purchase History</h3>
                <button
                  onClick={handleClearHistory}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Clear History"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {orderHistory.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">No previous purchases found.</div>
              ) : (
                <ul className="divide-y">
                  {orderHistory.map(order => (
                    <li
                      key={order.id}
                      className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${selectedOrder?.id === order.id ? 'bg-blue-100' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="font-bold text-xs text-gray-900">{new Date(order.created_at).toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total: ${order.total_amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Status: {order.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Right: Products in Selected Order */}
            <div className="flex-1 flex flex-col">
              {selectedOrder ? (
                <>
                  <div className="p-3 border-b bg-white flex-shrink-0 flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900">Order Details</h3>
                    <button
                      onClick={async () => {
                        setIsReordering(true);
                        for (const product of orderProducts) {
                          let productId = product.product && product.product.id;
                          // Check for existence by serpapi_id
                          if (product.product && product.product.serpapi_id) {
                            const { data: existing, error } = await supabase
                              .from('products')
                              .select('id')
                              .eq('serpapi_id', product.product.serpapi_id)
                              .single();
                            if (existing && existing.id) {
                              productId = existing.id;
                            } else if (!error) {
                              // Insert if not found
                              const { data: newProduct } = await supabase
                                .from('products')
                                .insert({
                                  serpapi_id: product.product.serpapi_id,
                                  name: product.product.name,
                                  description: product.product.name,
                                  price: product.product.price,
                                  image_url: product.product.image_url,
                                  category_id: product.product.category_id || '',
                                  stock_quantity: 100,
                                  rating: 0,
                                  review_count: 0,
                                  brand: product.product.brand || 'Walmart',
                                })
                                .select('id')
                                .single();
                              if (newProduct && newProduct.id) productId = newProduct.id;
                            }
                          }
                          await addToCart({
                            id: productId,
                            name: product.product && product.product.name,
                            price: product.product && product.product.price,
                            image_url: product.product && product.product.image_url,
                            brand: product.product && product.product.brand,
                            description: '',
                            category_id: '',
                            stock_quantity: 100,
                            rating: 0,
                            review_count: 0,
                            sku: undefined,
                            is_featured: false,
                            original_price: undefined,
                          }, product.quantity);
                        }
                        setIsReordering(false);
                        navigate('/checkout');
                      }}
                      className="bg-[#ffc220] text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors flex items-center space-x-2 shadow text-xs sm:text-sm"
                      disabled={isReordering}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Re-purchase All</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {orderProducts.map(product => {
                      if (!product.product || typeof product.product.price !== 'number') {
                        console.warn('Missing product or price in order history:', product);
                      }
                      return (
                        <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-2 flex space-x-2 items-center shadow">
                          <img
                            src={product.product && product.product.image_url ? product.product.image_url : 'https://via.placeholder.com/64'}
                            alt={product.product && product.product.name ? product.product.name : 'Product'}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-2">
                              {product.product && product.product.name ? product.product.name : 'Unknown Product'}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0071ce] text-xs sm:text-sm">
                                {product.product && typeof product.product.price === 'number'
                                  ? `$${product.product.price.toFixed(2)}`
                                  : 'N/A'}
                              </span>
                              <span className="text-xs font-bold px-1">Qty: {product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">Select an order to view details</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}