// Notifications.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes } from "react-icons/fa";

// Type definitions
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "order" | "payment" | "stock" | "review";
}

// Initial data
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Pesanan Baru",
    message: "Budi Santoso telah melakukan pemesanan",
    time: "5 menit yang lalu",
    isRead: false,
    type: "order",
  },
  {
    id: 2,
    title: "Pembayaran Diterima",
    message: "Pembayaran untuk INV-2023081502 telah diterima",
    time: "1 jam yang lalu",
    isRead: false,
    type: "payment",
  },
  {
    id: 3,
    title: "Stok Menipis",
    message: "Stok untuk Ayam Goreng Lengkuas hampir habis",
    time: "3 jam yang lalu",
    isRead: true,
    type: "stock",
  },
  {
    id: 4,
    title: "Ulasan Baru",
    message: "Siti Nurhaliza memberikan ulasan 5 bintang",
    time: "1 hari yang lalu",
    isRead: true,
    type: "review",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Notification functions
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const openNotificationModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  // Render notification modal
  const renderNotificationModal = () => (
    <AnimatePresence>
      {isNotificationModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsNotificationModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedNotification?.title}
                </h3>
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">{selectedNotification?.message}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{selectedNotification?.time}</span>
                <span className="mx-2">•</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedNotification?.type === "order"
                      ? "bg-blue-100 text-blue-800"
                      : selectedNotification?.type === "payment"
                      ? "bg-green-100 text-green-800"
                      : selectedNotification?.type === "stock"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {selectedNotification?.type === "order"
                    ? "Pesanan"
                    : selectedNotification?.type === "payment"
                    ? "Pembayaran"
                    : selectedNotification?.type === "stock"
                    ? "Stok"
                    : "Ulasan"}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsNotificationModalOpen(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
        <button
          onClick={markAllAsRead}
          className="text-orange-500 hover:text-orange-600"
        >
          Tandai semua telah dibaca
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => openNotificationModal(notification)}
              >
                <div className="flex items-start">
                  <div className="shrink-0 pt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        !notification.isRead ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.type === "order"
                            ? "bg-blue-100 text-blue-800"
                            : notification.type === "payment"
                            ? "bg-green-100 text-green-800"
                            : notification.type === "stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {notification.type === "order"
                          ? "Pesanan"
                          : notification.type === "payment"
                          ? "Pembayaran"
                          : notification.type === "stock"
                          ? "Stok"
                          : "Ulasan"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Modal */}
      {renderNotificationModal()}
    </div>
  );
}