export interface User {
  id: number | string;
  email: string;
  username: string;
  name?: string;
  avatar_url?: string;
  role_id?: number | string;
  role_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  permissions: string[]; // Mảng mảng quyền: ['view booking', 'refund ticket', ...]
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password?: string;
  password_confirmation?: string;
}
