"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";


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
// Testimonials Data
const testimonialsData = [
  {
    id: 1,
    name: "Budi Santoso",
    avatar: "https://picsum.photos/100/100?random=1",
    comment: "Sekarang makan di warteg jadi lebih praktis! Tidak perlu antri lagi.",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    avatar: "https://picsum.photos/100/100?random=2",
    comment: "Menu digitalnya sangat membantu, bisa lihat gambar makanan sebelum pesan.",
    rating: 4,
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    avatar: "https://picsum.photos/100/100?random=3",
    comment: "Pembayaran dengan QRIS sangat memudahkan, tidak perlu bawa uang tunai.",
    rating: 5,
  },
];

const sectionData = {
  title: "Apa Kata Pelanggan Kami",
  description: "Kepuasan pelanggan adalah prioritas utama dalam setiap sajian kami",
};

export default function TestimonialsSection() {
  return (
    <motion.section
      id="testimonials"
      className="py-20 px-4  relative overflow-hidden"
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
     

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 flex items-center justify-center text-white">
            <FaStar className="text-yellow-400 mr-3" /> {sectionData.title}
          </h2>
          <p className="text-orange-100/80 text-lg font-medium">
            {sectionData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 shadow-2xl relative group"
              variants={itemVariants}
              whileHover={{ y: -12, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-6 right-8 text-white/10 text-7xl font-serif leading-none group-hover:text-orange-300/20 transition-colors">
                "
              </div>

              <div className="flex items-center mb-6 relative z-10">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden mr-4 border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl tracking-wide">
                    {testimonial.name}
                  </h3>
                  <div className="flex text-yellow-400 mt-1 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-3.5 h-3.5 ${i < testimonial.rating ? "fill-yellow-400" : "fill-white/20"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-orange-50/90 italic leading-relaxed text-lg relative z-10">
                "{testimonial.comment}"
              </p>

              <div className="mt-8 flex gap-2">
                <div className="w-12 h-1 bg-orange-400 rounded-full"></div>
                <div className="w-4 h-1 bg-white/30 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}