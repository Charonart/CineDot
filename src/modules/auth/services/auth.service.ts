import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';

export interface UserAuthData {
  user_id: number;
  id?: string | number;
  username?: string;
  fullname: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  total_points?: number;
  user_tier?: string;
  role_name?: string;
  province?: string;
  birthday?: string;
  gender?: string;
}

export interface AuthResponseData {
  user: UserAuthData;
  token: string;
  permissions?: string[];
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  /**
   * Fetch CSRF cookie to ensure stateful Sanctum requests work
   */
  async ensureCsrf(): Promise<void> {
    try {
      await apiClient.get(ENDPOINTS.AUTH.CSRF_COOKIE);
    } catch {
      // Ignore errors, maybe the backend isn't stateful or the route is not defined
    }
  },

  /**
   * Đăng ký tài khoản khách hàng mới
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    await this.ensureCsrf();
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return response.data;
  },

  /**
   * Đăng nhập hệ thống & lấy Token + Permissions
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    await this.ensureCsrf();
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return response.data;
  },

  /**
   * Lấy thông tin user hiện tại (Me)
   */
  async me(): Promise<ApiResponse<{ user: UserAuthData; permissions: string[] }>> {
    const response = await apiClient.get<ApiResponse<{ user: UserAuthData; permissions: string[] }>>(
      ENDPOINTS.AUTH.ME
    );
    return response.data;
  },

  /**
   * Đăng xuất & thu hồi Sanctum token
   */
  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Gửi OTP khôi phục mật khẩu qua Email
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    await this.ensureCsrf();
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  /**
   * Xác thực OTP và đặt lại mật khẩu mới
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    await this.ensureCsrf();
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      payload
    );
    return response.data;
  },

  /**
   * Gửi lại email xác thực tài khoản
   */
  async resendVerificationEmail(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.RESEND_VERIFICATION
    );
    return response.data;
  },
};
