'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';

// =====================
// TYPE & INTERFACE
// =====================

export type PaymentType = 'BANK' | 'EWALLET' | 'QRIS';
export type BankType = 'BCA' | 'MANDIRI' | 'BRI' | 'BNI' | 'OTHER';
export type EWalletType = 'OVO' | 'GOPAY' | 'DANA' | 'SHOPEEPAY' | 'OTHER';

export interface PaymentMethod {
  paymentMethodId: string;
  type: PaymentType;
  bankName?: BankType;
  ewalletName?: EWalletType;
  accountNumber?: string;
  description?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

// =====================
// HOOK
// =====================

export const usePaymentMethods = (profileId: string) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAll, setErrorAll] = useState<string | null>(null);

  // ====== GET BY PROFILE (existing) ======
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(
        `/payment-method/profile/${profileId}`
      );
      setPaymentMethods(res.data.data || []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal mengambil data payment method';

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ====== GET ALL (BARU) ======
  const getAllPaymentMethods = async () => {
    try {
      setLoadingAll(true);
      setErrorAll(null);

      const res = await axiosInstance.get('/payment-method');
      setAllPaymentMethods(res.data.data || []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal mengambil semua payment method';

      setErrorAll(message);
      toast.error(message);
    } finally {
      setLoadingAll(false);
    }
  };

  // ====== CREATE ======
  const createPaymentMethod = async (formData: FormData) => {
    try {
      await axiosInstance.post('/payment-method', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Payment method berhasil dibuat');

      // refresh kedua list
      await fetchPaymentMethods();
      await getAllPaymentMethods();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal membuat payment method';

      toast.error(message);
      throw err;
    }
  };

  // ====== UPDATE ======
  const updatePaymentMethod = async (id: string, formData: FormData) => {
    try {
      await axiosInstance.put(`/payment-method/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Payment method berhasil diperbarui');

      await fetchPaymentMethods();
      await getAllPaymentMethods();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal memperbarui payment method';

      toast.error(message);
      throw err;
    }
  };

  // ====== DELETE ======
  const deletePaymentMethod = async (id: string) => {
    try {
      await axiosInstance.delete(`/payment-method/${id}`);
      toast.success('Payment method berhasil dihapus');

      await fetchPaymentMethods();
      await getAllPaymentMethods();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Gagal menghapus payment method';

      toast.error(message);
      throw err;
    }
  };

  // auto fetch by profile saat mount / profileId berubah
  useEffect(() => {
    if (profileId) {
      fetchPaymentMethods();
      getAllPaymentMethods();
    }
  }, [profileId]);

  return {
    // data by profile
    paymentMethods,
    loading,
    error,

    // data all
    allPaymentMethods,
    loadingAll,
    errorAll,

    // actions
    fetchPaymentMethods,
    getAllPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  };
};
