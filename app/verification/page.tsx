"use client";

import { useEffect, useState } from "react"; // Tambahkan useState
import { useRouter } from "next/navigation";
import { FaSpinner, FaShieldAlt, FaCheckCircle } from "react-icons/fa"; // Tambahkan FaCheckCircle
import { useAuth } from "@/lib/hooks/useAuth";

export default function VerificationPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  // State untuk mengontrol animasi sukses
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Jika user sudah ada dan tidak dalam proses loading
    if (user && !userLoading) {
      // Tampilkan animasi sukses dulu
      setShowSuccess(true);

      // Setelah 2 detik, alihkan pengguna
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, userLoading, router]);

  // --- Tampilan Saat Memuat Data User ---
  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
        <div className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center text-center">
          {/* Ikon Sukses dengan Animasi Scale-In */}
          <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-scale-in" />

          {/* Teks Sukses */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
            Verifikasi Berhasil!
          </h2>
          <p className="text-gray-600 animate-fade-in">
            Mengalihkan Anda ke dashboard...
          </p>
          
          {/* Logo (opsional, bisa ditampilkan atau tidak) */}
          <div className="h-24 w-24 mt-6 opacity-50">
            <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    );
  }

  // --- Tampilan Setelah User Diverifikasi ---
  // Kita hanya menampilkan ini jika user ada dan state showSuccess sudah true
  if (user && showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
        <div className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center text-center">
          {/* Ikon Sukses dengan Animasi Scale-In */}
          <FaCheckCircle className="text-green-500 text-6xl mb-4 animate-scale-in" />

          {/* Teks Sukses */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
            Verifikasi Berhasil!
          </h2>
          <p className="text-gray-600 animate-fade-in">
            Mengalihkan Anda ke dashboard...
          </p>
          
          {/* Logo (opsional, bisa ditampilkan atau tidak) */}
          <div className="h-24 w-24 mt-6 opacity-50">
            <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    );
  }

  // --- Fallback (seharusnya tidak terlalu lama terlihat) ---
  // Ini adalah tampilan jika user belum ada dan bukan dalam proses loading
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          {/* Logo dengan animasi pulse */}
          <div className="h-40 w-40 mb-6 animate-pulse-slow">
            <img src="/images/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>

          {/* Spinner Ikon */}
          <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />

          {/* Teks Verifikasi */}
          <p className="text-gray-700 text-lg font-medium animate-fade-in">
            Memverifikasi identitas Anda...
          </p>
        </div>
      </div>
      
  );
  
}

