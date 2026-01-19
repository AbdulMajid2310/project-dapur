"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUtensils, FaMotorcycle } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";

type Address = {
  addressId: string;
  delivery: "ON_PLACE" | "DELIVERY";
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type OrderInfo = {
  deliveryOption: "dine-in" | "delivery";
  tableNumber: string;
  address: string;
  note: string;
};

export default function OrderModal() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    deliveryOption: "dine-in",
    tableNumber: "",
    address: "",
    note: "",
  });

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(true); // kontrol modal internal

  // Hardcode userId
  const userId = "07664bdc-47f6-44fe-8993-0c9bd071d831";

  // fetch addresses by userId from backend
  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/addresses?userId=${userId}`);
        setUserAddresses(res.data || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, isOpen]);

  const handleOrderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const payload = {
        delivery: orderInfo.deliveryOption === "dine-in" ? "ON_PLACE" : "DELIVERY",
        description:
          orderInfo.deliveryOption === "dine-in"
            ? orderInfo.tableNumber
            : orderInfo.address,
        notes: orderInfo.note,
        userId,
      };

      await axiosInstance.post("/addresses", payload);

      // reset form atau bisa tampilkan notifikasi
      setIsOpen(false);
      alert("Berhasil submit order, lanjut ke pembayaran!");
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Informasi Pemesanan
          </h3>
          <motion.button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleOrderSubmit} id="order-form" className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Opsi Pengiriman */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opsi Pengiriman
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() =>
                    setOrderInfo((prev) => ({ ...prev, deliveryOption: "dine-in" }))
                  }
                  className={`py-3 px-4 rounded-lg border transition-colors flex items-center justify-center ${
                    orderInfo.deliveryOption === "dine-in"
                      ? "border-orange-500 bg-orange-50 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUtensils className="mr-2" /> Makan di Tempat
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() =>
                    setOrderInfo((prev) => ({ ...prev, deliveryOption: "delivery" }))
                  }
                  className={`py-3 px-4 rounded-lg border transition-colors flex items-center justify-center ${
                    orderInfo.deliveryOption === "delivery"
                      ? "border-orange-500 bg-orange-50 text-orange-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaMotorcycle className="mr-2" /> Diantar ke Rumah
                </motion.button>
              </div>
            </div>

            {/* Input Table / Address */}
            {orderInfo.deliveryOption === "dine-in" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Meja
                </label>
                <input
                  type="text"
                  name="tableNumber"
                  value={orderInfo.tableNumber}
                  onChange={handleOrderInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Contoh: Meja 5"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Pengiriman
                </label>
                <textarea
                  name="address"
                  value={orderInfo.address}
                  onChange={handleOrderInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan (Opsional)
              </label>
              <textarea
                name="note"
                value={orderInfo.note}
                onChange={handleOrderInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Contoh: Tidak menggunakan sambal"
              />
            </div>

            {/* Daftar alamat sebelumnya */}
            {loading ? (
              <p className="text-gray-500">Loading alamat sebelumnya...</p>
            ) : userAddresses.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-gray-800 font-semibold mb-2">
                  Alamat / Meja sebelumnya
                </h4>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {userAddresses.map((addr) => (
                    <li
                      key={addr.addressId}
                      className="border p-3 rounded-lg bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm">
                          {addr.delivery === "ON_PLACE"
                            ? `Meja: ${addr.description || "–"}`
                            : `Alamat: ${addr.description || "–"}`}
                        </p>
                        {addr.notes && (
                          <p className="text-xs text-gray-500">Catatan: {addr.notes}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(addr.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 mt-2">Belum ada alamat sebelumnya</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="lg:p-6 p-4 border-t border-slate-200">
          <motion.button
            onClick={handleOrderSubmit}
            type="submit"
            form="order-form"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Lanjut ke Pembayaran
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
