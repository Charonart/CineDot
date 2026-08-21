import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';
import {
  AdminLoginRequestDTO,
  AdminAuthResponseDTO,
  AdminMeResponseDTO,
} from '../dto/adminAuth.dto';
import { adminAuthMapper } from '../mappers/adminAuth.mapper';
import { AdminUser } from '../types/admin.types';

export interface AdminAuthResult {
  token: string;
  adminUser: AdminUser;
  permissions: string[];
}

export const adminAuthService = {
  /**
   * Khởi tạo CSRF cookie cho Laravel Sanctum
   */
  async ensureCsrf(): Promise<void> {
    try {
      await apiClient.get(ENDPOINTS.AUTH.CSRF_COOKIE);
    } catch {
      // Bỏ qua nếu backend dùng Token-based thuần
    }
  },

  /**
   * Đăng nhập tài khoản Quản trị / Nhân sự
   */
  async login(payload: AdminLoginRequestDTO): Promise<AdminAuthResult> {
    await this.ensureCsrf();
    const res = await apiClient.post<ApiResponse<AdminAuthResponseDTO>>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );

    const responseData = res.data?.data;
    const token = responseData?.token || '';
    const userDto = responseData?.user;
    const permissions = responseData?.permissions || [];

    const adminUser = adminAuthMapper.toDomain(userDto, permissions);
    if (!adminUser) {
      throw new Error('Tài khoản của bạn không có quyền truy cập vào Cổng Quản Trị.');
    }

    return {
      token,
      adminUser,
      permissions,
    };
  },

  /**
   * Lấy thông tin tài khoản hiện tại & quyền hạn (Session Rehydration)
   */
  async me(): Promise<{ adminUser: AdminUser; permissions: string[] }> {
    const res = await apiClient.get<ApiResponse<AdminMeResponseDTO>>(ENDPOINTS.AUTH.ME);
    const responseData = res.data?.data;
    const userDto = responseData?.user;
    const permissions = responseData?.permissions || [];

    const adminUser = adminAuthMapper.toDomain(userDto, permissions);
    if (!adminUser) {
      throw new Error('Tài khoản hiện tại không có quyền hạn Quản trị viên.');
    }

    return {
      adminUser,
      permissions,
    };
  },

  /**
   * Đăng xuất và thu hồi Sanctum token trên máy chủ
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Log lỗi nhưng không chặn luồng đăng xuất phía client
    }
  },
};
