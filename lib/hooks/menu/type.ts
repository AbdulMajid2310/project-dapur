import { TestimonialData } from "../testimonial/type";

export interface MenuItem {
  menuItemId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string ;
  isFavorite: boolean;
  isAvailable: boolean;
  stock: number;
  orderCount: number;
  rating: number | null;
  reviewCount: number;
  allergens: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  testimonials: TestimonialData[]
}

export interface MenuApiResponse {
  message: string;
  data: MenuItem[];
}