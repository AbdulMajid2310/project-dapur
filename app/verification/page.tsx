"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/lib/hooks/useAuth";

export default function VerificationPage() {
  const { user, userLoading, error } = useAuth();
  const router = useRouter();

  console.log("User Data:", user?.userId);
  useEffect(() => {
    if (user?.role) {
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 2000); // 2 detik biar efek loading terlihat

      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaShieldAlt className="text-blue-500 text-6xl mb-4 animate-pulse" />
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <h2 className="text-xl font-semibold">Verifying your account...</h2>
        <p className="text-gray-500 text-sm mt-2">
          Please wait a moment
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
      <h2 className="text-xl font-semibold">Redirecting...</h2>
    </div>
  );
}
