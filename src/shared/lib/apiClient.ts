import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import https from 'https';
import { ApiError } from '../types/api.types';
import { useAuthStore } from '../store/useAuthStore';

const isServer = typeof window === 'undefined';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cinedot_be.test/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  httpsAgent: isServer ? new https.Agent({ rejectUnauthorized: false }) : undefined,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Auto-attach Sanctum Bearer Token from Cookie / Store
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      Cookies.get('cine_token') ||
      Cookies.get('cinedot_token') ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('cinedot_token') || localStorage.getItem('cine_token')
        : null) ||
      useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize responses and standardize error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data as any;

    if (
      status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?.url?.includes('/auth/register') &&
      !error.config?.url?.includes('/auth/logout') &&
      !error.config?.url?.includes('/auth/me')
    ) {
      // Sanctum Token Expired / Unauthenticated on protected route
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    } else if (status === 403) {
      console.warn('⚠️ [RBAC 403 Forbidden]: Bạn không có quyền thực hiện thao tác này.');
    }

    let message =
      responseData?.data?.message ||
      responseData?.message ||
      (status === 422 ? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.' : undefined) ||
      error.message ||
      'Đã xảy ra lỗi khi kết nối tới máy chủ CineDot';

    if (status === 401 && (message === 'Unauthenticated.' || message === 'Unauthenticated')) {
      message = 'Vui lòng đăng nhập để tiếp tục.';
    }

    const errors = responseData?.data?.errors || responseData?.errors;

    const normalizedError: ApiError = {
      success: false,
      message,
      code: String(status || '500'),
      status,
      errors,
    };

    return Promise.reject(normalizedError);
  }
);
