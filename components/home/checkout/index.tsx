"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import CardPayment from "./CardPayment";
import { useAuth } from "@/lib/hooks/useAuth";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Address {
  addressId: string;
  description: string;
  notes?: string;
}

interface PaymentMethod {
  paymentMethodId: string;
  name: string;
  type: "bank" | "ewallet" | "qris";
}

export default function CheckoutCard() {
 const {  user } = useAuth();
     const userId = user?.userId
console.log('data userId', userId)
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartItems, setSelectedCartItems] = useState<string[]>([]);
console.log(cart)
  const [deliveryOption, setDeliveryOption] = useState<"dine-in" | "delivery">("delivery");

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressIds, setSelectedAddressIds] = useState<string[]>([]); // multi checkbox
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newAddressNotes, setNewAddressNotes] = useState("");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [tableNumber, setTableNumber] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodIds, setSelectedPaymentMethodIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  // --- Fetch cart ---
  const getUserCart = async () => {
    try {
      const res = await axiosInstance.get(`/cart/user/${userId}`);
      const items: CartItem[] = res.data.data.items || [];
      setCart(items);
      setSelectedCartItems(items.map(i => i.id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch addresses ---
  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get(`/addresses?userId=${userId}`);
      const addresses: Address[] = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUserAddresses(addresses);
      setSelectedAddressIds(addresses.length ? [addresses[0].addressId] : []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Fetch payment methods ---
  const fetchPaymentMethods = async () => {
    try {
      const res = await axiosInstance.get(`/payment-method`);
      const methods: PaymentMethod[] = res.data.data || [];
      setPaymentMethods(methods);
      if (methods.length) setSelectedPaymentMethodIds([methods[0].paymentMethodId]);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Add / Update Address ---
  const handleSaveAddress = async () => {
    if (!newAddress) return alert("Alamat tidak boleh kosong");
    try {
      let res: any = null;
      if (editingAddressId) {
        // Update
        res = await axiosInstance.put(`/addresses/${editingAddressId}`, {
          description: newAddress,
          notes: newAddressNotes,
        });
        setUserAddresses(prev => prev.map(a => a.addressId === editingAddressId ? res.data.data : a));
        setSelectedAddressIds([res.data.data.addressId]);
        setEditingAddressId(null);
      } else {
        // Add new
        res = await axiosInstance.post("/addresses", {
          userId,
          delivery: "DELIVERY",
          description: newAddress,
          notes: newAddressNotes,
        });
        const addedAddress: Address = res.data.data;
        setUserAddresses(prev => [...prev, addedAddress]);
        setSelectedAddressIds([addedAddress.addressId]);
      }
      setNewAddress("");
      setNewAddressNotes("");
      setAddingAddress(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Delete Address ---
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Hapus alamat ini?")) return;
    try {
      await axiosInstance.delete(`/addresses/${addressId}`);
      setUserAddresses(prev => prev.filter(a => a.addressId !== addressId));
      setSelectedAddressIds(prev => prev.filter(id => id !== addressId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Quantity & delete ---
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await axiosInstance.put(`/cart/item/${itemId}`, { quantity });
    getUserCart();
  };

  const deleteItem = async (itemId: string) => {
    await axiosInstance.delete(`/cart/item/${itemId}`);
    getUserCart();
  };

  // --- Checkbox toggle ---
  const toggleCartItem = (id: string) => {
    setSelectedCartItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAddress = (id: string) => {
    setSelectedAddressIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const togglePaymentMethod = (id: string) => {
    setSelectedPaymentMethodIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // --- Upload bukti ---
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
      setPaymentProofPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // --- Calculate subtotal for selected items ---
  useEffect(() => {
    const subtotal = cart
      .filter(i => selectedCartItems.includes(i.id))
      .reduce((sum, i) => sum + i.subtotal, 0);
    setTotalPrice(subtotal);
  }, [selectedCartItems, cart]);

  // --- Create order ---
  const createOrder = async () => {
    if (selectedCartItems.length === 0) return alert("Pilih minimal 1 item");
    if (deliveryOption === "delivery" && selectedAddressIds.length === 0) return alert("Pilih alamat");
    if (deliveryOption === "dine-in" && !tableNumber) return alert("Masukkan nomor meja");
    if (selectedPaymentMethodIds.length === 0) return alert("Pilih metode pembayaran");

    try {
      // Buat order
      const orderPayload = {
        cartItemIds: selectedCartItems,
        addressId: selectedAddressIds[0], // hanya ambil 1 untuk delivery
        paymentMethodId: selectedPaymentMethodIds[0], // sementara ambil 1
      };

      const orderRes = await axiosInstance.post("/orders", orderPayload);
      const orderId = orderRes.data.data.orderId;

      // Upload bukti pembayaran
      if (paymentProof) {
        const formData = new FormData();
        formData.append("file", paymentProof);
        await axiosInstance.post(`/orders/${orderId}/payment-proof`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

    

      alert("Pesanan berhasil dibuat!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal membuat pesanan");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      getUserCart();
      fetchAddresses();
      fetchPaymentMethods();
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-start justify-end pt-16 bg-black/40">
        <motion.div className="bg-white w-full md:w-96 h-[calc(100vh-4rem)] overflow-y-auto flex flex-col rounded-l-2xl shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold">Checkout</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 space-y-6">
            {/* Step 1: Keranjang */}
            {currentStep === 1 && (
              <div>
                <h4 className="font-semibold mb-2">Keranjang Belanja</h4>
                {cart.length === 0 ? <p>Keranjang kosong</p> :
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={selectedCartItems.includes(item.id)} onChange={()=>toggleCartItem(item.id)} />
                          <img src={item.image} className="w-12 h-12 rounded"/>
                          <div>
                            <p>{item.name}</p>
                            <p>Rp{item.subtotal.toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          <button onClick={() => deleteItem(item.id)} className="ml-2 text-red-500">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                <p className="mt-2 font-medium">Subtotal: Rp{totalPrice.toLocaleString("id-ID")}</p>
              </div>
            )}

            {/* Step 2: Pengiriman */}
            {currentStep === 2 && (
              <div>
                <h4 className="font-semibold mb-2">Pengiriman</h4>
                <div className="flex space-x-2 mb-4">
                  <button onClick={()=>setDeliveryOption("dine-in")} className={`px-4 py-2 border rounded ${deliveryOption==="dine-in"?"border-orange-500 bg-orange-50":"border-gray-300"}`}>
                    Makan di Tempat
                  </button>
                  <button onClick={()=>setDeliveryOption("delivery")} className={`px-4 py-2 border rounded ${deliveryOption==="delivery"?"border-orange-500 bg-orange-50":"border-gray-300"}`}>
                    Diantar
                  </button>
                </div>

                {deliveryOption === "dine-in" ? (
                  <input type="text" placeholder="Nomor Meja" className="w-full border px-2 py-1 rounded" value={tableNumber} onChange={e=>setTableNumber(e.target.value)} />
                ) : (
                  <div>
                    {addingAddress || editingAddressId ? (
                      <div className="space-y-2 mb-2">
                        <input type="text" placeholder="Alamat Baru / Update" className="w-full border px-2 py-1 rounded" value={newAddress} onChange={e=>setNewAddress(e.target.value)} />
                        <input type="text" placeholder="Catatan (opsional)" className="w-full border px-2 py-1 rounded" value={newAddressNotes} onChange={e=>setNewAddressNotes(e.target.value)} />
                        <button onClick={handleSaveAddress} className="px-4 py-2 bg-orange-500 text-white rounded flex items-center gap-2">
                          {editingAddressId ? <FaEdit /> : <FaPlus />} {editingAddressId ? "Update Alamat" : "Simpan Alamat"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {userAddresses.map(addr => (
                          <div key={addr.addressId} className="flex items-center justify-between border p-2 rounded">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={selectedAddressIds.includes(addr.addressId)} onChange={()=>toggleAddress(addr.addressId)} />
                              <span>{addr.description} {addr.notes && `(${addr.notes})`}</span>
                            </label>
                            <div className="flex gap-1">
                              <button onClick={()=>{
                                setEditingAddressId(addr.addressId);
                                setNewAddress(addr.description);
                                setNewAddressNotes(addr.notes||"");
                                setAddingAddress(false);
                              }} className="text-yellow-500"><FaEdit /></button>
                              <button onClick={()=>handleDeleteAddress(addr.addressId)} className="text-red-500"><FaTrash /></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={()=>setAddingAddress(true)} className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded"><FaPlus /> Tambah Alamat</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pembayaran */}
            {currentStep === 3 && (
              <div>
                <h4 className="font-semibold mb-2">Metode Pembayaran</h4>
                <div className="space-y-2">
                  {paymentMethods.map(pm => (
                    <label key={pm.paymentMethodId} className="flex items-center gap-2 border p-2 rounded">
                      <input type="checkbox" checked={selectedPaymentMethodIds.includes(pm.paymentMethodId)} onChange={()=>togglePaymentMethod(pm.paymentMethodId)} />
                      <span>{pm.name} ({pm.type})</span>
                    </label>
                  ))}
                </div>
                <CardPayment />
                <div className="mt-4 border-dashed border-2 border-gray-300 p-4 text-center rounded-lg">
                  {paymentProofPreview ? <img src={paymentProofPreview} className="mx-auto w-40 h-40 object-contain" /> :
                    <p>Pilih file bukti pembayaran</p>}
                  <button onClick={()=>fileInputRef.current?.click()} className="mt-2 px-4 py-2 bg-orange-500 text-white rounded">Pilih File</button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleProofUpload} accept="image/*" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-between items-center">
            {currentStep > 1 && <button onClick={()=>setCurrentStep(currentStep-1)}>Kembali</button>}
            {currentStep < 3 ? <button onClick={()=>setCurrentStep(currentStep+1)} className="bg-orange-500 text-white px-4 py-2 rounded">Lanjut</button> :
              <button onClick={createOrder} className="bg-orange-500 text-white px-4 py-2 rounded" disabled={selectedCartItems.length===0 || (deliveryOption==="delivery"&&selectedAddressIds.length===0)}>Buat Pesanan</button>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
