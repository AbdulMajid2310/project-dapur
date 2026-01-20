"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaTimes, FaEdit } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
}

interface UserResponse {
  message: string;
  data: User;
}

export default function UserProfile() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<UserResponse>(`/users/detail/${userId}`);
        const data = response.data.data;
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError("Gagal memuat data user.");
        setLoading(false);
      }
    };

    if (isOpen) fetchUser();
  }, [userId, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phone", phone);
      if (avatarFile) formData.append("avatar", avatarFile);

      await axiosInstance.put(`/users/${userData.userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserData({
        ...userData,
        firstName,
        lastName,
        phone,
        avatar: avatarFile ? URL.createObjectURL(avatarFile) : userData.avatar,
      });

      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui profil.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setAvatarFile(e.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40">
      <motion.div className="bg-white text-gray-700 w-full md:w-3xl max-h-[calc(100vh-4rem)] overflow-y-auto flex flex-col rounded-2xl shadow-xl">
        <div className="p-6 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-orange-400"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Profil Pengguna</h2>

          {loading ? (
            <p className="text-orange-400">Memuat data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userData ? (
            <>
              {!isEditing ? (
                <div className="max-w-lg mx-auto  p-6 flex flex-col  text-center">
                  <div className="grid grid-cols-2 gap-4">
<div className="flex justify-center items-center">

                    <div className="relative w-40 h-40 mb-4">
                      <img
                        src={userData.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover border-4 border-orange-400 shadow-md"
                      />
                    </div>
</div>

                    <div>

                      <h3 className="text-2xl font-bold capitalize text-gray-800 mb-2">{userData.firstName} {userData.lastName}</h3>
                      <p className="text-gray-500 mb-1">{userData.email}</p>
                      <p className="text-gray-500 mb-4">{userData.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-2 bg-orange-400 text-white font-semibold rounded-full shadow hover:bg-orange-500 transition transform hover:scale-105"
                  >
                    <FaEdit /> Edit Profil
                  </button>
                </div>

              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <img
                      src={avatarFile ? URL.createObjectURL(avatarFile) : userData.avatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-orange-400"
                    />
                    <label className="flex items-center cursor-pointer px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                      <FaUpload className="mr-2" />
                      Pilih Avatar
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>

                  <form onSubmit={handleSubmit} className="lg:col-span-2 w-full">
                    <div className="grid grid-cols-2 gap-4">

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Nama Depan</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Nama Belakang</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Telepon</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-200 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 py-3 bg-orange-400 text-white font-bold rounded-xl hover:bg-orange-500 transition"
                      >
                        {updating ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 bg-gray-300 text-black font-bold rounded-xl hover:bg-gray-400 transition"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
