"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuestionCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Type definitions disesuaikan dengan backend
interface FAQ {
  faqId: string; // ID dari backend adalah string (UUID)
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft" | "archived"; // Tambahkan 'archived'
  createdAt: string;
  updatedAt: string;
}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<Partial<FAQ> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/faqs');
        // Backend response: { success: true, message: '...', data: [...] }
        setFaqs(response.data.data);
        toast.success(response.data.message || "Data FAQ berhasil dimuat.");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal memuat data FAQ.");
        console.error("Gagal memuat data FAQ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Filter FAQs
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
    setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
  }, [searchTerm, faqs]);

  // FAQ CRUD functions
  const openAddFAQModal = () => {
    setSelectedFAQ({ question: "", answer: "", category: "Pemesanan", status: "published" });
    setIsFAQModalOpen(true);
  };

  const openEditFAQModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsFAQModalOpen(true);
  };

  const handleFAQChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedFAQ((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // ... di dalam komponen FAQManagement

  const saveFAQ = async () => {
    if (!selectedFAQ?.question || !selectedFAQ?.answer) {
      toast.error("Pertanyaan dan jawaban harus diisi.");
      return;
    }

    try {
      if (selectedFAQ.faqId) {
        // --- PERBAIKAN DIMULAI DI SINI ---

        // 1. Buat payload baru tanpa properti yang tidak diperlukan
        const { faqId, createdAt, updatedAt, ...updateData } = selectedFAQ;

        // 2. Gunakan metode PATCH dan kirim payload yang bersih
        await axiosInstance.put(`/faqs/${selectedFAQ.faqId}`, updateData);
        toast.success("FAQ berhasil diperbarui.");
        
        // --- PERBAIKAN SELESAI ---
      } else {
        // Add new FAQ (tidak ada perubahan di sini)
        await axiosInstance.post('/faqs', selectedFAQ);
        toast.success("FAQ berhasil ditambahkan.");
      }
      setIsFAQModalOpen(false);
      // Refresh data dari server untuk sinkronisasi
      const response = await axiosInstance.get('/faqs');
      setFaqs(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan FAQ.");
      console.error("Gagal menyimpan FAQ:", error);
    }
  };

// ... sisanya tetap sama

  const deleteFAQ = async (faqId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      try {
        await axiosInstance.delete(`/faqs/${faqId}`);
        toast.success("FAQ berhasil dihapus.");
        // Refresh data dari server
        const response = await axiosInstance.get('/faqs');
        setFaqs(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal menghapus FAQ.");
        console.error("Gagal menghapus FAQ:", error);
      }
    }
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFAQItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalFAQPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render FAQ modal
  const renderFAQModal = () => (
    <AnimatePresence>
      {isFAQModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedFAQ?.faqId ? "Edit FAQ" : "Tambah FAQ"}
                </h3>
                <button
                  onClick={() => setIsFAQModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                <input
                  type="text"
                  name="question"
                  value={selectedFAQ?.question || ""}
                  onChange={handleFAQChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
                <textarea
                  name="answer"
                  value={selectedFAQ?.answer || ""}
                  onChange={handleFAQChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={selectedFAQ?.category || ""}
                    onChange={handleFAQChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="Pemesanan">Pemesanan</option>
                    <option value="Pengantaran">Pengantaran</option>
                    <option value="Pembayaran">Pembayaran</option>
                    <option value="Layanan Pelanggan">Layanan Pelanggan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={selectedFAQ?.status || "published"}
                    onChange={handleFAQChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="published">Diterbitkan</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsFAQModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
              >
                Batal
              </button>
              <button
                onClick={saveFAQ}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center"
              >
                <FaSave className="mr-2" /> Simpan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="text-lg">Loading...</div></div>;
  }

  return (
    <div className="space-y-6">
      {/* ... (Header dan Search Bar tetap sama) ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola FAQ</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari FAQ..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={openAddFAQModal} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Tambah FAQ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertanyaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                {/* KOLOM URUTAN DIHAPUS */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {currentFAQItems.map((faq) => (
                  <motion.tr key={faq.faqId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                      <div className="text-sm text-gray-500">{faq.answer.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.category}</td>
                    {/* KOLOM URUTAN DIHAPUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${faq.status === "published" ? "bg-green-100 text-green-800" : faq.status === "draft" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}`}>
                        {faq.status === "published" ? "Diterbitkan" : faq.status === "draft" ? "Draft" : "Diarsipkan"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => openEditFAQModal(faq)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                      <button onClick={() => deleteFAQ(faq.faqId)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ... (Pagination tetap sama) ... */}
      {totalFAQPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalFAQPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => paginate(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? "z-10 bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => paginate(currentPage < totalFAQPages ? currentPage + 1 : totalFAQPages)} disabled={currentPage === totalFAQPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}

      {/* FAQ Modal */}
      {renderFAQModal()}
    </div>
  );
}