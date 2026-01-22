"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaCog,
  FaUsers,
  FaUtensils,
  FaFileInvoice,
  FaBell,
  FaImages,
  FaQuoteLeft,
  FaQuestionCircle,
  FaSignOutAlt,
  FaHome,
  FaStore,
  FaClipboardList,
  FaTags,
  FaChartBar,
  FaUserCog,
  FaTimes,
  FaUser
} from "react-icons/fa";
import { Notification, NavigationItem } from "../../lib/types";
import { useState } from "react";

interface SidebarProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
}

const navigation: NavigationItem[] = [
  { 
    id: "dashboard", 
    icon: <FaChartLine />, 
    label: "Dashboard", 
    href: "/admin",
    color: "from-sky-500 to-sky-600"       // Biru cerah
  },
  { 
    id: "menu", 
    icon: <FaUtensils />, 
    label: "Kelola Menu", 
    href: "/admin/menu",
    color: "from-amber-500 to-amber-600"   // Kuning makanan
  },
  { 
    id: "orders", 
    icon: <FaFileInvoice />, 
    label: "Pesanan", 
    href: "/admin/orders",
    color: "from-emerald-500 to-emerald-600" // Hijau transaksi
  },
  { 
    id: "gallery", 
    icon: <FaImages />, 
    label: "Galeri", 
    href: "/admin/gallery",
    color: "from-violet-500 to-violet-600" // Ungu modern
  },
  { 
    id: "testimonials", 
    icon: <FaQuoteLeft />, 
    label: "Testimonial", 
    href: "/admin/testimonials",
    color: "from-rose-500 to-rose-600"     // Merah lembut
  },
  { 
    id: "faq", 
    icon: <FaQuestionCircle />, 
    label: "FAQ", 
    href: "/admin/faqs",
    color: "from-cyan-500 to-cyan-600"     // Biru muda informatif
  },
  { 
    id: "profile", 
    icon: <FaCog />, 
    label: "Pengaturan Profil", 
    href: "/admin/profile",
    color: "from-slate-500 to-slate-600"   // Netral profesional
  },
];


export default function Sidebar({ notifications, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-indigo-700 flex items-center justify-between">
          <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-2"}`}>
            <div className="w-10 h-10  rounded-xl flex items-center justify-center backdrop-blur-sm">
              <img src="/images/logo.png" alt="logo" className="h-8 w-8 object-contain" />
            </div>
            {!collapsed && <span className="text-xl font-bold">Dapur Umi</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* COLLAPSE BUTTON FOR DESKTOP */}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
              </svg>
            </button>
            {/* CLOSE BUTTON FOR MOBILE */}
            <button className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={onClose}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 scrollbar-hide overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`group flex items-center ${collapsed ? "justify-center" : ""} p-3 rounded-xl transition-all ${
                      isActive 
                        ? `bg-linear-to-r ${item.color} shadow-lg` 
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => onClose && onClose()}
                  >
                    <div>

                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"} transition-colors`}>
                      {item.icon}
                    </div>
                    </div>
                    {!collapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                    {!collapsed && item.id === "notifications" && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-indigo-700">
          <button className={`group flex items-center ${collapsed ? "justify-center" : ""} w-full p-3 rounded-xl hover:bg-white/10 transition-colors`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
              <FaSignOutAlt />
            </div>
            {!collapsed && <span className="ml-3 font-medium">Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
}