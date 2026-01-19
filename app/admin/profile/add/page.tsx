"use client";

import { useState } from "react";
import { FaCamera, FaSave, FaTimes, FaRedo, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";

interface SocialMediaInput {
  platform: string;
  url: string;
  title: string;
}

interface ProfileForm {
  name: string;
  description: string;
  address: string;
  operatingHours: string;
  phone: string;
  email: string;
  socialMedia: SocialMediaInput[];
}

const AVAILABLE_PLATFORMS = [
  { id: "facebook", name: "Facebook" },
  { id: "instagram", name: "Instagram" },
  { id: "twitter", name: "Twitter" },
  { id: "whatsapp", name: "WhatsApp" },
  { id: "tiktok", name: "TikTok" },
  { id: "youtube", name: "YouTube" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function ProfileAdd() {
  const { user } = useAuth();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProfileForm>({
    name: "",
    description: "",
    address: "",
    operatingHours: "",
    phone: "",
    email: "",
    socialMedia: [
      { platform: "facebook", url: "", title: "Facebook" },
      { platform: "instagram", url: "", title: "Instagram" },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const addSocialMediaPlatform = (platformId: string) => {
    const platform = AVAILABLE_PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return;
    if (formData.socialMedia.some((sm) => sm.platform === platformId)) {
      toast.warning(`${platform.name} sudah ditambahkan.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: platformId, url: "", title: platform.name }],
    }));
  };

  const updateSocialMedia = (index: number, field: keyof Omit<SocialMediaInput, 'platform'>, value: string) => {
    setFormData((prev) => {
      const updatedSocialMedia = [...prev.socialMedia];
      updatedSocialMedia[index] = { ...updatedSocialMedia[index], [field]: value };
      return { ...prev, socialMedia: updatedSocialMedia };
    });
  };

  const removeSocialMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(result);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      operatingHours: "",
      phone: "",
      email: "",
      socialMedia: [
        { platform: "facebook", url: "", title: "Facebook" },
        { platform: "instagram", url: "", title: "Instagram" },
      ],
    });
    setLogoFile(null);
    setCoverImageFile(null);
    setLogoPreview("");
    setCoverImagePreview("");
  };

  const saveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Nama dan Email wajib diisi!");
      return;
    }
    if (!user?.userId) {
      toast.error("User tidak terdeteksi. Silakan login ulang.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "socialMedia") {
          formDataToSend.append(key, value as string);
        }
      });
      formData.socialMedia.forEach((sm, index) => {
        if (sm.url.trim()) {
          formDataToSend.append(`socialMedia[${index}][platform]`, sm.platform);
          formDataToSend.append(`socialMedia[${index}][url]`, sm.url);
          formDataToSend.append(`socialMedia[${index}][title]`, sm.title);
        }
      });
      if (logoFile) formDataToSend.append("images", logoFile);
      if (coverImageFile) formDataToSend.append("images", coverImageFile);

      await axiosInstance.post(`/profiles/${user.userId}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profil berhasil dibuat!");
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
      toast.error(`Gagal membuat profil: ${errorMessage}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlatformIds = formData.socialMedia.map(sm => sm.platform);
  const unselectedPlatforms = AVAILABLE_PLATFORMS.filter(platform => !selectedPlatformIds.includes(platform.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Buat Profil Toko Baru</h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Dasar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Masukkan nama toko"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="email@toko.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="08123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
            <input
              type="text"
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="08:00 - 22:00"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Jl. Contoh No. 123, Kota, Provinsi"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Deskripsikan toko Anda"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Media Sosial</h3>
          {unselectedPlatforms.length > 0 && (
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value=""
              onChange={(e) => addSocialMediaPlatform(e.target.value)}
            >
              <option value="" disabled>+ Tambah Platform</option>
              {unselectedPlatforms.map((platform) => (
                <option key={platform.id} value={platform.id}>{platform.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.socialMedia.map((sm, index) => (
            <div key={sm.platform} className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">{sm.title}</label>
                <button
                  type="button"
                  onClick={() => removeSocialMedia(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <input
                type="text"
                value={sm.url}
                onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder={`URL ${sm.title}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gambar Profil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Toko</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaCamera /></div>
                )}
              </div>
              <div className="flex space-x-2">
                <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center">
                  <FaCamera className="mr-2" /> Pilih Logo
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
                </label>
                {logoPreview && <button type="button" onClick={() => { setLogoPreview(""); setLogoFile(null); }} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg"><FaTimes /></button>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Sampul</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaCamera /></div>
                )}
              </div>
              <div className="flex space-x-2">
                <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-pointer flex items-center">
                  <FaCamera className="mr-2" /> Pilih Gambar
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                </label>
                {coverImagePreview && <button type="button" onClick={() => { setCoverImagePreview(""); setCoverImageFile(null); }} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg"><FaTimes /></button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={resetForm} disabled={isSubmitting} className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center">
          <FaRedo className="mr-2" /> Reset
        </button>
        <button onClick={saveProfile} disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium flex items-center">
          <FaSave className="mr-2" /> {isSubmitting ? "Menyimpan..." : "Buat Profil"}
        </button>
      </div>
    </div>
  );
}
