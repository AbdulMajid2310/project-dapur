"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaTimes, 
  FaCreditCard, 
  FaUniversity,
  FaQrcode,
  FaWallet,
  FaInfoCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { usePaymentMethods } from '@/lib/hooks/payment-method/usePaymentMentod';

// ============ TYPES ============

type PaymentType = 'BANK' | 'EWALLET' | 'QRIS';
type BankType = 'BCA' | 'MANDIRI' | 'BRI' | 'BNI' | 'OTHER';
type EWalletType = 'OVO' | 'GOPAY' | 'DANA' | 'SHOPEEPAY' | 'OTHER';

interface PaymentMethodForm {
  type: PaymentType;
  bankName?: BankType;
  ewalletName?: EWalletType;
  accountNumber?: string;
  description?: string;
  bufferQR: File | null;
}

interface Props {
  profileId: string;
}

// ============ COMPONENT ============

export default function PaymentMethodManager({ profileId }: Props) {
  const {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  } = usePaymentMethods(profileId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState<PaymentMethodForm>({
    type: 'BANK',
    bankName: undefined,
    ewalletName: undefined,
    accountNumber: '',
    description: '',
    bufferQR: null,
  });

  // ============ HANDLERS ============

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({
        ...prev,
        bufferQR: e.target.files![0],
      }));
    }
  };

  // Reset form saat tipe berubah
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      bankName: undefined,
      ewalletName: undefined,
      accountNumber: '',
      bufferQR: null,
    }));
  }, [form.type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.type === 'BANK' && !form.bankName) {
      toast.error('Nama bank harus diisi');
      return;
    }

    if (form.type === 'EWALLET' && !form.ewalletName) {
      toast.error('Nama e-wallet harus diisi');
      return;
    }

    if (form.type !== 'QRIS' && !form.accountNumber) {
      toast.error('Nomor akun harus diisi');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('profileId', profileId);

      if (form.type === 'BANK' && form.bankName) {
        formData.append('bankName', form.bankName);
      }

      if (form.type === 'EWALLET' && form.ewalletName) {
        formData.append('ewalletName', form.ewalletName);
      }

      if (form.type !== 'QRIS' && form.accountNumber) {
        formData.append('accountNumber', form.accountNumber);
      }

      if (form.description) {
        formData.append('description', form.description);
      }

      if (form.bufferQR) {
        formData.append('bufferQR', form.bufferQR);
      }

      if (editing) {
        await updatePaymentMethod(editing.paymentMethodId, formData);
      } else {
        await createPaymentMethod(formData);
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm({
        type: 'BANK',
        bankName: undefined,
        ewalletName: undefined,
        accountNumber: '',
        description: '',
        bufferQR: null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah yakin ingin menghapus payment method ini?')) return;
    try {
      await deletePaymentMethod(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (pm: any) => {
    setEditing(pm);
    setForm({
      type: pm.type,
      bankName: pm.bankName,
      ewalletName: pm.ewalletName,
      accountNumber: pm.accountNumber || '',
      description: pm.description || '',
      bufferQR: null,
    });
    setIsModalOpen(true);
  };

  const formatPaymentName = (pm: any) => {
    if (pm.type === 'BANK') return pm.bankName || '-';
    if (pm.type === 'EWALLET') return pm.ewalletName || '-';
    return '';
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'BANK': return <FaUniversity className="text-blue-600" />;
      case 'EWALLET': return <FaWallet className="text-green-600" />;
      case 'QRIS': return <FaQrcode className="text-purple-600" />;
      default: return <FaCreditCard className="text-gray-600" />;
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'BANK': return 'bg-blue-50 border-blue-200';
      case 'EWALLET': return 'bg-green-50 border-green-200';
      case 'QRIS': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // ============ RENDER ============

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCreditCard className="mr-3 text-orange-500" />
            Metode Pembayaran
          </h2>
          <p className="text-gray-600 mt-1">Kelola metode pembayaran untuk toko Anda</p>
        </div>
        <button
          className="flex items-center bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Tambah Metode
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8 bg-white rounded-xl shadow-sm">
          <FaSpinner className="animate-spin text-3xl text-orange-500 mr-3" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      )}

      {!loading && paymentMethods.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-6xl text-gray-300 mb-4">
            <FaCreditCard />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum ada metode pembayaran</h3>
          <p className="text-gray-500 mb-6">Tambahkan metode pembayaran untuk memudahkan pelanggan</p>
          <button
            className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" /> Tambah Metode Pembayaran
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {paymentMethods.map((pm) => (
            <motion.div
              key={pm.paymentMethodId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${getPaymentColor(pm.type)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">
                    {getPaymentIcon(pm.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{pm.type}</h3>
                    <p className="text-sm text-gray-600">{formatPaymentName(pm)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pm)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(pm.paymentMethodId)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    title="Hapus"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {(pm.type === 'BANK' || pm.type === 'EWALLET') && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Nomor Akun</p>
                  <p className="font-medium text-gray-800">{pm.accountNumber || '-'}</p>
                </div>
              )}

              {pm.type === 'QRIS' && pm.qrCode && (
                <div className="mb-3 flex justify-center">
                  <img
                    src={pm.qrCode}
                    alt="QRIS"
                    className="w-32 h-32 rounded-lg shadow-sm"
                  />
                </div>
              )}

              {pm.description && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Deskripsi</p>
                  <p className="text-gray-700">{pm.description}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ============ MODAL ============ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] h-full overflow-y-auto scrollbar-hide shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">
                    {editing
                      ? 'Edit Metode Pembayaran'
                      : 'Tambah Metode Pembayaran'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditing(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >
                <div>
                  <label className=" mb-2 font-medium text-gray-700 flex items-center">
                    <FaCreditCard className="mr-2 text-orange-500" />
                    Tipe Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'BANK', label: 'Bank', icon: <FaUniversity className="text-blue-600" /> },
                      { value: 'EWALLET', label: 'E-Wallet', icon: <FaWallet className="text-green-600" /> },
                      { value: 'QRIS', label: 'QRIS', icon: <FaQrcode className="text-purple-600" /> }
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all ${
                          form.type === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setForm(prev => ({ ...prev, type: option.value as PaymentType }))}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={option.value}
                          checked={form.type === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <span className="text-sm font-medium">{option.label}</span>
                          {form.type === option.value && (
                            <div className="absolute top-1 right-1">
                              <FaCheck className="text-orange-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {form.type === 'BANK' && (
                  <>
                    <div>
                      <label className=" mb-2 font-medium text-gray-700 flex items-center">
                        <FaUniversity className="mr-2 text-orange-500" />
                        Nama Bank
                      </label>
                      <select
                        name="bankName"
                        value={form.bankName || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Bank</option>
                        <option value="BCA">BCA</option>
                        <option value="MANDIRI">Mandiri</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="OTHER">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Nomor Rekening</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={form.accountNumber || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Masukkan nomor rekening"
                        required
                      />
                    </div>
                  </>
                )}

                {form.type === 'EWALLET' && (
                  <>
                    <div>
                      <label className="mb-2 font-medium text-gray-700 flex items-center">
                        <FaWallet className="mr-2 text-orange-500" />
                        Nama E-Wallet
                      </label>
                      <select
                        name="ewalletName"
                        value={form.ewalletName || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih E-Wallet</option>
                        <option value="OVO">OVO</option>
                        <option value="GOPAY">GoPay</option>
                        <option value="DANA">DANA</option>
                        <option value="SHOPEEPAY">ShopeePay</option>
                        <option value="OTHER">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Nomor Akun</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={form.accountNumber || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Masukkan nomor akun"
                        required
                      />
                    </div>
                  </>
                )}

                {form.type === 'QRIS' && (
                  <div>
                    <label className=" mb-2 font-medium text-gray-700 flex items-center">
                      <FaQrcode className="mr-2 text-orange-500" />
                      Upload QRIS
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="qr-upload"
                      />
                      <label htmlFor="qr-upload" className="cursor-pointer">
                        {form.bufferQR ? (
                          <div className="space-y-2">
                            <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600 text-4xl">
                                <FaCheck />
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Gambar QRIS dipilih</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <FaQrcode className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-sm text-gray-600">Klik untuk upload QRIS</p>
                            <p className="text-xs text-gray-400">PNG, JPG, WEBP (maks. 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {editing?.qrCode && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">QRIS saat ini:</p>
                        <div className="flex justify-center">
                          <img
                            src={editing.qrCode}
                            alt="QRIS"
                            className="w-32 h-32 rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className=" mb-2 font-medium text-gray-700 flex items-center">
                    <FaInfoCircle className="mr-2 text-orange-500" />
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Tambahkan deskripsi opsional"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditing(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    {editing ? 'Update' : 'Tambah'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}