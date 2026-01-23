"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUtensils,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
} from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "react-toastify";
import DetailMenu from "../detailProduct";



/* =====================
   CONSTANTS
===================== */


const sectionData = {
  title: "Semua Menu",
  description:
    "Nikmati berbagai pilihan makanan tradisional dengan cita rasa autentik",
};

/* =====================
   ANIMATION VARIANTS
===================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

import { Variants } from "framer-motion";
import { MenuApiResponse, MenuItem } from "@/lib/hooks/menu/type";

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1], // ✅ VALID
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1], // easeIn
    },
  },
};


/* =====================
   COMPONENT
===================== */
export default function AllMenu() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [allMenuData, setAllMenuData] = useState<MenuItem[]>([]);
  console.log('menuall', allMenuData)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const itemsPerPage = 12;

  /* =====================
     FETCH MENU
  ===================== */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get<MenuApiResponse>("/menu-items");
        setAllMenuData(res.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const menuCategoriesData = [
    { id: "all", name: "Semua" },
    { id: "favorite", name: "Favorit" },
    ...Array.from(new Set(allMenuData.map((item) => item.category))).map((cat) => ({
      id: cat,
      name: cat,
    })),
  ];


  /* =====================
     FILTER & PAGINATION
  ===================== */
  const filteredMenu = allMenuData.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorite"
        ? item.isFavorite
        : item.category === selectedCategory);

    return matchesSearch && matchesCategory && item.isAvailable;
  });


  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const currentMenuItems = filteredMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  /* =====================
     ADD TO CART
  ===================== */
  const handleAddToCart = async (menuItemId: string) => {
    try {
      setAddingToCart(menuItemId);
      await axiosInstance.post("/cart/add", {
        userId,
        menuItemId,
        quantity: 1,
      });
      toast.success("Berhasil menambahkan ke pesanan");
    } catch {
      toast.error("Gagal menambahkan ke pesanan");
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading)
    return <p className="text-center text-white py-20">Loading menu...</p>;
  if (error)
    return <p className="text-center text-red-500 py-20">{error}</p>;

  /* =====================
     RENDER
  ===================== */
  
  return (
    <>
      <motion.section
        id="menu"
        className="py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          {/* HEADER */}
          <motion.div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white flex justify-center items-center gap-4 mb-4">
              <FaUtensils className="text-orange-300" />
              {sectionData.title}
            </h2>
            <p className="text-orange-100/80 text-lg">
              {sectionData.description}
            </p>
          </motion.div>

          {/* CATEGORY & SEARCH */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between mb-12">
            <div className="flex overflow-x-auto scrollbar-hide gap-3">
              {menuCategoriesData.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2 whitespace-nowrap rounded-full font-semibold transition ${selectedCategory === cat.id
                      ? "bg-white text-[#9C633D]"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>


            <div className="relative max-w-md w-full">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari menu..."
                className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white focus:outline-none"
              />
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-200" />
            </div>
          </div>

          {/* MENU GRID */}
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
          >
            <AnimatePresence mode="popLayout">
              {currentMenuItems.map((item, index) => (
                <motion.div
                  layout
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedMenu(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <motion.button
                      disabled={addingToCart === item.menuItemId}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.menuItemId);
                      }}
                      className="w-full bg-[#9C633D] text-white py-2 rounded-xl font-bold"
                    >
                      {addingToCart === item.menuItemId ? (
                        "Menambahkan..."
                      ) : (
                        <>
                          <FaPlus className="inline mr-2" />
                          Tambah
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1
                      ? "bg-white text-[#9C633D]"
                      : "text-white"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedMenu && (
          <DetailMenu
            menu={selectedMenu}
            onClose={() => setSelectedMenu(null)}
            onAddToCart={(id) => {
              handleAddToCart(id);
              setSelectedMenu(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
