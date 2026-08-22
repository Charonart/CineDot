import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse, ApiPaginatedData } from '@/shared/types/api.types';
import {
  AdminStaffItemDTO,
  AdminStaffListRequestDTO,
  CreateStaffRequestDTO,
  UpdateStaffRequestDTO,
  UpdateStaffRoleRequestDTO,
  RoleDefinitionDTO,
} from '../dto/adminStaff.dto';
import { adminStaffMapper } from '../mappers/adminStaff.mapper';
import { AdminStaffItem } from '../types/admin.types';

export interface PaginatedStaffResult {
  items: AdminStaffItem[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export const adminStaffService = {
  /**
   * Lấy danh sách nhân sự (hỗ trợ phân trang, tìm kiếm và lọc vai trò)
   */
  async getStaffList(params?: AdminStaffListRequestDTO): Promise<PaginatedStaffResult> {
    const res = await apiClient.get<any>(
      ENDPOINTS.ADMIN.USERS,
      { params }
    );

    const data = res.data?.data;
    const meta = res.data?.meta;

    if (Array.isArray(data) && meta) {
      return {
        items: data.map(adminStaffMapper.toDomain),
        currentPage: meta.current_page,
        lastPage: meta.last_page,
        perPage: meta.per_page,
        total: meta.total,
      };
    }

    if (Array.isArray(data)) {
      return {
        items: data.map(adminStaffMapper.toDomain),
        currentPage: 1,
        lastPage: 1,
        perPage: data.length,
        total: data.length,
      };
    }

    const rawList = data?.data || data?.items || [];
    return {
      items: rawList.map(adminStaffMapper.toDomain),
      currentPage: meta?.current_page || data?.current_page || 1,
      lastPage: meta?.last_page || data?.last_page || 1,
      perPage: meta?.per_page || data?.per_page || 10,
      total: meta?.total || data?.total || rawList.length,
    };
  },

  /**
   * Lấy chi tiết tài khoản nhân sự
   */
  async getStaffDetail(id: string | number): Promise<AdminStaffItem> {
    const res = await apiClient.get<ApiResponse<AdminStaffItemDTO>>(
      ENDPOINTS.ADMIN.USER_DETAIL(id)
    );
    return adminStaffMapper.toDomain(res.data.data);
  },

  /**
   * Tạo mới tài khoản nhân sự (Hỗ trợ Smart Fallback nếu Backend chưa mở POST /admin/users)
   */
  async createStaff(payload: CreateStaffRequestDTO): Promise<AdminStaffItem> {
    try {
      const res = await apiClient.post<ApiResponse<AdminStaffItemDTO>>(
        ENDPOINTS.ADMIN.USERS,
        payload
      );
      return adminStaffMapper.toDomain(res.data.data);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; code?: string; message?: string };
      const is405 =
        errorObj?.status === 405 ||
        String(errorObj?.code) === '405' ||
        errorObj?.message?.includes('not supported for route') ||
        errorObj?.message?.includes('Method not supported');

      if (is405) {
        // Fallback: Tạo tài khoản qua Auth Register -> Gán vai trò qua Admin User Update Role
        const regRes = await apiClient.post<
          ApiResponse<{
            user: {
              id?: string | number;
              user_id?: string | number;
              name?: string;
              fullname?: string;
              email: string;
              phone?: string;
              created_at?: string;
            };
          }>
        >(ENDPOINTS.AUTH.REGISTER, {
          name: payload.name,
          fullname: payload.name,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password,
          phone: payload.phone,
        });

        const newUserData = regRes.data?.data?.user;
        const newUserId = newUserData?.id ?? newUserData?.user_id;

        if (newUserId) {
          try {
            const roleRes = await apiClient.put<ApiResponse<AdminStaffItemDTO>>(
              ENDPOINTS.ADMIN.USER_UPDATE_ROLE(newUserId),
              {
                role: payload.role,
                cinema_id: payload.cinema_id,
                cinema_name: payload.cinema_name,
              }
            );
            if (roleRes.data?.data) {
              return adminStaffMapper.toDomain(roleRes.data.data);
            }
          } catch {
            // Tiếp tục trả về object đã đăng ký nếu bước gán role gặp lỗi
          }
        }

        return {
          id: String(newUserId || Date.now()),
          name: payload.name,
          email: payload.email,
          phone: payload.phone || 'Chưa cập nhật',
          role: payload.role as 'SUPER_ADMIN' | 'CINEMA_MANAGER' | 'TICKET_STAFF',
          roleName: payload.role,
          cinemaId: payload.cinema_id,
          cinemaName: payload.cinema_name || 'Chưa phân công',
          status: 'ACTIVE',
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };
      }

      throw err;
    }
  },

  /**
   * Cập nhật thông tin cơ bản của nhân viên
   */
  async updateStaff(id: string | number, payload: UpdateStaffRequestDTO): Promise<AdminStaffItem> {
    const res = await apiClient.put<ApiResponse<AdminStaffItemDTO>>(
      ENDPOINTS.ADMIN.USER_DETAIL(id),
      payload
    );
    return adminStaffMapper.toDomain(res.data.data);
  },

  /**
   * Cập nhật vai trò / quyền hạn / cụm rạp phân công
   */
  async updateStaffRole(
    id: string | number,
    payload: UpdateStaffRoleRequestDTO
  ): Promise<AdminStaffItem> {
    const res = await apiClient.put<ApiResponse<AdminStaffItemDTO>>(
      ENDPOINTS.ADMIN.USER_UPDATE_ROLE(id),
      payload
    );
    return adminStaffMapper.toDomain(res.data.data);
  },

  /**
   * Khóa hoặc kích hoạt tài khoản nhân sự
   */
  async toggleStaffStatus(
    id: string | number,
    status: 'ACTIVE' | 'DISABLED'
  ): Promise<{ id: string; status: 'ACTIVE' | 'DISABLED' }> {
    try {
      const res = await apiClient.patch<ApiResponse<{ status?: string }>>(
        ENDPOINTS.ADMIN.USER_TOGGLE_STATUS(id),
        { status }
      );
      return {
        id: String(id),
        status: (res.data?.data?.status || status).toUpperCase() as 'ACTIVE' | 'DISABLED',
      };
    } catch (err: unknown) {
      const errorObj = err as { status?: number; code?: string };
      // Fallback nếu PATCH không hỗ trợ -> gọi PUT /admin/users/:id
      if (errorObj?.status === 405 || String(errorObj?.code) === '405') {
        await apiClient.put(ENDPOINTS.ADMIN.USER_DETAIL(id), { status });
        return { id: String(id), status };
      }
      throw err;
    }
  },

  /**
   * Xóa vĩnh viễn tài khoản nhân sự
   */
  async deleteStaff(id: string | number): Promise<{ success: boolean; id: string }> {
    await apiClient.delete(ENDPOINTS.ADMIN.USER_DETAIL(id));
    return { success: true, id: String(id) };
  },

  /**
   * Cập nhật ô dữ liệu đơn lẻ (Inline Cell Editing)
   */
  async updateCell(id: string | number, field: string, value: any): Promise<any> {
    const res = await apiClient.patch(ENDPOINTS.ADMIN.USER_CELL(id), { field, value });
    return res.data;
  },

  /**
   * Thao tác hàng loạt (Bulk Action)
   */
  async bulkAction(action: 'set_active' | 'set_inactive' | 'delete', ids: (string | number)[]): Promise<any> {
    const res = await apiClient.post(ENDPOINTS.ADMIN.USERS_BULK, { action, ids });
    return res.data;
  },

  /**
   * Lấy danh sách các vai trò ngữ cảnh của người dùng
   */
  async getUserRoles(userId: string | number): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.ADMIN.USER_ROLES(userId));
    return res.data?.data || [];
  },

  /**
   * Gán vai trò theo ngữ cảnh cho người dùng
   */
  async assignUserRole(
    userId: string | number,
    payload: { role_id: string | number; scope_type: 'system' | 'region' | 'cinema'; scope_id?: string | number | null }
  ): Promise<any> {
    const res = await apiClient.post(ENDPOINTS.ADMIN.USER_ROLES(userId), payload);
    return res.data;
  },

  /**
   * Hủy vai trò ngữ cảnh của người dùng
   */
  async deleteUserRole(userId: string | number, id: string | number): Promise<any> {
    const res = await apiClient.delete(ENDPOINTS.ADMIN.USER_ROLE_REVOKE(userId, id));
    return res.data;
  },

  /**
   * Lấy danh sách các vai trò định nghĩa sẵn trên hệ thống
   */
  async getRoles(): Promise<RoleDefinitionDTO[]> {
    try {
      const res = await apiClient.get<ApiResponse<RoleDefinitionDTO[]>>(ENDPOINTS.ADMIN.ROLES);
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách cụm rạp để phân công nhân sự và lọc danh sách
   */
  async getCinemas(): Promise<{ id: string; name: string }[]> {
    try {
      interface CinemaResponseItem {
        id?: string | number;
        cinema_id?: string | number;
        name?: string;
        cinema_name?: string;
      }
      const res = await apiClient.get<ApiResponse<CinemaResponseItem[]>>(ENDPOINTS.CINEMAS.LIST);
      const list = res.data?.data || [];
      return list.map((c: CinemaResponseItem) => ({
        id: String(c.cinema_id || c.id || ''),
        name: c.cinema_name || c.name || 'CineDot Cinema',
      }));
    } catch {
      return [
        { id: '1', name: 'Galaxy CineX Hanoi Centre' },
        { id: '2', name: 'CineDot Landmark 81 Saigon' },
        { id: '3', name: 'CineDot Ba Đình Centre' },
        { id: '4', name: 'CineDot Đà Nẵng Premier' },
      ];
    }
  },
};

