"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  FaCog, 
  FaEdit, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube, 
  FaTiktok, 
  FaWhatsapp, 
  FaTelegram, 
  FaGlobe, 
  FaExternalLinkAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone, 
  FaEnvelope,
  FaStore,
  FaInfoCircle,
  FaShareAlt,
  FaCreditCard,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import ProfileAdd from "./add/page";
import { useProfile } from "@/lib/hooks/profile/useProfile";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import PaymentMethodManager from "@/components/paymentMethod";

// --- Definisi Tipe Data ---
interface SocialMedia {
  platform: string;
  url: string;
}

interface Profile {
  profileId: string
  name: string;
  email: string;
  phone: string;
  operatingHours: string;
  address: string;
  description: string;
  socialMedias: SocialMedia[];
  logo: string | null;
  coverImage: string | null;
}

interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => void;
}

export default function ProfilePage() {
  const { profile, loading, error, fetchProfile } = useProfile() as UseProfileResult;
  const route = useRouter()

  // Menggunakan useCallback untuk memastikan fungsi tidak berubah antar render
  const handleFetchProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Ambil data profil saat komponen pertama kali dimuat
  useEffect(() => {
    handleFetchProfile();
  }, [handleFetchProfile]);

  // Fungsi untuk mendapatkan ikon media sosial berdasarkan platform
  const getSocialIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("facebook")) return <FaFacebook className="text-blue-600" />;
    if (lowerPlatform.includes("instagram")) return <FaInstagram className="text-pink-600" />;
    if (lowerPlatform.includes("twitter")) return <FaTwitter className="text-blue-400" />;
    if (lowerPlatform.includes("linkedin")) return <FaLinkedin className="text-blue-700" />;
    if (lowerPlatform.includes("youtube")) return <FaYoutube className="text-red-600" />;
    if (lowerPlatform.includes("tiktok")) return <FaTiktok className="text-gray-900" />;
    if (lowerPlatform.includes("whatsapp")) return <FaWhatsapp className="text-green-600" />;
    if (lowerPlatform.includes("telegram")) return <FaTelegram className="text-blue-500" />;
    return <FaGlobe className="text-gray-600" />;
  };

  // Fungsi untuk memformat URL media sosial
  const formatSocialUrl = (url: string): string => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
        <p className="text-gray-600">Memuat data profil...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm flex items-center">
        <FaExclamationTriangle className="mr-3 text-xl" />
        <div>
          <p className="font-semibold">Terjadi Kesalahan</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <ProfileAdd />;
  }

  return (
    <div className="space-y-6">
      {/* Header dengan cover image dan logo */}
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-gray-200 relative">
          {profile.coverImage ? (
            <Image
              src={profile.coverImage}
              alt="Gambar Sampul"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-r from-orange-400 to-red-500 flex items-center justify-center">
              <FaStore className="text-white text-5xl opacity-50" />
            </div>
          )}
        </div>
        
        {/* Logo dan tombol edit */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20">
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white relative">
              {profile.logo ? (
                <Image
                  src={profile.logo}
                  alt="Logo Toko"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 128px, 160px"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <FaStore className="text-white text-4xl" />
                </div>
              )}
            </div>
            
            {/* Tombol Edit */}
            <button
              onClick={() => route.push(`/admin/profile/${profile.profileId}/update`)}
              className="mt-4 sm:mt-0 px-6 py-3 rounded-xl flex items-center bg-linear-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              <FaEdit className="mr-2" />
              Edit Profil
            </button>
          </div>
          
          {/* Nama Toko */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">{profile.name}</h1>
          
          {/* Info Singkat */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
            {profile.phone && (
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                <FaPhone className="mr-2 text-orange-500" />
                {profile.phone}
              </div>
            )}
            {profile.email && (
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                <FaEnvelope className="mr-2 text-orange-500" />
                {profile.email}
              </div>
            )}
            {profile.operatingHours && (
              <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                <FaClock className="mr-2 text-orange-500" />
                {profile.operatingHours}
              </div>
            )}
          </div>
          
          {profile.address && (
            <div className="flex items-start mt-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-orange-500 mt-0.5" />
              {profile.address}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaInfoCircle className="mr-2 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">
              Informasi Toko
            </h3>
          </div>
          
          {profile.description && (
            <p className="text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg">{profile.description}</p>
          )}

          <div className="space-y-4">
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaEnvelope className="mr-2 text-gray-400" />
                Email
              </label>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile.email}</p>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaPhone className="mr-2 text-gray-400" />
                Telepon
              </label>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile.phone}</p>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaClock className="mr-2 text-gray-400" />
                Jam Operasional
              </label>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile.operatingHours}</p>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                Alamat
              </label>
              <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <FaShareAlt className="mr-2 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Media Sosial</h3>
          </div>

          <div className="space-y-3">
            {profile.socialMedias && profile.socialMedias.length > 0 ? (
              profile.socialMedias.map((sm: SocialMedia, index: number) => (
                <a
                  key={index}
                  href={formatSocialUrl(sm.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group border border-gray-100"
                >
                  <div className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">
                    {getSocialIcon(sm.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{sm.platform}</p>
                    <p className="text-xs text-gray-500 truncate">{sm.url}</p>
                  </div>
                  <FaExternalLinkAlt className="text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">
                  <FaGlobe />
                </div>
                <p className="text-gray-500">Tidak ada media sosial</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
        
        <PaymentMethodManager profileId={profile.profileId} />
      </div>
    </div>
  );
}