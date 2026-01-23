import { MenuItem } from "../menu/type";
import { Order } from "../order/type";
import { UserData } from "../user/type";

export interface TestimonialData {
  testimonialId: string;
  rating: number;
  comment: string;
  image: string | null;
  user: UserData
  menuItem: MenuItem;
  order: Order;
  imageUrl: string
  createdAt: string;
}



export interface ApiResponse {
  message: string;
  data: TestimonialData[];
}