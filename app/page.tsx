"use client";

import Navbar from "@/components/home/navbar";
import FeaturesSection from "@/components/home/featuresSection";
import HeroSection from "@/components/home/heroSection";
import PaymentStep from "@/components/home/paymentStep";
import Footer from "@/components/home/footer";
import LazySection from "@/components/home/lazySection"; 

export default function Home() {
  

  return (
    <div className="min-h-screen text-gray-700 bg-linear-to-b from-[#FFDD9E] to-[#FFF5E6]">
      <Navbar />
      <div className="bg-[#9C633D] w-full pt-16 text-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Komponen di atas fold (langsung dimuat) */}
          <HeroSection />
          <FeaturesSection />
          <PaymentStep />

          {/* Komponen di bawah fold (dimuat saat scroll) */}
          {/* Kita passing fungsi import() ke props componentImport */}
          <LazySection componentImport={() => import("@/components/home/favoriteMenu")} />
          <LazySection componentImport={() => import("@/components/home/allMenu")} />
          <LazySection componentImport={() => import("@/components/home/FAQSection")} />
          <LazySection componentImport={() => import("@/components/home/gallerySection")} />
        </div>
      </div>
      <Footer />
    </div>
  );
}