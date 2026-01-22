"use client";
import { useState, ReactNode, useEffect } from "react";
import {
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaUser,
    FaBars,
    FaTimes,
    FaChartLine,
    FaUtensils,
    FaFileInvoice,
    FaCog
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { PageTitle } from "../../lib/types";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/user/useUsers";
import Image from "next/image";
import { useNotifications } from "@/hooks/useData";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const { userLoading, user, logout } = useAuth();
    const { userDetail, getUserDetail } = useUsers();
    const { notifications } = useNotifications();

    /* ===================== EFFECT ===================== */
    useEffect(() => {
        if (user?.userId) {
            getUserDetail(user.userId);
        }
    }, [user?.userId]);

    useEffect(() => {
        if (!userLoading && (!user || user.role !== "admin")) {
            router.push("/login");
        }
    }, [user, userLoading]);

    /* ===================== PAGE INFO ===================== */
    const getPageInfo = (
        pathname: string
    ): { title: PageTitle; description: string; icon: ReactNode } => {
        switch (pathname) {
            case "/admin":
                return {
                    title: "Dashboard",
                    description: "Ringkasan performa toko Anda",
                    icon: <FaChartLine />
                };
            case "/admin/menu":
                return {
                    title: "Kelola Menu",
                    description: "Atur menu dan harga produk",
                    icon: <FaUtensils />
                };
            case "/admin/orders":
                return {
                    title: "Kelola Pesanan",
                    description: "Pantau dan proses pesanan pelanggan",
                    icon: <FaFileInvoice />
                };
            case "/admin/notifications":
                return {
                    title: "Notifikasi",
                    description: "Aktivitas terbaru sistem",
                    icon: <FaBell />
                };
            case "/admin/gallery":
                return {
                    title: "Kelola Galeri",
                    description: "Aktivitas terbaru sistem",
                    icon: <FaBell />
                };
            default:
                return {
                    title: "Dashboard",
                    description: "Ringkasan performa toko Anda",
                    icon: <FaChartLine />
                };
        }
    };

    const { title, description, icon: pageIcon } = getPageInfo(pathname);
    const unreadCount =
        notifications?.filter((n) => !n.isRead).length ?? 0;

    /* ===================== LOADING ===================== */
    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-linear-to-br from-indigo-50 to-purple-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-indigo-600 font-medium">Memuat panel admin...</p>
                </div>
            </div>
        );
    }

    /* ===================== HANDLER ===================== */
    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <div className="flex h-screen overflow-hidden">
                {/* SIDEBAR */}
                <Sidebar
                    notifications={notifications}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* MAIN */}
                <div className="flex-1 flex flex-col">
                    {/* HEADER */}
                    <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                        <div className="flex gap-2 items-center">

                            {/* MOBILE MENU BUTTON */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <FaBars size={20} />
                            </button>

                            {/* TITLE */}
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center justify-center w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                                    {pageIcon}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-4 relative">


                            {/* NOTIFICATION */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationOpen(!notificationOpen)}
                                    className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <FaBell className="text-gray-700" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-md">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* NOTIFICATION DROPDOWN */}
                                {notificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications && notifications.length > 0 ? (
                                                notifications.slice(0, 5).map((notif, index) => (
                                                    <div key={index} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-indigo-50' : ''}`}>
                                                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                                        <p className="text-xs text-gray-400 mt-2">{new Date(notif.time).toLocaleString('id-ID')}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <p>Tidak ada notifikasi baru</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-gray-50 text-center">
                                            <button
                                                onClick={() => {
                                                    router.push("/admin/notifications");
                                                    setNotificationOpen(false);
                                                }}
                                                className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                                            >
                                                Lihat Semua
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PROFILE */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    <div>

                                        {userDetail?.avatar ? (
                                          <div className="w-10 h-10 relative">
    <Image
        src={userDetail.avatar}
        alt="Admin"
        fill
        className="rounded-full object-cover"
        unoptimized
    />
</div>

                                        ) : (
                                            <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                                <FaUser size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {userDetail?.firstName} {userDetail?.lastName}
                                        </p>

                                    </div>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* PROFILE DROPDOWN */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{userDetail?.firstName} {userDetail?.lastName}</p>
                                            <p className="text-xs text-gray-500">{userDetail?.email || "admin@example.com"}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                router.push("/admin/profile");
                                                setProfileOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <FaUser className="text-gray-500" />
                                            Profil Saya
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push("/admin/settings");
                                                setProfileOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <FaCog className="text-gray-500" />
                                            Pengaturan
                                        </button>
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <FaSignOutAlt />
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-120px)]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}