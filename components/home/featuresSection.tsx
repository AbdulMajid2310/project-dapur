"use client";

import { motion } from "framer-motion";
import { FaUtensils, FaQrcode, FaCreditCard, FaBell } from "react-icons/fa";

// Features Data
const featuresData = [
  {
    title: "Menu Digital Interaktif",
    description: "Lihat menu lengkap dengan gambar dan harga real-time",
    icon: <FaUtensils className="text-2xl" />,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Pesan Tanpa Antri",
    description: "Pesan langsung dari HP Anda dengan QR Code",
    icon: <FaQrcode className="text-2xl" />,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Pembayaran Mudah",
    description: "Bayar dengan QRIS langsung dari aplikasi",
    icon: <FaCreditCard className="text-2xl" />,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Notifikasi Real-time",
    description: "Dapat notifikasi saat pesanan siap diambil",
    icon: <FaBell className="text-2xl" />,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

const sectionData = {
  title: "Fitur Unggulan Dapur Umi",
  description: "Nikmati kemudahan memesan makanan tradisional dengan teknologi modern",
};
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

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="py-20 px-4"
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
      <div className="container mx-auto">
        <motion.div
          className="text-center text-white max-w-2xl mx-auto mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {sectionData.title}
          </h2>
          <p className="">
            {sectionData.description}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
               variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.iconColor} mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}