"use client";

import axiosInstance from '@/lib/axiosInstance';
import React, { useState, useEffect } from 'react';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiImage, 
  FiMessageSquare, 
  FiHelpCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiStar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUsers,
  FiGrid,
  FiBarChart2,
  FiActivity,
  FiPieChart,
  FiCalendar,
  FiAward,
  FiTarget,
  FiAlertCircle,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiEye,
  FiHeart,
  FiTruck,
  FiHome
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Type definitions
interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
  isFavorite: boolean;
  category: string;
  stock: number;
  orderCount: number;
  rating: string | null;
  reviewCount: number;
  allergens: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testimonials: any[];
}

interface Order {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalItemPrice: string;
  deliveryFee: string;
  grandTotal: string;
  createdAt: string;
  updatedAt: string;
  address?: {
    delivery: string;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface Gallery {
  galleryId: string;
  title: string;
  caption: string;
  imageUrl: string;
  alt: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  testimonialId: string;
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  menuItem: {
    name: string;
    image: string;
  };
  comment: string;
  rating: string;
  isApproved: boolean;
  createdAt: string;
}

interface FAQ {
  faqId: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

// Color palette
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  dark: '#1f2937',
  light: '#f3f4f6'
};

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, change, icon, color, subtitle, trend = 'neutral' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <FiTrendingUp className="text-green-500" />;
    if (trend === 'down') return <FiTrendingDown className="text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden">
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" 
        style={{ backgroundColor: color + '20' }}
      ></div>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center">
            {getTrendIcon()}
            <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}% dari bulan lalu
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Label for PieChart
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === undefined || percent === null) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, orderRes, galleryRes, testimonialRes, faqRes, userRes] = await Promise.all([
          axiosInstance.get('/menu-items'),
          axiosInstance.get('/orders'),
          axiosInstance.get('/gallery'),
          axiosInstance.get('/testimonials'),
          axiosInstance.get('/faqs'),
          axiosInstance.get('/users')
        ]);

        setMenuItems(menuRes.data.data);
        setOrders(orderRes.data.data);
        setGalleries(galleryRes.data.data);
        setTestimonials(testimonialRes.data.data);
        setFaqs(faqRes.data.data);
        setUsers(userRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate advanced metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const totalMenuItems = menuItems.length;
  const availableMenuItems = menuItems.filter(item => item.isAvailable).length;
  const favoriteMenuItems = menuItems.filter(item => item.isFavorite).length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.grandTotal), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalGalleries = galleries.length;
  const activeGalleries = galleries.filter(gallery => gallery.isActive).length;
  const totalTestimonials = testimonials.length;
  const approvedTestimonials = testimonials.filter(testimonial => testimonial.isApproved).length;
  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + parseFloat(t.rating), 0) / testimonials.length 
    : 0;
  const totalFaqs = faqs.length;
  const publishedFaqs = faqs.filter(faq => faq.status === 'published').length;

  // Delivery vs Pickup analysis
  const deliveryOrders = orders.filter(order => order.address?.delivery === 'DELIVERY').length;
  const pickupOrders = orders.filter(order => order.address?.delivery === 'ON_PLACE').length;

  // Generate dynamic data for charts based on actual API data
  const generateRevenueData = () => {
    // Group orders by month and calculate revenue
    const monthlyRevenue: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      
      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }
      monthlyRevenue[monthYear] += parseFloat(order.grandTotal);
    });
    
    // Convert to array format for chart
    return Object.entries(monthlyRevenue).map(([name, value]) => ({ name, value }));
  };

  const revenueData = generateRevenueData();

  // Generate daily order trend data
  const generateOrderTrendData = () => {
    const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const dayCounts: Record<string, number> = {};
    
    // Initialize all days with 0
    daysOfWeek.forEach(day => {
      dayCounts[day] = 0;
    });
    
    // Count orders by day of week
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Sunday
      dayCounts[dayName]++;
    });
    
    // Convert to array format for chart
    return daysOfWeek.map(day => ({ name: day, orders: dayCounts[day] }));
  };

  const orderTrendData = generateOrderTrendData();

  const categoryData = Object.entries(
    menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const orderStatusData = [
    { name: 'Selesai', value: completedOrders, color: COLORS.success },
    { name: 'Menunggu', value: pendingOrders, color: COLORS.warning },
    { name: 'Lainnya', value: Math.max(0, totalOrders - completedOrders - pendingOrders), color: COLORS.dark }
  ].filter(item => item.value > 0);

  const deliveryData = [
    { name: 'Delivery', value: deliveryOrders, color: COLORS.primary },
    { name: 'Pickup', value: pickupOrders, color: COLORS.secondary }
  ];

  // Top performing items
  const topMenuItems = [...menuItems]
    .filter(item => item.rating !== null)
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentTestimonials = [...testimonials]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiRefreshCw className="text-blue-500 text-2xl animate-spin" />
          </div>
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard Dapur Umi</h1>
            <p className="text-gray-600 mt-2">Analisis lengkap untuk meningkatkan layanan kuliner Anda</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2">
              <FiFilter />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2">
              <FiDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
          change={12.5}
          trend="up"
          icon={<FiDollarSign className="text-xl" />}
          color={COLORS.success}
          subtitle={`${totalOrders} transaksi`}
        />
        <MetricCard
          title="Total Pelanggan"
          value={totalUsers}
          change={8.2}
          trend="up"
          icon={<FiUsers className="text-xl" />}
          color={COLORS.primary}
          subtitle={`${activeUsers} aktif`}
        />
        <MetricCard
          title="Rating Rata-rata"
          value={averageRating.toFixed(1)}
          change={2.1}
          trend="up"
          icon={<FiStar className="text-xl" />}
          color={COLORS.warning}
          subtitle={`${totalTestimonials} ulasan`}
        />
        <MetricCard
          title="Nilai Pesanan Rata-rata"
          value={`Rp ${Math.round(averageOrderValue).toLocaleString('id-ID')}`}
          change={-3.4}
          trend="down"
          icon={<FiShoppingCart className="text-xl" />}
          color={COLORS.info}
          subtitle="Per transaksi"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tren Pendapatan</h2>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === 'week' ? 'Minggu' : range === 'month' ? 'Bulan' : 'Tahun'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                {/* <linearlinear id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearlinear> */}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS.primary} 
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Distribusi Pesanan</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Status Pesanan</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {orderStatusData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Metode Pengiriman</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={deliveryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deliveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {deliveryData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Pesanan Harian</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="orders" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Menu Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Kategori Menu</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-6">Statistik Cepat</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <div className="flex items-center">
                <FiPackage className="mr-3" />
                <span>Total Menu</span>
              </div>
              <span className="text-2xl font-bold">{totalMenuItems}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <div className="flex items-center">
                <FiHeart className="mr-3" />
                <span>Menu Favorit</span>
              </div>
              <span className="text-2xl font-bold">{favoriteMenuItems}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/20">
              <div className="flex items-center">
                <FiImage className="mr-3" />
                <span>Galeri</span>
              </div>
              <span className="text-2xl font-bold">{totalGalleries}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiHelpCircle className="mr-3" />
                <span>FAQ</span>
              </div>
              <span className="text-2xl font-bold">{totalFaqs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Menu Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu Terpopuler</h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {topMenuItems.map((item, index) => (
              <div key={item.menuItemId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`text-xs ${
                          i < parseFloat(item.rating || '0') ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({item.rating})</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1">Rp {parseFloat(item.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Lihat Semua</button>
          </div>
          <div className="space-y-3">
            {recentOrders.map(order => {
              const userName = order.address?.user 
                ? `${order.address.user.firstName} ${order.address.user.lastName}`
                : 'Unknown User';
              
              return (
                <div key={order.orderId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      order.status === 'COMPLETED' ? 'bg-green-100' : 
                      order.status === 'PENDING' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {order.status === 'COMPLETED' ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : order.status === 'PENDING' ? (
                        <FiClock className="text-yellow-500" />
                      ) : (
                        <FiXCircle className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">Rp {parseFloat(order.grandTotal).toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Wawasan Pelanggan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <FiUsers className="text-3xl text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
            <p className="text-sm text-gray-600">Total Pelanggan</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <FiTrendingUp className="text-3xl text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray-600">Tingkat Aktivasi</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <FiStar className="text-3xl text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}/5.0</p>
            <p className="text-sm text-gray-600">Rating Rata-rata</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;