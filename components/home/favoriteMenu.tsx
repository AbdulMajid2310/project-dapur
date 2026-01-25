import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaStar, FaPlus, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import DetailMenu from "../detailProduct";
import { MenuApiResponse, MenuItem } from "@/lib/hooks/menu/type";
import { useRouter } from "next/navigation";



// =====================
// ANIMATIONS
// =====================
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// =====================
// COMPONENT
// =====================
export default function FavoriteMenu() {
  const { user } = useAuth();
  const userId = user?.userId
  const router = useRouter()
  const [favoriteMenuData, setFavoriteMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // menyimpan menuItemId yang sedang ditambahkan
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);


  // Fetch favorite menu
  useEffect(() => {
    const fetchFavoriteMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get<MenuApiResponse>("/menu-items/favorites");
        const rawData = response.data.data;

        const formattedData: MenuItem[] = rawData.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category ,
          isFavorite: item.isFavorite,
          isAvailable: item.isAvailable,
          stock: item.stock,
          orderCount: item.orderCount,
          rating: item.rating,
          reviewCount: item.reviewCount,
          allergens: item.allergens,
          isActive: item.isActive,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          testimonials: item.testimonials || []
        }));

        setFavoriteMenuData(formattedData);
      } catch (err: any) {
        console.error("Failed to fetch favorite menus:", err);
        setError(err.message || "Failed to fetch favorite menus.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteMenus();
  }, []);

  // Fungsi untuk menambahkan ke pesanan
  const handleAddToCart = async (menuItemId: string) => {
    // ❗ JIKA BELUM LOGIN
  if (!userId) {
    toast.info("Silakan login terlebih dahulu");
    router.push("/login");
    return;
  }
    try {
      setAddingToCart(menuItemId);

      await axiosInstance.post("/cart/add", {
        userId,
        menuItemId,
        quantity: 1,
      });

      toast("Berhasil menambahkan ke pesanan!");
    } catch (err: any) {
      toast.error("Gagal menambahkan ke pesanan.");
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>

      <motion.section
        className="py-16 px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <div className="container mx-auto">
          {/* Header */}
          <motion.div className="flex justify-between items-end mb-8" variants={itemVariants}>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-3 text-2xl" />
              <h2 className="lg:text-4xl text-2xl font-bold text-white">Menu Favorit Kami</h2>
            </div>
            <motion.a
              href="#menu"
              className="text-orange-200 hover:text-white font-medium flex items-center transition-colors"
              whileHover={{ x: 5 }}
            >
              Lihat Semua Menu
              <FaChevronRight className="ml-1" />
            </motion.a>
          </motion.div>

          {/* Menu List */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {favoriteMenuData.map((item) => (
                <motion.div
                  key={item.menuItemId}

                  onClick={() => setSelectedMenu(item)}
                  className="shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-2xl mr-6 snap-start cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ y: -12 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-[#9C633D] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Rp{parseFloat(item.price).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-5 h-10">{item.description}</p>

                    <motion.button
                      className={`w-full bg-[#9C633D] hover:bg-[#835332] text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-md ${addingToCart === item.menuItemId ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      whileHover={{ scale: addingToCart === item.menuItemId ? 1 : 1.02 }}
                      whileTap={{ scale: addingToCart === item.menuItemId ? 1 : 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.menuItemId);
                      }}

                      disabled={addingToCart === item.menuItemId}
                    >
                      {addingToCart === item.menuItemId ? "Menambahkan..." : <><FaPlus className="mr-2 text-sm" /> Tambah ke Pesanan</>}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      <AnimatePresence>
        {selectedMenu && (
          <DetailMenu
            menu={selectedMenu}
            onClose={() => setSelectedMenu(null)}
            onAddToCart={(menuItemId) => {
              handleAddToCart(menuItemId);
              setSelectedMenu(null);
            }}
          />
        )}
      </AnimatePresence>

    </>
  );
}
