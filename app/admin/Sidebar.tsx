// components/Sidebar.tsx
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
} from "react-icons/fa";
import { Notification, NavigationItem } from "../../lib/types";

interface SidebarProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
}

const navigation: NavigationItem[] = [
  { id: "dashboard", icon: <FaChartLine />, label: "Dashboard", href: "/admin" },
  {
    id: "financial",
    icon: <FaMoneyBillWave />,
    label: "Laporan Keuangan",
    href: "/admin/financial",
  },
  { id: "menu", icon: <FaUtensils />, label: "Kelola Menu", href: "/admin/menu" },
  {
    id: "customers",
    icon: <FaUsers />,
    label: "Pelanggan",
    href: "/admin/customers",
  },
  { id: "orders", icon: <FaFileInvoice />, label: "Pesanan", href: "/admin/orders" },
  {
    id: "notifications",
    icon: <FaBell />,
    label: "Notifikasi",
    href: "/admin/notifications",
  },
  { id: "gallery", icon: <FaImages />, label: "Galeri", href: "/admin/gallery" },
  {
    id: "testimonials",
    icon: <FaQuoteLeft />,
    label: "Testimoni",
    href: "/admin/testimonials",
  },
  { id: "faq", icon: <FaQuestionCircle />, label: "FAQ", href: "/admin/faqs" },
  {
    id: "profile",
    icon: <FaCog />,
    label: "Pengaturan Profil",
    href: "/admin/profile",
  },
];

export default function Sidebar({ notifications, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

 const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => !n.isRead).length
  : 0;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="text-xl font-bold">Warteg Sederhana</span>
        </div>
        {/* Close btn mobile */}
        <button className="md:hidden text-white" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`w-full flex items-center px-4 py-3 text-left ${
              pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => onClose && onClose()}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
            {item.id === "notifications" && unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        ))}

        <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 mt-8">
          <FaSignOutAlt className="mr-3" /> Keluar
        </button>
      </nav>
    </div>
  );
}