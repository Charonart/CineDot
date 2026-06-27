import { create } from 'zustand';
import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'cine_token';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// Lấy token ban đầu từ cookie nếu có
const initialToken = Cookies.get(AUTH_TOKEN_KEY) || null;

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  setToken: (token: string) => {
    Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7, path: '/' }); // Cookie expires in 7 days
    set({ token });
  },
  clearToken: () => {
    Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
    set({ token: null });
  },
}));
