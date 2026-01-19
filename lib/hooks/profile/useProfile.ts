"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfileByUserId, createProfile } from "./service";
import { Profile } from "./type";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user?.userId) {
      setError("User ID tidak ditemukan.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profileData = await getProfileByUserId(user.userId);
      setProfile(profileData);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError?.response?.data?.message || "Gagal mengambil data profil.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  const createProfileData = async (formData: FormData) => {
    if (!user?.userId) {
      const errorMessage = "User ID tidak ditemukan, tidak dapat membuat profil.";
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newProfile = await createProfile(user.userId, formData);
      setProfile(newProfile);
      toast.success("Profile berhasil dibuat!");
      return newProfile;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError?.response?.data?.message || "Gagal membuat profil.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [user?.userId, fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile: createProfileData,
  };
};