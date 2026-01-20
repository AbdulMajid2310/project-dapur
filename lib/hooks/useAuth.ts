"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

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
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axiosInstance.get<UserResponse>("/auth/profile");
      setUser(res.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memuat profil");
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await axiosInstance.post("/auth/login", { email, password });
      
      await fetchProfile();
      
      toast.success("Login berhasil! Mengalihkan...");
      router.push("/verification");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout endpoint failed", err);
    } finally {
      setUser(null);
      toast.success("Anda telah berhasil keluar");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    login,
    logout,
    loading,
    user,
    userLoading,
  };
};