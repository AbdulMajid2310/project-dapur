'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
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

  // ============ RENDER ============

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <button
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Tambah
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-2">Memuat data...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((pm) => (
          <div
            key={pm.paymentMethodId}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{pm.type}</p>

              {(pm.type === 'BANK' || pm.type === 'EWALLET') && (
                <p>
                  {formatPaymentName(pm)} - {pm.accountNumber || '-'}
                </p>
              )}

              {pm.type === 'QRIS' && pm.qrCode && (
                <img
                  src={pm.qrCode}
                  alt="QRIS"
                  className="w-20 h-20 mt-2"
                />
              )}

              {pm.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {pm.description}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(pm)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDelete(pm.paymentMethodId)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============ MODAL ============ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {editing
                    ? 'Edit Payment Method'
                    : 'Tambah Payment Method'}
                </h3>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditing(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 p-6 space-y-4"
              >
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Tipe Pembayaran
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="BANK">Bank</option>
                    <option value="EWALLET">E-Wallet</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>

                {form.type === 'BANK' && (
                  <>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">
                        Bank Name
                      </label>
                      <select
                        name="bankName"
                        value={form.bankName || ''}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                      <label className="block mb-1 font-medium text-gray-700">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={form.accountNumber || ''}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        required
                      />
                    </div>
                  </>
                )}

                {form.type === 'EWALLET' && (
                  <>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">
                        E-Wallet Name
                      </label>
                      <select
                        name="ewalletName"
                        value={form.ewalletName || ''}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                      <label className="block mb-1 font-medium text-gray-700">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={form.accountNumber || ''}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        required
                      />
                    </div>
                  </>
                )}

                {form.type === 'QRIS' && (
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Upload QRIS
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {editing?.qrCode && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          QRIS saat ini:
                        </p>
                        <img
                          src={editing.qrCode}
                          alt="QRIS"
                          className="w-20 h-20"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {editing ? 'Update' : 'Tambah'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
