"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEdit, 
  FaTimes, 
  FaSearch, 
  FaShoppingCart, 
  FaTruck, 
  FaStore,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaBox,
  FaShippingFast,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFilter,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
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
  customerEmail?: string; // Tambahkan email pelanggan
  customerPhone?: string; // Tambahkan telepon pelanggan
  date: string;
  time: string;
  items: OrderItem[];
  amount: number;
  payment: string;
  status: OrderStatus;
  deliveryOption: string;
  address: string;
  notes?: string; // Tambahkan catatan pesanan
  estimatedDelivery?: string; // Tambahkan estimasi pengiriman
  trackingNumber?: string; // Tambahkan nomor resi
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      case OrderStatus.PENDING_PAYMENT: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case OrderStatus.WAITING_VERIFICATION: return "bg-blue-100 text-blue-800 border-blue-200";
      case OrderStatus.PROCESSING: return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case OrderStatus.PACKING: return "bg-purple-100 text-purple-800 border-purple-200";
      case OrderStatus.SHIPPED: return "bg-orange-100 text-orange-800 border-orange-200";
      case OrderStatus.COMPLETED: return "bg-green-100 text-green-800 border-green-200";
      case OrderStatus.CANCELLED: return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const statusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT: return <FaClock className="mr-1" />;
      case OrderStatus.WAITING_VERIFICATION: return <FaExclamationCircle className="mr-1" />;
      case OrderStatus.PROCESSING: return <FaBox className="mr-1" />;
      case OrderStatus.PACKING: return <FaBox className="mr-1" />;
      case OrderStatus.SHIPPED: return <FaShippingFast className="mr-1" />;
      case OrderStatus.COMPLETED: return <FaCheckCircle className="mr-1" />;
      case OrderStatus.CANCELLED: return <FaTimes className="mr-1" />;
    }
  };

  // --- Fetch orders dari backend ---
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/orders");
      const data: Order[] = res.data.data.map((o: any) => ({
        id: o.orderId,
        orderNumber: o.orderNumber,
        customer: `${o.address.user.firstName} ${o.address.user.lastName}`,
        customerEmail: o.address.user.email, // Tambahkan email
        customerPhone: o.address.user.phone, // Tambahkan telepon
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
        notes: o.notes, // Tambahkan catatan
        estimatedDelivery: o.estimatedDelivery, // Tambahkan estimasi pengiriman
        trackingNumber: o.trackingNumber, // Tambahkan nomor resi
      }));
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data order:", error);
      toast.error("Gagal mengambil data order.");
    } finally {
      setIsLoading(false);
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
        o.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.customerPhone && o.customerPhone.includes(searchTerm))
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
      <motion.div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Detail Pesanan</h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="mt-2 text-orange-100">Nomor Pesanan: {selectedOrder.orderNumber}</p>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide max-h-[60vh]">
            {/* Informasi Pelanggan */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaUser className="mr-2 text-orange-500" /> Informasi Pelanggan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm text-gray-500 capitalize">Nama</h5>
                  <p className="font-medium capitalize">{selectedOrder.customer}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Email</h5>
                  <p className="font-medium">{selectedOrder.customerEmail || "-"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Telepon</h5>
                  <p className="font-medium capitalize">{selectedOrder.customerPhone || "-"}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Tanggal & Waktu</h5>
                  <p className="font-medium">{selectedOrder.date} {selectedOrder.time}</p>
                </div>
              </div>
            </div>

            {/* Informasi Pengiriman */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                {selectedOrder.deliveryOption === "Diantar" ? 
                  <FaTruck className="mr-2 text-orange-500" /> : 
                  <FaStore className="mr-2 text-orange-500" />
                } Informasi Pengiriman
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm text-gray-500">Opsi Pengiriman</h5>
                  <p className="font-medium">{selectedOrder.deliveryOption}</p>
                </div>
                {selectedOrder.estimatedDelivery && (
                  <div>
                    <h5 className="text-sm text-gray-500">Estimasi Pengiriman</h5>
                    <p className="font-medium">{selectedOrder.estimatedDelivery}</p>
                  </div>
                )}
                {selectedOrder.trackingNumber && (
                  <div>
                    <h5 className="text-sm text-gray-500">Nomor Resi</h5>
                    <p className="font-medium">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
                {selectedOrder.deliveryOption === "Diantar" && (
                  <div className="md:col-span-2">
                    <h5 className="text-sm text-gray-500">Alamat Pengiriman</h5>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Pembayaran */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaMoneyBillWave className="mr-2 text-orange-500" /> Informasi Pembayaran
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm text-gray-500">Metode Pembayaran</h5>
                  <p className="font-medium">{selectedOrder.payment}</p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Total Pembayaran</h5>
                  <p className="font-medium text-lg text-orange-600">Rp {selectedOrder.amount.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>

            {/* Status Pesanan */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Status Pesanan</h4>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleOrderStatusChange(e.target.value as OrderStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.values(OrderStatus).map(s => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>

            {/* Items */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaShoppingCart className="mr-2 text-orange-500" /> Item Pesanan
              </h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Rp {item.price.toLocaleString("id-ID")} x {item.quantity}</p>
                    </div>
                    <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan */}
            {selectedOrder.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Catatan Pesanan</h4>
                <p className="text-gray-700">{selectedOrder.notes}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Tutup
            </button>
            <button 
              onClick={updateOrderStatus} 
              className="px-6 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
            >
              Update Status
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-3 text-orange-500" /> Kelola Pesanan
          </h2>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pesanan..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center mb-3">
          <FaFilter className="mr-2 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filter Status</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === "ALL" 
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >Semua</button>
          {Object.values(OrderStatus).map(s => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                activeFilter === s 
                  ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {statusIcon(s)}
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Orders List */}
          {currentOrderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-sm p-12 text-gray-700 space-y-4">
              <div className="text-6xl text-orange-400">
                <FaShoppingCart />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Tidak ada pesanan dengan status "{activeFilter === "ALL" ? "Semua" : statusLabel(activeFilter)}".</h3>
                <p className="text-gray-500 mt-2">Coba periksa filter lain atau lakukan pemesanan baru.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {currentOrderItems.map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-lg text-gray-800">#{order.orderNumber}</p>
                          <p className="text-gray-500 text-sm flex items-center mt-1">
                            <FaCalendarAlt className="mr-1" /> {order.date} {order.time}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center border ${statusColor(order.status)}`}>
                          {statusIcon(order.status)}
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-700 font-medium flex capitalize items-center">
                          <FaUser className="mr-2 text-gray-400 capitalize" /> {order.customer}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                          {order.deliveryOption === "Diantar" ? 
                            <><FaTruck className="mr-1" /> {order.deliveryOption}</> : 
                            <><FaStore className="mr-1" /> {order.deliveryOption}</>
                          }
                        </p>
                      </div>

                      <div className="border-t pt-3 mb-3">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.name} x{item.quantity}</span>
                              <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500 italic">+{order.items.length - 2} item lainnya</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-bold text-lg text-orange-600">Rp {order.amount.toLocaleString("id-ID")}</p>
                        </div>
                        <button 
                          onClick={() => openOrderModal(order)} 
                          className="bg-orange-100 text-orange-600 p-2 rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalOrderPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page 
                      ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalOrderPages))}
                disabled={currentPage === totalOrderPages}
                className={`p-2 rounded-lg ${currentPage === totalOrderPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {renderOrderModal()}
    </div>
  );
}