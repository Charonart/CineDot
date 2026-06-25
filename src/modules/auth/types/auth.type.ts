export type UserRole = 'customer' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
