// src/types/profile.ts

export interface SocialMediaData {
  socialMediaId?: string; 
  title?: string;
  url?: string;
  platform?: string; 
}


export interface Profile {
  profileId: string;
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
  socialMedias: SocialMediaData[];
  createdAt: string;
  updatedAt: string;
}


export interface CreateProfileForm {
  name: string;
  description?: string;
  address: string;
  operatingHours: string;
  phone: string;
  email: string;
  minOrder: number;
  deliveryFee: number;
  deliveryTime: string;
  socialMedias: Omit<SocialMediaData, 'socialMediaId'>[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}