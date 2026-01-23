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
  FaFilter,
  FaClipboardList,
  FaTags,
  FaEye,
  FaEyeSlash,
  FaArchive,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Type definitions disesuaikan dengan backend
interface FAQ {
  faqId: string;
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft" | "archived";
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
  const [activeStatus, setActiveStatus] = useState("Semua");
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/faqs');
        setFaqs(response.data.data);
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
    let filtered = faqs;
    
    // Filter by status
    if (activeStatus !== "Semua") {
      filtered = filtered.filter(item => item.status === activeStatus);
    }
    
    // Filter by category
    if (activeCategory !== "Semua") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFaqs(filtered);
    setCurrentPage(1);
  }, [searchTerm, faqs, activeStatus, activeCategory]);

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(faqs.map(item => item.category)))];

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

  const saveFAQ = async () => {
    if (!selectedFAQ?.question || !selectedFAQ?.answer) {
      toast.error("Pertanyaan dan jawaban harus diisi.");
      return;
    }

    try {
      if (selectedFAQ.faqId) {
        const { faqId, createdAt, updatedAt, ...updateData } = selectedFAQ;
        await axiosInstance.put(`/faqs/${selectedFAQ.faqId}`, updateData);
      } else {
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

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "published":
        return {
          icon: <FaEye className="mr-1" />,
          label: "Diterbitkan",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "draft":
        return {
          icon: <FaEdit className="mr-1" />,
          label: "Draft",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      case "archived":
        return {
          icon: <FaArchive className="mr-1" />,
          label: "Diarsipkan",
          className: "bg-red-100 text-red-800 border-red-200"
        };
      default:
        return {
          icon: <FaInfoCircle className="mr-1" />,
          label: status,
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
    }
  };

  // Render FAQ modal
  const renderFAQModal = () => (
    <AnimatePresence>
      {isFAQModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  {selectedFAQ?.faqId ? "Edit FAQ" : "Tambah FAQ Baru"}
                </h3>
                <button
                  onClick={() => setIsFAQModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaQuestionCircle className="mr-2 text-orange-500" /> Pertanyaan
                </label>
                <input
                  type="text"
                  name="question"
                  value={selectedFAQ?.question || ""}
                  onChange={handleFAQChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan pertanyaan yang sering diajukan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban</label>
                <textarea
                  name="answer"
                  value={selectedFAQ?.answer || ""}
                  onChange={handleFAQChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tulis jawaban yang jelas dan informatif"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaTags className="mr-2 text-orange-500" /> Kategori
                  </label>
                  <select
                    name="category"
                    value={selectedFAQ?.category || ""}
                    onChange={handleFAQChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={selectedFAQ?.status || "published"}
                    onChange={handleFAQChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="published">Diterbitkan</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsFAQModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveFAQ}
                className="px-6 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center"
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
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
        <div className="text-lg text-gray-600">Memuat data FAQ...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <FaQuestionCircle className="mr-3" /> Kelola FAQ
            </h2>
            <p className="text-orange-100">Kelola pertanyaan yang sering diajukan oleh pelanggan</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari FAQ..."
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 backdrop-blur text-white placeholder-white/70 border border-white/30 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
            <button 
              onClick={openAddFAQModal} 
              className="bg-white text-orange-500 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-orange-50 transition-colors shadow-md"
            >
              <FaPlus className="mr-2" /> Tambah FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center mb-3 md:mb-0">
            <FaFilter className="mr-2 text-gray-500" />
            <h3 className="font-semibold text-gray-700">Filter</h3>
          </div>
          <div className="text-sm text-gray-500">
            Menampilkan {filteredFaqs.length} dari {faqs.length} FAQ
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {["Semua", "published", "draft", "archived"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center ${
                    activeStatus === status
                      ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status !== "Semua" && getStatusInfo(status).icon}
                  {status === "Semua" ? "Semua Status" : getStatusInfo(status).label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Kategori</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-6xl text-gray-300 mb-4">
            <FaQuestionCircle />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada FAQ ditemukan</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || activeStatus !== "Semua" || activeCategory !== "Semua"
              ? "Coba ubah filter atau kata kunci pencarian"
              : "Mulai dengan menambahkan FAQ baru"}
          </p>
          <button
            onClick={openAddFAQModal}
            className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg flex items-center font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          >
            <FaPlus className="mr-2" /> Tambah FAQ Baru
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pertanyaan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {currentFAQItems.map((faq) => (
                      <motion.tr 
                        key={faq.faqId} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{faq.answer.substring(0, 100)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {faq.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusInfo(faq.status).className}`}>
                            {getStatusInfo(faq.status).icon}
                            {getStatusInfo(faq.status).label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openEditFAQModal(faq)} 
                            className="text-blue-600 hover:text-blue-900 mr-3 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => deleteFAQ(faq.faqId)} 
                            className="text-red-600 hover:text-red-900 p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalFAQPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                  disabled={currentPage === 1} 
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalFAQPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page} 
                    onClick={() => paginate(page)} 
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page 
                        ? "z-10 bg-linear-to-r from-orange-500 to-red-500 border-orange-500 text-white" 
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => paginate(currentPage < totalFAQPages ? currentPage + 1 : totalFAQPages)} 
                  disabled={currentPage === totalFAQPages} 
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* FAQ Modal */}
      {renderFAQModal()}
    </motion.div>
  );
}