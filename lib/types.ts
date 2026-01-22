// types/index.ts
export interface FinancialData {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFavorite: boolean;
  isAvailable: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  joinDate: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  time: string;
  items: OrderItem[];
  amount: number;
  payment: string;
  status: "Diproses" | "Selesai" | "Dibatalkan";
  deliveryOption: string;
  address: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "order" | "payment" | "stock" | "review";
}

export interface ProfileData {
  name: string;
  description: string;
  address: string;
  operatingHours: string;
  phone: string;
  email: string;
  minOrder: number;
  deliveryFee: number;
  deliveryTime: string;
  logo: string;
  coverImage: string;
  socialMedia: {
    facebook: string;
    instagram: string;
  };
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category: string;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  status: "published" | "draft";
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: "published" | "draft";
}

export interface NavigationItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string
}

export type PageTitle = 
  | "Dashboard"
  | "Laporan Keuangan"
  | "Kelola Menu"
  | "Kelola Pelanggan"
  | "Kelola Pesanan"
  | "Notifikasi"
  | "Kelola Galeri"
  | "Kelola Testimoni"
  | "Kelola FAQ"
  | "Pengaturan Profil";

export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  searchTerm: string;
  category: string;
  type: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface ModalState {
  isOpen: boolean;
  selectedItem: any;
}

export interface FormState {
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}