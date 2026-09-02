import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  AdminUserDTO,
  UserStatsDTO,
  UserDetailResponseDTO,
  CreateUserPayload,
  UpdateUserPayload,
  AdjustPointsPayload,
  RoleItemDTO,
  CreateRolePayload,
  UpdateRolePayload,
  PermissionsListResponseDTO,
  UserTierDTO,
  CreateUserTierPayload,
  UpdateUserTierPayload,
} from '../dto/adminUserManagement.dto';
import { CustomerFilterParams } from '../types/adminUserManagement.types';

export interface PaginatedUsersResponse {
  data: AdminUserDTO[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const adminUserManagementService = {
  // ── 1. Users & Customers ──
  async getUsers(params?: CustomerFilterParams): Promise<PaginatedUsersResponse> {
    const res = await apiClient.get<{ success: boolean; data: AdminUserDTO[]; meta: any }>(
      ENDPOINTS.ADMIN.USERS,
      { params }
    );
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  async getUserStats(): Promise<UserStatsDTO> {
    const res = await apiClient.get<{ success: boolean; data: UserStatsDTO }>(
      ENDPOINTS.ADMIN.USERS_STATS
    );
    return res.data.data;
  },

  async getUserDetail(id: number | string): Promise<UserDetailResponseDTO> {
    const res = await apiClient.get<{ success: boolean; data: UserDetailResponseDTO }>(
      ENDPOINTS.ADMIN.USER_DETAIL(id)
    );
    return res.data.data;
  },

  async createUser(payload: CreateUserPayload): Promise<AdminUserDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: AdminUserDTO }>(
      ENDPOINTS.ADMIN.USERS,
      payload
    );
    return res.data.data;
  },

  async updateUser(id: number | string, payload: UpdateUserPayload): Promise<AdminUserDTO> {
    const res = await apiClient.put<{ success: boolean; message: string; data: AdminUserDTO }>(
      ENDPOINTS.ADMIN.USER_DETAIL(id),
      payload
    );
    return res.data.data;
  },

  async toggleUserStatus(id: number | string): Promise<AdminUserDTO> {
    const res = await apiClient.patch<{ success: boolean; message: string; data: AdminUserDTO }>(
      ENDPOINTS.ADMIN.USER_TOGGLE_STATUS(id)
    );
    return res.data.data;
  },

  async adjustUserPoints(id: number | string, payload: AdjustPointsPayload): Promise<AdminUserDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: AdminUserDTO }>(
      ENDPOINTS.ADMIN.USER_ADJUST_POINTS(id),
      payload
    );
    return res.data.data;
  },

  async deleteUser(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.USER_DETAIL(id)
    );
    return res.data;
  },

  async updateCell(id: number | string, field: string, value: any): Promise<AdminUserDTO> {
    const res = await apiClient.patch<{ success: boolean; message: string; data: AdminUserDTO }>(
      `/api/v1/admin/users/${id}/cell`,
      { field, value }
    );
    return res.data.data;
  },

  async bulkAction(
    action: 'delete' | 'toggle_active' | 'set_active' | 'set_inactive' | 'adjust_points',
    ids: (string | number)[],
    payload?: any
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      '/api/v1/admin/users/bulk',
      { action, ids, payload }
    );
    return res.data;
  },

  // ── 2. Roles & Permissions ──
  async getRoles(): Promise<RoleItemDTO[]> {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.ROLES);
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : [];
  },

  async getRoleDetail(id: number | string): Promise<RoleItemDTO & { permissions: any[] }> {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.ROLE_DETAIL(id));
    return res.data?.data ?? res.data;
  },

  async createRole(payload: CreateRolePayload): Promise<RoleItemDTO> {
    const res = await apiClient.post<any>(ENDPOINTS.ADMIN.ROLES, payload);
    return res.data?.data ?? res.data;
  },

  async updateRole(id: number | string, payload: UpdateRolePayload): Promise<RoleItemDTO> {
    const res = await apiClient.put<any>(ENDPOINTS.ADMIN.ROLE_DETAIL(id), payload);
    return res.data?.data ?? res.data;
  },

  async syncRolePermissions(id: number | string, permissionIds: number[]): Promise<any> {
    const res = await apiClient.put<any>(ENDPOINTS.ADMIN.ROLE_PERMISSIONS(id), {
      permission_ids: permissionIds,
    });
    return res.data?.data ?? res.data;
  },

  async deleteRole(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.ROLE_DETAIL(id)
    );
    return res.data;
  },

  async getPermissions(): Promise<PermissionsListResponseDTO> {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.PERMISSIONS);
    const d = res.data?.data ?? res.data;
    return {
      list: Array.isArray(d?.list) ? d.list : Array.isArray(d) ? d : [],
      grouped: d?.grouped && typeof d.grouped === 'object' ? d.grouped : {},
    };
  },

  // ── 3. User Tiers ──
  async getUserTiers(): Promise<UserTierDTO[]> {
    const res = await apiClient.get<{ success: boolean; data: UserTierDTO[] }>(
      ENDPOINTS.ADMIN.USER_TIERS
    );
    return res.data.data;
  },

  async createUserTier(payload: CreateUserTierPayload): Promise<UserTierDTO> {
    const res = await apiClient.post<{ success: boolean; message: string; data: UserTierDTO }>(
      ENDPOINTS.ADMIN.USER_TIERS,
      payload
    );
    return res.data.data;
  },

  async updateUserTier(id: number | string, payload: UpdateUserTierPayload): Promise<UserTierDTO> {
    const res = await apiClient.put<{ success: boolean; message: string; data: UserTierDTO }>(
      ENDPOINTS.ADMIN.USER_TIER_DETAIL(id),
      payload
    );
    return res.data.data;
  },

  async deleteUserTier(id: number | string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.USER_TIER_DETAIL(id)
    );
    return res.data;
  },
};
