"use client";

import { motion } from "framer-motion";
import { FaTimes, FaPlus, FaStar } from "react-icons/fa";
import { MenuItem } from "./home/favoriteMenu"; 

type DetailMenuProps = {
  menu: MenuItem;
  onClose: () => void;
  onAddToCart: (menuItemId: string) => void;
};

export default function DetailMenu({
  menu,
  onClose,
  onAddToCart,
}: DetailMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-auto max-h-[90vh] scrollbar-hide"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* IMAGE */}
        <div className="relative h-64 md:h-80">
          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2"
          >
            <FaTimes />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-2xl font-bold">{menu.name}</h3>
            <span className="bg-[#9C633D] text-white px-4 py-1 rounded-full">
              Rp{parseFloat(menu.price).toLocaleString("id-ID")}
            </span>
          </div>

          {menu.isFavorite && (
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mb-4">
              <FaStar className="mr-1" /> Menu Favorit
            </div>
          )}

          <p className="text-gray-600 mb-6">{menu.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium text-green-600">
                {menu.isAvailable ? "Tersedia" : "Habis"}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onAddToCart(menu.menuItemId)}
              className="flex-1 bg-[#9C633D] text-white py-3 rounded-lg flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Tambah ke Pesanan
            </button>

            <button
              onClick={onClose}
              className="border px-6 py-3 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
