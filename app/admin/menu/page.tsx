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
  FaFilter,
  FaUtensils,
  FaCoffee,
  FaPizzaSlice,
  FaIceCream,
  FaHamburger,
  FaGlassCheers,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

// Tipe MenuItem yang sesuai dengan backend
export interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isFavorite: boolean;
}

export default function MenuManagement() {
  // --- States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const itemsPerPage = 12;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kategori ikon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "makanan": return <FaUtensils />;
      case "minuman": return <FaCoffee />;
      case "dessert": return <FaIceCream />;
      case "snack": return <FaPizzaSlice />;
      case "main course": return <FaHamburger />;
      default: return <FaGlassCheers />;
    }
  };

  // --- API Calls ---
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ message: string; data: MenuItem[] }>('/menu-items');
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

  useEffect(() => {
    fetchMenuItems();
  }, []);

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
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    if (!selectedMenuItem && !selectedFile) {
      toast.error("Mohon pilih gambar untuk menu baru.");
      return;
    }

    const priceValue = Number(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Harga harus berupa angka yang valid dan tidak boleh kurang dari 0.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', String(priceValue));

    if (formData.isFavorite !== undefined) {
      data.append('isFavorite', formData.isFavorite ? 'true' : 'false');
    }
    if (formData.isAvailable !== undefined) {
      data.append('isAvailable', formData.isAvailable ? 'true' : 'false');
    }

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
      setTimeout(() => {
        fetchMenuItems();
      }, 500);
    } catch (error: any) {
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        toast.error(error.response.data.message.join(', '));
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan menu.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal & Form Handlers ---
  const openAddModal = () => {
    setSelectedMenuItem(null);
    setFormData({
      name: "",
      description: "",
      category: "Makanan",
      price: 0,
      isFavorite: false,
      isAvailable: true,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setFormData({
      ...item,
      isFavorite: Boolean(item.isFavorite),
      isAvailable: Boolean(item.isAvailable)
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "price"
            ? value === "" ? "" : Number(value)
            : value,
    }));
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
    let filtered = menuItems;
    
    // Filter by category
    if (activeCategory !== "Semua") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMenuItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, menuItems, activeCategory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredMenuItems || []).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredMenuItems || []).length / itemsPerPage);

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(menuItems.map(item => item.category)))];

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
              <FaUtensils className="mr-3" /> Kelola Menu
            </h2>
            <p className="text-orange-100">Kelola menu makanan dan minuman untuk restoran Anda</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari menu..."
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 backdrop-blur text-white placeholder-white/70 border border-white/30 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
            <button 
              onClick={openAddModal} 
              className="bg-white text-orange-500 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-orange-50 transition-colors shadow-md"
            >
              <FaPlus className="mr-2" /> Tambah Menu
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
              className={`px-4 py-2 capitalize rounded-lg text-sm font-medium transition-all flex items-center ${
                activeCategory === category
                  ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category !== "Semua" && (
                <span className="mr-2">{getCategoryIcon(category)}</span>
              )}
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
          <FaSpinner className="animate-spin text-5xl text-orange-500 mb-4" />
          <p className="text-gray-600">Memuat data menu...</p>
        </div>
      ) : filteredMenuItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-6xl text-gray-300 mb-4">
            <FaUtensils />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada menu ditemukan</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || activeCategory !== "Semua" 
              ? "Coba ubah filter atau kata kunci pencarian" 
              : "Mulai dengan menambahkan menu baru"}
          </p>
          <button 
            onClick={openAddModal} 
            className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg flex items-center font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          >
            <FaPlus className="mr-2" /> Tambah Menu Baru
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentItems.map((item) => (
                <motion.div
                  key={item.menuItemId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />

                    {/* Favorite */}
                    {item.isFavorite && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow">
                        <FaStar className="text-yellow-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center ${
                          item.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <FaCheckCircle className="mr-1" /> Tersedia
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="mr-1" /> Habis
                          </>
                        )}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full flex items-center text-gray-700">
                        {getCategoryIcon(item.category)}
                        <span className="ml-1 capitalize">{item.category}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 capitalize line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-orange-500">
                         Rp{Number(item.price).toLocaleString("id-ID")}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.menuItemId)}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Hapus"
                        >
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
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                  disabled={currentPage === 1} 
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)} 
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
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                  disabled={currentPage === totalPages} 
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] scrollbar-hide overflow-hidden shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">
                    {selectedMenuItem ? "Edit Menu" : "Tambah Menu Baru"}
                  </h3>
                  <button 
                    onClick={closeModal} 
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide max-h-[60vh]">
                {/* Image Upload */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCloudUploadAlt className="mr-2 text-orange-500" /> Gambar Menu
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
                    {formData.image || selectedFile ? (
                      <div className="relative">
                        <img 
                          src={formData.image || ''} 
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaFilter className="mr-2 text-orange-500" /> Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>-- Pilih Kategori --</option>
                      <option value="Makanan">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea 
                    name="description" 
                    value={formData.description || ''} 
                    onChange={handleInputChange} 
                    rows={3} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
<input
  type="text"
  name="price"
  value={
    formData.price
      ? `Rp${Number(formData.price).toLocaleString("id-ID")}`
      : ""
  }
  onChange={(e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setFormData(prev => ({
      ...prev,
      price: raw ? Number(raw) : 0,
    }));
  }}
  inputMode="numeric"
  placeholder="Rp0"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
  required
/>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isFavorite"
                      name="isFavorite"
                      checked={formData.isFavorite || false}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFavorite" className="ml-3  text-sm font-medium text-gray-700 flex items-center">
                      <FaStar className="mr-2 text-yellow-400" /> Menu Favorit
                    </label>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      name="isAvailable"
                      checked={formData.isAvailable || false}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isAvailable" className="ml-3  text-sm font-medium text-gray-700 flex items-center">
                      <FaCheckCircle className="mr-2 text-green-400" /> Tersedia
                    </label>
                  </div>
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
                  onClick={handleSave} 
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
    </motion.div>
  );
}