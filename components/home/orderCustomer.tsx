import { useCustomerOrders } from '@/lib/hooks/order/useOrder';
import { motion } from 'framer-motion';
import React, { useState } from 'react'; // Impor useState
import { FaCalendarCheck, FaWindowClose } from 'react-icons/fa';
import { FaRegCreditCard, FaSackDollar } from 'react-icons/fa6';
import { FiPackage } from 'react-icons/fi';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return { label: 'Pending Payment', className: 'bg-yellow-100 text-yellow-800' };
    case 'WAITING_VERIFICATION':
      return { label: 'Waiting Verification', className: 'bg-blue-100 text-blue-800' };
    case 'PROCESSING':
      return { label: 'Processing', className: 'bg-indigo-100 text-indigo-800' };
    case 'PACKING':
      return { label: 'Packing', className: 'bg-purple-100 text-purple-800' };
    case 'SHIPPED':
      return { label: 'Shipped', className: 'bg-orange-100 text-orange-800' };
    case 'COMPLETED':
      return { label: 'Completed', className: 'bg-green-100 text-green-800' };
    case 'CANCELLED':
      return { label: 'Cancelled', className: 'bg-red-100 text-red-800' };
    default:
      return { label: status.replace('_', ' '), className: 'bg-gray-100 text-gray-800' };
  }
};

// Definisikan opsi filter
const filterOptions = [
  { key: 'ALL', label: 'Semua' },
  { key: 'WAITING_VERIFICATION', label: 'Verifikasi' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'PACKING', label: 'Dikemas' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
  // Anda bisa menambahkan status lain jika perlu
];

const OrderCustomerComponent: React.FC = () => {
  const { orders, loading } = useCustomerOrders();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const filteredOrders = activeFilter === 'ALL'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading orders...</p>
      </div>
    );
  }

  if (!isModalOpen) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40">
      <motion.div className="bg-slate-50 w-full md:w-3xl h-[calc(100vh-4rem)] scrollbar-hide overflow-y-auto flex flex-col rounded-2xl shadow-xl">
        <div className="max-w-5xl mx-auto p-4">
          <div className='flex justify-between mb-6 items-center'>

            <h1 className="text-2xl font-bold ">Pesanan Saya</h1>
            <button onClick={() => setIsModalOpen(false)}>
              <FaWindowClose />
            </button>
          </div>

          {/* Tombol Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <p className="flex flex-col items-center justify-center text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-gray-700 space-y-2">
              <span className="text-4xl">📭</span> {/* ikon */}
              <span className="text-lg font-semibold">
                Tidak ada pesanan dengan status &quot;
                {filterOptions.find(f => f.key === activeFilter)?.label}
                &quot;.
              </span>
              <span className="text-sm text-gray-500">
                Coba periksa status lain atau lakukan pemesanan baru.
              </span>
            </p>

          ) : (
            // --- AWAL KODE YANG DIPERBAIKI ---
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusStyle = getStatusStyle(order.status);

                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Header: Nomor Pesanan dan Status */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-4 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase ${statusStyle.className}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Grid Informasi Utama */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaCalendarCheck className="w-4 h-4 text-gray-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaSackDollar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          Rp {parseInt(order.grandTotal).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaRegCreditCard className="w-4 h-4 text-gray-400" />
                        <span>{order.paymentStatus.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Daftar Item */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FiPackage className="w-4 h-4 mr-2" />
                        Detail Pesanan
                      </h4>
                      <ul className="space-y-3">
                        {order.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center flex-1">
                              <img
                                src={item.menuItem.image}
                                alt={item.menuItem.name}
                                className="w-14 h-14 object-cover rounded-full mr-4"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900 ml-4">
                              Rp {parseInt(item.priceAtPurchase).toLocaleString('id-ID')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            // --- AKHIR KODE YANG DIPERBAIKI ---
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderCustomerComponent;