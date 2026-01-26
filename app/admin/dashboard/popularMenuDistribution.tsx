'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';
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
interface MenuItem {
  menuItemId: string;
  name: string;
  orderCount: number;
  image: string;
  rating: string | null;
  category: string;
  price: string;
}

interface PopularMenuDistributionProps {
  topMenuItems: MenuItem[];
}

/* =======================
   Colors
======================= */
const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
];

/* =======================
   Component
======================= */
const PopularMenuDistribution: React.FC<
  PopularMenuDistributionProps
> = ({ topMenuItems }) => {
  /* ---------- Empty State ---------- */
  if (topMenuItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Menu
        </h2>
        <p className="text-sm text-gray-500">
          Tidak ada data menu.
        </p>
      </div>
    );
  }

  const chartData = topMenuItems.map((item) => ({
    name: item.name,
    value: item.orderCount,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu Terpopuler</h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Lihat Semua</button>
          </div>

      

      {/* List */}
      <div className="space-y-3">
        {topMenuItems.map((item, index) => {
          const rating = Number(item.rating) || 0;
          const price = Number(item.price) || 0;

          return (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </div>

                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover mr-3"
                />

                <div>
                  <p className="font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-xs ${
                        i < Math.round(rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({rating.toFixed(1)})
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-700 mt-1">
                  Rp {price.toLocaleString('id-ID')}
                </p>

                <p className="text-xs text-gray-400">
                  {item.orderCount > 0
                    ? `${item.orderCount} terjual`
                    : 'Belum terjual'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularMenuDistribution;
