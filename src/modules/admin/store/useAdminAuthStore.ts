'use client';

import { create } from 'zustand';
import { AdminUser, AdminRole } from '../types/admin.types';
import { INITIAL_ADMIN_USERS } from '../mocks/mockAdminData';

export interface AdminUserRecord extends AdminUser {
  passwordHash: string;
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  adminUsersList: AdminUserRecord[];
  
  // Actions
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  addStaffAccount: (data: {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
    cinemaName?: string;
    phone?: string;
  }) => { success: boolean; error?: string };
  initAdminStore: () => void;
}

const LOCAL_KEY_ADMIN_USERS = 'cinedot_admin_users';
const LOCAL_KEY_CURRENT_ADMIN = 'cinedot_current_admin';

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  adminUser: null,
  isAuthenticated: false,
  isInitialized: false,
  adminUsersList: [],

  initAdminStore: () => {
    if (typeof window === 'undefined') return;

    // Load or initialize admin users list
    let list: AdminUserRecord[] = [];
    try {
      const storedList = localStorage.getItem(LOCAL_KEY_ADMIN_USERS);
      if (storedList) {
        list = JSON.parse(storedList);
      } else {
        list = INITIAL_ADMIN_USERS;
        localStorage.setItem(LOCAL_KEY_ADMIN_USERS, JSON.stringify(list));
      }
    } catch {
      list = INITIAL_ADMIN_USERS;
    }

    // Load current active admin session
    let current: AdminUser | null = null;
    try {
      const storedCurrent = localStorage.getItem(LOCAL_KEY_CURRENT_ADMIN);
      if (storedCurrent) {
        current = JSON.parse(storedCurrent);
      }
    } catch {
      current = null;
    }

    set({
      adminUsersList: list,
      adminUser: current,
      isAuthenticated: !!current,
      isInitialized: true,
    });
  },

  loginAdmin: (email: string, pass: string) => {
    const { adminUsersList } = get();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Find user account by email
    const foundRecord = adminUsersList.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!foundRecord) {
      return { success: false, error: 'Email hoặc Mật khẩu quản trị không chính xác!' };
    }

    // 2. Strict Password match check
    if (foundRecord.passwordHash !== cleanPass) {
      return { success: false, error: 'Mật khẩu quản trị không chính xác!' };
    }

    if (foundRecord.status === 'DISABLED') {
      return { success: false, error: 'Tài khoản nhân sự này hiện đã bị tạm khóa!' };
    }

    // Prepare clean User object without passwordHash
    const userSession: AdminUser = {
      id: foundRecord.id,
      email: foundRecord.email,
      name: foundRecord.name,
      role: foundRecord.role,
      roleName: foundRecord.roleName,
      cinemaName: foundRecord.cinemaName,
      phone: foundRecord.phone,
      createdAt: foundRecord.createdAt,
      status: foundRecord.status,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_KEY_CURRENT_ADMIN, JSON.stringify(userSession));
    }

    set({
      adminUser: userSession,
      isAuthenticated: true,
    });

    return { success: true };
  },

  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_KEY_CURRENT_ADMIN);
    }
    set({
      adminUser: null,
      isAuthenticated: false,
    });
  },

  addStaffAccount: (data) => {
    const { adminUsersList } = get();
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate email
    const exists = adminUsersList.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Email nhân sự này đã tồn tại trên hệ thống!' };
    }

    const roleNameMap: Record<AdminRole, string> = {
      SUPER_ADMIN: 'Tổng Quản Trị Hệ Thống',
      CINEMA_MANAGER: 'Quản Lý Cụm Rạp',
      TICKET_STAFF: 'Nhân Viên Soát Vé Cổng',
    };

    const newRecord: AdminUserRecord = {
      id: 'adm-' + Date.now().toString().slice(-4),
      email: cleanEmail,
      passwordHash: data.password.trim(),
      name: data.name.trim(),
      role: data.role,
      roleName: roleNameMap[data.role] || 'Nhân Viên',
      cinemaName: data.cinemaName || 'Toàn Bộ Cụm Rạp',
      phone: data.phone || 'Chưa cập nhật',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      status: 'ACTIVE',
    };

    const updatedList = [...adminUsersList, newRecord];

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_KEY_ADMIN_USERS, JSON.stringify(updatedList));
    }

    set({ adminUsersList: updatedList });

    return { success: true };
  },
}));
