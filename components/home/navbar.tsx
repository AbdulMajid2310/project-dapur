"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaStar,
  FaQrcode,
  FaQuestionCircle,
  FaEnvelope,
  FaShoppingCart,
} from "react-icons/fa";
import CheckoutCard from "./checkout";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";

const navigationData = [
  { href: "#beranda", icon: <FaUtensils className="mr-2" />, text: "Beranda" },
  { href: "#features", icon: <FaStar className="mr-2" />, text: "Fitur" },
  { href: "#menu", icon: <FaUtensils className="mr-2" />, text: "Menu" },
  { href: "#how-to-order", icon: <FaQrcode className="mr-2" />, text: "Cara Pesan" },
  { href: "#testimonials", icon: <FaStar className="mr-2" />, text: "Testimoni" },
  { href: "#faq", icon: <FaQuestionCircle className="mr-2" />, text: "FAQ" },
  { href: "#kontak", icon: <FaEnvelope className="mr-2" />, text: "Kontak" },
];

const wartegInfo = { name: "Dapur Umi" };

export default function Navbar() {
    const {  user } = useAuth();
    const userId = user?.userId
    
  const [isScrolled, setIsScrolled] = useState(false);
  const [cart, setCart] = useState<{ totalItems: number }>({ totalItems: 0 });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  console.log(cart)

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/cart/user/${userId}`);
      if (response.data?.data) {
        setCart({ totalItems: response.data.data.totalItems || 0 });
      }
    } catch (error) {
      console.error("Gagal mengambil data cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCheckout = () => setIsCheckoutOpen((prev) => !prev);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 bg-[#FFDD9E] text-gray-700 py-4 text-lg font-semibold ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-satisfy font-bold text-gray-800">
              {wartegInfo.name}
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="md:flex hidden space-x-8">
            {navigationData.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon} {item.text}
              </motion.a>
            ))}
          </div>

          {/* Cart + Avatar */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleCheckout}
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaShoppingCart className="text-2xl" />
              {cart.totalItems > 0 && (
                <motion.span
                  className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cart.totalItems}
                </motion.span>
              )}
            </motion.button>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/images/product/eat2.jpeg"
                alt="avatar"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* CheckoutCard Mengambang */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            className="fixed top-16 z-60 w-full md:w-96 bg-white shadow-xl overflow-y-auto"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <CheckoutCard />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
