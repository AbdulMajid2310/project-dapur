// src/hooks/useCustomerOrders.ts
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '../useAuth';
import { Order, OrderResponse } from './type';
import { toast } from 'react-toastify';

interface UseCustomerOrdersOptions {
  status?: string;
}

export const useCustomerOrders = (options?: UseCustomerOrdersOptions) => {
  const { user } = useAuth();
  const userId = user?.userId;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  /**
   * Fetch orders
   */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const queryParams = options?.status
          ? `?status=${options.status}`
          : '';

        const res = await axiosInstance.get<OrderResponse>(
          `/orders/user/${userId}${queryParams}`,
        );

        if (!cancelled) {
          setOrders(res.data.data || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setOrders([]);
          toast.error(
            err.response?.data?.message || 'Failed to fetch orders',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [userId, options?.status]);

  /**
   * Delete order by user
   */
  const deleteOrder = useCallback(
    async (orderId: string) => {
      if (!userId) {
        toast.error('User tidak terautentikasi');
        return;
      }

      setDeleting(true);

      try {
        await axiosInstance.delete(
          `/orders/${orderId}/user/${userId}`,
        );

        // Update state tanpa refetch
        setOrders((prev) =>
          prev.filter((order) => order.orderId !== orderId),
        );

        toast.success('Order berhasil dihapus');
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || 'Gagal menghapus order',
        );
      } finally {
        setDeleting(false);
      }
    },
    [userId],
  );

  return {
    orders,
    setOrders,
    loading,
    deleting,
    deleteOrder, // 🔥 expose delete function
  };
};
