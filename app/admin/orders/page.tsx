"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance"; // pastikan path benar

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
  status: "Diproses" | "Selesai" | "Dibatalkan" | string;
  deliveryOption: string;
  address: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Fetch all orders dari backend ---
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
        status: mapStatus(o.status),
        deliveryOption: o.address.delivery === "DELIVERY" ? "Diantar" : "Makan di Tempat",
        address: o.address.description,
      }));
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data order:", error);
    }
  };

  // --- Map backend status ke frontend ---
  const mapStatus = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
      case "WAITING_VERIFICATION":
      case "PROCESSING":
      case "PACKING":
      case "SHIPPED":
        return "Diproses";
      case "COMPLETED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- Filter orders berdasarkan search ---
  useEffect(() => {
    if (!searchTerm) return setFilteredOrders(orders);
    setFilteredOrders(
      orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.payment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, orders]);

  // --- Modal & Update Status ---
  const openEditOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.id;

    try {
      // TODO: bisa sesuaikan endpoint update status di backend
      // Saat ini menggunakan PUT /verify sebagai contoh
      await axiosInstance.put(`/orders/${orderId}/verify`, {});

      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
      );
      setFilteredOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
      );

      setIsOrderModalOpen(false);
      alert("Status pesanan berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal update status pesanan.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrderItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Render modal ---
  const renderOrderModal = () => {
    if (!selectedOrder) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Detail Pesanan</h3>
            <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">ID Pesanan</h4>
                <p className="font-medium">{selectedOrder.orderNumber}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Pelanggan</h4>
                <p className="font-medium capitalize">{selectedOrder.customer}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Tanggal & Waktu</h4>
                <p className="font-medium">{selectedOrder.date} {selectedOrder.time}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Pembayaran</h4>
                <p className="font-medium">{selectedOrder.payment}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Opsi Pengiriman</h4>
                <p className="font-medium">{selectedOrder.deliveryOption}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                <select
                  name="status"
                  value={selectedOrder.status || ""}
                  onChange={handleOrderChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Item Pesanan</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Rp {item.price.toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">Rp {(item.quantity * item.price).toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total</td>
                      <td className="px-4 py-2 text-sm font-bold text-orange-500">Rp {selectedOrder.amount.toLocaleString("id-ID")}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedOrder.deliveryOption === "Diantar" && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Alamat Pengiriman</h4>
                <p className="font-medium">{selectedOrder.address}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3">Tutup</button>
            <button onClick={updateOrderStatus} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Update Status</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pesanan</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pesanan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {currentOrderItems.map((order) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date} {order.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Rp {order.amount.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payment}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "Selesai" ? "bg-green-100 text-green-800" : order.status === "Diproses" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => openEditOrderModal(order)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                    
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalOrderPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
            <button onClick={() => paginate(currentPage < totalOrderPages ? currentPage + 1 : totalOrderPages)} disabled={currentPage === totalOrderPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-medium">{filteredOrders.length}</span> results</p>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><FaChevronLeft /></button>
              {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => paginate(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? "z-10 bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>{page}</button>
              ))}
              <button onClick={() => paginate(currentPage < totalOrderPages ? currentPage + 1 : totalOrderPages)} disabled={currentPage === totalOrderPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"><FaChevronRight /></button>
            </nav>
          </div>
        </div>
      )}

      {/* Modal */}
      {isOrderModalOpen && renderOrderModal()}
    </div>
  );
}
