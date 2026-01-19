// hooks/useData.ts
import { useState, useEffect, useMemo } from "react";
import {
  MenuItem,
  Customer,
  Order,
  Notification,
  GalleryItem,
  Testimonial,
  FAQ,
  FilterOptions,
  PaginationState,
} from "../lib/types";
import {
  initialMenuItems,
  initialCustomers,
  initialOrders,
  initialNotifications,
  initialGalleryItems,
  initialTestimonials,
  initialFAQs,
} from "../lib/data";

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: "all",
    type: "all",
    dateRange: { start: "", end: "" },
  });

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = filters.searchTerm === "" || 
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [menuItems, filters.searchTerm]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Math.max(...menuItems.map(m => m.id)) + 1,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return {
    menuItems,
    filteredMenuItems,
    filters,
    setFilters,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: "all",
    type: "all",
    dateRange: { start: "", end: "" },
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = filters.searchTerm === "" || 
        customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        customer.phone.includes(filters.searchTerm);
      
      return matchesSearch;
    });
  }, [customers, filters.searchTerm]);

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.max(...customers.map(c => c.id)) + 1,
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  return {
    customers,
    filteredCustomers,
    filters,
    setFilters,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: "all",
    type: "all",
    dateRange: { start: "", end: "" },
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = filters.searchTerm === "" || 
        order.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.payment.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [orders, filters.searchTerm]);

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  return {
    orders,
    filteredOrders,
    filters,
    setFilters,
    updateOrderStatus,
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
  };
}