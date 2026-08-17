export interface User {
  id?: number | string;
  user_id?: number | string;
  email: string;
  username?: string;
  name?: string;
  fullname?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  total_points?: number;
  user_tier?: string;
  role_id?: number | string;
  role_name?: string;
  birthday?: string;
  gender?: string;
  province?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  permissions?: string[];
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
  username?: string;
  password_confirmation?: string;
}
