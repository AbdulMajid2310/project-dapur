"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

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
}

const COLORS = {
    primary: "#3b82f6",
};

export default function RevenueTrend() {
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get("/orders");
                setOrders(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    /**
     * Generate revenue data based on selected time range
     */
    const revenueData = useMemo(() => {
        const revenueMap: Record<string, number> = {};
        const now = new Date();

        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            let key = "";

            if (timeRange === "week") {
                const diffDays =
                    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays > 7) return;

                key = date.toLocaleDateString("id-ID", {
                    weekday: "short",
                });
            }

            if (timeRange === "month") {
                key = date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                });
            }

            if (timeRange === "year") {
                key = date.toLocaleDateString("id-ID", {
                    month: "short",
                    year: "numeric",
                });
            }

            revenueMap[key] =
                (revenueMap[key] || 0) + Number(order.grandTotal);
        });

        return Object.entries(revenueMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [orders, timeRange]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500">Memuat data pendapatan...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Tren Pendapatan
                </h2>

                <div className="flex gap-2">
                    {(["week", "month", "year"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {range === "week"
                                ? "Minggu"
                                : range === "month"
                                    ? "Bulan"
                                    : "Tahun"}
                        </button>
                    ))}
                </div>
            </div>

            {revenueData.length === 0 ? (
                <p className="text-gray-500 text-center">
                    Tidak ada data pendapatan
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={COLORS.primary}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={COLORS.primary}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />

                        <Tooltip
                            formatter={(value) => [
                                `Rp ${(value ?? 0).toLocaleString("id-ID")}`,
                                "Pendapatan",
                            ]}
                        />


                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={COLORS.primary}
                            fill="url(#colorRevenue)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
