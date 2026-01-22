
// Tipe data untuk respons dari API
export interface OrderItem {
  id: string;
  menuItem: {
    menuItemId: string;
    name: string;
    description: string;
    price: string;
    image: string;
    isAvailable: boolean;
    isFavorite: boolean;
    stock: number;
    orderCount: number;
    rating: number | null;
    reviewCount: number;
    allergens: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  quantity: number;
  priceAtPurchase: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialData{
  testimonialId: string
  imageurl: string
  comment: string
  rating: string
  isApproved: boolean
  createdAt: string
}

export interface Order {
  orderId: string;
  orderNumber: string;
  address: {
    addressId: string;
    delivery: string;
    description: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    user: {
      userId: string;
      email: string;
      password: string;
      refreshToken: string;
      firstName: string;
      lastName: string;
      phone: string;
      isActive: boolean;
      role: string;
      avatar: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  paymentMethod: {
    paymentMethodId: string;
    type: string;
    bankName: string | null;
    ewalletName: string | null;
    accountNumber: string;
    qrCode: string | null;
    description: string;
    createdAt: string;
    updatedAt: string;
    profile: {
      profileId: string;
      name: string;
      description: string;
      address: string;
      operatingHours: string;
      phone: string;
      email: string;
      logo: string;
      coverImage: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  testimonials: TestimonialData,
  status: string;
  paymentStatus: string;
  paymentProof: string | null;
  paidAt: string | null;
  totalItemPrice: string;
  deliveryFee: string;
  grandTotal: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  message: string;
  data: Order[];
}



