"use client";

import { MenuItem } from "@/lib/hooks/menu/type";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, 
  FaPlus, 
  FaStar, 
  FaHeart,
  FaUserCircle,
  FaQuoteLeft,
} from "react-icons/fa";
import { useState } from "react";

type DetailMenuProps = {
  menu: MenuItem;
  onClose: () => void;
  onAddToCart: (menuItemId: string) => void;
};

export default function DetailMenu({
  menu,
  onClose,
  onAddToCart,
}: DetailMenuProps) {
 
  const [isImageLoading, setIsImageLoading] = useState(true);

  

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white grid grid-cols-2 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl "
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE SECTION */}
        <div className="relative w-full  h-64 md:h-auto">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
          <div className="w-full h-full">

          <img
            src={menu.image}
            alt={menu.name}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoading(false)}
          />
          </div>
          
          {/* Overlay linear */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <FaTimes size={18} />
          </button>

          {/* Favorite badge */}
          {menu.isFavorite && (
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center">
              <FaHeart className="mr-1 text-red-400" /> Menu Favorit
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="flex-1 p-6 h-full max-h-[80vh] scrollbar-hide  md:p-8 pb-40 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{menu.name}</h3>
              
            </div>
            <div className="text-right">
              <span className="bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                Rp{parseFloat(menu.price).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Deskripsi</h4>
            <p className="text-gray-600 leading-relaxed">{menu.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="mb-8">
            <button
              onClick={() => onAddToCart(menu.menuItemId)}
              className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
            >
              <FaPlus className="mr-2" /> Tambah ke Pesanan
            </button>
          </div>

          {/* Testimonials Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 text-lg">Ulasan Pelanggan</h4>
              
            </div>

            {menu.testimonials.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {menu.testimonials.map((item, index)=>(

                  <div key={index} className="flex items-start bg-slate-200 rounded-2xl p-2  gap-4">
                    <div className="shrink-0">
                      {item.image ? (
                        <img
                          src={item?.user.avatar || ""}
                          alt={item?.user.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium capitalize text-gray-800">
                          {item?.user.firstName}{" "}
                          {item.user.lastName}
                        </h5>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={12}
                              className={`${
                                i < item.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {item.comment}
                      </p>
                      
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Testimonial"
                          className="w-full max-w-xs rounded-lg mt-2"
                        />
                      )}
                    </div>
                  </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FaQuoteLeft className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada ulasan untuk menu ini</p>
                <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama memberikan ulasan!</p>
              </div>
            )}
          </div>

        
        </div>
      </motion.div>
    </motion.div>
  );
}