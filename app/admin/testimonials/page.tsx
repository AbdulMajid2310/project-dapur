// TestimonialsManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuoteLeft,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Type definitions
interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  status: "published" | "draft";
}

// Initial data
const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Budi Santoso",
    avatar: "https://picsum.photos/100/100?random=1",
    comment: "Sekarang makan di warteg jadi lebih praktis! Tidak perlu antri lagi.",
    rating: 5,
    date: "2023-08-10",
    status: "published",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    avatar: "https://picsum.photos/100/100?random=2",
    comment: "Menu digitalnya sangat membantu, bisa lihat gambar makanan sebelum pesan.",
    rating: 4,
    date: "2023-08-08",
    status: "published",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    avatar: "https://picsum.photos/100/100?random=3",
    comment: "Pembayaran dengan QRIS sangat memudahkan, tidak perlu bawa uang tunai.",
    rating: 5,
    date: "2023-08-05",
    status: "published",
  },
];

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Filter testimonials
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTestimonials(testimonials);
    } else {
      const filtered = testimonials.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestimonials(filtered);
    }
  }, [searchTerm, testimonials]);

  // Testimonial CRUD functions
  const openAddTestimonialModal = () => {
    setSelectedTestimonial({
      id: testimonials.length + 1,
      name: "",
      avatar: "",
      comment: "",
      rating: 5,
      date: new Date().toISOString().split("T")[0],
      status: "published",
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setSelectedTestimonial((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: val };
    });
  };

  const saveTestimonial = () => {
    if (!selectedTestimonial) return;

    if (selectedTestimonial.id > testimonials.length) {
      // Add new testimonial
      setTestimonials([...testimonials, selectedTestimonial]);
    } else {
      // Update existing testimonial
      setTestimonials(
        testimonials.map((testimonial) =>
          testimonial.id === selectedTestimonial.id ? selectedTestimonial : testimonial
        )
      );
    }
    setIsTestimonialModalOpen(false);
    alert("Testimoni berhasil disimpan!");
  };

  const deleteTestimonial = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
      alert("Testimoni berhasil dihapus!");
    }
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestimonialItems = filteredTestimonials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalTestimonialPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render testimonial modal
  const renderTestimonialModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedTestimonial && selectedTestimonial.id > testimonials.length
                ? "Tambah Testimoni"
                : "Edit Testimoni"}
            </h3>
            <button
              onClick={() => setIsTestimonialModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={selectedTestimonial?.name || ""}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Avatar
            </label>
            <input
              type="text"
              name="avatar"
              value={selectedTestimonial?.avatar || ""}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {selectedTestimonial?.avatar && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={selectedTestimonial.avatar}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-500">Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimoni
            </label>
            <textarea
              name="comment"
              value={selectedTestimonial?.comment || ""}
              onChange={handleTestimonialChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                name="rating"
                value={selectedTestimonial?.rating || 5}
                onChange={handleTestimonialChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value={5}>5 Bintang</option>
                <option value={4}>4 Bintang</option>
                <option value={3}>3 Bintang</option>
                <option value={2}>2 Bintang</option>
                <option value={1}>1 Bintang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={selectedTestimonial?.date || ""}
                onChange={handleTestimonialChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={selectedTestimonial?.status || "published"}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="published">Diterbitkan</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsTestimonialModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveTestimonial}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Testimoni</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari testimoni..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddTestimonialModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Testimoni
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimoni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {currentTestimonialItems.map((testimonial) => (
                  <motion.tr
                    key={testimonial.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {testimonial.comment.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonial.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          testimonial.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {testimonial.status === "published" ? "Diterbitkan" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditTestimonialModal(testimonial)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-900"
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
      {totalTestimonialPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() =>
                paginate(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalTestimonialPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                paginate(
                  currentPage < totalTestimonialPages
                    ? currentPage + 1
                    : totalTestimonialPages
                )
              }
              disabled={currentPage === totalTestimonialPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && renderTestimonialModal()}
    </div>
  );
}