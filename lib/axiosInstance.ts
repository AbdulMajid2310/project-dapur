import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface FailedQueueItem {
  resolve: () => void;
  reject: (reason?: any) => void;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown): Promise<unknown> => {
    const axiosError = error as AxiosError;

    if (!axios.isAxiosError(axiosError) || !axiosError.response || !axiosError.config) {
      return Promise.reject(error);
    }

    const originalRequest = axiosError.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (axiosError.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post('/auth/refresh');
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        console.error('Refresh token failed, redirecting to login.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;