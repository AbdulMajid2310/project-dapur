"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaChevronDown } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Variants animasi
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// Section default
const sectionData = {
  title: "Pertanyaan Umum (FAQ)",
  description: "Temukan jawaban untuk pertanyaan yang sering diajukan",
};

export default function FAQSection() {
  const [faqData, setFaqData] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Fetch data FAQ dari API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/faqs");
        if (response.data && response.data.data) {
          setFaqData(response.data.data);
        }
      } catch (error: any) {
        toast.error("Gagal mengambil data FAQ. Silakan coba lagi.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <motion.section
      id="faq"
      className="py-20 px-4 bg-[#9C633D]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <div className="container mx-auto">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center text-white">
            <FaQuestionCircle className="text-orange-300 mr-3" /> {sectionData.title}
          </h2>
          <p className="text-lg font-medium text-orange-100/80">
            {sectionData.description}
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {loading ? (
            <p className="text-center text-white/80">Memuat FAQ...</p>
          ) : faqData.length === 0 ? (
            <p className="text-center text-white/80">FAQ tidak tersedia.</p>
          ) : (
            faqData.map((faq, index) => (
              <motion.div
                key={faq.faqId}
                className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg"
                variants={itemVariants}
              >
                <motion.button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  <span
                    className={`font-bold text-lg transition-colors ${
                      activeFaq === index ? "text-orange-300" : "text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={activeFaq === index ? "text-orange-300" : "text-white/70"}
                  >
                    <FaChevronDown />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-orange-50/90 leading-relaxed border-t border-white/10 mt-2">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
