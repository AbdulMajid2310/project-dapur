// components/AdminLayout.tsx
"use client";
import { useState, ReactNode, useEffect } from "react"; // ✅ tambah useEffect
import { FaHome, FaBell, FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { Notification, PageTitle } from "../../lib/types";
import { usePathname, useRouter } from "next/navigation"; // ✅ tambah useRouter
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/user/useUsers";
import Image from "next/image";

interface AdminLayoutProps {
  children: ReactNode;
  notifications: Notification[];
}

export default function AdminLayout({
  children,
  notifications,
}: AdminLayoutProps) {
  const router = useRouter(); // ✅
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userLoading, user, logout } = useAuth(); // ✅ sesuaikan dengan hook kamu
  const [profileOpen, setProfileOpen] = useState(false);

  const { userDetail, getUserDetail } = useUsers();

  useEffect(() => {
    if (user?.userId) {
      getUserDetail(user.userId);
    }
  }, [user?.userId]);
  const pathname = usePathname();

  // ✅ PROTEKSI ROUTE ADMIN
  useEffect(() => {
    if (!userLoading) {
      // kalau tidak ada user → ke login
      if (!user) {
        router.push("/login");
        return;
      }

      // kalau ada user tapi bukan admin → ke login (atau /unauthorized)
      if (user?.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, userLoading, router]);

  const getPageInfo = (
    pathname: string
  ): { title: PageTitle; description: string } => {
    switch (pathname) {
      case "/admin":
        return {
          title: "Dashboard",
          description: "Ringkasan performa toko Anda",
        };
      case "/admin/financial":
        return {
          title: "Laporan Keuangan",
          description: "Pantau pendapatan dan pengeluaran toko Anda",
        };
      case "/admin/menu":
        return {
          title: "Kelola Menu",
          description: "Kelola menu makanan dan minuman",
        };
      case "/admin/customers":
        return {
          title: "Kelola Pelanggan",
          description: "Kelola data pelanggan",
        };
      case "/admin/orders":
        return {
          title: "Kelola Pesanan",
          description: "Kelola pesanan masuk",
        };
      case "/admin/notifications":
        return {
          title: "Notifikasi",
          description: "Lihat notifikasi terbaru",
        };
      case "/admin/gallery":
        return {
          title: "Kelola Galeri",
          description: "Kelola galeri foto toko",
        };
      case "/admin/testimonials":
        return {
          title: "Kelola Testimoni",
          description: "Kelola testimoni pelanggan",
        };
      case "/admin/faq":
        return {
          title: "Kelola FAQ",
          description: "Kelola pertanyaan yang sering diajukan",
        };
      case "/admin/profile":
        return {
          title: "Pengaturan Profil",
          description: "Kelola informasi toko Anda",
        };
      default:
        return {
          title: "Dashboard",
          description: "Ringkasan performa toko Anda",
        };
    }
  };

  const { title, description } = getPageInfo(pathname);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  // ✅ Tampilkan loading dulu supaya tidak flicker
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout()

      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/login");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          notifications={notifications}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className="md:hidden text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <FaHome className="text-3xl" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {title}
                </h1>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>

            <div className="flex items-center lg:space-x-4 spacex-2">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="relative flex items-center space-x-2">
                {/* AVATAR BUTTON */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-gray-200"
                >
                  {userDetail?.avatar ? (
                    <Image
                      src={userDetail.avatar}
                      alt="Admin"
                      height={40}
                      width={40}
                      className="object-cover h-full w-full "
                      unoptimized
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                </button>

                <div className="hidden sm:block">
                  <p className="font-medium capitalize text-gray-800">
                    {userDetail?.firstName} {userDetail?.lastName}
                  </p>
                </div>

                {/* DROPDOWN MENU */}
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800">
                        {userDetail?.firstName} {userDetail?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{userDetail?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/admin/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      👤 Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      🚪 Keluar
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
