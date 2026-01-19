// src/components/MenuFormModal.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSave, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { MenuItem, Category } from "@/app/admin/menu/page";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, file?: File) => void;
  selectedMenuItem: MenuItem | null;
  categories: Category[];
  isSubmitting: boolean;
}

export function MenuFormModal({ isOpen, onClose, onSave, selectedMenuItem, categories, isSubmitting }: MenuFormModalProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form saat selectedMenuItem berubah
  useEffect(() => {
    if (selectedMenuItem) {
      setFormData(selectedMenuItem);
    } else {
      const defaultCategory = categories.length > 0 ? categories[0] : { categoryId: '', name: 'Tidak Ada Kategori' };
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: defaultCategory,
        isFavorite: false,
        isAvailable: true,
      });
    }
    setSelectedFile(null);
  }, [selectedMenuItem, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.category?.categoryId) {
      alert("Mohon lengkapi semua field yang diperlukan.");
      return;
    }
    const priceValue = Number(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      alert("Harga harus berupa angka yang valid.");
      return;
    }
    onSave(formData, selectedFile || undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{selectedMenuItem ? "Edit Menu" : "Tambah Menu"}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
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
                  <select name="categoryId" value={formData.category?.categoryId || ''} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                    {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>)}
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
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3" disabled={isSubmitting}>Batal</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center disabled:opacity-50" disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} Simpan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}