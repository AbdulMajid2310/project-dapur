"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaCreditCard } from "react-icons/fa";
import CardPayment from "./CardPayment";

export default function OrderSection() {
  const [paymentInfo, setPaymentInfo] = useState({
    method: "",
    proofImage: null as File | null,
    proofPreview: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentInfo({
        method: "",
        proofImage: file,
        proofPreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Pembayaran Pesanan</h3>
          <motion.button
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <form className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Card Payment */}
          <CardPayment />

          {/* Upload Bukti Pembayaran */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Upload Bukti Pembayaran</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {paymentInfo.proofPreview ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-64 h-64">
                    <img
                      src={paymentInfo.proofPreview}
                      alt="Bukti Pembayaran"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={() =>
                      setPaymentInfo({ method: "", proofImage: null, proofPreview: "" })
                    }
                    className="text-red-500 hover:text-red-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hapus Gambar
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <FaCreditCard className="w-16 h-16 mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Upload bukti pembayaran Anda</p>
                    <p className="text-sm text-gray-500">Format: JPG, PNG (Maks. 5MB)</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pilih File
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProofUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="lg:p-6 p-4 border-t border-slate-200">
        <div className="flex space-x-3">
          <motion.button
            type="button"
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Kembali
          </motion.button>
          <motion.button
            type="button"
            disabled={!paymentInfo.proofImage}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              paymentInfo.proofImage
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            whileHover={paymentInfo.proofImage ? { scale: 1.02 } : {}}
            whileTap={paymentInfo.proofImage ? { scale: 0.98 } : {}}
          >
            Konfirmasi Pembayaran
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
