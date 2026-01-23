export interface UserData {
  userId: string;
  email: string;
  refreshToken?: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  role: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}
