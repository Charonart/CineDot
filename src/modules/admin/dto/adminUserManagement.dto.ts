/**
 * DTOs for Users, Customers, Roles, Permissions and User Tiers
 */

export interface AdminUserDTO {
  id: number;
  user_id: number;
  username: string;
  email: string;
  fullname?: string | null;
  avatar?: string | null;
  role: string;
  role_id: number;
  phone?: string | null;
  gender?: string | null;
  birthday?: string | null;
  point: number;
  total_points: number;
  is_active: boolean;
  user_tier?: string;
  discount_percent?: number;
  province?: string | null;
  province_id?: number | null;
  email_verified: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface UserStatsDTO {
  total_users: number;
  total_customers: number;
  total_staff: number;
  verified_users: number;
  active_users: number;
  total_points: number;
}

export interface UserBookingSummaryDTO {
  booking_id: number;
  booking_code: string;
  movie_title: string;
  cinema_name: string;
  room_name: string;
  show_time?: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface UserContextRoleDTO {
  id: number;
  role_id: number;
  role_name: string;
  scope_type: 'system' | 'region' | 'cinema';
  scope_id?: number | null;
  scope_name: string;
}

export interface UserDetailResponseDTO {
  user: AdminUserDTO;
  total_spent: number;
  paid_bookings_count: number;
  recent_bookings: UserBookingSummaryDTO[];
  context_roles: UserContextRoleDTO[];
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  fullname?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  province_id?: number;
  role_id?: number;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  fullname?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  province_id?: number;
  password?: string;
  role_id?: number;
  is_active?: boolean;
}

export interface AdjustPointsPayload {
  points: number;
  reason?: string;
}

// ── Roles & Permissions DTOs ──
export interface RoleItemDTO {
  id: number;
  role_id: number;
  name: string;
  description?: string | null;
  users_count: number;
  permissions_count: number;
  permission_ids: number[];
  permission_names?: string[];
  is_system: boolean;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permission_ids?: number[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permission_ids?: number[];
}

export interface PermissionItemDTO {
  id: number;
  permission_id: number;
  name: string;
  description: string;
}

export interface PermissionsListResponseDTO {
  list: PermissionItemDTO[];
  grouped: Record<string, PermissionItemDTO[]>;
}

// ── User Tiers DTOs ──
export interface UserTierDTO {
  id: number;
  user_tier_id: number;
  tier: string;
  name: string;
  min_points: number;
  discount_percent: number;
  members_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserTierPayload {
  tier: string;
  min_points: number;
  discount_percent: number;
}

export interface UpdateUserTierPayload {
  tier?: string;
  min_points?: number;
  discount_percent?: number;
}
