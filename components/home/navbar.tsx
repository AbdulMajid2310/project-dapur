"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaStar,
  FaQrcode,
  FaQuestionCircle,
  FaEnvelope,
  FaShoppingCart,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
  FaChevronDown,
  FaUserCircle,
  FaImage,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CheckoutCard from "./checkout";
import OrderCustomer from "./orderCustomer";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/user/useUsers";
import Image from "next/image";
import UserProfile from "../usereProfile";

const navigationData = [
  { href: "#beranda", icon: <FaUtensils className="mr-2" />, text: "Beranda" },
  { href: "#features", icon: <FaStar className="mr-2" />, text: "Fitur" },
  { href: "#menu", icon: <FaUtensils className="mr-2" />, text: "Menu" },
  { href: "#how-to-order", icon: <FaQrcode className="mr-2" />, text: "Cara Pesan" },
  { href: "#faq", icon: <FaQuestionCircle className="mr-2" />, text: "FAQ" },
  { href: "#gallery", icon: <FaImage className="mr-2" />, text: "Galeri" },
];

const wartegInfo = { name: "Dapur Umi" };

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const userId = user?.userId;

  const [isScrolled, setIsScrolled] = useState(false);
  const [cart, setCart] = useState<{ totalItems: number }>({ totalItems: 0 });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userDetail, getUserDetail } = useUsers();

  useEffect(() => {
    if (userId) getUserDetail(userId);
  }, [userId]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`/cart/user/${userId}`);
        if (response.data?.data) {
          setCart({ totalItems: response.data.data.totalItems || 0 });
        }
      } catch (error) {
        console.error("Gagal mengambil data cart:", error);
      }
    };
    fetchCart();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCheckout = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    setIsCheckoutOpen(prev => !prev);
    setIsOrdersOpen(false);
    setIsProfileOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleOrders = () => {
    setIsOrdersOpen(prev => !prev);
    setIsCheckoutOpen(false);
    setIsProfileOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(prev => !prev);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    setIsCheckoutOpen(false);
    setIsOrdersOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Anda telah berhasil keluar");
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <>
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 bg-[#FFDD9E] text-gray-700 py-4 text-lg font-semibold ${isScrolled ? "shadow-lg" : ""}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-satisfy font-bold capitalize text-gray-800">{wartegInfo.name}</span>
          </motion.div>

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

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleCheckout}
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaShoppingCart className="text-2xl" />
              {userId && cart.totalItems > 0 && (
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

            {userId ? (
              // User is logged in - show user dropdown
              <div className="relative" ref={dropdownRef}>
                <motion.div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleDropdown}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                    {userDetail?.avatar ? (
                      <Image
                        src={userDetail.avatar}
                        alt="Admin"
                        height={40}
                        width={40}
                        className="object-cover h-full w-full"
                        unoptimized
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <FaChevronDown className="text-xs text-gray-600" />
                </motion.div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 capitalize">{userDetail?.firstName} {userDetail?.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                      </div>

                      <button
                        onClick={toggleProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaUser className="mr-2" /> Profile
                      </button>

                      <button
                        onClick={toggleOrders}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaShoppingBag className="mr-2" /> Pesanan
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t border-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" /> Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // User is not logged in - show login and register buttons
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={handleLogin}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignInAlt className="mr-2" /> Masuk
                </motion.button>
                <motion.button
                  onClick={handleRegister}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUserPlus className="mr-2" /> Daftar
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Checkout Panel */}
      <AnimatePresence>
        {isCheckoutOpen && userId && (
          <motion.div
            className="fixed top-16 right-0 z-60 w-full md:w-96 bg-white scrollbar-hide shadow-xl overflow-y-auto"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <CheckoutCard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Panel */}
      <AnimatePresence>
        {isOrdersOpen && userId && (
          <motion.div
            className="fixed top-16 right-0 z-60 w-full md:w-96 bg-white scrollbar-hide shadow-xl overflow-y-auto"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <OrderCustomer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UserProfile Panel */}
      <AnimatePresence>
        {isProfileOpen && userId && (
          <motion.div
            className="fixed top-16 right-0 z-60 w-full md:w-96 bg-white scrollbar-hide shadow-xl overflow-y-auto"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <UserProfile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}