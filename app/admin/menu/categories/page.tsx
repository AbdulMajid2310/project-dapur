"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaCloudUploadAlt,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

// ... tipe lainnya

export interface Category {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string; // URL untuk ikon
  color?: string; // Kode hex, misalnya '#FF5733'
  order: number;
  isActive: boolean;
}

export default function CategoryManagement() {
  // --- States ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API Calls ---
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ message: string; data: Category[] }>('/categories');
      // Urutkan berdasarkan 'order' sebelum diset ke state
      const sortedCategories = (response.data.data || []).sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
      setFilteredCategories(sortedCategories);
    } catch (error) {
      toast.error('Gagal memuat data kategori.');
      console.error(error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await axiosInstance.delete(`/categories/${id}`);
        toast.success('Kategori berhasil dihapus!');
        fetchCategories();
      } catch (error) {
        toast.error('Gagal menghapus kategori.');
        console.error(error);
      }
    }
  };

  const handleSave = async () => {


    if (!formData.name) {
      toast.error("Nama kategori harus diisi.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.description) data.append('description', formData.description);
    if (formData.color) data.append('color', formData.color);




    if (selectedFile) {
      data.append('icon', selectedFile);
    }

    try {
      if (selectedCategory) {
        // Update
        await axiosInstance.patch(`/categories/${selectedCategory.categoryId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Kategori berhasil diperbarui!');
      } else {
        // Create
        if (!selectedFile) {
          toast.error("Mohon pilih ikon untuk kategori baru.");
          setIsSubmitting(false);
          return;
        }
        await axiosInstance.post('/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Kategori berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan kategori.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal & Form Handlers ---
  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({ name: "", order: 0, isActive: true, color: "#6B7280" });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Category) => {
    setSelectedCategory(item);
    setFormData(item);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, icon: objectUrl }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({});
    setSelectedFile(null);
  };

  // --- Search & Pagination ---
  useEffect(() => {
    if (!categories) {
      setFilteredCategories([]);
      return;
    }
    if (searchTerm === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, categories]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredCategories || []).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredCategories || []).length / itemsPerPage);

  // --- Render ---
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Kategori</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input type="text" placeholder="Cari kategori..." className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={openAddModal} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Tambah Kategori
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12"><FaSpinner className="animate-spin text-4xl text-orange-500" /></div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ikon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.categoryId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 p-1">
                          {item.icon && <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.description?.substring(0, 30)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: item.color }}></div>
                          <span className="ml-2 text-xs text-gray-500">{item.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.isActive ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.categoryId)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded ${currentPage === page ? "bg-orange-500 text-white" : ""}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">{selectedCategory ? "Edit Kategori" : "Tambah Kategori"}</h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ikon Kategori</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400">
                    {formData.icon || selectedFile ? (
                      <img src={formData.icon || ''} alt="Preview" className="max-h-32 rounded-md object-contain" />
                    ) : (
                      <div className="space-y-1 text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Klik untuk upload ikon</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                    <div className="flex items-center space-x-2">
                      <input type="color" name="color" value={formData.color || '#000000'} onChange={handleInputChange} className="h-10 w-20 border border-gray-300 rounded cursor-pointer" />
                      <input type="text" value={formData.color || ''} onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                    <input type="number" name="order" value={formData.order || 0} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive ?? true} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Aktif</label>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3" disabled={isSubmitting}>Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center disabled:opacity-50" disabled={isSubmitting}>
                  {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}