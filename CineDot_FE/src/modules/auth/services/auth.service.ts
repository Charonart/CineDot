import { authApi } from '../api/auth.api';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';
import { authMapper } from '../mappers/auth.mapper';
import { AuthSession } from '../types/auth.type';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from '../dto/auth.dto';
import { logger } from '@/lib/logger/logger';
import { ZodError } from 'zod';

export interface ServiceError extends Error {
  code?: string;
  errors?: Record<string, string[] | undefined>;
}

const normalizeAuthError = (error: unknown, defaultCode: string): never => {
  if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'REQUEST_CANCELED') {
    throw error;
  }
  
  const errObj = error as { code?: string; message?: string; errors?: Record<string, string[] | undefined> } | null;
  const code = errObj?.code || defaultCode;
  const message = errObj?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
  const errors = errObj?.errors;

  const err = new Error(message) as ServiceError;
  err.code = code;
  err.errors = errors;
  throw err;
};

export const authService = {
  ensureCsrfCookie: async (): Promise<void> => {
    try {
      await authApi.getCsrfCookie();
    } catch (error) {
      logger.error('[AuthService] ensureCsrfCookie failed:', error);
      const err = new Error('Không thể khởi tạo phiên làm việc bảo mật. Vui lòng tải lại trang.') as ServiceError;
      err.code = 'CSRF_TOKEN_MISMATCH';
      throw err;
    }
  },

  login: async (payload: LoginRequestDTO): Promise<AuthSession> => {
    try {
      await authService.ensureCsrfCookie();
      const validated = loginSchema.parse(payload);
      const response = await authApi.login(validated);
      if (response && response.success === false) throw response;
      return authMapper.toAuthSession(response.data);
    } catch (error) {
      logger.error('[AuthService] login failed:', error);
      if (error instanceof ZodError) {
        const err = new Error('Dữ liệu đăng nhập không hợp lệ.') as ServiceError;
        err.code = 'VALIDATION_ERROR';
        err.errors = error.flatten().fieldErrors;
        throw err;
      }
      return normalizeAuthError(error, 'FAILED_TO_LOGIN');
    }
  },

  register: async (payload: RegisterRequestDTO): Promise<AuthSession> => {
    try {
      await authService.ensureCsrfCookie();
      const validated = registerSchema.parse(payload);
      const response = await authApi.register(validated);
      if (response && response.success === false) throw response;
      return authMapper.toAuthSession(response.data);
    } catch (error) {
      logger.error('[AuthService] register failed:', error);
      if (error instanceof ZodError) {
        const err = new Error('Dữ liệu đăng ký không hợp lệ.') as ServiceError;
        err.code = 'VALIDATION_ERROR';
        err.errors = error.flatten().fieldErrors;
        throw err;
      }
      return normalizeAuthError(error, 'FAILED_TO_REGISTER');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const response = await authApi.logout();
      if (response && response.success === false) throw response;
    } catch (error) {
      logger.error('[AuthService] logout failed:', error);
      return normalizeAuthError(error, 'FAILED_TO_LOGOUT');
    }
  },

  getCurrentUser: async (signal?: AbortSignal): Promise<AuthSession> => {
    try {
      const response = await authApi.me(signal);
      if (response && response.success === false) throw response;
      return authMapper.toAuthSession(response.data);
    } catch (error) {
      return normalizeAuthError(error, 'FAILED_TO_LOAD_CURRENT_USER');
    }
  },

  forgotPassword: async (payload: ForgotPasswordRequestDTO): Promise<void> => {
    try {
      await authService.ensureCsrfCookie();
      const validated = forgotPasswordSchema.parse(payload);
      const response = await authApi.forgotPassword(validated);
      if (response && response.success === false) throw response;
    } catch (error) {
      logger.error('[AuthService] forgotPassword failed:', error);
      if (error instanceof ZodError) {
        const err = new Error('Email không hợp lệ.') as ServiceError;
        err.code = 'VALIDATION_ERROR';
        err.errors = error.flatten().fieldErrors;
        throw err;
      }
      return normalizeAuthError(error, 'FAILED_TO_SEND_PASSWORD_RESET');
    }
  },

  resetPassword: async (payload: ResetPasswordRequestDTO): Promise<void> => {
    try {
      await authService.ensureCsrfCookie();
      const validated = resetPasswordSchema.parse(payload);
      const response = await authApi.resetPassword(validated);
      if (response && response.success === false) throw response;
    } catch (error) {
      logger.error('[AuthService] resetPassword failed:', error);
      if (error instanceof ZodError) {
        const err = new Error('Dữ liệu khôi phục mật khẩu không hợp lệ.') as ServiceError;
        err.code = 'VALIDATION_ERROR';
        err.errors = error.flatten().fieldErrors;
        throw err;
      }
      return normalizeAuthError(error, 'FAILED_TO_RESET_PASSWORD');
    }
  },

  resendEmailVerification: async (): Promise<void> => {
    try {
      const response = await authApi.resendEmailVerification();
      if (response && response.success === false) throw response;
    } catch (error) {
      logger.error('[AuthService] resendEmailVerification failed:', error);
      return normalizeAuthError(error, 'FAILED_TO_SEND_VERIFICATION');
    }
  },
};
