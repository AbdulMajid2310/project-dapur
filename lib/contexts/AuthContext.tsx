// lib/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance'; // Asumsi path benar

export interface UserData {
  userId: string;
  email: string;
  role: string;
}

export interface UserResponse {
  message: string;
  data: UserData;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean; // untuk login/logout
  userLoading: boolean; // untuk fetch profile awal
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      // Coba ambil dari localStorage/sessionStorage terlebih dahulu untuk instant load
      // const cachedUser = localStorage.getItem('user');
      // if (cachedUser) {
      //   setUser(JSON.parse(cachedUser));
      // }
      
      const { data } = await axiosInstance.get<UserResponse>("/auth/profile");
      setUser(data.data);
      // localStorage.setItem('user', JSON.stringify(data.data)); // Cache ke localStorage
    } catch (error: any) {
      setUser(null);
      // localStorage.removeItem('user'); // Hapus cache jika gagal
      // Jangan menampilkan toast error di sini agar tidak mengganggu saat pertama kali load halaman publik
      // const message = error?.response?.data?.message || "Gagal memuat profil";
      // toast.error(message);
    } finally {
      setUserLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/login", { email, password });
      await fetchProfile(); // Fetch profile setelah login berhasil
      toast.success("Login berhasil! Mengalihkan...");
      router.push("/verification"); // Sesuaikan dengan logika redirect Anda
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login gagal. Silakan coba lagi.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      // localStorage.removeItem('user');
      toast.success("Anda telah berhasil keluar");
      router.push("/login");
    } catch (error) {
      console.error("Logout endpoint failed", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};