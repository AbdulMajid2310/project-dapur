import axiosInstance from '@/lib/axiosInstance';
import { TestimonialData } from '@/lib/hooks/testimonial/type';
import { useAuth } from '@/lib/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaTimes, 
  FaCheckCircle, 
  FaCamera,
  FaQuoteLeft,
  FaSpinner,
  FaUserCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface CreateTestimonialSectionProps {
  menuItemId: string;
  orderId: string;
  orderItemId: string;
  onClose: () => void;
}

interface OrderItemDetail {
  orderItemId: string;
  quantity: number;
  subtotal: string;
  priceAtPurchase: string;
  menuItem: {
    menuItemId: string;
    name: string;
    description: string;
    image: string;
    price: string;
  };
}



const CreateTestimonialSection: React.FC<CreateTestimonialSectionProps> = ({
  menuItemId,
  orderId,
  orderItemId,
  onClose,
}) => {
  const { user } = useAuth();
  const userId = user?.userId;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [orderItem, setOrderItem] = useState<OrderItemDetail | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  const [testimonial, setTestimonial] = useState<TestimonialData | null>(null);
  console.log("testimonial", testimonial)
  const [loadingTestimonial, setLoadingTestimonial] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ORDER ITEM ================= */
  useEffect(() => {
    const fetchOrderItem = async () => {
      try {
        const res = await axiosInstance.get(
          `/orders/${orderId}/items/${orderItemId}`
        );
        setOrderItem(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil detail order item', err);
      } finally {
        setLoadingItem(false);
      }
    };
    fetchOrderItem();
  }, [orderId, orderItemId]);

  /* ================= FETCH TESTIMONIAL ================= */
  useEffect(() => {
    const fetchTestimonial = async () => {
      if (!userId) return;

      try {
        const res = await axiosInstance.get(
          `/testimonials/user/${userId}/order/${orderId}/order-item/${orderItemId}/menu/${menuItemId}`
        );

        if (res.data?.data) {
          setTestimonial(res.data.data);
          setRating(res.data.data.rating);
          setComment(res.data.data.comment);
          setImagePreview(res.data.data.image);
        }
      } catch (err) {
        console.log('Testimonial tidak ditemukan atau error', err);
      } finally {
        setLoadingTestimonial(false);
      }
    };

    fetchTestimonial();
  }, [userId, orderId, orderItemId, menuItemId]);

  /* ================= IMAGE PREVIEW ================= */
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(testimonial?.image || null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile, testimonial?.image]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('User tidak ditemukan');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('orderItemId', orderItemId);
      formData.append('orderId', orderId);
      formData.append('menuItemId', menuItemId);
      formData.append('comment', comment);
      formData.append('rating', rating.toString());
      formData.append('userId', userId);

      if (imageFile) formData.append('image', imageFile);

      // POST new testimonial
      await axiosInstance.post('/testimonials', formData);

      toast.success('Ulasan berhasil dikirim!');
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Maaf sedang ada gangguan');
      toast.error(err.response?.data?.message || 'Gagal mengirim ulasan');
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  if (loadingItem || loadingTestimonial) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mr-3" />
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* ===== ORDER ITEM DETAIL ===== */}
      {orderItem && (
        <div className="p-5 border-b  flex gap-4">
          <img
            src={orderItem.menuItem.image}
            alt={orderItem.menuItem.name}
            className="w-20 h-20 rounded-lg object-cover border shadow-sm"
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

      {/* ===== TESTIMONIAL DISPLAY ===== */}
      {testimonial ? (
        <div className="p-5  rounded-lg mt-6 border-slate-300 border">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              {testimonial.user?.avatar ? (
                <img
                  src={testimonial.user?.avatar}
                  alt={testimonial.user?.lastName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800 capitalize">{testimonial.user?.firstName} {testimonial.user.lastName}</h4>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-sm ${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-gray-700">{testimonial.comment}</p>
              {testimonial.image && (
                <div className="mt-3">
                  <img
                    src={testimonial.image}
                    alt="Testimonial"
                    className="w-full max-w-xs rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ===== FORM ===== */
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto (Opsional)</label>
              {!imagePreview ? (
                <label className="group relative flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition bg-gray-50">
                  <div className="flex flex-col items-center text-center px-4">
                    <FaCamera className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-400 mt-1">PNG / JPG (maks. 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  />
                </label>
              ) : (
                <div className="relative h-48 rounded-xl overflow-hidden border shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                      <FaTimes size={14} /> Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RATING */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seberapa puas Anda?</label>
              <div className="flex justify-center gap-2 mb-2">
                {[1,2,3,4,5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRating(v)}
                    className={`transition transform hover:scale-125 ${v <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <FaStar className="text-3xl drop-shadow-sm" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {['','Tidak puas 😞','Kurang 😐','Cukup 🙂','Puas 😊','Sangat puas 😍'][rating]}
              </p>
            </div>
          </div>

          {/* COMMENT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cerita pengalaman Anda</label>
            <div className="relative">
              <FaQuoteLeft className="absolute top-3 left-3 text-gray-300" />
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Bagikan pengalaman Anda..."
                className="w-full border rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* ERROR & SUCCESS */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <FaCheckCircle className="mr-2" /> Ulasan berhasil dikirim! 🎉
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <><FaSpinner className="animate-spin mr-2" /> Mengirim...</>
            ) : 'Kirim Ulasan'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTestimonialSection;
