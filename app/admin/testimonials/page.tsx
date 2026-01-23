"use client";

import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse, TestimonialData } from '@/lib/hooks/testimonial/type';
import React, { useState, useEffect } from 'react';
import {
  FaStar,
  FaTrashAlt,
  FaRedo,
  FaCommentDots,
  FaExclamationTriangle,
  FaTimes,
  FaInfoCircle,
  FaShoppingCart,
  FaSearch,
  FaTh,
  FaList
} from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';



const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[] | null>(null);
  const [filteredTestimonials, setFilteredTestimonials] = useState<TestimonialData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');




  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state sebelum fetch
      const response = await axiosInstance.get<ApiResponse>('/testimonials');
      setTestimonials(response.data.data);
      setFilteredTestimonials(response.data.data);
    } catch (err: any) {
      setError('Gagal memuat testimoni.');
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials) {
      const filtered = testimonials.filter(testimonial =>
        testimonial.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestimonials(filtered);
    }
  }, [searchTerm, testimonials]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async (testimonialId: string, userName: string) => {

    const previousTestimonials = testimonials;
    setTestimonials((prev) => prev?.filter((t) => t.testimonialId !== testimonialId) || null);
    setFilteredTestimonials((prev) => prev?.filter((t) => t.testimonialId !== testimonialId) || null);

    setDeletingId(testimonialId);

    try {
      await axiosInstance.delete(`/testimonials/admin/${testimonialId}`);
    } catch (err: any) {
      setTestimonials(previousTestimonials);
      setFilteredTestimonials(previousTestimonials);
      toast('Gagal menghapus testimoni. Silakan coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  // Fungsi untuk menangani error gambar
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://via.placeholder.com/150/E5E7EB/6B7280?text=No+Image';
  };

  // --- Tampilan Loading ---
  if (loading) {
    return (
      <section className="bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data testimoni...</p>
        </div>
      </section>
    );
  }

  // --- Tampilan Error ---
  if (error) {
    return (
      <section className="bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 min-h-screen flex justify-center items-center">
        <div className="text-center text-red-600 bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <FaExclamationTriangle className="text-3xl" />
          </div>
          <p className="text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            <FaRedo className="mr-2" /> Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  // --- Tampilan Kosong ---
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="bg-linear-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 min-h-screen flex justify-center items-center">
        <div className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-full">
            <FaCommentDots className="text-4xl" />
          </div>
          <p className="text-xl font-medium mb-2">Belum ada testimoni.</p>
          <p className="text-sm">Jadilah yang pertama memberikan ulasan!</p>
        </div>
      </section>
    );
  }

  // --- Tampilan Utama ---
  return (
    <>


      <section className=" min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-linear-to-r mb-4 from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <IoFastFoodOutline className="mr-3" /> Kelola Testimoni Pelanggan
                </h2>
                <p className="text-orange-100">Kelola koleksi gambar untuk website Anda</p>
              </div>

            </div>
          </div>


          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Cari berdasarkan nama, produk, atau komentar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  aria-label="List view"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTestimonials?.map((testimonial) => (
                <div
                  key={testimonial.testimonialId}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={testimonial.imageUrl || testimonial.menuItem.image}
                      alt={testimonial.menuItem.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={12}
                            className={`${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500 ring-offset-2"
                        src={testimonial.user?.avatar || "https://via.placeholder.com/150/E5E7EB/6B7280?text=User"}
                        alt={`${testimonial.user.firstName} ${testimonial.user.lastName}`}
                        onError={handleImageError}
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium capitalize line-clamp-1 text-gray-900">
                          {testimonial.user.firstName} {testimonial.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(testimonial.createdAt)}</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2">{testimonial.menuItem.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">"{testimonial.comment}"</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Rp {parseFloat(testimonial.menuItem.price).toLocaleString('id-ID')}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExpandedId(testimonial.testimonialId)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          aria-label="View details"
                        >
                          <FaInfoCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.testimonialId, `${testimonial.user.firstName} ${testimonial.user.lastName}`)}
                          disabled={deletingId === testimonial.testimonialId}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Hapus testimoni dari ${testimonial.user.firstName} ${testimonial.user.lastName}`}
                        >
                          {deletingId === testimonial.testimonialId ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FaTrashAlt size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTestimonials?.map((testimonial) => (
                <div
                  key={testimonial.testimonialId}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">

                    <div className="p-4 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className='flex gap-4 '>

                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500 ring-offset-2"
                              src={testimonial.user?.avatar || "https://via.placeholder.com/150/E5E7EB/6B7280?text=User"}
                              alt={`${testimonial.user.firstName} ${testimonial.user.lastName}`}
                              onError={handleImageError}
                            />
                            <div className="ml-4">
                              <p className="text-lg capitalize font-semibold text-gray-900">
                                {testimonial.user.firstName} {testimonial.user.lastName}
                              </p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    size={14}
                                    className={`${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">({testimonial.rating}/5)</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{formatDate(testimonial.createdAt)}</p>
                            </div>
                          </div>
                          <div>

                            {/* Bagian Tengah: Komentar/Testimoni */}
                            <div className=' bg-gray-50 rounded-r-lg border-indigo-500 flex flex-col justify-center text-left h-full border-l-4'>
                                <p className='text-gray-700 font-bold pl-4'>Ulasan :</p>
                              <blockquote className="text-gray-700 w-full h-full italic line-clamp-2  px-6 py-2   text-base leading-relaxed">
                                "{testimonial.comment}"
                              </blockquote>
                            </div>
                          </div>
                          <div>


                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0 space-x-2">
                          <button
                            onClick={() => setExpandedId(testimonial.testimonialId)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                          >
                            <FaInfoCircle className="mr-1" /> Detail
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial.testimonialId, `${testimonial.user.firstName} ${testimonial.user.lastName}`)}
                            disabled={deletingId === testimonial.testimonialId}
                            className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Hapus testimoni dari ${testimonial.user.firstName} ${testimonial.user.lastName}`}
                          >
                            {deletingId === testimonial.testimonialId ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FaTrashAlt size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {expandedId && testimonials && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full scrollbar-hide max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold text-gray-900">Detail Testimoni</h3>
              <button
                onClick={() => setExpandedId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {testimonials.filter(t => t.testimonialId === expandedId).map(testimonial => (
              <div key={testimonial.testimonialId} className="space-y-4">
                {/* User Info */}
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.user?.avatar || "https://via.placeholder.com/150/E5E7EB/6B7280?text=User"}
                    alt={`${testimonial.user.firstName} ${testimonial.user.lastName}`}
                    onError={handleImageError}
                  />
                  <div className="ml-3">
                    <p className="text-base font-medium capitalize text-gray-900">
                      {testimonial.user.firstName} {testimonial.user.lastName}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={`${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({testimonial.rating}/5)</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                    <FaShoppingCart className="mr-1" /> Informasi Produk
                  </h4>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <img
                      className="h-14 w-14 rounded-md object-cover"
                      src={testimonial.menuItem.image}
                      alt={testimonial.menuItem.name}
                      onError={handleImageError}
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.menuItem.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.menuItem.category}
                      </p>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">
                        Rp {parseFloat(testimonial.menuItem.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Image */}
                {testimonial.imageUrl && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Gambar Testimoni</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <img
                        className="w-full h-60 object-contain rounded-md"
                        src={testimonial.imageUrl}
                        alt="Testimonial image"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}

                {/* Order Info */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Informasi Pesanan</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">ID Pesanan:</span>
                      <span className="text-xs font-medium text-gray-900">{testimonial.order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Status:</span>
                      <span className={`text-xs font-medium ${testimonial.order.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                        {testimonial.order.status === 'COMPLETED' ? (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Selesai
                          </span>
                        ) : testimonial.order.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Tanggal Pesanan:</span>
                      <span className="text-xs font-medium text-gray-900">
                        {formatDate(testimonial.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Comment */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Komentar</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 italic">
                      "{testimonial.comment}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialSection;