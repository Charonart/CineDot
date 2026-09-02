export interface UserRoleDTO {
  id: string | number;
  user_id?: string | number;
  role_id: string | number;
  role_name?: string;
  scope_type: 'system' | 'region' | 'cinema';
  scope_id?: string | number | null;
  scope_name?: string;
  created_at?: string;
}

export interface AssignUserRoleRequestDTO {
  role_id: string | number;
  scope_type: 'system' | 'region' | 'cinema';
  scope_id?: string | number | null;
}

export interface AdminStaffItemDTO {
  id: string | number;
  name?: string;
  fullname?: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  role: string;
  roles?: string[];
  role_name?: string;
  roleName?: string;
  cinema_id?: string | number | null;
  cinemaId?: string | number | null;
  cinema_name?: string | null;
  cinemaName?: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'active' | 'disabled';
  created_at: string;
  permissions?: string[];
  user_roles?: UserRoleDTO[];
}

export interface AdminStaffListRequestDTO {
  search?: string;
  role?: string;
  cinema_id?: string | number;
  status?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  filters?: Record<string, any>;
  page?: number;
  per_page?: number;
  [key: string]: any;
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
  default_permissions?: string[];
  permissions_count?: number;
  permission_ids?: number[];
  permission_names?: string[];
}
