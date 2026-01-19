"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaCog,
  FaStore,
  FaUsers,
  FaUtensils,
  FaShoppingCart,
  FaFileInvoice,
  FaBell,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaTimes,
  FaCheck,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaChartPie,
  FaChartBar,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaHamburger,
  FaCoffee,
  FaIceCream,
  FaGlassCheers,
  FaUtensilSpoon,
  FaBreadSlice,
  FaDrumstickBite,
  FaCarrot,
  FaAppleAlt,
  FaLeaf,
  FaEgg,
  FaFish,
  FaSeedling,
  FaHome,
  FaImages,
  FaQuoteLeft,
  FaQuestionCircle,
} from "react-icons/fa";

// Type definitions
interface FinancialData {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
}

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFavorite: boolean;
  isAvailable: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  joinDate: string;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  time: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  amount: number;
  payment: string;
  status: "Diproses" | "Selesai" | "Dibatalkan";
  deliveryOption: string;
  address: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "order" | "payment" | "stock" | "review";
}

interface ProfileData {
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

// Gallery Item Type
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category: string;
}

// Testimonial Type
interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  status: "published" | "draft";
}

// FAQ Type
interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: "published" | "draft";
}

// Initial data
const initialFinancialData: FinancialData[] = [
  {
    id: "TRX001",
    date: "2023-08-15",
    description: "Penjualan Makanan",
    category: "Food Sales",
    amount: 450000,
    type: "income",
    paymentMethod: "GoPay",
    status: "completed",
  },
  {
    id: "TRX002",
    date: "2023-08-15",
    description: "Penjualan Minuman",
    category: "Beverage Sales",
    amount: 120000,
    type: "income",
    paymentMethod: "OVO",
    status: "completed",
  },
  {
    id: "TRX003",
    date: "2023-08-14",
    description: "Pembelian Bahan Baku",
    category: "Ingredients",
    amount: 350000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX004",
    date: "2023-08-14",
    description: "Biaya Listrik",
    category: "Utilities",
    amount: 85000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX005",
    date: "2023-08-13",
    description: "Penjualan Catering",
    category: "Catering",
    amount: 1200000,
    type: "income",
    paymentMethod: "BCA",
    status: "completed",
  },
  {
    id: "TRX006",
    date: "2023-08-13",
    description: "Gaji Karyawan",
    category: "Salary",
    amount: 2500000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX007",
    date: "2023-08-12",
    description: "Penjualan Makanan",
    category: "Food Sales",
    amount: 380000,
    type: "income",
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: "TRX008",
    date: "2023-08-12",
    description: "Biaya Sewa",
    category: "Rent",
    amount: 1500000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX009",
    date: "2023-08-11",
    description: "Penjualan Minuman",
    category: "Beverage Sales",
    amount: 95000,
    type: "income",
    paymentMethod: "DANA",
    status: "pending",
  },
  {
    id: "TRX010",
    date: "2023-08-11",
    description: "Biaya Marketing",
    category: "Marketing",
    amount: 300000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
];

const categories: CategoryData[] = [
  { name: "Food Sales", value: 45, color: "#FF6384" },
  { name: "Beverage Sales", value: 20, color: "#36A2EB" },
  { name: "Catering", value: 15, color: "#FFCE56" },
  { name: "Ingredients", value: 10, color: "#4BC0C0" },
  { name: "Utilities", value: 5, color: "#9966FF" },
  { name: "Salary", value: 10, color: "#FF9F40" },
  { name: "Rent", value: 20, color: "#C9CBCF" },
  { name: "Marketing", value: 5, color: "#7CFC00" },
];

const paymentMethods = [
  { name: "GoPay", value: 35, color: "#00AED9" },
  { name: "OVO", value: 25, color: "#EB0029" },
  { name: "DANA", value: 15, color: "#0080FF" },
  { name: "BCA", value: 15, color: "#0066B2" },
  { name: "Cash", value: 10, color: "#4CAF50" },
];

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Nasi Rames Komplit",
    description:
      "Nasi dengan lauk pilihan: ayam goreng, tempe, tahu, sayur, dan sambal",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isFavorite: true,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Soto Ayam Kampung",
    description: "Soto ayam segar dengan suwir ayam kampung dan kentang",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isFavorite: true,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Gado-Gado Jakarta",
    description: "Sayuran segar dengan bumbu kacang dan telur rebus",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isFavorite: true,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Rendang Sapi Padang",
    description: "Daging sapi empuk dengan bumbu rendang autentik",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isFavorite: true,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Ayam Goreng Lengkuas",
    description: "Ayam goreng dengan rempah lengkuas yang harum",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1623682247451-0ca2cddc009b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Makanan Utama",
    isFavorite: true,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Es Teh Manis",
    description: "Teh manis dingin dengan es batu",
    price: 5000,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Minuman",
    isFavorite: true,
    isAvailable: true,
  },
];

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 45, Jakarta Selatan",
    totalOrders: 12,
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    phone: "081234567891",
    address: "Jl. Thamrin No. 12, Jakarta Pusat",
    totalOrders: 8,
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567892",
    address: "Jl. Gatot Subroto No. 30, Jakarta Selatan",
    totalOrders: 15,
    joinDate: "2023-01-10",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    phone: "081234567893",
    address: "Jl. Rasuna Said No. 5, Jakarta Selatan",
    totalOrders: 6,
    joinDate: "2023-03-05",
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    email: "rudi@example.com",
    phone: "081234567894",
    address: "Jl. MH Thamrin No. 20, Jakarta Pusat",
    totalOrders: 10,
    joinDate: "2023-02-15",
  },
];

const initialOrders: Order[] = [
  {
    id: "INV-2023081501",
    customer: "Budi Santoso",
    date: "2023-08-15",
    time: "12:30",
    items: [
      { name: "Nasi Rames Komplit", quantity: 2, price: 25000 },
      { name: "Es Teh Manis", quantity: 2, price: 5000 },
    ],
    amount: 60000,
    payment: "GoPay",
    status: "Selesai",
    deliveryOption: "Diantar",
    address: "Jl. Sudirman No. 45, Jakarta Selatan",
  },
  {
    id: "INV-2023081502",
    customer: "Siti Nurhaliza",
    date: "2023-08-15",
    time: "13:45",
    items: [
      { name: "Soto Ayam Kampung", quantity: 1, price: 20000 },
      { name: "Gado-Gado Jakarta", quantity: 1, price: 18000 },
    ],
    amount: 38000,
    payment: "BCA",
    status: "Diproses",
    deliveryOption: "Makan di Tempat",
    address: "-",
  },
  {
    id: "INV-2023081503",
    customer: "Ahmad Fauzi",
    date: "2023-08-14",
    time: "19:20",
    items: [
      { name: "Rendang Sapi Padang", quantity: 1, price: 35000 },
      { name: "Ayam Goreng Lengkuas", quantity: 1, price: 28000 },
      { name: "Es Teh Manis", quantity: 1, price: 5000 },
    ],
    amount: 68000,
    payment: "OVO",
    status: "Selesai",
    deliveryOption: "Diantar",
    address: "Jl. Gatot Subroto No. 30, Jakarta Selatan",
  },
];

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Pesanan Baru",
    message: "Budi Santoso telah melakukan pemesanan",
    time: "5 menit yang lalu",
    isRead: false,
    type: "order",
  },
  {
    id: 2,
    title: "Pembayaran Diterima",
    message: "Pembayaran untuk INV-2023081502 telah diterima",
    time: "1 jam yang lalu",
    isRead: false,
    type: "payment",
  },
  {
    id: 3,
    title: "Stok Menipis",
    message: "Stok untuk Ayam Goreng Lengkuas hampir habis",
    time: "3 jam yang lalu",
    isRead: true,
    type: "stock",
  },
  {
    id: 4,
    title: "Ulasan Baru",
    message: "Siti Nurhaliza memberikan ulasan 5 bintang",
    time: "1 hari yang lalu",
    isRead: true,
    type: "review",
  },
];

// Initial Gallery Data
const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1601050691389-d98d48d8c1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Makanan Nasi Rames",
    caption: "Nasi Rames Komplit dengan lauk pilihan",
    category: "Makanan",
  },
  {
    id: 2,
    src: "https://picsum.photos/600/400?random=2",
    alt: "Interior Warteg",
    caption: "Ruangan makan yang nyaman dan bersih",
    category: "Interior",
  },
  {
    id: 3,
    src: "https://picsum.photos/600/400?random=3",
    alt: "Soto Ayam",
    caption: "Soto Ayam Kampung segar",
    category: "Makanan",
  },
  {
    id: 4,
    src: "https://picsum.photos/600/400?random=4",
    alt: "Minuman",
    caption: "Berbagai pilihan minuman segar",
    category: "Minuman",
  },
  {
    id: 5,
    src: "https://picsum.photos/600/400?random=5",
    alt: "Karyawan",
    caption: "Tim kami yang ramah dan profesional",
    category: "Tim",
  },
  {
    id: 6,
    src: "https://picsum.photos/600/400?random=6",
    alt: "Gado-Gado",
    caption: "Gado-Gado Jakarta dengan bumbu kacang autentik",
    category: "Makanan",
  },
];

// Initial Testimonials Data
const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Budi Santoso",
    avatar: "https://picsum.photos/100/100?random=1",
    comment: "Sekarang makan di warteg jadi lebih praktis! Tidak perlu antri lagi.",
    rating: 5,
    date: "2023-08-10",
    status: "published",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    avatar: "https://picsum.photos/100/100?random=2",
    comment: "Menu digitalnya sangat membantu, bisa lihat gambar makanan sebelum pesan.",
    rating: 4,
    date: "2023-08-08",
    status: "published",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    avatar: "https://picsum.photos/100/100?random=3",
    comment: "Pembayaran dengan QRIS sangat memudahkan, tidak perlu bawa uang tunai.",
    rating: 5,
    date: "2023-08-05",
    status: "published",
  },
];

// Initial FAQ Data
const initialFAQs: FAQ[] = [
  {
    id: 1,
    question: "Bagaimana cara memesan makanan di Warteg Sederhana?",
    answer: "Anda dapat memesan makanan melalui aplikasi digital kami. Pilih menu yang diinginkan, tambahkan ke keranjang, lalu lanjutkan ke pembayaran.",
    category: "Pemesanan",
    order: 1,
    status: "published",
  },
  {
    id: 2,
    question: "Apakah makanan dapat diantar ke rumah?",
    answer: "Ya, kami menyediakan layanan pengantaran dengan biaya tambahan sesuai jarak. Estimasi waktu pengantaran 30-45 menit.",
    category: "Pengantaran",
    order: 2,
    status: "published",
  },
  {
    id: 3,
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BNI) dan e-wallet (GoPay, OVO, DANA).",
    category: "Pembayaran",
    order: 3,
    status: "published",
  },
  {
    id: 4,
    question: "Apakah ada minimal pemesanan?",
    answer: "Ya, minimal pemesanan untuk layanan pengantaran adalah Rp15.000. Untuk makan di tempat tidak ada minimal.",
    category: "Pemesanan",
    order: 4,
    status: "published",
  },
  {
    id: 5,
    question: "Bagaimana jika ada keluhan dengan pesanan?",
    answer: "Silakan hubungi kami melalui nomor telepon atau email yang tertera. Kami akan segera menindaklanjuti keluhan Anda.",
    category: "Layanan Pelanggan",
    order: 5,
    status: "published",
  },
];

const initialProfileData: ProfileData = {
  name: "Warteg Sederhana",
  description: "Menyajikan masakan rumahan autentik dengan bahan segar pilihan",
  address: "Jl. Merdeka No. 123, Jakarta Pusat",
  operatingHours: "08:00 - 22:00 WIB",
  phone: "(021) 1234-5678",
  email: "info@wartegsederhana.com",
  minOrder: 15000,
  deliveryFee: 5000,
  deliveryTime: "30-45 menit",
  logo: "/images/product/eat2.jpeg",
  coverImage: "/images/product/eat2.jpeg",
  socialMedia: {
    facebook: "https://facebook.com/wartegsederhana",
    instagram: "https://instagram.com/wartegsederhana",
  },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [financialData, setFinancialData] =
    useState<FinancialData[]>(initialFinancialData);
  const [filteredFinancialData, setFilteredFinancialData] =
    useState<FinancialData[]>(initialFinancialData);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [filteredMenuItems, setFilteredMenuItems] =
    useState<MenuItem[]>(initialMenuItems);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer[]>(initialCustomers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  
  // New states for gallery, testimonials, and FAQs
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [filteredGalleryItems, setFilteredGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(initialFAQs);
  
  const [editMode, setEditMode] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "2023-08-01",
    end: "2023-08-15",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // New modal states
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  
  // New selected items
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate financial summary
  useEffect(() => {
    const totalIncome = financialData
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = financialData
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const pendingTransactions = financialData.filter(
      (item) => item.status === "pending"
    ).length;
    const completedTransactions = financialData.filter(
      (item) => item.status === "completed"
    ).length;
    const failedTransactions = financialData.filter(
      (item) => item.status === "failed"
    ).length;

    setFinancialSummary({
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingTransactions,
      completedTransactions,
      failedTransactions,
    });
  }, [financialData]);

  // Filter financial data
  useEffect(() => {
    let result = financialData;

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== "all") {
      result = result.filter((item) => item.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFinancialData(result);
    setCurrentPage(1);
  }, [financialData, dateRange, selectedCategory, selectedType, searchTerm]);

  // Filter menu items
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMenuItems(menuItems);
    } else {
      const filtered = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  }, [searchTerm, menuItems]);

  // Filter customers
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Filter orders
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.payment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  // Filter gallery items
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGalleryItems(galleryItems);
    } else {
      const filtered = galleryItems.filter(
        (item) =>
          item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGalleryItems(filtered);
    }
  }, [searchTerm, galleryItems]);

  // Filter testimonials
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTestimonials(testimonials);
    } else {
      const filtered = testimonials.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestimonials(filtered);
    }
  }, [searchTerm, testimonials]);

  // Filter FAQs
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchTerm, faqs]);

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle profile change
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle social media change
  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  // Save profile
  const saveProfile = () => {
    console.log("Profil disimpan:", profileData);
    setEditMode(false);
    alert("Profil berhasil diperbarui!");
  };

  // Menu CRUD functions
  const openAddMenuModal = () => {
    setSelectedMenuItem({
      id: menuItems.length + 1,
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "Makanan Utama",
      isFavorite: false,
      isAvailable: true,
    });
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsMenuModalOpen(true);
  };

  const handleMenuChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setSelectedMenuItem((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: val };
    });
  };

  const saveMenuItem = () => {
    if (!selectedMenuItem) return;

    if (selectedMenuItem.id > menuItems.length) {
      // Add new menu
      setMenuItems([...menuItems, selectedMenuItem]);
    } else {
      // Update existing menu
      setMenuItems(
        menuItems.map((item) =>
          item.id === selectedMenuItem.id ? selectedMenuItem : item
        )
      );
    }
    setIsMenuModalOpen(false);
    alert("Menu berhasil disimpan!");
  };

  const deleteMenuItem = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
      alert("Menu berhasil dihapus!");
    }
  };

  // Customer CRUD functions
  const openAddCustomerModal = () => {
    setSelectedCustomer({
      id: customers.length + 1,
      name: "",
      email: "",
      phone: "",
      address: "",
      totalOrders: 0,
      joinDate: new Date().toISOString().split("T")[0],
    });
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const saveCustomer = () => {
    if (!selectedCustomer) return;

    if (selectedCustomer.id > customers.length) {
      // Add new customer
      setCustomers([...customers, selectedCustomer]);
    } else {
      // Update existing customer
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id ? selectedCustomer : customer
        )
      );
    }
    setIsCustomerModalOpen(false);
    alert("Pelanggan berhasil disimpan!");
  };

  const deleteCustomer = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      alert("Pelanggan berhasil dihapus!");
    }
  };

  // Order functions
  const openEditOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const updateOrderStatus = () => {
    if (!selectedOrder) return;

    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id ? selectedOrder : order
      )
    );
    setIsOrderModalOpen(false);
    alert("Status pesanan berhasil diperbarui!");
  };

  // Notification functions
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const openNotificationModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  // Gallery CRUD functions
  const openAddGalleryModal = () => {
    setSelectedGalleryItem({
      id: galleryItems.length + 1,
      src: "",
      alt: "",
      caption: "",
      category: "Makanan",
    });
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setSelectedGalleryItem(item);
    setIsGalleryModalOpen(true);
  };

  const handleGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedGalleryItem((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const saveGalleryItem = () => {
    if (!selectedGalleryItem) return;

    if (selectedGalleryItem.id > galleryItems.length) {
      // Add new gallery item
      setGalleryItems([...galleryItems, selectedGalleryItem]);
    } else {
      // Update existing gallery item
      setGalleryItems(
        galleryItems.map((item) =>
          item.id === selectedGalleryItem.id ? selectedGalleryItem : item
        )
      );
    }
    setIsGalleryModalOpen(false);
    alert("Item galeri berhasil disimpan!");
  };

  const deleteGalleryItem = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini dari galeri?")) {
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
      alert("Item galeri berhasil dihapus!");
    }
  };

  // Testimonial CRUD functions
  const openAddTestimonialModal = () => {
    setSelectedTestimonial({
      id: testimonials.length + 1,
      name: "",
      avatar: "",
      comment: "",
      rating: 5,
      date: new Date().toISOString().split("T")[0],
      status: "published",
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setSelectedTestimonial((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: val };
    });
  };

  const saveTestimonial = () => {
    if (!selectedTestimonial) return;

    if (selectedTestimonial.id > testimonials.length) {
      // Add new testimonial
      setTestimonials([...testimonials, selectedTestimonial]);
    } else {
      // Update existing testimonial
      setTestimonials(
        testimonials.map((testimonial) =>
          testimonial.id === selectedTestimonial.id ? selectedTestimonial : testimonial
        )
      );
    }
    setIsTestimonialModalOpen(false);
    alert("Testimoni berhasil disimpan!");
  };

  const deleteTestimonial = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
      alert("Testimoni berhasil dihapus!");
    }
  };

  // FAQ CRUD functions
  const openAddFAQModal = () => {
    setSelectedFAQ({
      id: faqs.length + 1,
      question: "",
      answer: "",
      category: "Pemesanan",
      order: faqs.length + 1,
      status: "published",
    });
    setIsFAQModalOpen(true);
  };

  const openEditFAQModal = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsFAQModalOpen(true);
  };

  const handleFAQChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setSelectedFAQ((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: val };
    });
  };

  const saveFAQ = () => {
    if (!selectedFAQ) return;

    if (selectedFAQ.id > faqs.length) {
      // Add new FAQ
      setFaqs([...faqs, selectedFAQ]);
    } else {
      // Update existing FAQ
      setFaqs(
        faqs.map((faq) =>
          faq.id === selectedFAQ.id ? selectedFAQ : faq
        )
      );
    }
    setIsFAQModalOpen(false);
    alert("FAQ berhasil disimpan!");
  };

  const deleteFAQ = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
      alert("FAQ berhasil dihapus!");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFinancialItems = filteredFinancialData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentOrderItems = filteredOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentGalleryItems = filteredGalleryItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentTestimonialItems = filteredTestimonials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentFAQItems = filteredFaqs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalFinancialPages = Math.ceil(
    filteredFinancialData.length / itemsPerPage
  );
  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const totalGalleryPages = Math.ceil(filteredGalleryItems.length / itemsPerPage);
  const totalTestimonialPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const totalFAQPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Pesanan Hari Ini</p>
              <p className="text-3xl font-bold">42</p>
            </div>
            <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
              <FaShoppingCart className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pendapatan Bulan Ini</p>
              <p className="text-3xl font-bold">Rp 12,500,000</p>
            </div>
            <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
              <FaMoneyBillWave className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Pelanggan</p>
              <p className="text-3xl font-bold">328</p>
            </div>
            <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
              <FaUsers className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Menu Tersedia</p>
              <p className="text-3xl font-bold">{menuItems.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-400 bg-opacity-30">
              <FaUtensils className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Menu Terlaris
          </h3>
          <div className="space-y-4">
            {[
              { name: "Nasi Rames Komplit", orders: 28 },
              { name: "Soto Ayam Kampung", orders: 22 },
              { name: "Gado-Gado Jakarta", orders: 18 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item.orders} pesanan
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pesanan Terbaru
          </h3>
          <div className="space-y-4">
            {[
              {
                id: "INV-2023081501",
                customer: "Budi Santoso",
                amount: 75000,
                status: "Selesai",
              },
              {
                id: "INV-2023081502",
                customer: "Siti Nurhaliza",
                amount: 45000,
                status: "Diproses",
              },
              {
                id: "INV-2023081503",
                customer: "Ahmad Fauzi",
                amount: 95000,
                status: "Selesai",
              },
            ].map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Rp {order.amount.toLocaleString("id-ID")}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Selesai"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render financial report
  const renderFinancialReport = () => {
    // Prepare chart data
    const incomeData = financialData
      .filter((item) => item.type === "income")
      .reduce((acc: { [key: string]: number }, item) => {
        const date = item.date;
        acc[date] = (acc[date] || 0) + item.amount;
        return acc;
      }, {});

    const expenseData = financialData
      .filter((item) => item.type === "expense")
      .reduce((acc: { [key: string]: number }, item) => {
        const date = item.date;
        acc[date] = (acc[date] || 0) + item.amount;
        return acc;
      }, {});

    const dates = Object.keys({ ...incomeData, ...expenseData }).sort();

    const chartData: ChartData = {
      labels: dates,
      datasets: [
        {
          label: "Pendapatan",
          data: dates.map((date) => incomeData[date] || 0),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Pengeluaran",
          data: dates.map((date) => expenseData[date] || 0),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h2>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <span>s/d</span>
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">Semua Kategori</option>
              {Array.from(
                new Set(financialData.map((item) => item.category))
              ).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="all">Semua Tipe</option>
              <option value="income">Pendapatan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Pendapatan</p>
                <p className="text-2xl font-bold">
                  Rp {financialSummary.totalIncome.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
                <FaArrowUp className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Pengeluaran</p>
                <p className="text-2xl font-bold">
                  Rp {financialSummary.totalExpense.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-400 bg-opacity-30">
                <FaArrowDown className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Laba Bersih</p>
                <p className="text-2xl font-bold">
                  Rp {financialSummary.netProfit.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
                <FaDollarSign className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Transaksi Selesai</p>
                <p className="text-2xl font-bold">
                  {financialSummary.completedTransactions}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
                <FaCheck className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Grafik Pendapatan vs Pengeluaran
              </h3>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-2">
                  <FaFilter />
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-2">
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="h-64 flex items-end space-x-2">
              {chartData.labels.map((label, index) => {
                const income = chartData.datasets[0].data[index];
                const expense = chartData.datasets[1].data[index];
                const maxValue = Math.max(
                  ...chartData.datasets[0].data,
                  ...chartData.datasets[1].data
                );

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {label.split("-")[2]}
                    </div>
                    <div className="flex items-end justify-center space-x-1 w-full">
                      <div
                        className="w-1/2 bg-green-400 rounded-t"
                        style={{ height: `${(income / maxValue) * 100}%` }}
                      ></div>
                      <div
                        className="w-1/2 bg-red-400 rounded-t"
                        style={{ height: `${(expense / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                <span className="text-sm">Pendapatan</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                <span className="text-sm">Pengeluaran</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Distribusi Kategori
              </h3>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-2">
                  <FaFilter />
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-2">
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                {categories.map((category, index) => {
                  const total = categories.reduce(
                    (sum, cat) => sum + cat.value,
                    0
                  );
                  const percentage = (category.value / total) * 100;
                  const rotation = categories
                    .slice(0, index)
                    .reduce((sum, cat) => sum + (cat.value / total) * 360, 0);

                  return (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        clipPath: `conic-linear(transparent ${rotation}deg, ${
                          category.color
                        } ${rotation}deg ${
                          rotation + percentage
                        }deg, transparent ${rotation + percentage}deg)`,
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Metode Pembayaran
            </h3>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaFilter />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaDownload />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{method.name}</span>
                  <span className="text-sm font-medium">{method.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${method.value}%`,
                      backgroundColor: method.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Riwayat Transaksi
            </h3>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaFilter />
              </button>
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700 p-2">
                  <FaDownload />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaFileExcel className="mr-2 text-green-500" /> Export Excel
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaFilePdf className="mr-2 text-red-500" /> Export PDF
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaFileCsv className="mr-2 text-blue-500" /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentFinancialItems.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}Rp{" "}
                      {transaction.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Selesai"
                          : transaction.status === "pending"
                          ? "Pending"
                          : "Gagal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalFinancialPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    paginate(
                      currentPage < totalFinancialPages
                        ? currentPage + 1
                        : totalFinancialPages
                    )
                  }
                  disabled={currentPage === totalFinancialPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredFinancialData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredFinancialData.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from(
                      { length: totalFinancialPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        paginate(
                          currentPage < totalFinancialPages
                            ? currentPage + 1
                            : totalFinancialPages
                        )
                      }
                      disabled={currentPage === totalFinancialPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render menu management
  const renderMenuManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari menu..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddMenuModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Menu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favorit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMenuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.description.substring(0, 30)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isAvailable ? "Tersedia" : "Habis"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.isFavorite ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditMenuModal(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render customer management
  const renderCustomerManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pelanggan</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddCustomerModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.address.substring(0, 30)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditCustomerModal(customer)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render order management
  const renderOrderManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pesanan</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pesanan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembayaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrderItems.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date} {order.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Rp {order.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.payment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Selesai"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Diproses"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditOrderModal(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalOrderPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                paginate(
                  currentPage < totalOrderPages
                    ? currentPage + 1
                    : totalOrderPages
                )
              }
              disabled={currentPage === totalOrderPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    paginate(
                      currentPage < totalOrderPages
                        ? currentPage + 1
                        : totalOrderPages
                    )
                  }
                  disabled={currentPage === totalOrderPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render notifications
  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
        <button
          onClick={markAllAsRead}
          className="text-orange-500 hover:text-orange-600"
        >
          Tandai semua telah dibaca
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
              onClick={() => openNotificationModal(notification)}
            >
              <div className="flex items-start">
                <div className="shrink-0 pt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      !notification.isRead ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.type === "order"
                          ? "bg-blue-100 text-blue-800"
                          : notification.type === "payment"
                          ? "bg-green-100 text-green-800"
                          : notification.type === "stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {notification.type === "order"
                        ? "Pesanan"
                        : notification.type === "payment"
                        ? "Pembayaran"
                        : notification.type === "stock"
                        ? "Stok"
                        : "Ulasan"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render gallery management
  const renderGalleryManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Galeri</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari gambar..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddGalleryModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Gambar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentGalleryItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1">{item.alt}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.caption}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditGalleryModal(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalGalleryPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() =>
                paginate(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalGalleryPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                paginate(
                  currentPage < totalGalleryPages
                    ? currentPage + 1
                    : totalGalleryPages
                )
              }
              disabled={currentPage === totalGalleryPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );

  // Render testimonials management
  const renderTestimonialsManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Testimoni</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari testimoni..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddTestimonialModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Testimoni
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimoni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTestimonialItems.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {testimonial.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {testimonial.comment.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {testimonial.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        testimonial.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {testimonial.status === "published" ? "Diterbitkan" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditTestimonialModal(testimonial)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalTestimonialPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() =>
                paginate(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalTestimonialPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                paginate(
                  currentPage < totalTestimonialPages
                    ? currentPage + 1
                    : totalTestimonialPages
                )
              }
              disabled={currentPage === totalTestimonialPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );

  // Render FAQ management
  const renderFAQManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola FAQ</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari FAQ..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddFAQModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah FAQ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pertanyaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urutan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFAQItems.map((faq) => (
                <tr key={faq.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {faq.question}
                    </div>
                    <div className="text-sm text-gray-500">
                      {faq.answer.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faq.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faq.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        faq.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {faq.status === "published" ? "Diterbitkan" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditFAQModal(faq)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalFAQPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() =>
                paginate(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalFAQPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                paginate(
                  currentPage < totalFAQPages
                    ? currentPage + 1
                    : totalFAQPages
                )
              }
              disabled={currentPage === totalFAQPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );

  // Render profile settings
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Pengaturan Profil Toko
        </h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg flex items-center ${
            editMode ? "bg-gray-200 text-gray-700" : "bg-orange-500 text-white"
          }`}
        >
          {editMode ? (
            <FaTimes className="mr-2" />
          ) : (
            <FaEdit className="mr-2" />
          )}
          {editMode ? "Batal" : "Edit Profil"}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Informasi Dasar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Toko
            </label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profileData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telepon
            </label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profileData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Operasional
            </label>
            {editMode ? (
              <input
                type="text"
                name="operatingHours"
                value={profileData.operatingHours}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {profileData.operatingHours}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            {editMode ? (
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profileData.address}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            {editMode ? (
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleProfileChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {profileData.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Pengaturan Layanan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimal Order (Rp)
            </label>
            {editMode ? (
              <input
                type="number"
                name="minOrder"
                value={profileData.minOrder}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                Rp {profileData.minOrder.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya Antar (Rp)
            </label>
            {editMode ? (
              <input
                type="number"
                name="deliveryFee"
                value={profileData.deliveryFee}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                Rp {profileData.deliveryFee.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Waktu Antar
            </label>
            {editMode ? (
              <input
                type="text"
                name="deliveryTime"
                value={profileData.deliveryTime}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {profileData.deliveryTime}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Media Sosial</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            {editMode ? (
              <input
                type="text"
                name="facebook"
                value={profileData.socialMedia.facebook}
                onChange={handleSocialMediaChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {profileData.socialMedia.facebook}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            {editMode ? (
              <input
                type="text"
                name="instagram"
                value={profileData.socialMedia.instagram}
                onChange={handleSocialMediaChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {profileData.socialMedia.instagram}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gambar Profil</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Toko
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={profileData.logo}
                  alt="Logo Toko"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              {editMode && (
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                  Ganti Logo
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gambar Sampul
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={profileData.coverImage}
                  alt="Gambar Sampul"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              {editMode && (
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
                  Ganti Gambar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="flex justify-end">
          <button
            onClick={saveProfile}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
          >
            <FaSave className="mr-2" /> Simpan Perubahan
          </button>
        </div>
      )}
    </div>
  );

  // Render menu modal
  const renderMenuModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedMenuItem && selectedMenuItem.id > menuItems.length
                ? "Tambah Menu"
                : "Edit Menu"}
            </h3>
            <button
              onClick={() => setIsMenuModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Menu
            </label>
            <input
              type="text"
              name="name"
              value={selectedMenuItem?.name || ""}
              onChange={handleMenuChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={selectedMenuItem?.description || ""}
              onChange={handleMenuChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                name="price"
                value={selectedMenuItem?.price || 0}
                onChange={handleMenuChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={selectedMenuItem?.category || ""}
                onChange={handleMenuChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Lauk Pauk">Lauk Pauk</option>
                <option value="Minuman">Minuman</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFavorite"
                name="isFavorite"
                checked={selectedMenuItem?.isFavorite || false}
                onChange={handleMenuChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isFavorite"
                className="ml-2 block text-sm text-gray-700"
              >
                Menu Favorit
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={selectedMenuItem?.isAvailable || false}
                onChange={handleMenuChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAvailable"
                className="ml-2 block text-sm text-gray-700"
              >
                Tersedia
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Gambar
            </label>
            <input
              type="text"
              name="image"
              value={selectedMenuItem?.image || ""}
              onChange={handleMenuChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsMenuModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveMenuItem}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  // Render customer modal
  const renderCustomerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedCustomer && selectedCustomer.id > customers.length
                ? "Tambah Pelanggan"
                : "Edit Pelanggan"}
            </h3>
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={selectedCustomer?.name || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={selectedCustomer?.email || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={selectedCustomer?.phone || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="address"
              value={selectedCustomer?.address || ""}
              onChange={handleCustomerChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Pesanan
              </label>
              <input
                type="number"
                name="totalOrders"
                value={selectedCustomer?.totalOrders || 0}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                name="joinDate"
                value={selectedCustomer?.joinDate || ""}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsCustomerModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveCustomer}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  // Render order modal
  const renderOrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Detail Pesanan</h3>
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                ID Pesanan
              </h4>
              <p className="font-medium">{selectedOrder?.id}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Pelanggan
              </h4>
              <p className="font-medium">{selectedOrder?.customer}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Tanggal & Waktu
              </h4>
              <p className="font-medium">
                {selectedOrder?.date} {selectedOrder?.time}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Pembayaran
              </h4>
              <p className="font-medium">{selectedOrder?.payment}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Opsi Pengiriman
              </h4>
              <p className="font-medium">{selectedOrder?.deliveryOption}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <select
                name="status"
                value={selectedOrder?.status || ""}
                onChange={handleOrderChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Item Pesanan
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                        Rp{" "}
                        {(item.quantity * item.price).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-sm font-medium text-gray-900 text-right"
                    >
                      Total
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-orange-500">
                      Rp {selectedOrder?.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {selectedOrder?.deliveryOption === "Diantar" && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Alamat Pengiriman
              </h4>
              <p className="font-medium">{selectedOrder?.address}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Tutup
          </button>
          <button
            onClick={updateOrderStatus}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );

  // Render notification modal
  const renderNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedNotification?.title}
            </h3>
            <button
              onClick={() => setIsNotificationModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">{selectedNotification?.message}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{selectedNotification?.time}</span>
            <span className="mx-2">•</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedNotification?.type === "order"
                  ? "bg-blue-100 text-blue-800"
                  : selectedNotification?.type === "payment"
                  ? "bg-green-100 text-green-800"
                  : selectedNotification?.type === "stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {selectedNotification?.type === "order"
                ? "Pesanan"
                : selectedNotification?.type === "payment"
                ? "Pembayaran"
                : selectedNotification?.type === "stock"
                ? "Stok"
                : "Ulasan"}
            </span>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  // Render gallery modal
  const renderGalleryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedGalleryItem && selectedGalleryItem.id > galleryItems.length
                ? "Tambah Gambar"
                : "Edit Gambar"}
            </h3>
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Gambar
            </label>
            <input
              type="text"
              name="src"
              value={selectedGalleryItem?.src || ""}
              onChange={handleGalleryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {selectedGalleryItem?.src && (
              <div className="mt-2 h-40 overflow-hidden rounded-lg">
                <img
                  src={selectedGalleryItem.src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              name="alt"
              value={selectedGalleryItem?.alt || ""}
              onChange={handleGalleryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              name="caption"
              value={selectedGalleryItem?.caption || ""}
              onChange={handleGalleryChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              value={selectedGalleryItem?.category || ""}
              onChange={handleGalleryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Interior">Interior</option>
              <option value="Tim">Tim</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsGalleryModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveGalleryItem}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  // Render testimonial modal
  const renderTestimonialModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedTestimonial && selectedTestimonial.id > testimonials.length
                ? "Tambah Testimoni"
                : "Edit Testimoni"}
            </h3>
            <button
              onClick={() => setIsTestimonialModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={selectedTestimonial?.name || ""}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Avatar
            </label>
            <input
              type="text"
              name="avatar"
              value={selectedTestimonial?.avatar || ""}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {selectedTestimonial?.avatar && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={selectedTestimonial.avatar}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-500">Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimoni
            </label>
            <textarea
              name="comment"
              value={selectedTestimonial?.comment || ""}
              onChange={handleTestimonialChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                name="rating"
                value={selectedTestimonial?.rating || 5}
                onChange={handleTestimonialChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value={5}>5 Bintang</option>
                <option value={4}>4 Bintang</option>
                <option value={3}>3 Bintang</option>
                <option value={2}>2 Bintang</option>
                <option value={1}>1 Bintang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={selectedTestimonial?.date || ""}
                onChange={handleTestimonialChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={selectedTestimonial?.status || "published"}
              onChange={handleTestimonialChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="published">Diterbitkan</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsTestimonialModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveTestimonial}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  // Render FAQ modal
  const renderFAQModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedFAQ && selectedFAQ.id > faqs.length
                ? "Tambah FAQ"
                : "Edit FAQ"}
            </h3>
            <button
              onClick={() => setIsFAQModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertanyaan
            </label>
            <input
              type="text"
              name="question"
              value={selectedFAQ?.question || ""}
              onChange={handleFAQChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jawaban
            </label>
            <textarea
              name="answer"
              value={selectedFAQ?.answer || ""}
              onChange={handleFAQChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={selectedFAQ?.category || ""}
                onChange={handleFAQChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="Pemesanan">Pemesanan</option>
                <option value="Pengantaran">Pengantaran</option>
                <option value="Pembayaran">Pembayaran</option>
                <option value="Layanan Pelanggan">Layanan Pelanggan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutan
              </label>
              <input
                type="number"
                name="order"
                value={selectedFAQ?.order || 1}
                onChange={handleFAQChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={selectedFAQ?.status || "published"}
                onChange={handleFAQChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="published">Diterbitkan</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsFAQModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveFAQ}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <Head>
        <title>Admin Dashboard - Warteg Sederhana</title>
        <meta
          name="description"
          content="Dashboard admin untuk Warteg Sederhana"
        />
      </Head>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">W</span>
              </div>
              <span className="text-xl font-bold">Warteg Sederhana</span>
            </div>
            {/* Close btn mobile */}
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            {[
              { id: "dashboard", icon: <FaChartLine />, label: "Dashboard" },
              {
                id: "financial",
                icon: <FaMoneyBillWave />,
                label: "Laporan Keuangan",
              },
              { id: "menu", icon: <FaUtensils />, label: "Kelola Menu" },
              { id: "customers", icon: <FaUsers />, label: "Pelanggan" },
              { id: "orders", icon: <FaFileInvoice />, label: "Pesanan" },
              { id: "notifications", icon: <FaBell />, label: "Notifikasi" },
              { id: "gallery", icon: <FaImages />, label: "Galeri" },
              { id: "testimonials", icon: <FaQuoteLeft />, label: "Testimoni" },
              { id: "faq", icon: <FaQuestionCircle />, label: "FAQ" },
              { id: "profile", icon: <FaCog />, label: "Pengaturan Profil" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left ${
                  activeTab === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.id === "notifications" &&
                  notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
              </button>
            ))}

            <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 mt-8">
              <FaSignOutAlt className="mr-3" /> Keluar
            </button>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            {/* Hamburger for mobile */}
            <div className="flex items-center space-x-2">
              <button
                className="md:hidden text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <FaHome className="text-3xl" />
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "financial" && "Laporan Keuangan"}
                  {activeTab === "menu" && "Kelola Menu"}
                  {activeTab === "customers" && "Kelola Pelanggan"}
                  {activeTab === "orders" && "Kelola Pesanan"}
                  {activeTab === "notifications" && "Notifikasi"}
                  {activeTab === "gallery" && "Kelola Galeri"}
                  {activeTab === "testimonials" && "Kelola Testimoni"}
                  {activeTab === "faq" && "Kelola FAQ"}
                  {activeTab === "profile" && "Pengaturan Profil"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "dashboard" && "Ringkasan performa toko Anda"}
                  {activeTab === "financial" &&
                    "Pantau pendapatan dan pengeluaran toko Anda"}
                  {activeTab === "menu" && "Kelola menu makanan dan minuman"}
                  {activeTab === "customers" && "Kelola data pelanggan"}
                  {activeTab === "orders" && "Kelola pesanan masuk"}
                  {activeTab === "notifications" && "Lihat notifikasi terbaru"}
                  {activeTab === "gallery" && "Kelola galeri foto toko"}
                  {activeTab === "testimonials" && "Kelola testimoni pelanggan"}
                  {activeTab === "faq" && "Kelola pertanyaan yang sering diajukan"}
                  {activeTab === "profile" && "Kelola informasi toko Anda"}
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center lg:space-x-4 spacex-2">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FaBell className="text-xl" />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/product/eat2.jpeg"
                    alt="Admin"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-800">Admin</p>
                  <p className="text-sm text-gray-600">Pemilik Toko</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "dashboard" && renderDashboard()}
                {activeTab === "financial" && renderFinancialReport()}
                {activeTab === "menu" && renderMenuManagement()}
                {activeTab === "customers" && renderCustomerManagement()}
                {activeTab === "orders" && renderOrderManagement()}
                {activeTab === "notifications" && renderNotifications()}
                {activeTab === "gallery" && renderGalleryManagement()}
                {activeTab === "testimonials" && renderTestimonialsManagement()}
                {activeTab === "faq" && renderFAQManagement()}
                {activeTab === "profile" && renderProfileSettings()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Modals */}
      {isMenuModalOpen && renderMenuModal()}
      {isCustomerModalOpen && renderCustomerModal()}
      {isOrderModalOpen && renderOrderModal()}
      {isNotificationModalOpen && renderNotificationModal()}
      {isGalleryModalOpen && renderGalleryModal()}
      {isTestimonialModalOpen && renderTestimonialModal()}
      {isFAQModalOpen && renderFAQModal()}
    </div>
  );
}