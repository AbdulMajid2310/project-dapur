import { useState, useEffect } from "react";
import { User } from "./type";
import axiosInstance from "@/lib/axiosInstance";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ GET ALL USERS
  const getUsers = async (params?: any) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users", { params });

      setUsers(res.data.data || res.data); // sesuaikan kalau response dibungkus "data"
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET DETAIL USER (sesuai format response kamu)
  const getUserDetail = async (userId: string) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/users/detail/${userId}`);

      // Karena response kamu:
      // { message: "...", data: { ...user } }
      setUserDetail(res.data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE USER (dengan upload avatar)
  const createUser = async (formData: FormData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await getUsers(); // refresh list
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE USER (dengan upload avatar)
  const updateUser = async (userId: string, formData: FormData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.patch(
        `/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await getUsers(); // refresh list
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE USER
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    userDetail,
    loading,
    error,
    getUsers,
    getUserDetail,
    createUser,
    updateUser,
    deleteUser,
  };
};
