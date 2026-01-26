'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

/* =======================
   Types
======================= */
interface InsightItem {
  label: string;
  value: string | number;
  icon: IconType;
  bgColor: string;       // Warna latar belakang kartu (misal: 'bg-blue-50')
  iconBgColor: string;   // Warna latar belakang ikon (misal: 'bg-blue-500')
  textColor?: string;    // Warna teks nilai (opsional, default ke 'text-gray-900')
}

interface CustomerInsightsProps {
  title?: string;
  items: InsightItem[];
}

/* =======================
   Component
======================= */
const CustomerInsights: React.FC<CustomerInsightsProps> = ({
  title = 'Wawasan Pelanggan',
  items,
}) => {
  if (items.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="mt-8 w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              className={`relative p-6 rounded-xl ${item.bgColor} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 cursor-pointer group`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.iconBgColor} mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
                <Icon className={`text-white text-2xl`} />
              </div>

              <p className={`text-3xl font-bold ${item.textColor || 'text-gray-900'}`}>
                {item.value}
              </p>

              <p className="text-sm font-medium text-gray-500 mt-1">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CustomerInsights;