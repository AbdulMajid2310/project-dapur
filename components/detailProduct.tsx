"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPlus, FaStar } from "react-icons/fa";

type MenuItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: "main" | "side" | "drink" | "dessert";
  description: string;
  isFavorite: boolean;
};

export default function DetailProduct() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(true);

  // Data statis contoh menu item
  const selectedMenuItem: MenuItem = {
    id: "1",
    name: "Nasi Goreng Spesial",
    image: "https://images.unsplash.com/photo-1604908177522-3b7a7e2565c4?auto=format&fit=crop&w=800&q=80",
    price: 25000,
    category: "main",
    description:
      "Nasi goreng spesial dengan telur, ayam, dan bumbu rahasia khas warteg kami.",
    isFavorite: true,
  };

  // Dummy addToCart
  const addToCart = (item: MenuItem) => {
    alert(`Berhasil menambahkan "${item.name}" ke pesanan!`);
  };

  if (!isDetailModalOpen) return null;

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
        <div className="relative h-64 md:h-80">
          <img
            src={selectedMenuItem.image}
            alt={selectedMenuItem.name}
            className="w-full h-full object-cover"
          />
          <motion.button
            onClick={() => setIsDetailModalOpen(false)}
            className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedMenuItem.name}
            </h3>
            <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-lg font-bold">
              Rp{selectedMenuItem.price.toLocaleString("id-ID")}
            </div>
          </div>

          {selectedMenuItem.isFavorite && (
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <FaStar className="w-4 h-4 mr-1" />
              Menu Favorit
            </div>
          )}

          <p className="text-gray-600 mb-6">{selectedMenuItem.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Kategori</div>
              <div className="font-medium">
                {selectedMenuItem.category === "main" && "Makanan Utama"}
                {selectedMenuItem.category === "side" && "Lauk Pauk"}
                {selectedMenuItem.category === "drink" && "Minuman"}
                {selectedMenuItem.category === "dessert" && "Dessert"}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div className="font-medium text-green-600">Tersedia</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              onClick={() => {
                addToCart(selectedMenuItem);
                setIsDetailModalOpen(false);
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="w-5 h-5 mr-2" />
              Tambah ke Pesanan
            </motion.button>

            <motion.button
              onClick={() => setIsDetailModalOpen(false)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Tutup
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
