"use client";

import { motion } from "framer-motion";
import { FaShoppingCart, FaUtensils } from "react-icons/fa";

// Hero Data
const heroData = {
  title: "Nikmati Makanan",
  highlight: "Tradisional",
  subtitle: "dengan Kemudahan",
  highlight2: "Digital",
  description: "Menyajikan masakan rumahan autentik dengan bahan segar pilihan. Pesan makanan favorit Anda tanpa antri, bayar dengan QRIS, dan dapat notifikasi real-time saat pesanan siap.",
  backgroundImage: "/images/hero/hero1.png",
};

export default function HeroSection() {
  return (
    <motion.section
      id="beranda"
      className="pt-32 pb-20 px-4 relative overflow-hidden"
      style={{ backgroundImage: `url("${heroData.backgroundImage}")`, backgroundSize: "cover", backgroundPosition: "center" }}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7 } }
      }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40"></div>
      <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {heroData.title}{" "}
            <span className="text-orange-400">{heroData.highlight}</span> {heroData.subtitle}
            <span className="text-orange-400"> {heroData.highlight2}</span>
          </h1>
          <p className="text-lg text-white mb-6 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
            {heroData.description}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="mr-2" /> Pesan Sekarang
            </motion.button>
            <motion.button
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUtensils className="mr-2" /> Lihat Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}