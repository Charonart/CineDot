import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../env/env';
import { logger } from '../logger/logger';
import { getMockPath } from '@mocks/mockRoutes';
import { ApiError } from '@shared/types/api.type';
import { isRequestCanceled } from '@shared/utils/isRequestCanceled';

export const axiosClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Mock Mode Strategy
    if (env.NEXT_PUBLIC_USE_MOCK && config.url) {
      const mockPath = getMockPath(config.url);
      if (mockPath) {
        //SSR-safe: window không tồn tại trong Server Component
        let origin: string;
        if (typeof window !== 'undefined') {
          origin = window.location.origin;
        } else {
          // Next.js tự set PORT khi chọn port available
          const port = process.env.PORT ?? '3000';
          origin = `http://localhost:${port}`;
        }
        config.baseURL = origin;
        config.url = mockPath;
        config.method = 'GET';
        logger.info(`🚀 [Mock Mode] Redirecting to ${mockPath}`);
      }
    }

    // 2. Auth Injection
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (isRequestCanceled(error)) {
      return Promise.reject({
        success: false,
        message: 'canceled',
        code: 'REQUEST_CANCELED',
      });
    }

    const status = error.response?.status;
    const responseData = error.response?.data as any;

    const normalizedError: ApiError = {
      success: false,
      message: responseData?.message || error.message || 'Something went wrong',
      code: responseData?.code || 'UNKNOWN_ERROR',
      errors: responseData?.errors,
    };

    logger.error(`❌ [Axios] ${normalizedError.code}: ${normalizedError.message}`, { status });

    return Promise.reject(normalizedError);
  },
);
