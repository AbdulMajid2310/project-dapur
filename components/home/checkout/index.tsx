"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import CardPayment from "./CardPayment";
import CartModal from "./cartModal";
import OrderModalAddress from "./cartModalAddress";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/hooks/useAuth";

export default function CheckoutCard() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
const {  user } = useAuth();
  // ======= STATE UTAMA =======
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);

  const [deliveryOption, setDeliveryOption] = useState<"dine-in" | "delivery">("delivery");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // ======= HANDLERS =======
  const handleSelectedCart = (ids: string[]) => {
    setSelectedCartIds(ids);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // VALIDASI TIPE FILE
    if (!file.type.startsWith("image/")) {
      alert("Harap upload file gambar (JPG/PNG)");
      return;
    }

    // VALIDASI UKURAN (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    setPaymentProof(file);
    setPaymentProofPreview(URL.createObjectURL(file));
    console.log("📎 Bukti pembayaran diunggah:", file.name);
  };

  // ======= RESET STATE SETELAH SUKSES =======
  const resetCheckoutState = () => {
    setSelectedCartIds([]);
    setSelectedAddress(null);
    setSelectedPaymentMethodId(null);
    setPaymentProof(null);
    setPaymentProofPreview("");
    setCurrentStep(1);
  };

  // ======= CREATE ORDER =======
  const createOrder = async () => {
    const orderPayload = {
      cartItemIds: selectedCartIds,
      addressId: deliveryOption === "delivery" ? selectedAddress : null,
      paymentMethodId: selectedPaymentMethodId,
      userId: user?.userId
    };

    console.log("📦 PAYLOAD ORDER:", orderPayload);

    try {
      setIsLoading(true);

      // 1️⃣ BUAT ORDER DULU
      const orderRes = await axiosInstance.post("/orders", orderPayload);
      const orderId = orderRes.data.data.orderId;


      // 2️⃣ UPLOAD PAYMENT PROOF (JIKA ADA)
      if (paymentProof) {
        const formData = new FormData();
        formData.append("file", paymentProof); // WAJIB "file"

        await axiosInstance.post(
          `/orders/${orderId}/payment-proof`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast("Pesanan berhasil dibuat!");
      resetCheckoutState();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("❌ Error create order:", err);

      if (err.response) {
        console.error("Server response:", err.response.data);
      }

      alert(err.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  const isSubmitDisabled =
    isLoading ||
    selectedCartIds.length === 0 ||
    (deliveryOption === "delivery" && !selectedAddress) ||
    !selectedPaymentMethodId;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40">
        <motion.div className="bg-white w-full md:w-2xl h-[calc(100vh-4rem)] scrollbar-hide overflow-y-auto flex flex-col rounded-2xl shadow-xl">

          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-bold">Checkout</h3>
            <button onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* BODY */}
          <div className="p-4 flex-1 space-y-6">

            {/* STEP 1 - CART */}
            {currentStep === 1 && (
              <CartModal onSelectItems={handleSelectedCart} />
            )}

            {/* STEP 2 - ADDRESS */}
            {currentStep === 2 && (
              <OrderModalAddress onSelectAddress={setSelectedAddress} />
            )}

            {/* STEP 3 - PAYMENT */}
            {currentStep === 3 && (
              <div>
                <CardPayment onSelectPayment={setSelectedPaymentMethodId} />

                <div className="mt-4 border-dashed border-2 border-gray-300 p-4 text-center rounded-lg">
                  {paymentProofPreview ? (
                    <img
                      src={paymentProofPreview}
                      className="mx-auto w-40 h-40 object-contain"
                      alt="Bukti pembayaran"
                    />
                  ) : (
                    <p>Pilih file bukti pembayaran</p>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
                  >
                    Pilih File
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleProofUpload}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t flex justify-between items-center">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Kembali
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-orange-500 text-white px-4 py-2 rounded ml-auto"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={createOrder}
                className={`bg-orange-500 text-white px-4 py-2 rounded ml-auto ${
                  isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitDisabled}
              >
                {isLoading ? "Memproses..." : "Buat Pesanan"}
              </button>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
