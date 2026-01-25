"use client";

import axiosInstance from "@/lib/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

// ----------------------
// TypeScript Interface
// ----------------------
interface GalleryItem {
  galleryId: string;
  title: string;
  caption: string;
  imageUrl: string;
  alt: string;
  category: string;
  order: number;
  isActive: boolean;
  metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

interface GalleryResponse {
  message: string;
  data: GalleryItem[];
}

// ----------------------
// Animation Variants
// ----------------------
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// ----------------------
// Static Section Content
// ----------------------
const sectionData = {
  title: "Galeri Dapur Umi",
  description:
    "Intip suasana hangat dan kelezatan hidangan autentik yang kami sajikan setiap hari",
  quote: "Kehangatan dalam setiap sudut, kelezatan dalam setiap suapan.",
};

// ----------------------
// Gallery Component
// ----------------------
export default function GallerySection() {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------
  // Fetch Gallery Data
  // ----------------------
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get<GalleryResponse>("/gallery");

        // ✅ pastikan yang disimpan adalah ARRAY
        setGalleryData(
          Array.isArray(response.data?.data)
            ? response.data.data
            : []
        );
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Gagal memuat data galeri.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // ----------------------
  // UI State Handling
  // ----------------------
  if (loading) {
    return (
      <div className="py-20 text-center text-orange-200">
        Memuat galeri...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  // ----------------------
  // Render
  // ----------------------
  return (
    <motion.section
      id="gallery"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {sectionData.title}
          </h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full mb-6" />
          <p className="text-orange-100/70 text-lg max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {galleryData
            .filter(item => item.isActive)
            .map(item => (
              <motion.div
                key={item.galleryId}
                className="group relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() =>
                  setSelectedId(
                    selectedId === item.galleryId
                      ? null
                      : item.galleryId
                  )
                }
              >
                {/* Image */}
                <div className="overflow-hidden h-56 md:h-64">
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#9C633D]/90 via-[#9C633D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-300 mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-orange-100/80 mb-3 line-clamp-2">
                      {item.caption}
                    </p>
                    <div className="flex items-center text-orange-300 text-sm font-medium">
                      <span className="mr-2">Lihat Detail</span>
                      <div className="w-4 h-px bg-orange-300" />
                    </div>
                  </div>
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                  {selectedId === item.galleryId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 bg-[#9C633D]/90 backdrop-blur-lg p-6 rounded-3xl flex flex-col justify-between text-white z-20"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-300">
                          {item.category}
                        </span>
                        <button onClick={() => setSelectedId(null)}>
                          <FaWindowClose className="w-5 h-5 text-orange-200 hover:text-white" />
                        </button>
                      </div>

                      <div className="mt-4 scrollbar-hide overflow-auto">
                        <h3 className="text-2xl font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-orange-100/80 leading-relaxed">
                          {item.caption}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>

        {/* Footer */}
        <motion.div className="mt-20 text-center" variants={itemVariants}>
          <p className="text-orange-100/60 mb-6 italic">
            “{sectionData.quote}”
          </p>
          <motion.button
            className="px-10 py-4 bg-white text-[#9C633D] font-bold rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-xl shadow-black/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Lihat Semua Foto
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
