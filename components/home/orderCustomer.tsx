"use client";
import { useCustomerOrders } from '@/lib/hooks/order/useOrder';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { 
  FaCalendarCheck, 
  FaWindowClose, 
  FaTimesCircle,
  FaStar,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaClock,
  FaMoneyBillWave,
  FaCommentDots,
  FaExclamationTriangle
} from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import CreateTestimonialSection from '../testimonials/createTestimonials';
import axiosInstance from '@/lib/axiosInstance';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return { 
        label: 'Menunggu Pembayaran', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <FaMoneyBillWave className="mr-1" />
      };
    case 'WAITING_VERIFICATION':
      return { 
        label: 'Menunggu Verifikasi', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FaClock className="mr-1" />
      };
    case 'PROCESSING':
      return { 
        label: 'Diproses', 
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <FaBox className="mr-1" />
      };
    case 'PACKING':
      return { 
        label: 'Dikemas', 
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <FiPackage className="mr-1" />
      };
    case 'SHIPPED':
      return { 
        label: 'Dikirim', 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <FaTruck className="mr-1" />
      };
    case 'COMPLETED':
      return { 
        label: 'Selesai', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <FaCheckCircle className="mr-1" />
      };
    case 'CANCELLED':
      return { 
        label: 'Dibatalkan', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <FaTimesCircle className="mr-1" />
      };
    default:
      return { 
        label: status.replace('_', ' '), 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: null
      };
  }
};

const filterOptions = [
  { key: 'ALL', label: 'Semua' },
  { key: 'WAITING_VERIFICATION', label: 'Verifikasi' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'PACKING', label: 'Dikemas' },
  { key: 'SHIPPED', label: 'Dikirim' },
  { key: 'COMPLETED', label: 'Selesai' },
  { key: 'CANCELLED', label: 'Dibatalkan' },
];

const OrderCustomerComponent: React.FC = () => {
  const { orders, loading, setOrders } = useCustomerOrders();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrderItemId, setSelectedOrderItemId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const filteredOrders = activeFilter === 'ALL'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-gray-500 text-lg mt-4">Memuat pesanan...</p>
      </div>
    );
  }

  if (!isModalOpen) return null;

  const handleOpenTestimonial = (orderId: string, orderItemId: string, menuItemId: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrderItemId(orderItemId);
    setSelectedItemId(menuItemId);
    setIsTestimonialOpen(true);
  };

const handleCancelOrder = async (orderId: string) => {
  setIsCancelling(orderId);

  try {
    await axiosInstance.put(`/orders/${orderId}/verify`, {
      status: "CANCELLED",
    });

    // ✅ UPDATE STATE LANGSUNG (REAL-TIME)
    setOrders((prevOrders: any[]) =>
      prevOrders.map(order =>
        order.orderId === orderId
          ? { ...order, status: "CANCELLED" }
          : order
      )
    );

  } catch (error) {
    console.error("Failed to cancel order:", error);
  } finally {
    setIsCancelling(null);
  }
};




  const canCancelOrder = (status: string) => {
    return status === 'PENDING_PAYMENT' || status === 'WAITING_VERIFICATION';
  };

  const hasTestimonial = (order: any, itemId: string) => {
    return order.testimonials && order.testimonials.testimonialId;
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white w-full  max-w-2xl h-160 scrollbar-hide overflow-y-auto flex flex-col rounded-3xl shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="w-full p-4 md:p-6">
          <div className='flex justify-between items-center border-b pb-4 mb-6'>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pesanan Saya</h1>
              <p className="text-gray-600 mt-1">Kelola dan lacak semua pesanan Anda</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaWindowClose className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${activeFilter === filter.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isTestimonialOpen ? (
            <AnimatePresence>
              <motion.div 
                className="w-full max-w-2xl mx-auto"
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className=" rounded-2xl  overflow-hidden">
                  <div className="bg-linear-to-r from-blue-600 to-blue-500 text-white p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">Tulis Ulasan</h2>
                        <p className="text-sm mt-1 opacity-90">
                          Bagikan pengalaman Anda dengan produk ini
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsTestimonialOpen(false)} 
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <FaWindowClose className="text-xl" />
                      </button>
                    </div>
                  </div>
                  <CreateTestimonialSection 
                    orderItemId={selectedOrderItemId} 
                    orderId={selectedOrderId} 
                    onClose={() => setIsTestimonialOpen(false)} 
                    menuItemId={selectedItemId} 
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl p-8 md:p-12">
                  <div className="text-6xl mb-4">
                    {activeFilter === 'ALL' ? (
                      <FiPackage className="text-gray-300" />
                    ) : (
                      getStatusStyle(activeFilter).icon || <FaExclamationTriangle className="text-gray-300" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Tidak ada pesanan dengan status "{filterOptions.find(f => f.key === activeFilter)?.label}"
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {activeFilter === 'ALL' 
                      ? "Anda belum memiliki pesanan. Mulai berbelanja untuk melihat pesanan Anda di sini."
                      : "Coba periksa status lain atau lakukan pemesanan baru."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    const isCompleted = order.status === 'COMPLETED';
                    const canCancel = canCancelOrder(order.status);

                    return (
                      <motion.div
                        key={order.orderId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-6">
                          {/* Order Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">Pesanan #{order.orderNumber || order.orderId.substring(0, 8)}</h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <FaCalendarCheck className="w-4 h-4 mr-1" />
                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-3 md:mt-0">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${statusStyle.className}`}>
                                {statusStyle.icon}
                                {statusStyle.label}
                              </span>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Total Pembayaran</p>
                                <p className="text-lg font-bold text-gray-800">
                                  Rp {parseInt(order.grandTotal).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <FiPackage className="w-4 h-4 mr-2" />
                              Detail Pesanan
                            </h4>
                            <ul className="space-y-3">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex items-center justify-between">
                                  <div className="flex items-center flex-1">
                                    <img
                                      src={item.menuItem.image}
                                      alt={item.menuItem.name}
                                      className="w-16 h-16 object-cover rounded-lg mr-4"
                                    />
                                    <div>
                                      <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                                      <div className='flex gap-4 text-sm text-gray-500'>
                                        <span>Rp {parseInt(item.priceAtPurchase).toLocaleString('id-ID')}</span>
                                        <span className="capitalize">Qty: {item.quantity}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                      Rp {parseInt(item.subtotal).toLocaleString('id-ID')}
                                    </p>
                                    
                                    {/* Testimonial Button */}
                                    {isCompleted && (
                                      <div className="mt-2">
                                        {hasTestimonial(order, item.orderItemId) ? (
                                          <div className="flex items-center text-green-600 text-sm">
                                            <FaStar className="mr-1" />
                                            <span>Ulasan diberikan</span>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => handleOpenTestimonial(order.orderId, item.orderItemId, item.menuItem.menuItemId)}
                                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                          >
                                            <FaCommentDots className="mr-1" />
                                            Beri Ulasan
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Order Footer */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t">
                            <div className="flex items-center space-x-4 mb-3 md:mb-0 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FaMoneyBillWave className={`w-4 h-4 mr-1 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-600'}`}>
                                  {order.paymentStatus === 'PAID' ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                              {canCancel && (
                                <button
                                  onClick={() => handleCancelOrder(order.orderId)}
                                  disabled={isCancelling === order.orderId}
                                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center disabled:opacity-50"
                                >
                                  {isCancelling === order.orderId ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600 mr-2"></div>
                                      Membatalkan...
                                    </>
                                  ) : (
                                    <>
                                      <FaTimesCircle className="mr-1" />
                                      Batalkan Pesanan
                                    </>
                                  )}
                                </button>
                              )}
                              
                              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderCustomerComponent;