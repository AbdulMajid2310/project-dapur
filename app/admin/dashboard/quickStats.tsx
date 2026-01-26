'use client';

import React from 'react';
import { IconType } from 'react-icons';

/* =======================
   Types
======================= */
interface QuickStatItem {
  label: string;
  value: number | string;
  icon: IconType;
}

interface QuickStatsProps {
  title?: string;
  items: QuickStatItem[];
}

/* =======================
   Component
======================= */
const QuickStats: React.FC<QuickStatsProps> = ({
  title = 'Statistik Cepat',
  items,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-6">{title}</h2>

      <div className="space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;

          return (
            <div
              key={item.label}
              className={`flex justify-between items-center pb-3 ${
                !isLast ? 'border-b border-white/20' : ''
              }`}
            >
              <div className="flex items-center">
                <Icon className="mr-3" />
                <span>{item.label}</span>
              </div>

              <span className="text-2xl font-bold">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
