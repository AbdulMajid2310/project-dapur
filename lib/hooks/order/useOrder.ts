// src/hooks/useCustomerOrders.ts
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '../useAuth';
import { Order, OrderResponse } from './type';
import { toast } from 'react-toastify';

interface UseCustomerOrdersOptions {
  status?: string; // Opsional: filter berdasarkan status
}

export const useCustomerOrders = (options?: UseCustomerOrdersOptions) => {
  const { user } = useAuth();
  const userId = user?.userId;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const queryParams = options?.status ? `?status=${options.status}` : '';
        const res = await axiosInstance.get<OrderResponse>(`/orders/user/${userId}${queryParams}`);

        if (!cancelled) {
          setOrders(res.data.data || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setOrders([]);
          toast.error(err.response?.data?.message || 'Failed to fetch orders');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [userId, options?.status]); // Re-fetch jika userId atau status berubah

  return { orders, loading };
};
