"use client";

import MetricCard from '@/components/metricCard';
import axiosInstance from '@/lib/axiosInstance';
import React, { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiPackage,
  FiImage,
  FiHelpCircle,
  FiDollarSign,
  FiStar,
  FiUsers,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiHeart,
} from 'react-icons/fi';
import RevenueTrend from './revenueTrend';
import OrderDistribution from './orderDistribtion';
import PopularMenuDistribution from './popularMenuDistribution';
import DailyOrders from './dailyOrders';
import MenuCategoryDistribution from './menuCategoryDistribution';
import QuickStats from './quickStats';
import RecentOrders from './recentOrders';
import CustomerInsights from './customerInsights';
import { MenuItem } from '@/lib/hooks/menu/type';
import { UserData } from '@/lib/hooks/user/type';
import { Order } from '@/lib/hooks/order/type';





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
  user: UserData
  menuItem:MenuItem;
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





const Dashboard: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
 
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
  const favoriteMenuItems = menuItems.filter(item => item.isFavorite).length;
  const totalOrders = orders.length;
 const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.grandTotal), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalGalleries = galleries.length;
  const totalTestimonials = testimonials.length;
  const averageRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + parseFloat(t.rating), 0) / testimonials.length
    : 0;
  const totalFaqs = faqs.length;

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

  

  // Top performing items
  const topMenuItems = [...menuItems]
    .filter(item => item.rating !== null)
    .sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

 
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

  const quickStatsData = [
    {
      label: 'Total Menu',
      value: totalMenuItems,
      icon: FiPackage,
    },
    {
      label: 'Menu Favorit',
      value: favoriteMenuItems,
      icon: FiHeart,
    },
    {
      label: 'Galeri',
      value: totalGalleries,
      icon: FiImage,
    },
    {
      label: 'FAQ',
      value: totalFaqs,
      icon: FiHelpCircle,
    },
  ];

  const customerInsightsData = [
  {
    label: 'Total Pelanggan',
    value: totalUsers,
    icon: FiUsers,
    bgColor: 'bg-blue-50',      // Latar belakang kartu yang lembut
    iconBgColor: 'bg-blue-500', // Latar belakang ikon yang solid
  },
  {
    label: 'Rating Rata-rata',
    value: `${averageRating.toFixed(1)}/5.0`,
    icon: FiStar,
    bgColor: 'bg-purple-50',      // Latar belakang kartu yang lembut
    iconBgColor: 'bg-purple-500', // Latar belakang ikon yang solid
    textColor: 'text-purple-900', // (Opsional) Warna teks nilai untuk menyesuaikan tema
  },
];


  return (
    <div className=" min-h-screen">
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
        <RevenueTrend />

        {/* Order Distribution */}
        <OrderDistribution orders={orders} />

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Orders */}
        {/* Daily Orders */}
        <DailyOrders
          data={orderTrendData}
          barColor={COLORS.primary}
        />



        {/* Menu Categories */}
        <MenuCategoryDistribution
          data={categoryData}
          colors={CHART_COLORS}
        />


        {/* Quick Stats */}
        <QuickStats items={quickStatsData} />

      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Menu Items */}
        <PopularMenuDistribution topMenuItems={topMenuItems} />


        {/* Recent Orders */}
        <RecentOrders
          orders={recentOrders}

        />

      </div>

      {/* Customer Insights */}
      <CustomerInsights items={customerInsightsData} />

    </div>
  );
};

export default Dashboard;