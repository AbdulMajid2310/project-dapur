"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTimes, FaSearch } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Enum backend
export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  WAITING_VERIFICATION = "WAITING_VERIFICATION",
  PROCESSING = "PROCESSING",
  PACKING = "PACKING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Type definitions
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string; // orderId
  orderNumber: string;
  customer: string;
  date: string;
  time: string;
  items: OrderItem[];
  amount: number;
  payment: string;
  status: OrderStatus;
  deliveryOption: string;
  address: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Label dan warna status
  const statusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT: return "Menunggu Pembayaran";
      case OrderStatus.WAITING_VERIFICATION: return "Menunggu Verifikasi";
      case OrderStatus.PROCESSING: return "Diproses";
      case OrderStatus.PACKING: return "Packing";
      case OrderStatus.SHIPPED: return "Dikirim";
      case OrderStatus.COMPLETED: return "Selesai";
      case OrderStatus.CANCELLED: return "Dibatalkan";
    }
  };

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT: return "bg-yellow-100 text-yellow-800";
      case OrderStatus.WAITING_VERIFICATION: return "bg-blue-100 text-blue-800";
      case OrderStatus.PROCESSING: return "bg-indigo-100 text-indigo-800";
      case OrderStatus.PACKING: return "bg-purple-100 text-purple-800";
      case OrderStatus.SHIPPED: return "bg-orange-100 text-orange-800";
      case OrderStatus.COMPLETED: return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED: return "bg-red-100 text-red-800";
    }
  };

  // --- Fetch orders dari backend ---
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      const data: Order[] = res.data.data.map((o: any) => ({
        id: o.orderId,
        orderNumber: o.orderNumber,
        customer: `${o.address.user.firstName} ${o.address.user.lastName}`,
        date: new Date(o.createdAt).toLocaleDateString("id-ID"),
        time: new Date(o.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
        items: o.items.map((i: any) => ({
          name: i.menuItem.name,
          quantity: i.quantity,
          price: Number(i.priceAtPurchase),
        })),
        amount: Number(o.grandTotal),
        payment: o.paymentMethod.type === "BANK" ? o.paymentMethod.bankName : o.paymentMethod.ewalletName || o.paymentMethod.type,
        status: o.status as OrderStatus,
        deliveryOption: o.address.delivery === "DELIVERY" ? "Diantar" : "Makan di Tempat",
        address: o.address.description,
      }));
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data order:", error);
      toast.error("Gagal mengambil data order.");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // --- Filter & Search (menggunakan useMemo untuk performa) ---
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => activeFilter === "ALL" || o.status === activeFilter)
      .filter(o =>
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.payment.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [orders, searchTerm, activeFilter]);

  const currentOrderItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const openOrderModal = (order: Order) => setSelectedOrder(order);

  const handleOrderStatusChange = (status: OrderStatus) => {
    if (!selectedOrder) return;
    setSelectedOrder({ ...selectedOrder, status });
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      await axiosInstance.put(`/orders/${selectedOrder.id}/verify`, {
        status: selectedOrder.status,
      });

      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? selectedOrder : o));
      toast.success("Status pesanan berhasil diperbarui!");
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal update status pesanan.");
    }
  };

  // --- Render Modal ---
  const renderOrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Detail Pesanan</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* Informasi Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500">ID Pesanan</h4>
                <p className="font-medium">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Pelanggan</h4>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Tanggal & Waktu</h4>
                <p className="font-medium">{selectedOrder.date} {selectedOrder.time}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Pembayaran</h4>
                <p className="font-medium">{selectedOrder.payment}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Opsi Pengiriman</h4>
                <p className="font-medium">{selectedOrder.deliveryOption}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Status</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleOrderStatusChange(e.target.value as OrderStatus)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {Object.values(OrderStatus).map(s => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm text-gray-500 mb-2">Item Pesanan</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between border p-2 rounded-lg">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.deliveryOption === "Diantar" && (
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Alamat Pengiriman</h4>
                <p className="font-medium">{selectedOrder.address}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t flex justify-end space-x-2">
            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-lg">Tutup</button>
            <button onClick={updateOrderStatus} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Update Status</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pesanan</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pesanan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === "ALL" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >Semua</button>
        {Object.values(OrderStatus).map(s => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${activeFilter === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {currentOrderItems.length === 0 ? (
        <p className="flex flex-col items-center justify-center text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-gray-700 space-y-2">
          <span className="text-4xl">📭</span>
          <span className="text-lg font-semibold">Tidak ada pesanan dengan status "{activeFilter === "ALL" ? "Semua" : statusLabel(activeFilter)}".</span>
          <span className="text-sm text-gray-500">Coba periksa filter lain atau lakukan pemesanan baru.</span>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {currentOrderItems.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border rounded-xl shadow p-4 bg-white flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">#{order.orderNumber}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{order.customer}</p>
                <p className="text-gray-500 text-sm mb-2">{order.date} {order.time}</p>

                <div className="space-y-1 mb-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>

                <p className="font-semibold text-gray-800 mb-2">Total: Rp {order.amount.toLocaleString("id-ID")}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">{order.payment}</p>
                  <button onClick={() => openOrderModal(order)} className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalOrderPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {renderOrderModal()}
    </div>
  );
}
