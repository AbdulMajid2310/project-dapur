import { MenuItem } from "../menu/type";
import { TestimonialData } from "../testimonial/type";
import { UserData } from "../user/type";

// Tipe data untuk respons dari API
export interface OrderItem {
  orderItemId: string;
  menuItem:MenuItem;
  quantity: number;
  priceAtPurchase: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
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
    user: UserData
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



