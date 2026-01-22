import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/lib/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface CreateTestimonialSectionProps {
  menuId: string;
  orderId: string;
  itemId: string
  onClose: () => void;
}

interface OrderItemDetail {
  id: string;
  quantity: number;
  subtotal: string;
  priceAtPurchase: string;
  menuItem: {
    name: string;
    description: string;
    image: string;
    price: string;
  };
  
}

const CreateTestimonialSection: React.FC<CreateTestimonialSectionProps> = ({
  menuId,
  orderId,
  itemId,
  onClose,
}) => {

  const { user } = useAuth();
  const userId = user?.userId

  console.log("userId", userId)
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [orderItem, setOrderItem] = useState<OrderItemDetail | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ORDER ITEM ================= */
  useEffect(() => {
    const fetchOrderItem = async () => {
      try {
        const res = await axiosInstance.get(
          `/orders/${orderId}/items/${menuId}`
        );
        setOrderItem(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil detail item');
      } finally {
        setLoadingItem(false);
      }
    };

    fetchOrderItem();
  }, [orderId, menuId]);

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Validasi sederhana di frontend
    if (!userId) {
      console.error('userId is required');
      return;
    }

    const safeRating = rating ?? 5;

    const formData = new FormData();
    formData.append('menuItemId', itemId);
    formData.append('orderId', orderId);
    formData.append('comment', comment);
    formData.append('rating', safeRating.toString());
    formData.append('userId', userId); // ✅ jangan kirim string kosong

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axiosInstance.post('/testimonials', formData);

      onClose?.(); // ✅ aman walaupun undefined
    } catch (error: any) {
      toast.error('Maaf sedang ada gangguan');
    }
  };
  /* ================= UI ================= */
  return (
    <div className="w-full overflow-hidden pb-20">


      {/* ===== PRODUCT DETAIL ===== */}
      <div className="p-5 border-b">
        {loadingItem ? (
          <div className="animate-pulse flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ) : orderItem && (
          <div className="flex gap-4">
            <img
              src={orderItem.menuItem.image}
              alt={orderItem.menuItem.name}
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {orderItem.menuItem.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {orderItem.menuItem.description}
              </p>
              <div className="mt-2 text-sm text-gray-600 flex justify-between">
                <span>Qty: {orderItem.quantity}</span>
                <span className="font-semibold text-blue-600">
                  Rp {Number(orderItem.subtotal).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div className='grid grid-cols-2 gap-4 items-center'>
          {/* ===== IMAGE UPLOAD ===== */}
          {!imagePreview ? (
            <label className="group relative flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
              <div className="flex flex-col items-center text-center px-4">
                <svg
                  className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M12 3v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-600">
                  Klik atau seret gambar ke sini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG / JPG (opsional)
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  e.target.files && setImageFile(e.target.files[0])
                }
              />
            </label>
          ) : (
            <div className="relative h-48 rounded-xl overflow-hidden border shadow-sm">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <FaTimes size={14} />
                  Hapus
                </button>
              </div>
            </div>
          )}
          {/* ===== RATING ===== */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Seberapa puas Anda?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRating(v)}
                  className={`transition transform hover:scale-125 ${v <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                >
                  <FaStar className="text-3xl drop-shadow-sm" />
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {['', 'Tidak puas 😞', 'Kurang 😐', 'Cukup 🙂', 'Puas 😊', 'Sangat puas 😍'][rating]}
            </p>
          </div>
        </div>

        {/* ===== COMMENT ===== */}
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Ceritakan pengalaman Anda..."
          className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />



        {/* ===== STATUS ===== */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm text-center">
            Ulasan berhasil dikirim 🎉
          </p>
        )}

        {/* ===== SUBMIT ===== */}
        <button
          disabled={isLoading || success}
          className="w-full bg-linear-to-r from-blue-600 to-blue-500 
          hover:from-blue-700 hover:to-blue-600
          text-white font-semibold py-3 rounded-xl transition
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Mengirim ulasan...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
};

export default CreateTestimonialSection;
