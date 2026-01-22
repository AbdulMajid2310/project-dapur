"use client";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaUtensils,
  FaChartLine,
  FaClock,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import AdminLayout from "../layout";
import { useState, useEffect } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  changeType?: "up" | "down";
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  changeType 
}) => {
  return (
    <div className={`${color} rounded-xl p-6 shadow-lg text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
        <div className="text-8xl">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === "up" ? "text-white/90" : "text-white/70"
            }`}>
              {changeType === "up" ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {change}% dari bulan lalu
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-white/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface MenuData {
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface OrderData {
  id: string;
  customer: string;
  amount: number;
  status: "Selesai" | "Diproses" | "Menunggu" | "Dibatalkan";
  time: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayOrders: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    availableMenus: 0,
    ordersChange: 0,
    revenueChange: 0,
    customersChange: 0,
    menusChange: 0,
  });
  const [topMenus, setTopMenus] = useState<MenuData[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);

  // Simulasi pengambilan data dari API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulasi delay API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Data simulasi
      setDashboardData({
        todayOrders: 42,
        monthlyRevenue: 12500000,
        totalCustomers: 328,
        availableMenus: 24,
        ordersChange: 12,
        revenueChange: 8,
        customersChange: 15,
        menusChange: -5,
      });
      
      setTopMenus([
        { name: "Nasi Rames Komplit", orders: 28, revenue: 840000, rating: 4.8 },
        { name: "Soto Ayam Kampung", orders: 22, revenue: 660000, rating: 4.6 },
        { name: "Gado-Gado Jakarta", orders: 18, revenue: 450000, rating: 4.7 },
        { name: "Mie Ayam Special", orders: 15, revenue: 375000, rating: 4.9 },
        { name: "Bakso Urat Special", orders: 12, revenue: 300000, rating: 4.5 },
      ]);
      
      setRecentOrders([
        {
          id: "INV-2023081501",
          customer: "Budi Santoso",
          amount: 75000,
          status: "Selesai",
          time: "10:30",
        },
        {
          id: "INV-2023081502",
          customer: "Siti Nurhaliza",
          amount: 45000,
          status: "Diproses",
          time: "11:15",
        },
        {
          id: "INV-2023081503",
          customer: "Ahmad Fauzi",
          amount: 95000,
          status: "Selesai",
          time: "12:45",
        },
        {
          id: "INV-2023081504",
          customer: "Rina Wijaya",
          amount: 55000,
          status: "Menunggu",
          time: "13:20",
        },
        {
          id: "INV-2023081505",
          customer: "Doni Prasetyo",
          amount: 120000,
          status: "Dibatalkan",
          time: "14:10",
        },
      ]);
      
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-green-100 text-green-800";
      case "Diproses": return "bg-blue-100 text-blue-800";
      case "Menunggu": return "bg-yellow-100 text-yellow-800";
      case "Dibatalkan": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Ringkasan performa bisnis Anda</p>
        </div>
        <button className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <FaEye className="mr-2" /> Lihat Laporan
        </button>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pesanan Hari Ini"
          value={dashboardData.todayOrders}
          icon={<FaShoppingCart className="text-2xl" />}
          color="bg-linear-to-r from-blue-500 to-blue-600"
          change={dashboardData.ordersChange}
          changeType="up"
        />
        <DashboardCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${dashboardData.monthlyRevenue.toLocaleString("id-ID")}`}
          icon={<FaMoneyBillWave className="text-2xl" />}
          color="bg-linear-to-r from-green-500 to-green-600"
          change={dashboardData.revenueChange}
          changeType="up"
        />
        <DashboardCard
          title="Total Pelanggan"
          value={dashboardData.totalCustomers}
          icon={<FaUsers className="text-2xl" />}
          color="bg-linear-to-r from-purple-500 to-purple-600"
          change={dashboardData.customersChange}
          changeType="up"
        />
        <DashboardCard
          title="Menu Tersedia"
          value={dashboardData.availableMenus}
          icon={<FaUtensils className="text-2xl" />}
          color="bg-linear-to-r from-yellow-500 to-yellow-600"
          change={Math.abs(dashboardData.menusChange)}
          changeType={dashboardData.menusChange >= 0 ? "up" : "down"}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Menu Terlaris
            </h3>
            <button className="text-orange-500 hover:text-orange-700 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {topMenus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? "bg-yellow-100 text-yellow-600" :
                    index === 1 ? "bg-gray-100 text-gray-600" :
                    index === 2 ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center mt-1">
                      <FaStar className="text-yellow-400 text-xs mr-1" />
                      <span className="text-xs text-gray-500">{item.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item.orders} pesanan
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Rp {item.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Pesanan Terbaru
            </h3>
            <button className="text-orange-500 hover:text-orange-700 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                  <div className="flex items-center mt-1">
                    <FaClock className="text-gray-400 text-xs mr-1" />
                    <span className="text-xs text-gray-500">{order.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Rp {order.amount.toLocaleString("id-ID")}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Grafik Penjualan
          </h3>
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>3 Bulan Terakhir</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <FaChartLine className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Grafik penjualan akan ditampilkan di sini</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}