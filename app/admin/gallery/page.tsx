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
} from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Type definitions yang disesuaikan dengan backend
interface GalleryItem {
  galleryId: string;
  imageUrl: string;
  title: string; // Saya menambahkan 'title' yang ada di backend
  alt: string;
  caption: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredGalleryItems, setFilteredGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Ubah menjadi 9 untuk grid 3x3
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<Partial<GalleryItem> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    if (searchTerm === "") {
      setFilteredGalleryItems(galleryItems);
    } else {
      const filtered = galleryItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGalleryItems(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, galleryItems]);

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
    formData.append('alt', selectedGalleryItem.alt || selectedGalleryItem.title); // Gunakan title sebagai alt default
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
      fetchGalleryItems(); // Re-fetch to update the list
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
        fetchGalleryItems(); // Re-fetch to update the list
      } catch (error) {
        toast.error('Gagal menghapus item.');
        console.error(error);
      }
    }
  };

  // --- Modal & Form Handlers ---

  const openAddGalleryModal = () => {
    setSelectedGalleryItem({ title: '', caption: '', alt: '', category: 'Makanan' }); // Reset form
    setSelectedFile(null);
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
    setSelectedFile(null); // Reset selected file when opening edit modal
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
  }

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGalleryItems = filteredGalleryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalGalleryPages = Math.ceil(filteredGalleryItems.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Render Functions ---
  const renderGalleryModal = () => (
    <AnimatePresence>
      {isGalleryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
        <motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] scrollbar-hide overflow-y-auto"
  onClick={(e) => e.stopPropagation()}
>
  <div className="p-6 border-b border-gray-200">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-800">
        {selectedGalleryItem?.galleryId ? "Edit Gambar" : "Tambah Gambar Baru"}
      </h3>
      <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
        <FaTimes />
      </button>
    </div>
  </div>

  <div className="p-6 space-y-4">
    {/* Image Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors"
      >
        {selectedGalleryItem?.imageUrl || selectedFile ? (
          <img
            src={selectedGalleryItem?.imageUrl || ''}
            alt="Preview"
            className="max-h-64 rounded-md object-contain"
          />
        ) : (
          <div className="space-y-1 text-center">
            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600">
              Klik untuk upload gambar (JPG, PNG, atau WEBP)
            </p>
            <p className="text-xs text-gray-400">
              Ukuran maksimal disarankan &lt; 5MB
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Judul */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
      <input
        type="text"
        name="title"
        value={selectedGalleryItem?.title || ''}
        onChange={handleGalleryChange}
        placeholder="Masukkan judul gambar"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
    </div>

    {/* Alt Text */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
      <input
        type="text"
        name="alt"
        value={selectedGalleryItem?.alt || ''}
        onChange={handleGalleryChange}
        placeholder="Contoh: Foto menu nasi goreng spesial"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <p className="text-xs text-gray-400 mt-1">
        Digunakan untuk aksesibilitas dan SEO
      </p>
    </div>

    {/* Caption */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
      <textarea
        name="caption"
        value={selectedGalleryItem?.caption || ''}
        onChange={handleGalleryChange}
        rows={3}
        placeholder="Tulis keterangan gambar di sini..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
    </div>

    {/* Kategori */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
      <select
        name="category"
        value={selectedGalleryItem?.category || ''}
        onChange={handleGalleryChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      >
        <option value="" disabled>
          -- Pilih Kategori --
        </option>
        <option value="Makanan">Makanan</option>
        <option value="Minuman">Minuman</option>
        <option value="Interior">Interior</option>
        <option value="Tim">Tim</option>
        <option value="Lainnya">Lainnya</option>
      </select>
    </div>
  </div>

  <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
    <button
      onClick={closeModal}
      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
      disabled={isSubmitting}
    >
      Batal
    </button>

    <button
      onClick={saveGalleryItem}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center disabled:opacity-50"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Galeri</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari gambar..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={openAddGalleryModal} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Tambah Gambar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
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
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={item.imageUrl} alt={item.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 capitalize mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.caption}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{item.category}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => openEditGalleryModal(item)} className="text-blue-600 hover:text-blue-900">
                          <FaEdit />
                        </button>
                        <button onClick={() => deleteGalleryItem(item.galleryId)} className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalGalleryPages > 1 && (
            <div className="flex items-center justify-center mt-6">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalGalleryPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => paginate(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? "z-10 bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => paginate(currentPage < totalGalleryPages ? currentPage + 1 : totalGalleryPages)} disabled={currentPage === totalGalleryPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <FaChevronRight className="h-5 w-5" />
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