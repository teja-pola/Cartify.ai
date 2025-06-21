import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6384', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

const TIME_FILTERS = [
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '1 Year', value: '1y' },
];

const CATEGORY_FILTERS = [
  { label: 'All Categories', value: 'all' },
  // Add more categories as needed
];

function getDateRange(filter: string) {
  const now = new Date();
  let from: Date;
  switch (filter) {
    case '1d': from = new Date(now); from.setDate(now.getDate() - 1); break;
    case '1w': from = new Date(now); from.setDate(now.getDate() - 7); break;
    case '1m': from = new Date(now); from.setMonth(now.getMonth() - 1); break;
    case '1y': from = new Date(now); from.setFullYear(now.getFullYear() - 1); break;
    default: from = new Date(0);
  }
  return from.toISOString();
}

export const AgentAnalyticsTool: React.FC = () => {
  const { products } = useStore();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]); // For top searched products
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('1w');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [purchaseFilter, setPurchaseFilter] = useState(false); // true = most purchased, false = most searched

  // Fetch real data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      // Fetch cart items
      const { data: cartData } = await supabase.from('cart_items').select('*');
      setCartItems(cartData || []);
      // Fetch searches (if you have a table for this)
      // const { data: searchData } = await supabase.from('searches').select('*');
      // setSearches(searchData || []);
      setIsLoading(false);
    }
    fetchData();
  }, [products]);

  // --- Top Products Searched (mocked if no real data) ---
  let topProducts: any[] = [];
  if (searches.length > 0) {
    // Real logic: filter by time/category, count searches, sort, group by category, etc.
    // For now, fallback to mock
  }
  if (topProducts.length === 0) {
    // Mock: 2 categories, 5-10 products each
    topProducts = [
      { category: 'Grocery', products: [
        { name: 'Basmati Rice', value: 120 },
        { name: 'Chicken', value: 90 },
        { name: 'Paneer', value: 80 },
        { name: 'Shampoo', value: 60 },
        { name: 'Chips', value: 50 },
      ]},
      { category: 'Electronics', products: [
        { name: 'Headphones', value: 110 },
        { name: 'Smartphone', value: 95 },
        { name: 'Laptop', value: 70 },
        { name: 'Charger', value: 60 },
        { name: 'Power Bank', value: 55 },
      ]},
    ];
  }

  // --- Sales by Category ---
  let categorySales: any[] = [];
  if (cartItems.length > 0 && products.length > 0) {
    const categoryMap: Record<string, { name: string, value: number }> = {};
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      const category = product?.category_id || 'Uncategorized';
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      if (!categoryMap[category]) categoryMap[category] = { name: categoryName, value: 0 };
      categoryMap[category].value += item.price * item.quantity;
    });
    categorySales = Object.values(categoryMap).filter(c => c.name !== 'Uncategorized' && c.name !== 'Walmart');
  }
  if (categorySales.length === 0) {
    categorySales = [
      { name: 'Grocery', value: 45000 },
      { name: 'Electronics', value: 30000 },
      { name: 'Fashion', value: 18000 },
      { name: 'Home', value: 22000 },
      { name: 'Beauty', value: 9000 },
      { name: 'Accessories', value: 7000 },
    ];
  }

  // --- Sales Over Time ---
  let salesOverTime: any[] = [];
  if (cartItems.length > 0) {
    const salesByDate: Record<string, number> = {};
    cartItems.forEach(item => {
      const date = item.created_at.slice(0, 10);
      if (!salesByDate[date]) salesByDate[date] = 0;
      salesByDate[date] += item.price * item.quantity;
    });
    salesOverTime = Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  if (salesOverTime.length === 0) {
    const now = new Date();
    salesOverTime = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (14 - i));
      return {
        date: date.toISOString().slice(0, 10),
        sales: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000,
      };
    });
  }

  // --- Cart Value Distribution ---
  let cartValueDistribution: any[] = [];
  if (cartItems.length > 0) {
    const orderValues: Record<string, number> = {};
    cartItems.forEach(item => {
      if (!orderValues[item.user_id]) orderValues[item.user_id] = 0;
      orderValues[item.user_id] += item.price * item.quantity;
    });
    const buckets = { '0-200': 0, '200-500': 0, '500-1000': 0, '1000-2000': 0, '2000+': 0 };
    Object.values(orderValues).forEach(val => {
      if (val <= 200) buckets['0-200']++;
      else if (val <= 500) buckets['200-500']++;
      else if (val <= 1000) buckets['500-1000']++;
      else if (val <= 2000) buckets['1000-2000']++;
      else buckets['2000+']++;
    });
    cartValueDistribution = Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }
  if (cartValueDistribution.length === 0) {
    cartValueDistribution = [
      { range: '0-200', count: 50 },
      { range: '200-500', count: 85 },
      { range: '500-1000', count: 40 },
      { range: '1000-2000', count: 15 },
      { range: '2000+', count: 5 },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-1 sm:px-4 lg:px-8 max-w-screen-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#0071ce]">Agent Analytics Dashboard</h1>
      {/* Top Section: Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Left: Top Products Searched */}
        <div className="bg-white rounded-xl shadow p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800">Top Products Searched</h2>
            {/* Filters */}
            <div className="flex flex-wrap gap-1">
              {TIME_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setTimeFilter(f.value)}
                  className={`px-2 py-1 rounded-full text-xs font-semibold border transition-colors ${timeFilter === f.value ? 'bg-[#0071ce] text-white border-[#0071ce]' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <select
              className="border rounded px-2 py-1 text-xs"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {topProducts.map(cat => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
            </select>
            <button
              className={`px-2 py-1 rounded-full text-xs font-semibold border transition-colors ${purchaseFilter ? 'bg-[#0071ce] text-white border-[#0071ce]' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              onClick={() => setPurchaseFilter(p => !p)}
            >
              {purchaseFilter ? 'Most Purchased' : 'Most Searched'}
            </button>
          </div>
          {/* List of Top Products */}
          <div className="flex-1 overflow-y-auto">
            {(categoryFilter === 'all' ? topProducts : topProducts.filter(c => c.category === categoryFilter)).map(cat => (
              <div key={cat.category} className="mb-2">
                <h3 className="font-semibold text-gray-700 mb-1 text-xs">{cat.category}</h3>
                <ul className="space-y-1">
                  {cat.products.slice(0, 10).map((p: any, idx: number) => (
                    <li key={p.name} className="flex items-center justify-between text-xs">
                      <span className="truncate">{idx + 1}. {p.name}</span>
                      <span className="font-bold text-[#0071ce]">{p.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Sales by Category */}
        <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label fontSize={10}>
                {categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
              <RechartsLegend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Sales Over Time & Cart Value Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sales Over Time */}
        <div className="bg-white rounded-xl shadow p-3 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
              <Line type="monotone" dataKey="sales" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Cart Value Distribution */}
        <div className="bg-white rounded-xl shadow p-3 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Cart Value Distribution</h2>
          <div className="mb-1 text-gray-600 text-xs">This chart shows how many users have carts in each value bucket. It helps you understand how the AI agent is influencing cart sizes and purchase behavior.</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cartValueDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" fontSize={10} />
              <YAxis fontSize={10} />
              <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString('en-US')}`} />
              <Bar dataKey="count" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 