import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '../types/auth.types';
import { authService, ResetPasswordPayload } from '@/modules/auth/services/auth.service';
import { clearAllAuthSession } from '../utils/authStorage';

export type AuthModalTab = 'login' | 'register' | 'forgot';

export interface AuthActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

interface AuthState {
  user: User | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Modal Popup states
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  authNotice: string;
  postLoginRedirectUrl: string | null;

  setAuth: (user: User, permissions: string[], token: string) => void;
  login: (emailOrPhone: string, pass: string) => Promise<AuthActionResult>;
  register: (data: { name: string; email: string; phone?: string; pass: string }) => Promise<AuthActionResult>;
  forgotPassword: (email: string) => Promise<AuthActionResult>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;

  // Modal actions
  openAuthModal: (tab?: AuthModalTab, notice?: string, redirectUrl?: string) => void;
  closeAuthModal: () => void;
  loginDemo: () => void;
}

const MOCK_DEMO_USER: User = {
  id: 1,
  user_id: 1,
  username: 'admin',
  email: 'admin@cinedot.com',
  name: 'Quản Trị Viên',
  fullname: 'Quản Trị Viên',
  role_name: 'admin',
  total_points: 1000,
  user_tier: 'Diamond',
};

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, permissions: [] };
  }
  const token =
    Cookies.get('cine_token') ||
    Cookies.get('cinedot_token') ||
    localStorage.getItem('cinedot_token') ||
    localStorage.getItem('cine_token');
  const storedUser = localStorage.getItem('cinedot_current_user');
  const storedPerms = localStorage.getItem('cinedot_permissions');
  
  let user: User | null = null;
  let permissions: string[] = [];
  
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }
  
  if (storedPerms) {
    try {
      permissions = JSON.parse(storedPerms);
    } catch {
      permissions = [];
    }
  }
  
  return { token: token || null, user, permissions };
};

export const useAuthStore = create<AuthState>((set, get) => {
  const { token: initialToken, user: initialUser, permissions: initialPermissions } = getInitialState();

  return {
    user: initialUser,
    permissions: initialPermissions,
    token: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),
    isLoading: false,

    isAuthModalOpen: false,
    authModalTab: 'login',
    authNotice: '',
    postLoginRedirectUrl: null,

    setAuth: (user, permissions, token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cinedot_token', token);
        localStorage.setItem('cine_token', token);
        localStorage.setItem('cinedot_current_user', JSON.stringify(user));
        localStorage.setItem('cinedot_permissions', JSON.stringify(permissions));
        Cookies.set('cinedot_token', token, { expires: 7, path: '/' });
        Cookies.set('cine_token', token, { expires: 7, path: '/' });
      }
      set({ user, permissions, token, isAuthenticated: true });
    },

    login: async (emailOrPhone, pass) => {
      set({ isLoading: true });
      try {
        const res = await authService.login({
          email: emailOrPhone.trim(),
          password: pass.trim(),
        });

        if (res.success && res.data) {
          const u = res.data.user;
          const userObj: User = {
            id: u.user_id,
            user_id: u.user_id,
            username: u.username,
            email: u.email,
            fullname: u.fullname,
            name: u.fullname,
            phone: u.phone,
            avatar: u.avatar,
            total_points: u.total_points || 0,
            user_tier: u.user_tier || 'Bronze',
            role_name: u.role_name || 'CUSTOMER',
          };
          get().setAuth(userObj, res.data.permissions || [], res.data.token);
          set({ isLoading: false, isAuthModalOpen: false });
          return { success: true, message: res.message || 'Đăng nhập thành công' };
        }
      } catch (err: any) {
        set({ isLoading: false });
        return {
          success: false,
          message: err?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
          errors: err?.errors,
        };
      }
      set({ isLoading: false });
      return { success: false, message: 'Đăng nhập không thành công.' };
    },

    register: async ({ name, email, phone, pass }) => {
      set({ isLoading: true });
      try {
        const res = await authService.register({
          fullname: name.trim(),
          email: email.trim().toLowerCase(),
          password: pass.trim(),
          phone: phone ? phone.trim() : undefined,
        });

        if (res.success && res.data) {
          const u = res.data.user;
          const userObj: User = {
            id: u.user_id,
            user_id: u.user_id,
            username: u.username,
            email: u.email,
            fullname: u.fullname,
            name: u.fullname,
            phone: u.phone,
            avatar: u.avatar,
            total_points: u.total_points || 0,
            user_tier: u.user_tier || 'Bronze',
            role_name: u.role_name || 'CUSTOMER',
          };
          get().setAuth(userObj, res.data.permissions || [], res.data.token);
          set({ isLoading: false, isAuthModalOpen: false });
          return { success: true, message: res.message || 'Đăng ký tài khoản thành công' };
        }
      } catch (err: any) {
        set({ isLoading: false });
        return {
          success: false,
          message: err?.message || 'Đăng ký không thành công. Vui lòng thử lại.',
          errors: err?.errors,
        };
      }
      set({ isLoading: false });
      return { success: false, message: 'Đăng ký không thành công.' };
    },

    forgotPassword: async (email: string) => {
      set({ isLoading: true });
      try {
        const res = await authService.forgotPassword(email.trim());
        set({ isLoading: false });
        return { success: true, message: res.message || 'Mã OTP đã được gửi đến email của bạn.' };
      } catch (err: any) {
        set({ isLoading: false });
        return {
          success: false,
          message: err?.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại email.',
          errors: err?.errors,
        };
      }
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
      set({ isLoading: true });
      try {
        const res = await authService.resetPassword(payload);
        set({ isLoading: false });
        return { success: true, message: res.message || 'Đặt lại mật khẩu thành công.' };
      } catch (err: any) {
        set({ isLoading: false });
        return {
          success: false,
          message: err?.message || 'Đặt lại mật khẩu thất bại.',
          errors: err?.errors,
        };
      }
    },

    logout: async () => {
      // 1. Clear state locally and all cookies/storage first to avoid UI blocking and infinite loop 401s
      clearAllAuthSession();
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        permissions: [],
      });

      // 2. Call API (if it fails, we already cleared the state)
      try {
        await authService.logout();
      } catch {
        // Silently ignore logout errors (like 401 unauthenticated)
      }
    },

    fetchMe: async () => {
      const token = get().token;
      if (!token) return;
      try {
        const res = await authService.me();
        if (res.success && res.data) {
          const u = res.data.user;
          const userObj: User = {
            id: u.user_id,
            user_id: u.user_id,
            username: u.username,
            email: u.email,
            fullname: u.fullname,
            name: u.fullname,
            phone: u.phone,
            avatar: u.avatar,
            total_points: u.total_points || 0,
            user_tier: u.user_tier || 'Bronze',
            role_name: u.role_name || 'CUSTOMER',
          };
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('cinedot_current_user', JSON.stringify(userObj));
            localStorage.setItem('cinedot_permissions', JSON.stringify(res.data.permissions || []));
          }
          
          set({
            user: userObj,
            permissions: res.data.permissions || [],
            isAuthenticated: true,
          });
        }
      } catch {
        // Token might be invalid
      }
    },

    hasPermission: (permission) => {
      const { permissions } = get();
      return permissions.includes(permission) || permissions.includes('*') || get().user?.role_name === 'admin';
    },

    hasAnyPermission: (permList) => {
      const { permissions } = get();
      return permList.some((p) => permissions.includes(p)) || permissions.includes('*') || get().user?.role_name === 'admin';
    },

    openAuthModal: (tab = 'login', notice = '', redirectUrl) => {
      set({
        isAuthModalOpen: true,
        authModalTab: tab,
        authNotice: notice,
        postLoginRedirectUrl: redirectUrl || null,
      });
    },

    closeAuthModal: () => {
      set({
        isAuthModalOpen: false,
        authNotice: '',
        postLoginRedirectUrl: null,
      });
    },

    loginDemo: () => {
      get().setAuth(MOCK_DEMO_USER, ['*'], 'mock_token_admin_101');
      set({ isAuthModalOpen: false });
    },
  };
});
