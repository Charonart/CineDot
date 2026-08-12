import { create } from 'zustand';
import { User } from '../types/auth.types';

export type AuthModalTab = 'login' | 'register' | 'forgot';

interface AuthState {
  user: User | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;

  // Modal Popup states
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  authNotice: string;
  postLoginRedirectUrl: string | null;

  setAuth: (user: User, permissions: string[], token: string) => void;
  login: (emailOrPhone: string, pass: string) => { success: boolean; message?: string };
  register: (data: { name: string; email: string; phone: string; pass: string }) => { success: boolean; message?: string };
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;

  // Modal actions
  openAuthModal: (tab?: AuthModalTab, notice?: string, redirectUrl?: string) => void;
  closeAuthModal: () => void;
  loginDemo: () => void;
}

const MOCK_DEMO_USER: User = {
  id: 'u-8841',
  username: 'cinedot_user',
  email: 'user@cinedot.vn',
  name: 'Nguyễn Văn CineDot',
  role_name: 'CUSTOMER',
};

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const token = localStorage.getItem('cinedot_token') || localStorage.getItem('cine_token');
  const storedUser = localStorage.getItem('cinedot_current_user');
  let user: User | null = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = MOCK_DEMO_USER;
    }
  } else if (token) {
    user = MOCK_DEMO_USER;
  }
  return { token, user };
};

export const useAuthStore = create<AuthState>((set, get) => {
  const { token: initialToken, user: initialUser } = getInitialState();

  return {
    user: initialUser,
    permissions: ['BOOK_TICKET', 'VIEW_PROFILE'],
    token: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),

    isAuthModalOpen: false,
    authModalTab: 'login',
    authNotice: '',
    postLoginRedirectUrl: null,

    setAuth: (user, permissions, token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cinedot_token', token);
        localStorage.setItem('cine_token', token);
        localStorage.setItem('cinedot_current_user', JSON.stringify(user));
        document.cookie = `cinedot_token=${token}; path=/; max-age=86400; SameSite=Strict`;
        document.cookie = `cine_token=${token}; path=/; max-age=86400; SameSite=Strict`;
      }
      set({ user, permissions, token, isAuthenticated: true });
    },

    login: (emailOrPhone, pass) => {
      if (typeof window === 'undefined') return { success: false, message: 'Thao tác không khả dụng' };

      const inputTarget = emailOrPhone.trim().toLowerCase();
      const inputPass = pass.trim();

      // Get registered users from localStorage
      const registeredStr = localStorage.getItem('cinedot_registered_users');
      let registeredList: Array<User & { pass: string; phone?: string }> = [];
      if (registeredStr) {
        try {
          registeredList = JSON.parse(registeredStr);
        } catch {
          registeredList = [];
        }
      }

      // 1. Search for existing account by email, username, or phone
      const userFound = registeredList.find(
        (u) =>
          u.email.toLowerCase() === inputTarget ||
          u.username.toLowerCase() === inputTarget ||
          (u.phone && u.phone === inputTarget)
      );

      if (userFound) {
        // Strict password check
        if (userFound.pass === inputPass) {
          const { pass: _, ...userObj } = userFound;
          const newToken = 'user_token_' + userFound.id;
          get().setAuth(userObj, ['BOOK_TICKET', 'VIEW_PROFILE'], newToken);
          return { success: true };
        } else {
          return { success: false, message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
        }
      }

      // 2. Check default system user fallback (user@cinedot.vn)
      if (inputTarget === 'user@cinedot.vn' || inputTarget === 'cinedot_user') {
        if (inputPass === '123456' || inputPass === '12345678') {
          const demoToken = 'mock_jwt_token_cinedot_platinum_8841';
          get().setAuth(MOCK_DEMO_USER, ['BOOK_TICKET', 'VIEW_PROFILE'], demoToken);
          return { success: true };
        } else {
          return { success: false, message: 'Mật khẩu không chính xác! Vui lòng kiểm tra lại.' };
        }
      }

      // 3. User does NOT exist in registered list
      return {
        success: false,
        message: 'Tài khoản chưa tồn tại. Vui lòng chuyển sang tab Đăng Ký để tạo tài khoản mới!',
      };
    },

    register: ({ name, email, phone, pass }) => {
      if (typeof window === 'undefined') return { success: false, message: 'Thao tác không khả dụng' };

      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();

      const registeredStr = localStorage.getItem('cinedot_registered_users');
      let registeredList: Array<User & { pass: string; phone?: string }> = [];
      if (registeredStr) {
        try {
          registeredList = JSON.parse(registeredStr);
        } catch {
          registeredList = [];
        }
      }

      if (registeredList.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, message: 'Email này đã được đăng ký tài khoản! Vui lòng bấm sang tab Đăng Nhập.' };
      }

      const newUserObj: User & { pass: string; phone: string } = {
        id: 'u-' + Date.now(),
        username: cleanEmail.split('@')[0],
        email: cleanEmail,
        name: name.trim(),
        role_name: 'CUSTOMER',
        pass: pass.trim(),
        phone: cleanPhone,
      };

      registeredList.push(newUserObj);
      localStorage.setItem('cinedot_registered_users', JSON.stringify(registeredList));

      const { pass: _, ...userObj } = newUserObj;
      const newToken = 'user_token_' + newUserObj.id;
      get().setAuth(userObj, ['BOOK_TICKET', 'VIEW_PROFILE'], newToken);
      return { success: true };
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cinedot_token');
        localStorage.removeItem('cine_token');
        localStorage.removeItem('cinedot_current_user');
        document.cookie = 'cinedot_token=; Max-Age=0; path=/;';
        document.cookie = 'cine_token=; Max-Age=0; path=/;';
      }
      set({ user: null, permissions: [], token: null, isAuthenticated: false });
    },

    hasPermission: (permission: string) => {
      const { permissions } = get();
      return permissions.includes(permission);
    },

    hasAnyPermission: (requiredPermissions: string[]) => {
      const { permissions } = get();
      return requiredPermissions.some((p) => permissions.includes(p));
    },

    openAuthModal: (tab = 'login', notice = '', redirectUrl = '') => {
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
      const demoToken = 'mock_jwt_token_cinedot_platinum_8841';
      get().setAuth(MOCK_DEMO_USER, ['BOOK_TICKET', 'VIEW_PROFILE'], demoToken);
      set({
        isAuthModalOpen: false,
        authNotice: '',
      });
    },
  };
});
