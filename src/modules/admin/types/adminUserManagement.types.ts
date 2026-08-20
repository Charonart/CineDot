import {
  AdminUserDTO,
  RoleItemDTO,
  PermissionItemDTO,
  UserTierDTO,
} from '../dto/adminUserManagement.dto';

export type AdminUser = AdminUserDTO;
export type AdminRoleItem = RoleItemDTO;
export type AdminPermissionItem = PermissionItemDTO;
export type AdminUserTier = UserTierDTO;

export interface CustomerFilterParams {
  search?: string;
  email?: string;
  role?: string;
  gender?: 'male' | 'female' | 'other';
  province_id?: number | string;
  verified?: boolean | string;
  is_active?: boolean | string;
  created_from?: string;
  created_to?: string;
  sort_by?: 'created_at' | 'username' | 'point' | 'total_points' | 'last_login';
  sort_dir?: 'asc' | 'desc';
  filters?: Record<string, any>;
  page?: number;
  per_page?: number;
  [key: string]: any;
}

export interface UserManagementPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}
