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

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false); // untuk login/logout
  const [userLoading, setUserLoading] = useState(true); // untuk fetch profile

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<UserResponse>("/auth/profile");
      setUser(data.data);
    } catch (error: any) {
      setUser(null);
      const message = error?.response?.data?.message || "Gagal memuat profil";
      toast.error(message);
    } finally {
      setUserLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        await axiosInstance.post("/auth/login", { email, password });
        await fetchProfile();
        toast.success("Login berhasil! Mengalihkan...");
        router.push("/verification");
      } catch (error: any) {
        const message = error?.response?.data?.message || "Login gagal. Silakan coba lagi.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile, router]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Anda telah berhasil keluar");
      router.push("/login");
    } catch (error) {
      console.error("Logout endpoint failed", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    userLoading,
    login,
    logout,
  };
};
