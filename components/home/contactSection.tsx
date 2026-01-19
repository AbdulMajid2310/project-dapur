"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaInstagram } from "react-icons/fa";

// Contact Data
const contactData = {
  address: "Jl. Merdeka No. 123, Jakarta Pusat",
  phone: "(021) 1234-5678",
  email: "info@wartegsederhana.com",
  operatingHours: "08:00 - 22:00 WIB",
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

const socialData = [
  { icon: <FaFacebookF />, color: "bg-blue-600", link: "#" },
  { icon: <FaInstagram />, color: "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600", link: "#" },
];

const sectionData = {
  title: "Hubungi Kami",
  description: "Silakan hubungi kami untuk informasi lebih lanjut atau pemesanan khusus",
};

export default function ContactSection() {
  return (
    <motion.section
      id="kontak"
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
          className="text-center max-w-2xl mx-auto mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 flex items-center justify-center text-white">
            <FaEnvelope className="text-orange-300 mr-4" /> {sectionData.title}
          </h2>
          <p className="text-orange-100/80 text-lg">
            {sectionData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center">
                <span className="w-10 h-1 bg-orange-400 mr-4 rounded-full"></span>
                Informasi Kontak
              </h3>

              <div className="grid gap-6">
                {[
                  {
                    icon: <FaMapMarkerAlt />,
                    title: "Alamat",
                    content: contactData.address,
                  },
                  {
                    icon: <FaPhone />,
                    title: "Telepon",
                    content: contactData.phone,
                  },
                  {
                    icon: <FaEnvelope />,
                    title: "Email",
                    content: contactData.email,
                  },
                  {
                    icon: <FaClock />,
                    title: "Jam Buka",
                    content: contactData.operatingHours,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <div className="bg-orange-400 text-[#9C633D] p-4 rounded-xl mr-5 shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                      <p className="text-orange-100/70 leading-relaxed">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={itemVariants} className="pt-4">
              <h4 className="font-bold text-white mb-6 flex items-center">
                Ikuti Kami di Media Sosial
              </h4>
              <div className="flex space-x-4">
                {socialData.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.link}
                    className={`${social.color} text-white p-4 rounded-2xl shadow-lg transition-all`}
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2.5rem] shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              Kirim Pesan Langsung
            </h3>

            <form className="space-y-5">
              {[
                { label: "Nama Lengkap", type: "text", placeholder: "Contoh: Budi Santoso" },
                { label: "Email", type: "email", placeholder: "budi@email.com" },
                { label: "Subjek", type: "text", placeholder: "Tanya ketersediaan menu" },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-orange-100 text-sm font-medium mb-2 ml-1">{field.label}</label>
                  <input
                    type={field.type}
                    className="w-full px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-orange-100 text-sm font-medium mb-2 ml-1">Pesan Anda</label>
                <textarea
                  rows={4}
                  className="w-full px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  placeholder="Tuliskan pesan atau pesanan Anda di sini..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-300 text-[#9C633D] py-4 rounded-xl font-extrabold text-lg transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEnvelope className="mr-3" /> Kirim Sekarang
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}