"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaImages,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaCloudUploadAlt,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner,
  FaFilter,
  FaEye,
  FaTag,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Type definitions yang disesuaikan dengan backend
interface GalleryItem {
  galleryId: string;
  imageUrl: string;
  title: string;
  alt: string;
  caption: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt?: string; // Tambahkan field untuk tanggal
}

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredGalleryItems, setFilteredGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<Partial<GalleryItem> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CRUD Functions ---

  // READ: Fetch all gallery items from the server
  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<GalleryItem[]>('/gallery');
      setGalleryItems(response.data);
      setFilteredGalleryItems(response.data);
    } catch (error) {
      toast.error('Gagal memuat data galeri.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Filter gallery items
  useEffect(() => {
    let filtered = galleryItems;
    
    // Filter by category
    if (activeCategory !== "Semua") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredGalleryItems(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, galleryItems, activeCategory]);

  // CREATE & UPDATE: Save gallery item (new or existing)
  const saveGalleryItem = async () => {
    if (!selectedGalleryItem?.title || !selectedGalleryItem?.caption || !selectedGalleryItem?.category) {
      toast.error('Judul, Caption, dan Kategori harus diisi.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', selectedGalleryItem.title);
    formData.append('caption', selectedGalleryItem.caption);
    formData.append('alt', selectedGalleryItem.alt || selectedGalleryItem.title);
    formData.append('category', selectedGalleryItem.category);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (selectedGalleryItem.galleryId) {
        // UPDATE existing item
        await axiosInstance.put(`/gallery/${selectedGalleryItem.galleryId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Gambar berhasil diperbarui!');
      } else {
        // CREATE new item
        if (!selectedFile) {
          toast.error('Harap pilih gambar untuk ditambahkan.');
          setIsSubmitting(false);
          return;
        }
        await axiosInstance.post('/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Gambar berhasil ditambahkan!');
      }
      
      setIsGalleryModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan gambar.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE: Delete a gallery item
  const deleteGalleryItem = async (galleryId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        await axiosInstance.delete(`/gallery/${galleryId}`);
        toast.success('Item galeri berhasil dihapus!');
        fetchGalleryItems();
      } catch (error) {
        toast.error('Gagal menghapus item.');
        console.error(error);
      }
    }
  };

  // --- Modal & Form Handlers ---

  const openAddGalleryModal = () => {
    setSelectedGalleryItem({ title: '', caption: '', alt: '', category: 'Makanan' });
    setSelectedFile(null);
    setPreviewImage(null);
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
    setSelectedFile(null);
    setPreviewImage(item.imageUrl);
    setIsGalleryModalOpen(true);
  };

  const openPreviewModal = (item: GalleryItem) => {
    setPreviewImage(item.imageUrl);
    setIsGalleryModalOpen(true);
  };

  const handleGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedGalleryItem((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setSelectedGalleryItem((prev) => {
        if (!prev) return null;
        return { ...prev, imageUrl: objectUrl };
      });
    }
  };
  
  const closeModal = () => {
    setIsGalleryModalOpen(false);
    setSelectedGalleryItem(null);
    setSelectedFile(null);
    setPreviewImage(null);
  }

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleryItems = filteredGalleryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalGalleryPages = Math.ceil(filteredGalleryItems.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(galleryItems.map(item => item.category)))];

  // --- Render Functions ---
  const renderGalleryModal = () => (
    <AnimatePresence>
      {isGalleryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  {selectedGalleryItem?.galleryId ? "Edit Gambar" : "Tambah Gambar Baru"}
                </h3>
                <button 
                  onClick={closeModal} 
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Image Upload */}
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaImages className="mr-2 text-orange-500" /> Gambar
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-orange-400 transition-colors bg-gray-50"
                >
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-64 rounded-lg object-contain"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        Klik untuk mengganti
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FaCloudUploadAlt className="mx-auto h-16 w-16 text-gray-400" />
                      <p className="text-lg text-gray-600">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-sm text-gray-400">
                        JPG, PNG, atau WEBP (maks. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                  <input
                    type="text"
                    name="title"
                    value={selectedGalleryItem?.title || ''}
                    onChange={handleGalleryChange}
                    placeholder="Masukkan judul gambar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaTag className="mr-2 text-orange-500" /> Kategori
                  </label>
                  <select
                    name="category"
                    value={selectedGalleryItem?.category || ''}
                    onChange={handleGalleryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Interior">Interior</option>
                    <option value="Tim">Tim</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  value={selectedGalleryItem?.alt || ''}
                  onChange={handleGalleryChange}
                  placeholder="Contoh: Foto menu nasi goreng spesial"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <FaInfoCircle className="mr-1" /> Digunakan untuk aksesibilitas dan SEO
                </p>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  name="caption"
                  value={selectedGalleryItem?.caption || ''}
                  onChange={handleGalleryChange}
                  rows={3}
                  placeholder="Tulis keterangan gambar di sini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>

              <button
                onClick={saveGalleryItem}
                className="px-6 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSave className="mr-2" />
                )}
                Simpan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <FaImages className="mr-3" /> Kelola Galeri
            </h2>
            <p className="text-orange-100">Kelola koleksi gambar untuk website Anda</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari gambar..."
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 backdrop-blur text-white placeholder-white/70 border border-white/30 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
            <button 
              onClick={openAddGalleryModal} 
              className="bg-white text-orange-500 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-orange-50 transition-colors shadow-md"
            >
              <FaPlus className="mr-2" /> Tambah Gambar
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center mb-3">
          <FaFilter className="mr-2 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filter Kategori</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
          <FaSpinner className="animate-spin text-5xl text-orange-500 mb-4" />
          <p className="text-gray-600">Memuat data galeri...</p>
        </div>
      ) : filteredGalleryItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-6xl text-gray-300 mb-4">
            <FaImages />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada gambar ditemukan</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || activeCategory !== "Semua" 
              ? "Coba ubah filter atau kata kunci pencarian" 
              : "Mulai dengan menambahkan gambar baru ke galeri"}
          </p>
          <button 
            onClick={openAddGalleryModal} 
            className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg flex items-center font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          >
            <FaPlus className="mr-2" /> Tambah Gambar Baru
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentGalleryItems.map((item) => (
                <motion.div
                  key={item.galleryId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.alt} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white w-full">
                        <p className="text-sm">{item.caption}</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur text-xs font-medium px-3 py-1 rounded-full text-gray-800">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEditGalleryModal(item)} 
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => openPreviewModal(item)} 
                          className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition-colors"
                          title="Preview"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => deleteGalleryItem(item.galleryId)} 
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      {item.createdAt && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(item.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalGalleryPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                  disabled={currentPage === 1} 
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalGalleryPages }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => paginate(currentPage < totalGalleryPages ? currentPage + 1 : totalGalleryPages)} 
                  disabled={currentPage === totalGalleryPages} 
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Gallery Modal */}
      {renderGalleryModal()}
    </div>
  );
}