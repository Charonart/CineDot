/**
 * Admin Staff & RBAC DTOs (Data Transfer Objects)
 * Matching Laravel Backend API specs for /api/v1/admin/users/* and /api/v1/admin/roles/*
 */

export interface AdminStaffItemDTO {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  role_name?: string;
  roleName?: string;
  cinema_id?: string | number | null;
  cinemaId?: string | number | null;
  cinema_name?: string | null;
  cinemaName?: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'active' | 'disabled';
  created_at: string;
  permissions?: string[];
}

export interface AdminStaffListRequestDTO {
  search?: string;
  role?: string;
  cinema_id?: string | number;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface CreateStaffRequestDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  cinema_id?: string | number | null;
  cinema_name?: string | null;
  phone?: string;
}

export interface UpdateStaffRequestDTO {
  name?: string;
  phone?: string;
  cinema_id?: string | number | null;
  cinema_name?: string | null;
}

export interface UpdateStaffRoleRequestDTO {
  role: string;
  cinema_id?: string | number | null;
  cinema_name?: string | null;
  permissions?: string[];
}

export interface RoleDefinitionDTO {
  id: string;
  name: string;
  description?: string;
  default_permissions: string[];
}
