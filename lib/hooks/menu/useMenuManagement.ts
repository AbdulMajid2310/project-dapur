// src/hooks/useMenuManagement.ts
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { MenuItem, Category } from "@/app/admin/menu/page"; // Asumsikan tipe diekspor dari sana

interface MenuFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isFavorite: boolean;
  isAvailable: boolean;
}

export const useMenuManagement = () => {
  // --- States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // --- API Calls ---
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get<{ message: string; data: Category[] }>('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat data kategori.');
      console.error(error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ message: string; data: MenuItem[] }>('/menu-items');
      setMenuItems(response.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat data menu.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Memoized Data ---
  const filteredMenuItems = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    if (searchTerm === "") return menuItems;
    return menuItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenuItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);

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

  // handleSave menerima formData dan file dari komponen form
  const handleSave = async (data: MenuFormData, file?: File) => {
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', data.name);
    formDataToSend.append('description', data.description);
    formDataToSend.append('price', String(data.price));
    formDataToSend.append('categoryId', data.categoryId);
    formDataToSend.append('isFavorite', String(data.isFavorite));
    formDataToSend.append('isAvailable', String(data.isAvailable));
    if (file) {
      formDataToSend.append('image', file);
    }

    try {
      if (selectedMenuItem) {
        await axiosInstance.patch(`/menu-items/${selectedMenuItem.menuItemId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Menu berhasil diperbarui!');
      } else {
        if (!file) {
          toast.error("Mohon pilih gambar untuk menu baru.");
          setIsSubmitting(false);
          return;
        }
        await axiosInstance.post('/menu-items', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Menu berhasil ditambahkan!');
      }
      closeModal();
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

  // --- Modal Handlers ---
  const openAddModal = () => {
    setSelectedMenuItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
  };

  return {
    // Data
    menuItems,
    categories,
    currentItems,
    totalPages,
    isLoading,
    isSubmitting,
    searchTerm,
    isModalOpen,
    selectedMenuItem,
    // Setters
    setSearchTerm,
    setCurrentPage,
    // Handlers
    handleDelete,
    handleSave,
    openAddModal,
    openEditModal,
    closeModal,
  };
};