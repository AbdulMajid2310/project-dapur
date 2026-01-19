"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUtensils, FaStar, FaSearch, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";

// =====================
// TYPES
// =====================
export interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string | null;
  isFavorite: boolean;
  isAvailable: boolean;
  stock: number;
  orderCount: number;
  rating: number | null;
  reviewCount: number;
  allergens: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuApiResponse {
  message: string;
  data: MenuItem[];
}

// =====================
// DATA & ANIMATION
// =====================
const menuCategoriesData = [
  { id: "all", name: "Semua Menu" },
  { id: "favorite", name: "Menu Favorit" },
  { id: "main", name: "Makanan Utama" },
  { id: "side", name: "Lauk Pauk" },
  { id: "drink", name: "Minuman" },
  { id: "dessert", name: "Dessert" },
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const sectionData = {
  title: "Semua Menu",
  description: "Nikmati berbagai pilihan makanan tradisional dengan cita rasa autentik",
};

// =====================
// COMPONENT
// =====================
export default function AllMenu() {
    const {  user } = useAuth();
    const userId = user?.userId
  const [allMenuData, setAllMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // menyimpan menuItemId yang sedang ditambahkan
  const itemsPerPage = 12;

  // =====================
  // Fetch API
  // =====================
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<MenuApiResponse>("/menu-items");
        setAllMenuData(response.data.data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch menu:", err);
        setError(err.message || "Failed to fetch menu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // =====================
  // Filter & Pagination
  // =====================
  const filteredMenu = allMenuData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorite" ? item.isFavorite : item.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const currentMenuItems = filteredMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm, selectedCategory]);

  // =====================
  // Add to Cart
  // =====================
  const handleAddToCart = async (menuItemId: string) => {
    try {
      setAddingToCart(menuItemId);

      await axiosInstance.post("/cart/add", {
        userId,
        menuItemId,
        quantity: 1,
      });

      alert("Berhasil menambahkan ke pesanan!");
    } catch (err: any) {
      console.error("Gagal menambahkan ke pesanan:", err);
      alert(err.response?.data?.message || "Gagal menambahkan ke pesanan.");
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) return <p className="text-center text-white py-20">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;

  // =====================
  // Render
  // =====================
  return (
    <motion.section
      id="menu"
      className="py-20 px-4  relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    >
     

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div className="text-center max-w-2xl mx-auto mb-12" variants={itemVariants}>
          <h2 className="text-3xl md:text-5xl font-extrabold lg:mb-4 mb-2 flex items-center justify-center text-white">
            <FaUtensils className="mr-4 text-orange-300" /> {sectionData.title}
          </h2>
          <p className="text-orange-100/80 text-lg">{sectionData.description}</p>
        </motion.div>

        {/* Categories & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <motion.div className="flex overflow-x-auto w-full lg:w-auto pb-2 -mx-2 px-2 scrollbar-hide" variants={itemVariants}>
            {menuCategoriesData.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center min-w-max py-2.5 px-8 mx-1.5 rounded-full border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-white text-[#9C633D] shadow-lg font-bold"
                    : "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-sm uppercase tracking-wider">{category.name}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div className="w-full max-w-md" variants={itemVariants}>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari menu favorit Anda..."
                className="w-full px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-200" />
            </div>
          </motion.div>
        </div>

        {/* Menu Grid */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          {currentMenuItems.map((item) => (
            <motion.div
              key={item.menuItemId}
              className="bg-white rounded-4xl overflow-hidden shadow-2xl transition-all duration-500 group cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-[#9C633D] text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg">
                  Rp{parseFloat(item.price).toLocaleString("id-ID")}
                </div>
                {item.isFavorite && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-[#9C633D] px-3 py-1 rounded-xl text-sm font-bold shadow-md">
                    ⭐ Populer
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#9C633D] transition-colors">{item.name}</h3>
                <p className="text-gray-500 mb-6 line-clamp-2 text-xs leading-relaxed">{item.description}</p>
                <motion.button
                  className={`w-full bg-[#9C633D] hover:bg-[#7a4d2f] text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg shadow-orange-900/20 ${
                    addingToCart === item.menuItemId ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: addingToCart === item.menuItemId ? 1 : 1.02 }}
                  whileTap={{ scale: addingToCart === item.menuItemId ? 1 : 0.98 }}
                  onClick={() => handleAddToCart(item.menuItemId)}
                  disabled={addingToCart === item.menuItemId}
                >
                  {addingToCart === item.menuItemId ? "Menambahkan..." : <><FaPlus className="mr-2 text-xs" /> Tambah</>}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div className="flex justify-center" variants={itemVariants}>
            <nav className="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-colors ${currentPage === 1 ? "text-white/20" : "text-white hover:bg-white/20"}`}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? "bg-white text-[#9C633D] shadow-lg" : "text-white hover:bg-white/20"}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-colors ${currentPage === totalPages ? "text-white/20" : "text-white hover:bg-white/20"}`}
              >
                <FaChevronRight />
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
