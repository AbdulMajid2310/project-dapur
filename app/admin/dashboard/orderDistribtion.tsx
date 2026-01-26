'use client';

import { Order } from '@/lib/hooks/order/type';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* =======================
   Types
======================= */

interface OrderDistributionProps {
  orders: Order[];
}

/* =======================
   Colors
======================= */
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  dark: '#1f2937',
};

/* =======================
   Component
======================= */
const OrderDistribution: React.FC<OrderDistributionProps> = ({ orders }) => {
  const totalOrders = orders.length;

  /* ---------- Status ---------- */
  const completedOrders = orders.filter(
    (order) => order.status === 'COMPLETED',
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING',
  ).length;

  const otherOrders = Math.max(
    0,
    totalOrders - completedOrders - pendingOrders,
  );

  const orderStatusData = [
    { name: 'Selesai', value: completedOrders, color: COLORS.success },
    { name: 'Menunggu', value: pendingOrders, color: COLORS.warning },
    { name: 'Lainnya', value: otherOrders, color: COLORS.dark },
  ].filter((item) => item.value > 0);

  /* ---------- Delivery ---------- */
  const deliveryOrders = orders.filter(
    (order) => order.address?.delivery === 'DELIVERY',
  ).length;

  const pickupOrders = orders.filter(
    (order) => order.address?.delivery === 'ON_PLACE',
  ).length;

  const deliveryData = [
    { name: 'Delivery', value: deliveryOrders, color: COLORS.primary },
    { name: 'Pickup', value: pickupOrders, color: COLORS.secondary },
  ].filter((item) => item.value > 0);

  /* ---------- Empty State ---------- */
  if (totalOrders === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Distribusi Pesanan
        </h2>
        <p className="text-sm text-gray-500">
          Belum ada data pesanan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Distribusi Pesanan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= STATUS ================= */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Status Pesanan
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {orderStatusData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= DELIVERY ================= */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Metode Pengiriman
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {deliveryData.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {deliveryData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDistribution;
