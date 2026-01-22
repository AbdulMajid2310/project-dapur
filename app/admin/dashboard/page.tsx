// app/admin/page.tsx
"use client";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import AdminLayout from "../layout";
import { initialNotifications } from "@/lib/data";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} rounded-xl p-6 shadow-lg text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Pesanan Hari Ini"
            value={42}
            icon={<FaShoppingCart className="text-2xl" />}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <DashboardCard
            title="Pendapatan Bulan Ini"
            value="Rp 12,500,000"
            icon={<FaMoneyBillWave className="text-2xl" />}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <DashboardCard
            title="Total Pelanggan"
            value={328}
            icon={<FaUsers className="text-2xl" />}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <DashboardCard
            title="Menu Tersedia"
            value={6}
            icon={<FaUtensils className="text-2xl" />}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Menu Terlaris
            </h3>
            <div className="space-y-4">
              {[
                { name: "Nasi Rames Komplit", orders: 28 },
                { name: "Soto Ayam Kampung", orders: 22 },
                { name: "Gado-Gado Jakarta", orders: 18 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item.orders} pesanan
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Pesanan Terbaru
            </h3>
            <div className="space-y-4">
              {[
                {
                  id: "INV-2023081501",
                  customer: "Budi Santoso",
                  amount: 75000,
                  status: "Selesai",
                },
                {
                  id: "INV-2023081502",
                  customer: "Siti Nurhaliza",
                  amount: 45000,
                  status: "Diproses",
                },
                {
                  id: "INV-2023081503",
                  customer: "Ahmad Fauzi",
                  amount: 95000,
                  status: "Selesai",
                },
              ].map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Rp {order.amount.toLocaleString("id-ID")}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Selesai"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
  
  );
}