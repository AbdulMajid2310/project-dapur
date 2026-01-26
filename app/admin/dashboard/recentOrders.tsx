'use client';

import React from 'react';
import {
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from 'react-icons/fi';

/* =======================
   Types
======================= */
interface OrderUser {
    firstName: string;
    lastName: string;
}

interface OrderAddress {
    delivery?: string;
    user?: OrderUser;
}

interface Order {
    orderId: string;
    orderNumber: string;
    status: 'COMPLETED' | 'PENDING' | string;
    grandTotal: string;
    createdAt: string;
    address?: OrderAddress;
}

interface RecentOrdersProps {
    orders: Order[];
    onViewAll?: () => void;
}

/* =======================
   Helpers
======================= */
const getStatusIcon = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return {
                bg: 'bg-green-100',
                icon: <FiCheckCircle className="text-green-500" />,
            };
        case 'PENDING':
            return {
                bg: 'bg-yellow-100',
                icon: <FiClock className="text-yellow-500" />,
            };
        default:
            return {
                bg: 'bg-gray-100',
                icon: <FiXCircle className="text-gray-500" />,
            };
    }
};

/* =======================
   Component
======================= */
const RecentOrders: React.FC<RecentOrdersProps> = ({
    orders,
    onViewAll,
}) => {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Pesanan Terbaru
                </h2>
                <p className="text-sm text-gray-500">
                    Belum ada pesanan.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Pesanan Terbaru
                </h2>

                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                        Lihat Semua
                    </button>
                )}
            </div>

            {/* List */}
            <div className="space-y-3">
                {orders.map((order) => {
                    const userName = order.address?.user
                        ? `${order.address.user.firstName} ${order.address.user.lastName}`
                        : 'Unknown User';

                    const statusUI = getStatusIcon(order.status);

                    return (
                        <div
                            key={order.orderId}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${statusUI.bg}`}
                                >
                                    {statusUI.icon}
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">
                                        {order.orderNumber}
                                    </p>
                                    <p className="text-sm capitalize text-gray-500">
                                        {userName}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-medium text-gray-800">
                                    Rp{' '}
                                    {Number(order.grandTotal).toLocaleString(
                                        'id-ID'
                                    )}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString(
                                        'id-ID'
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentOrders;
