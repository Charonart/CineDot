'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { AdminUser, AdminRole, PermissionSlug } from '../types/admin.types';
import { clearAllAuthSession, getStoredAuthToken } from '@/shared/utils/authStorage';

interface AdminAuthState {
  adminUser: AdminUser | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // Session Actions
  setSession: (adminUser: AdminUser, permissions: string[], token: string) => void;
  clearSession: () => void;
  initAdminStore: () => void;

  // RBAC Helper Methods
  hasPermission: (permission: PermissionSlug | string) => boolean;
  hasAnyPermission: (permissions: (PermissionSlug | string)[]) => boolean;
  hasRole: (roles: AdminRole | AdminRole[]) => boolean;
  canManageCinema: (cinemaId: string | number | null | undefined) => boolean;
}

const LOCAL_KEY_ADMIN_USER = 'cinedot_admin_user';
const LOCAL_KEY_ADMIN_PERMS = 'cinedot_admin_permissions';
const COOKIE_KEY_TOKEN = 'cine_token';

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  adminUser: null,
  permissions: [],
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  initAdminStore: () => {
    if (typeof window === 'undefined') return;

    const token = getStoredAuthToken();

    let adminUser: AdminUser | null = null;
    let permissions: string[] = [];

    try {
      const storedUser = localStorage.getItem(LOCAL_KEY_ADMIN_USER);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Xác thực vai trò: Bắt buộc phải là một trong các vai trò quản trị / nhân sự hợp lệ
        const validRoles = [
          'SUPER_ADMIN',
          'CINEMA_MANAGER',
          'TICKET_STAFF',
          'FNB_STAFF',
          'MARKETING',
          'ACCOUNTANT',
          'STAFF',
        ];
        if (parsed && validRoles.includes(parsed.role)) {
          adminUser = parsed;
        } else {
          // Tài khoản không có vai trò quản trị -> Xóa bỏ
          adminUser = null;
          localStorage.removeItem(LOCAL_KEY_ADMIN_USER);
        }
      }
    } catch {
      adminUser = null;
    }

    try {
      const storedPerms = localStorage.getItem(LOCAL_KEY_ADMIN_PERMS);
      if (storedPerms) {
        permissions = JSON.parse(storedPerms);
      }
    } catch {
      permissions = [];
    }

    set({
      token: token || null,
      adminUser,
      permissions: permissions.length > 0 ? permissions : adminUser?.permissions || [],
      isAuthenticated: Boolean(token && adminUser),
      isInitialized: true,
    });
  },

  setSession: (adminUser: AdminUser, permissions: string[], token: string) => {
    if (typeof window !== 'undefined') {
      if (token) {
        Cookies.set('cine_token', token, { expires: 7, path: '/' });
        Cookies.set('cinedot_token', token, { expires: 7, path: '/' });
        Cookies.set('cinedot_admin_token', token, { expires: 7, path: '/' });
        localStorage.setItem('cinedot_admin_token', token);
        localStorage.setItem('cinedot_token', token);
        localStorage.setItem('cine_token', token);
      }
      localStorage.setItem(LOCAL_KEY_ADMIN_USER, JSON.stringify(adminUser));
      localStorage.setItem(LOCAL_KEY_ADMIN_PERMS, JSON.stringify(permissions));
    }

    set({
      adminUser,
      permissions,
      token,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  clearSession: () => {
    clearAllAuthSession();

    set({
      adminUser: null,
      permissions: [],
      token: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  /**
   * Kiểm tra quyền hạn chi tiết (hỗ trợ wildcard *)
   */
  hasPermission: (permission: PermissionSlug | string) => {
    const { permissions, adminUser } = get();

    if (!adminUser) return false;
    if (adminUser.role === 'SUPER_ADMIN') return true;
    if (permissions.includes('*')) return true;
    if (permissions.includes(permission)) return true;

    // Hỗ trợ kiểm tra nhóm wildcard (ví dụ: 'movies.*' match 'movies.view')
    const prefix = permission.split('.')[0] + '.*';
    if (permissions.includes(prefix)) return true;

    return false;
  },

  /**
   * Kiểm tra xem user có ít nhất một trong các quyền trong mảng hay không
   */
  hasAnyPermission: (permList: (PermissionSlug | string)[]) => {
    const { hasPermission } = get();
    return permList.some((p) => hasPermission(p));
  },

  /**
   * Kiểm tra vai trò của tài khoản
   */
  hasRole: (roles: AdminRole | AdminRole[]) => {
    const { adminUser } = get();
    if (!adminUser) return false;

    if (Array.isArray(roles)) {
      return roles.includes(adminUser.role);
    }
    return adminUser.role === roles;
  },

  /**
   * Kiểm tra xem user có quyền quản lý cụm rạp chỉ định hay không (Cinema Scoping)
   */
  canManageCinema: (cinemaId: string | number | null | undefined) => {
    const { adminUser } = get();
    if (!adminUser) return false;
    if (adminUser.role === 'SUPER_ADMIN') return true;
    if (!cinemaId) return true;

    return String(adminUser.cinemaId) === String(cinemaId);
  },
}));
