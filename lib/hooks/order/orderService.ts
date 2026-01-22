import axiosInstance from '@/lib/axiosInstance';
import { OrderResponse } from './type';

export const orderService = {
  // Get orders by userId (optional status)
  getOrdersByUserId: async (userId: string, status?: string) => {
    const queryParams = status ? `?status=${status}` : '';
    const res = await axiosInstance.get<OrderResponse>(
      `/orders/user/${userId}${queryParams}`
    );
    return res.data;
  },

  // Get order by orderId
  getOrderById: async (orderId: string) => {
    const res = await axiosInstance.get<OrderResponse>(
      `/orders/${orderId}`
    );
    return res.data;
  },

  // Get order item by orderId & itemId
  getOrderItemById: async (orderId: string, itemId: string) => {
    const res = await axiosInstance.get(
      `/orders/${orderId}/items/${itemId}`
    );
    return res.data;
  },
};
