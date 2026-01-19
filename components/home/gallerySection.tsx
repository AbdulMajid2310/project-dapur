"use client";

import { motion } from "framer-motion";

// Gallery Data
const galleryData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1601050691389-d98d48d8c1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Gambar Acak 1",
  },
  {
    id: 2,
    src: "https://picsum.photos/400/300?random=2",
    alt: "Gambar Acak 2",
  },
  {
    id: 3,
    src: "https://picsum.photos/400/300?random=3",
    alt: "Gambar Acak 3",
  },
  {
    id: 4,
    src: "https://picsum.photos/400/300?random=4",
    alt: "Gambar Acak 4",
  },
  {
    id: 5,
    src: "https://picsum.photos/400/300?random=5",
    alt: "Gambar Acak 5",
  },
  {
    id: 6,
    src: "https://picsum.photos/400/300?random=6",
    alt: "Gambar Acak 6",
  },
  {
    id: 7,
    src: "https://picsum.photos/400/300?random=7",
    alt: "Gambar Acak 7",
  },
  {
    id: 8,
    src: "https://picsum.photos/400/300?random=8",
    alt: "Gambar Acak 8",
  },
];

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

const sectionData = {
  title: "Galeri Dapur Umi",
  description: "Intip suasana hangat dan kelezatan hidangan autentik yang kami sajikan setiap hari",
  quote: "Kehangatan dalam setiap sudut, kelezatan dalam setiap suapan.",
};

export default function GallerySection() {
  return (
    <motion.section
      id="galeri"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#9C633D] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {sectionData.title}
          </h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full mb-6"></div>
          <p className="text-orange-100/70 text-lg max-w-2xl mx-auto">
            {sectionData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {galleryData.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-4xl shadow-2xl border border-white/10"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="aspect-4/5 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <motion.div
                className="absolute inset-0 bg-linear-to-t from-[#9C633D]/90 via-[#9C633D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6"
              >
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-1">{image.alt}</h3>
                  <div className="flex items-center text-orange-300 text-sm font-medium">
                    <span className="mr-2">Lihat Detail</span>
                    <div className="w-4 h-px bg-orange-300"></div>
                  </div>
                </div>
              </motion.div>

              <div className="absolute inset-0 border border-white/20 rounded-4xl pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          variants={itemVariants}
        >
          <p className="text-orange-100/60 mb-6 italic">
            "{sectionData.quote}"
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