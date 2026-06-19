export type UserRoleDTO = 'customer' | 'staff' | 'admin';

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  emailVerifiedAt?: string | null;
  roles: UserRoleDTO[];
  permissions: string[];
}

export interface AuthSessionDTO {
  user: AuthUserDTO;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
