import axios, { type AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('[API] Unauthorized access', error.config?.url);
      }
      if (!error.response) {
        console.error('[API] Network error — no response received', error.message);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
