"use client";

import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaUtensils, FaQrcode, FaBell, FaCreditCard, FaQuestionCircle, FaClock } from "react-icons/fa";

// Footer Data
const footerData = {
  brand: {
    name: "Dapur Umi",
    description: "Menyajikan masakan rumahan autentik dengan bahan segar pilihan",
    logo: "/images/logo.png",
  },
  contact: {
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    phone: "(021) 1234-5678",
    email: "info@wartegsederhana.com",
  },
  features: [
    { icon: <FaUtensils className="mr-2" />, text: "Menu Digital" },
    { icon: <FaQrcode className="mr-2" />, text: "Pemesanan Online" },
    { icon: <FaCreditCard className="mr-2" />, text: "Pembayaran QRIS" },
    { icon: <FaBell className="mr-2" />, text: "Notifikasi Real-time" },
  ],
  operatingHours: {
    title: "Jam Buka",
    days: "Setiap Hari",
    hours: "08:00 - 22:00 WIB",
  },
  help: [
    { icon: <FaQuestionCircle className="mr-2" />, text: "FAQ", href: "#faq" },
    { icon: <FaUtensils className="mr-2" />, text: "Panduan Pengguna" },
    { icon: <FaEnvelope className="mr-2" />, text: "Kebijakan Privasi" },
    { icon: <FaCreditCard className="mr-2" />, text: "Syarat & Ketentuan" },
  ],
  social: [
    { icon: <FaFacebookF />, color: "bg-blue-600", link: "#" },
    { icon: <FaInstagram />, color: "bg-pink-500", link: "#" },
  ],
  copyright: "Hak Cipta Dilindungi.",
};

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#FFDD9E] text-gray-700">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center text-gray-700 space-x-2 mb-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={footerData.brand.logo} alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold">
                {footerData.brand.name}
              </span>
            </div>
            <p className="mb-4">{footerData.brand.description}</p>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2" />
              {footerData.contact.address}
            </div>
            <div className="flex items-center mb-2">
              <FaPhone className="mr-2" />
              {footerData.contact.phone}
            </div>
            <div className="flex items-center mb-4">
              <FaEnvelope className="mr-2" />
              {footerData.contact.email}
            </div>
            <div className="flex space-x-4">
              {footerData.social.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className={`${social.color} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Fitur</h3>
            <ul className="space-y-2">
              {footerData.features.map((item, index) => (
                <li key={index}>
                  <motion.a
                    href="#"
                    className="hover:text-gray-900 transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    {item.icon} {item.text}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{footerData.operatingHours.title}</h3>
            <p className="mb-2 flex items-center">
              <FaClock className="mr-2" /> {footerData.operatingHours.days}
            </p>
            <p className="font-medium">
              {footerData.operatingHours.hours}
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Bantuan</h3>
            <ul className="space-y-2">
              {footerData.help.map((item, index) => (
                <li key={index}>
                  <motion.a
                    href={item.href || "#"}
                    className="hover:text-gray-900 transition-colors flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    {item.icon} {item.text}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} {footerData.brand.name}. {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}