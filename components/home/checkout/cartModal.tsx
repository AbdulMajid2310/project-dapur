"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  subtotal: number;
}

export default function CartModal() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Hardcode userId & delivery fee
  const userId = "07664bdc-47f6-44fe-8993-0c9bd071d831";
  const deliveryFee = 15000; // contoh biaya antar
  const deliveryOption = "delivery"; // "delivery" atau "dine-in"

  // Fetch cart data
  const getUserCart = async () => {
    try {
      const res = await axiosInstance.get(`/cart/user/${userId}`);
      const data: CartItem[] = res.data.data.items;
      setCart(data);

      // Hitung subtotal
      const subtotal = data.reduce((acc, item) => acc + item.subtotal, 0);
      setTotalPrice(subtotal);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    getUserCart();
  }, []);

  // Update quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return deleteItem(cartItemId);
    try {
      await axiosInstance.put(`/cart/item/${cartItemId}`, { quantity });
      getUserCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Delete item
  const deleteItem = async (cartItemId: string) => {
    try {
      await axiosInstance.delete(`/cart/item/${cartItemId}`);
      getUserCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Clear all items
  const clearCart = async () => {
    try {
      await axiosInstance.delete(`/cart/clear/${userId}`);
      getUserCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Hitung grand total
  const grandTotal = totalPrice + (deliveryOption === "delivery" ? deliveryFee : 0);

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
        <div className="p-4 lg:p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FaShoppingCart className="mr-2" /> Keranjang Pesanan
          </h3>
          <motion.button className="text-gray-500 hover:text-gray-700" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FaTimes />
          </motion.button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <FaShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600">Keranjang Anda masih kosong</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Rp{Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaMinus />
                    </motion.button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <motion.button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaPlus />
                    </motion.button>
                  </div>
                  <div className="font-bold text-orange-500">
                    Rp{item.subtotal.toLocaleString("id-ID")}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 lg:p-6 border-t border-slate-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rp{totalPrice.toLocaleString("id-ID")}</span>
              </div>
              {deliveryOption === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Antar</span>
                  <span className="font-medium">Rp{deliveryFee.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">Rp{grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={clearCart}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Hapus Semua
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
