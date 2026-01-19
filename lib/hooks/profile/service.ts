import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse, Profile } from "./type";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Profile>>(`/profiles/user/${userId}`);
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error("Service Error: Gagal mengambil profile", axiosError?.response?.data || axiosError.message);
    throw error;
  }
};

export const createProfile = async (userId: string, formData: FormData): Promise<Profile> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Profile>>(`/profiles/${userId}`, formData);
    return response.data.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error("Service Error: Gagal membuat profile", axiosError?.response?.data || axiosError.message);
    throw error;
  }
};