/**
 * Admin Auth DTOs (Data Transfer Objects)
 * Matching Laravel Backend API specs for /api/v1/auth/*
 */

export interface AdminLoginRequestDTO {
  email: string;
  password?: string;
}

export interface AdminUserDTO {
  id: string | number;
  user_id?: string | number;
  name?: string;
  fullname?: string;
  email: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  role?: string;
  role_id?: string | number;
  role_name?: string;
  roleName?: string;
  cinema_id?: string | number | null;
  cinemaId?: string | number | null;
  cinema_name?: string | null;
  cinemaName?: string | null;
  permissions?: string[];
  status?: 'ACTIVE' | 'DISABLED' | 'active' | 'disabled';
  created_at?: string;
  createdAt?: string;
}

export interface AdminAuthResponseDTO {
  token: string;
  user: AdminUserDTO;
  permissions?: string[];
}

export interface AdminMeResponseDTO {
  user: AdminUserDTO;
  permissions?: string[];
}
