"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaCheckSquare, FaSquare } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";

interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  subtotal: number;
}

interface CartModalProps {
  onSelectItems: (ids: string[]) => void;
}

export default function CartModal({ onSelectItems }: CartModalProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // STATE UNTUK ITEM YANG DIPILIH
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);

  const { user } = useAuth();
  const userId = "f884b326-0012-4fa2-ad7a-f5f3641abc55";

  // Fetch cart data
  const getUserCart = async () => {
    try {
      const res = await axiosInstance.get(`/cart/user/${userId}`);
      const data: CartItem[] = res.data.data.items;
      setCart(data);
      
      // Tidak memilih semua item secara default
      setSelectedCartIds([]);
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
      setSelectedCartIds(prev => prev.filter(id => id !== cartItemId));
      getUserCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Clear all items
  const clearCart = async () => {
    try {
      await axiosInstance.delete(`/cart/clear/${userId}`);
      setSelectedCartIds([]);
      getUserCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // FUNGSI TOGGLE CHECKBOX (PILIH / BATAL PILIH)
  const toggleSelectItem = (id: string) => {
    setSelectedCartIds(prev => {
      const updated = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      
      // Kirim ID yang dipilih ke komponen induk
      onSelectItems(updated);
      return updated;
    });
  };

  // FUNGSI UNTUK MEMILIH SEMUA ITEM
  const selectAllItems = () => {
    const allIds = cart.map(item => item.id);
    setSelectedCartIds(allIds);
    // Kirim semua ID ke komponen induk
    onSelectItems(allIds);
  };

  // FUNGSI UNTUK MEMBATALKAN PEMILIHAN SEMUA ITEM
  const deselectAllItems = () => {
    setSelectedCartIds([]);
    // Kirim array kosong ke komponen induk
    onSelectItems([]);
  };

  // Cek apakah semua item sudah dipilih
  const allItemsSelected = cart.length > 0 && selectedCartIds.length === cart.length;

  // HITUNG TOTAL BERDASARKAN ITEM YANG DICENTANG
  useEffect(() => {
    const subtotal = cart
      .filter(item => selectedCartIds.includes(item.id))
      .reduce((acc, item) => acc + item.subtotal, 0);

    setTotalPrice(subtotal);
  }, [selectedCartIds, cart]);

  const grandTotal = totalPrice;

  return (
    <motion.div
      className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] scrollbar-hide overflow-hidden flex flex-col"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center ">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FaShoppingCart className="mr-2" /> Keranjang Pesanan
        </h3>
        <div className="flex items-center space-x-2">
          {cart.length > 0 && (
            <button
              onClick={allItemsSelected ? deselectAllItems : selectAllItems}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {allItemsSelected ? (
                <>
                  <FaCheckSquare className="text-orange-500" />
                  <span>Batal Pilih Semua</span>
                </>
              ) : (
                <>
                  <FaSquare className="text-gray-500" />
                  <span>Pilih Semua</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 scrollbar-hide overflow-y-auto p-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">Keranjang Anda masih kosong</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* CHECKBOX LINGKARAN */}
                <div
                  className="cursor-pointer"
                  onClick={() => toggleSelectItem(item.id)}
                >
                  <CircleCheckbox
                    checked={selectedCartIds.includes(item.id)}
                  />
                </div>

                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Rp{Number(item.price).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <FaMinus />
                  </motion.button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
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
        <div className="p-4 border-t border-slate-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              Rp{totalPrice.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span className="text-orange-500">
              Rp{grandTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* =======================
   COMPONENT CHECKBOX BULAT
   ======================= */
const CircleCheckbox = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
    ${checked ? "border-orange-500" : "border-gray-300"}`}
  >
    {checked && (
      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
    )}
  </div>
);