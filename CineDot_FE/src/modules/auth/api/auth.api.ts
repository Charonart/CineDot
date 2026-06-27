import { axiosClient } from '@/lib/axios/axiosClient';
import { env } from '@/lib/env/env';
import { ApiResponse } from '@/shared/types/api.type';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  AuthSessionDTO,
} from '../dto/auth.dto';

export const authApi = {
  getCsrfCookie: (): Promise<void> => {
    return axiosClient.get('/sanctum/csrf-cookie', {
      baseURL: env.NEXT_PUBLIC_BACKEND_ORIGIN,
    });
  },

  login: (payload: LoginRequestDTO): Promise<ApiResponse<AuthSessionDTO>> => {
    return axiosClient.post('/auth/login', payload);
  },

  register: (payload: RegisterRequestDTO): Promise<ApiResponse<AuthSessionDTO>> => {
    return axiosClient.post('/auth/register', payload);
  },

  logout: (): Promise<ApiResponse<null>> => {
    return axiosClient.post('/auth/logout');
  },

  me: (signal?: AbortSignal): Promise<ApiResponse<AuthSessionDTO>> => {
    return axiosClient.get('/auth/me', { signal });
  },

  forgotPassword: (payload: ForgotPasswordRequestDTO): Promise<ApiResponse<null>> => {
    return axiosClient.post('/auth/forgot-password', payload);
  },

  resetPassword: (payload: ResetPasswordRequestDTO): Promise<ApiResponse<null>> => {
    return axiosClient.post('/auth/reset-password', payload);
  },

  resendEmailVerification: (): Promise<ApiResponse<null>> => {
    return axiosClient.post('/auth/email/verification-notification');
  },
};
