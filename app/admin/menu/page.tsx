"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaTimes,
  FaSave,
  FaCloudUploadAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

// Tipe untuk kategori, diambil dari endpoint /categories
export interface Category {
  categoryId: string;
  name: string;
}

// Tipe MenuItem yang sesuai dengan backend
export interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isFavorite: boolean;
  category: Category; // Relasi ke kategori
}

export default function MenuManagement() {
  // --- States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("data menu", filteredMenuItems)
  // --- States untuk Kategori ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API Calls ---

  // 1. Fungsi untuk mengambil data kategori
  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await axiosInstance.get<{ message: string; data: Category[] }>('/categories');
      setCategories(response.data.data || []);
      
    } catch (error) {
      toast.error('Gagal memuat data kategori.');
      console.error(error);
      setCategories([]); // Pastikan state tetap array
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  // 2. Fungsi untuk mengambil data menu
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ message: string; data: MenuItem[] }>('/menu-items');
      console.log("data menu fetch", response)
      setMenuItems(response.data.data || []);
      setFilteredMenuItems(response.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat data menu.');
      console.error(error);
      setMenuItems([]);
      setFilteredMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect untuk memanggil fetch data saat komponen dimuat
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []); // <-- Hanya satu useEffect yang diperlukan untuk fetch awal

  // --- CRUD Handlers ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await axiosInstance.delete(`/menu-items/${id}`);
        toast.success('Menu berhasil dihapus!');
        fetchMenuItems();
      } catch (error) {
        toast.error('Gagal menghapus menu.');
        console.error(error);
      }
    }
  };

  const handleSave = async () => {
    // Validasi 1: Field wajib
    if (!formData.name || !formData.description || !formData.category?.categoryId) {
      toast.error("Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    // Validasi 2: Gambar untuk menu baru
    if (!selectedMenuItem && !selectedFile) {
      toast.error("Mohon pilih gambar untuk menu baru.");
      return;
    }

    // --- VALIDASI & KONVERSI TIPE DATA ---
    const priceValue = Number(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Harga harus berupa angka yang valid dan tidak boleh kurang dari 0.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', String(priceValue));
    data.append('categoryId', formData.category.categoryId);
    data.append('isFavorite', String(!!formData.isFavorite));
    data.append('isAvailable', String(!!formData.isAvailable));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      if (selectedMenuItem) {
        await axiosInstance.put(`/menu-items/${selectedMenuItem.menuItemId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Menu berhasil diperbarui!');
      } else {
        await axiosInstance.post('/menu-items', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Menu berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchMenuItems();
    } catch (error: any) {
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        toast.error(error.response.data.message.join(', '));
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan menu.');
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal & Form Handlers ---
  const openAddModal = () => {
    setSelectedMenuItem(null);
    // Gunakan kategori pertama dari data yang sudah di-fetch, atau fallback ke objek kosong
    const defaultCategory = categories.length > 0 ? categories[0] : { categoryId: '', name: 'Tidak Ada Kategori' };
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: defaultCategory,
      isFavorite: false,
      isAvailable: true,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setFormData(item);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.categoryId === value);
      setFormData(prev => ({ ...prev, category: selectedCategory }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: objectUrl }));
    }
  };
  
  const closeModal = () => {
    // --- PERBAIKAN: Cegah memory leak ---
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
    setIsModalOpen(false);
    setSelectedMenuItem(null);
    setFormData({});
    setSelectedFile(null);
  }

  // --- Search & Pagination ---
  useEffect(() => {
    if (!menuItems) {
      setFilteredMenuItems([]);
      return;
    }
    if (searchTerm === "") {
      setFilteredMenuItems(menuItems);
    } else {
      const filtered = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, menuItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredMenuItems || []).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredMenuItems || []).length / itemsPerPage);

  console.log("data", currentItems)
  // --- Render ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={openAddModal} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Tambah Menu
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      ) : (
        <>
          {/* --- KODE TABEL YANG SEBELUMNYA DIHAPUS --- */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.menuItemId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img src={item.image} alt={item.name} width={48} height={48} className="object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description.substring(0, 30)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Rp {item.price.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.isAvailable ? "Tersedia" : "Habis"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.isFavorite ? <FaStar className="text-yellow-400" /> : "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.menuItemId)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">{selectedMenuItem ? "Edit Menu" : "Tambah Menu"}</h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400">
                    {formData.image || selectedFile ? (
                      <img src={formData.image || ''} alt="Preview" className="max-h-64 rounded-md object-contain" />
                    ) : (
                      <div className="space-y-1 text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input type="number" name="price" value={formData.price || 0} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      name="categoryId" 
                      value={formData.category?.categoryId || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required
                      disabled={isCategoriesLoading}
                    >
                      {isCategoriesLoading ? (
                        <option>Memuat kategori...</option>
                      ) : (
                        categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>)
                      )}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="isFavorite" name="isFavorite" checked={formData.isFavorite || false} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                    <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700">Menu Favorit</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable || false} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                    <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">Tersedia</label>
                  </div>
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