import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

const topSearchedProducts = [
  { name: 'Basmati Rice', value: 120 },
  { name: 'Chicken', value: 90 },
  { name: 'Paneer', value: 80 },
  { name: 'Shampoo', value: 60 },
  { name: 'Chips', value: 50 },
];

// Mock Data Generation
const generateMockData = () => {
  const mockCategorySales = [
    { name: 'Grocery', value: 45000 },
    { name: 'Electronics', value: 30000 },
    { name: 'Fashion', value: 18000 },
    { name: 'Home', value: 22000 },
    { name: 'Pharmacy', value: 9000 },
  ];

  const mockDepartmentPopularity = [
    { department: 'Grocery', orders: 150 },
    { department: 'Electronics', orders: 80 },
    { department: 'Home', orders: 120 },
    { department: 'Fashion', orders: 95 },
  ];

  const mockSalesOverTime = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().slice(0, 10),
      sales: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000,
    };
  }).reverse();

  const mockCartValueDistribution = [
    { range: '0-200', count: 50 },
    { range: '200-500', count: 85 },
    { range: '500-1000', count: 40 },
    { range: '1000-2000', count: 15 },
    { range: '2000+', count: 5 },
  ];
  
  const mockKpi = {
    salesToday: mockSalesOverTime[mockSalesOverTime.length - 1]?.sales || 0,
    ordersToday: Math.floor(Math.random() * 20) + 10,
    avgOrderValue: 450,
    newCustomers: 5,
    returningCustomers: 25,
  };

  return { mockKpi, mockCategorySales, mockDepartmentPopularity, mockSalesOverTime, mockCartValueDistribution };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6384'];

export const AgentAnalyticsTool: React.FC = () => {
  const [kpiData, setKpiData] = useState<any>({});
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [departmentPopularity, setDepartmentPopularity] = useState<any[]>([]);
  const [salesOverTime, setSalesOverTime] = useState<any[]>([]);
  const [cartValueDistribution, setCartValueDistribution] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { products } = useStore();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      const { data: cartItems, error } = await supabase.from('cart_items').select('*');

      if (error) {
        console.error('Error fetching cart items for analytics:', error);
        // On error, use mock data
        const { mockKpi, mockCategorySales, mockDepartmentPopularity, mockSalesOverTime, mockCartValueDistribution } = generateMockData();
        setKpiData(mockKpi);
        setCategorySales(mockCategorySales);
        setDepartmentPopularity(mockDepartmentPopularity);
        setSalesOverTime(mockSalesOverTime);
        setCartValueDistribution(mockCartValueDistribution);
        setIsLoading(false);
        return;
      }

      // If real data exists, process it
      if (cartItems && cartItems.length > 0 && products.length > 0) {
        // KPI Data
        const today = new Date().toISOString().slice(0, 10);
        const todaysItems = cartItems.filter(item => item.created_at.slice(0, 10) === today);
        const totalSalesToday = todaysItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setKpiData({
          salesToday: totalSalesToday,
          ordersToday: new Set(todaysItems.map(item => item.user_id)).size,
          avgOrderValue: todaysItems.length ? totalSalesToday / new Set(todaysItems.map(item => item.user_id)).size : 0,
          newCustomers: 0, // Placeholder
          returningCustomers: 0, // Placeholder
        });

        // Category Sales & Department Popularity
        const categoryData: Record<string, { value: number; orders: number }> = {};
        cartItems.forEach(item => {
          const productDetails = products.find(p => p.id === item.product_id);
          const category = productDetails?.category_id || 'uncategorized';
          if (!categoryData[category]) {
            categoryData[category] = { value: 0, orders: 0 };
          }
          categoryData[category].value += item.price * item.quantity;
          categoryData[category].orders += 1;
        });
        setCategorySales(Object.entries(categoryData).map(([name, { value }]) => ({ name, value })));
        setDepartmentPopularity(Object.entries(categoryData).map(([department, { orders }]) => ({ department, orders })));

        // Sales Over Time
        const salesByDate: Record<string, number> = {};
        cartItems.forEach(item => {
          const date = item.created_at.slice(0, 10);
          if (!salesByDate[date]) {
            salesByDate[date] = 0;
          }
          salesByDate[date] += item.price * item.quantity;
        });
        setSalesOverTime(Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        
        // Cart Value Distribution
        const orderValues: Record<string, number> = {};
        cartItems.forEach(item => {
            if(!orderValues[item.user_id]) orderValues[item.user_id] = 0;
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
        setCartValueDistribution(Object.entries(buckets).map(([range, count]) => ({range, count})));


        // Inventory Alerts
        const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
        setInventoryAlerts([
          { name: 'Low Stock', value: lowStockCount },
          { name: 'Fully Stocked', value: products.length - lowStockCount },
        ]);
      } else {
        // If no real data, use mock data
        const { mockKpi, mockCategorySales, mockDepartmentPopularity, mockSalesOverTime, mockCartValueDistribution } = generateMockData();
        setKpiData(mockKpi);
        setCategorySales(mockCategorySales);
        setDepartmentPopularity(mockDepartmentPopularity);
        setSalesOverTime(mockSalesOverTime);
        setCartValueDistribution(mockCartValueDistribution);
        
        // Mock inventory data
        const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
        setInventoryAlerts([
          { name: 'Low Stock', value: lowStockCount || 15 },
          { name: 'Fully Stocked', value: (products.length - lowStockCount) || 185 },
        ]);
      }
      setIsLoading(false);
    };

    if (products.length > 0) {
      fetchAnalyticsData();
    }
  }, [products]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#0071ce]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#0071ce]">Agent Analytics Tool</h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Today's Sales" value={`₹${kpiData.salesToday?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0'}`} color="bg-blue-100 text-blue-800" />
        <KpiCard label="Orders Today" value={kpiData.ordersToday || 0} color="bg-green-100 text-green-800" />
        <KpiCard label="Avg. Order Value" value={`₹${kpiData.avgOrderValue?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0'}`} color="bg-yellow-100 text-yellow-800" />
        <KpiCard label="New vs Returning" value={`${kpiData.newCustomers || 0} / ${kpiData.returningCustomers || 0}`} color="bg-purple-100 text-purple-800" />
      </div>

      {/* Category Sales Pie Chart */}
      <Section title="Sales by Category (Department)">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
              {categorySales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
            <RechartsLegend />
          </PieChart>
        </ResponsiveContainer>
      </Section>

      {/* Top Searched Products Pie Chart */}
      <Section title="Top Searched Products/Dishes">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={topSearchedProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
              {topSearchedProducts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <RechartsLegend />
          </PieChart>
        </ResponsiveContainer>
      </Section>

      {/* Popular Departments Bar Chart */}
      <Section title="Popular Departments">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={departmentPopularity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="orders" fill="#0071ce" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Sales Over Time Line Chart */}
      <Section title="Sales Over Time">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={salesOverTime} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
            <Line type="monotone" dataKey="sales" stroke="#00C49F" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Cart Value Distribution Histogram */}
      <Section title="Cart Value Distribution">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={cartValueDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="count" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Inventory Alerts Donut Chart */}
      <Section title="Inventory Alerts">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={inventoryAlerts} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} label>
              {inventoryAlerts.map((entry, index) => (
                <Cell key={`cell-inv-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <RechartsLegend />
          </PieChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
};

// KPI Card Component
const KpiCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className={`rounded-xl shadow-md p-5 flex flex-col items-center justify-center text-center ${color}`}>
    <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm font-medium">{label}</div>
  </div>
);

// Section Wrapper
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{title}</h2>
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8">{children}</div>
  </section>
); 