import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../axiosInstance"; // Pastikan ini adalah instance yang sudah ada interceptor-nya

export interface UserData {
  userId: string;
  email: string;
  role: string;
}

export interface UserResponse {
  message: string;
  data: UserData;
}

export const useAuth = () => {
  const router = useRouter();
  
  // State untuk proses login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk data user
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Fungsi untuk mengambil data profil user
  const fetchProfile = useCallback(async () => {
    try {
      setUserError(null);
      // axiosInstance akan otomatis mengirim cookie dan menangani refresh token
      const res = await axiosInstance.get<UserResponse>("/auth/profile");
      setUser(res.data.data);
    } catch (err: any) {
      // Error di sini kemungkinan besar bukan 401 (karena sudah ditang interceptor)
      // melainkan error lain seperti 500, 404, dll.
      setUserError(err?.response?.data?.message || "Failed to load profile");
      // Jika terjadi error selain autentikasi, kita bisa anggap user tidak valid
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fungsi login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // Cukup panggil endpoint login. Backend akan mengatur cookie.
      await axiosInstance.post("/auth/login", { email, password });
      
      // Setelah login berhasil, ambil data profil user
      await fetchProfile();
      
      // Arahkan ke halaman yang diinginkan
      router.push("/verification");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi logout
  const logout = useCallback(async () => {
    try {
      // Panggil endpoint logout agar server menghapus refresh token dari DB
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout endpoint failed", err);
    } finally {
      // Hapus state user di sisi klien dan arahkan ke login
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  // Effect untuk mengambil profil saat komponen pertama kali dimuat
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    // Fungsi dan state untuk autentikasi
    login,
    logout,
    loading,
    error,

    // Data dan state user
    user,
    userLoading,
    userError,
  };
};