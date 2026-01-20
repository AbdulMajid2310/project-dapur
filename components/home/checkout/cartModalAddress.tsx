"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUtensils, FaMotorcycle, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/hooks/useAuth";

type Address = {
  addressId: string;
  delivery: "ON_PLACE" | "DELIVERY";
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type OrderInfo = {
  deliveryOption: "dine-in" | "delivery";
  tableNumber: string;
  address: string;
  note: string;
};


type OrderModalProps = {
  onSelectAddress: (addressId: string | null) => void;
};



export default function OrderModalAddress({ onSelectAddress }: OrderModalProps) {

  const { user } = useAuth();
  const userId = user?.userId
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    deliveryOption: "dine-in",
    tableNumber: "",
    address: "",
    note: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // === FETCH ADDRESSES ===
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/addresses?userId=${userId}`);
      setUserAddresses(res.data || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchAddresses();
  }, [isOpen]);

  // === HANDLE INPUT ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  };

  // === RESET FORM ===
  const resetForm = () => {
    setOrderInfo({
      deliveryOption: "dine-in",
      tableNumber: "",
      address: "",
      note: "",
    });
    setIsEditing(false);
    setEditingAddressId(null);
    setShowForm(false);
  };

  // === ADD / UPDATE ADDRESS ===
  const handleSaveAddress = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const payload = {
      delivery:
        orderInfo.deliveryOption === "dine-in" ? "ON_PLACE" : "DELIVERY",
      description:
        orderInfo.deliveryOption === "dine-in"
          ? orderInfo.tableNumber
          : orderInfo.address,
      notes: orderInfo.note,
      userId,
    };

    try {
      if (isEditing && editingAddressId) {
        await axiosInstance.put(`/addresses/${editingAddressId}`, payload);
      } else {
        await axiosInstance.post("/addresses", payload);
      }

      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  // === DELETE ADDRESS ===
  const handleDeleteAddress = async (addressId: string) => {

    try {
      await axiosInstance.delete(`/addresses/${addressId}`);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  // === EDIT ADDRESS ===
  const handleEditAddress = (addr: Address) => {
    setShowForm(true);
    setIsEditing(true);
    setEditingAddressId(addr.addressId);

    setOrderInfo({
      deliveryOption: addr.delivery === "ON_PLACE" ? "dine-in" : "delivery",
      tableNumber:
        addr.delivery === "ON_PLACE" ? addr.description || "" : "",
      address:
        addr.delivery === "DELIVERY" ? addr.description || "" : "",
      note: addr.notes || "",
    });
  };

  // === PILIH ADDRESS ===
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    onSelectAddress(addressId); // Kirim ke parent via props

  };


  if (!isOpen) return null;

  return (
    <motion.div
      className="w-full max-h-[90vh] overflow-hidden flex flex-col "
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* HEADER */}
      <div className="p-2  flex justify-between items-center">
        <h3 className="text-xl font-bold">Informasi Pemesanan</h3>
        {/* TOMBOL TAMBAH DATA */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setEditingAddressId(null);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
          >
            <FaPlus /> Tambah Baru
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* PILIH DELIVERY */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              setOrderInfo((p) => ({ ...p, deliveryOption: "dine-in" }))
            }
            className={`py-3 rounded-lg border flex items-center justify-center ${orderInfo.deliveryOption === "dine-in"
                ? "border-orange-500 bg-orange-50 text-orange-500"
                : "border-gray-300"
              }`}
          >
            <FaUtensils className="mr-2" /> Makan di Tempat
          </button>

          <button
            onClick={() =>
              setOrderInfo((p) => ({ ...p, deliveryOption: "delivery" }))
            }
            className={`py-3 rounded-lg border flex items-center justify-center ${orderInfo.deliveryOption === "delivery"
                ? "border-orange-500 bg-orange-50 text-orange-500"
                : "border-gray-300"
              }`}
          >
            <FaMotorcycle className="mr-2" /> Diantar
          </button>
        </div>



        {/* FORM ADD / EDIT (TERSEMBUNYI DULU) */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSaveAddress}
              className="border p-4 rounded-xl bg-gray-50 space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {orderInfo.deliveryOption === "dine-in" ? (
                <input
                  type="text"
                  name="tableNumber"
                  value={orderInfo.tableNumber}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Meja 5"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              ) : (
                <textarea
                  name="address"
                  value={orderInfo.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              )}

              <textarea
                name="note"
                value={orderInfo.note}
                onChange={handleChange}
                rows={2}
                placeholder="Catatan (opsional)"
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  {isEditing ? "Update" : "Simpan"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* DAFTAR ALAMAT */}
        <div>
          <h4 className="font-semibold mb-2">Alamat / Meja Tersimpan</h4>

          {loading ? (
            <p>Loading...</p>
          ) : userAddresses.length === 0 ? (
            <p className="text-gray-500">Belum ada alamat tersimpan</p>
          ) : (
            <div className="space-y-2">
              {userAddresses.map((addr) => (
                <div
                  key={addr.addressId}
                  className={`border p-3 rounded-lg bg-white flex justify-between items-center cursor-pointer 
      ${selectedAddressId === addr.addressId ? "border-orange-500 bg-orange-50" : ""}`}
                  onClick={() => handleSelectAddress(addr.addressId)}
                >
                  <div>
                    <p className="font-medium">
                      {addr.delivery === "ON_PLACE"
                        ? `Meja: ${addr.description || "-"}`
                        : `Alamat: ${addr.description || "-"}`}
                    </p>
                    {addr.notes && (
                      <p className="text-sm text-gray-500">
                        Catatan: {addr.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="text-yellow-500"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteAddress(addr.addressId)
                      }
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </motion.div>
  );
}
