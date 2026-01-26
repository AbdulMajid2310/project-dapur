import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUtensils, FaMotorcycle, FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
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
  const userId = user?.userId;
  const [isOpen, setIsOpen] = useState(true); // Asumsikan modal selalu terbuka saat komponen dipanggil
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
    if (!userId) return;
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
    if (isOpen && userId) {
      fetchAddresses();
    }
  }, [isOpen, userId]);

  // === FILTER ALAMAT BERDASARKAN PILIHAN ===
  const filteredAddresses = userAddresses.filter((addr) => {
    if (orderInfo.deliveryOption === "dine-in") {
      return addr.delivery === "ON_PLACE";
    }
    return addr.delivery === "DELIVERY";
  });

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
      // Jika alamat yang dihapus adalah yang sedang dipilih, reset pilihan
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        onSelectAddress(null);
      }
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
      tableNumber: addr.delivery === "ON_PLACE" ? addr.description || "" : "",
      address: addr.delivery === "DELIVERY" ? addr.description || "" : "",
      note: addr.notes || "",
    });
  };

  // === PILIH ALAMAT ===
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    onSelectAddress(addressId);
  };

  // === HANDLE CHECKBOX CHANGE ===
  const handleCheckboxChange = (addressId: string) => {
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
      onSelectAddress(null);
    } else {
      handleSelectAddress(addressId);
    }
  };
  
  // === HANDLE FILTER CLICK ===
  const handleFilterClick = (option: "dine-in" | "delivery") => {
    setOrderInfo(p => ({ ...p, deliveryOption: option }));
    // Reset pilihan saat filter berubah
    setSelectedAddressId(null);
    onSelectAddress(null);
  }


  if (!isOpen) return null;

  return (
    <motion.div
      className="w-full max-h-[80vh] overflow-hidden scrollbar-hide flex flex-col bg-white rounded-xl shadow-xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* HEADER */}
      <div className="p-4  border-b border-gray-200 flex justify-between items-center bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-t-xl">
        <h3 className="text-xl font-bold">Informasi Pemesanan</h3>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setEditingAddressId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition-colors duration-200 font-medium"
          >
            <FaPlus /> Tambah Baru
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-6">
        {/* PILIH DELIVERY SEBAGAI FILTER */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleFilterClick("dine-in")}
            className={`py-4 px-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
              orderInfo.deliveryOption === "dine-in"
                ? "border-orange-500 bg-orange-50 text-orange-500 shadow-md"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            <FaUtensils className="text-2xl mb-2" />
            <span className="font-medium">Makan di Tempat</span>
          </button>

          <button
            onClick={() => handleFilterClick("delivery")}
            className={`py-4 px-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
              orderInfo.deliveryOption === "delivery"
                ? "border-orange-500 bg-orange-50 text-orange-500 shadow-md"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            <FaMotorcycle className="text-2xl mb-2" />
            <span className="font-medium">Diantar</span>
          </button>
        </div>

        {/* FORM ADD / EDIT */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSaveAddress}
              className="border-2 border-gray-200 p-6 rounded-xl bg-gray-50 space-y-4 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h4 className="font-semibold text-lg text-gray-800">
                {isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}
              </h4>
              
              {orderInfo.deliveryOption === "dine-in" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Meja
                  </label>
                  <input
                    type="text"
                    name="tableNumber"
                    value={orderInfo.tableNumber}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Meja 5"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={orderInfo.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="note"
                  value={orderInfo.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Catatan tambahan"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium shadow-sm"
                >
                  {isEditing ? "Update" : "Simpan"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* DAFTAR ALAMAT YANG SUDAH DIFILTER */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-gray-800">
            {orderInfo.deliveryOption === "dine-in" ? "Daftar Meja" : "Daftar Alamat"} Tersimpan
          </h4>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Belum ada {orderInfo.deliveryOption === "dine-in" ? "meja" : "alamat"} tersimpan
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Tambah {orderInfo.deliveryOption === "dine-in" ? "meja" : "alamat"} baru untuk mempermudah pemesanan
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAddresses.map((addr) => (
                <div
                  key={addr.addressId}
                  className={`border-2 p-4 py-2 rounded-lg bg-white flex justify-between items-center transition-all duration-200 ${
                    selectedAddressId === addr.addressId
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* CUSTOM ROUNDED CHECKBOX */}
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange(addr.addressId)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        selectedAddressId === addr.addressId
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-white border-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {selectedAddressId === addr.addressId && <FaCheck className="text-white text-xs" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {addr.description || "-"}
                      </p>
                      {addr.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          Catatan: {addr.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addr);
                      }}
                      className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.addressId);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Hapus"
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