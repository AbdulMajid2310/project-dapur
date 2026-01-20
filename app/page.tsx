"use client";

import Navbar from "@/components/home/navbar";
import FeaturesSection from "@/components/home/featuresSection";
import HeroSection from "@/components/home/heroSection";
import FavoriteMenu from "@/components/home/favoriteMenu";
import AllMenu from "@/components/home/allMenu";
import TestimonialsSection from "@/components/home/testimonialsSection";
import ContactSection from "@/components/home/contactSection";
import FAQSection from "@/components/home/FAQSection";
import GallerySection from "@/components/home/gallerySection";
import Footer from "@/components/home/footer";
import PaymentStep from "@/components/home/paymentStep";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";

export default function WartegLanding() {
   const router = useRouter(); // ✅
    const { userLoading, user } = useAuth(); 

      // ✅ PROTEKSI ROUTE ADMIN
      useEffect(() => {
        if (!userLoading) {
          // kalau tidak ada user → ke login
          if (!user) {
            router.push("/login");
            return;
          }
    
          // kalau ada user tapi bukan admin → ke login (atau /unauthorized)
          if (user?.role !== "customer") {
            router.push("/login");
          }
        }
      }, [user, userLoading, router]);

      if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen text-gray-700 bg-linear-to-b from-[#FFDD9E] to-[#FFF5E6]">
      {/* Navbar */}
      <Navbar />

   
      <div className="bg-[#9C633D] w-full pt-16 text-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <HeroSection />

          {/* Features */}
          <FeaturesSection />

          {/* How to Order Section */}
          <PaymentStep />

          {/* Menu Sections */}
          <FavoriteMenu />
          <AllMenu />

          {/* Other Sections */}
          <TestimonialsSection />
          <FAQSection />
          {/* <ContactSection /> */}
          <GallerySection />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
