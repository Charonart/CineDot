import Cookies from 'js-cookie';

export const AUTH_COOKIE_KEYS = [
  'cine_token',
  'cinedot_token',
  'cinedot_admin_token',
  'XSRF-TOKEN',
] as const;

export const AUTH_LOCAL_STORAGE_KEYS = [
  'cine_token',
  'cinedot_token',
  'cinedot_admin_token',
  'cinedot_user',
  'cinedot_current_user',
  'cinedot_permissions',
  'cinedot_admin_user',
  'cinedot_admin_permissions',
] as const;

/**
 * Xóa sạch 100% tất cả cookie và localStorage liên quan đến phiên làm việc
 * trên tất cả các paths và miền.
 */
export function clearAllAuthSession(): void {
  if (typeof window === 'undefined') return;

  // 1. Xóa toàn bộ Cookie
  AUTH_COOKIE_KEYS.forEach((key) => {
    Cookies.remove(key, { path: '/' });
    Cookies.remove(key, { path: '/admin' });
    Cookies.remove(key);
  });

  // 2. Xóa toàn bộ LocalStorage
  AUTH_LOCAL_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Bỏ qua nếu storage bị block
    }
  });

  // 3. Xóa SessionStorage
  try {
    sessionStorage.clear();
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy token xác thực hiện tại từ bất kỳ nguồn hợp lệ nào
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  return (
    Cookies.get('cine_token') ||
    Cookies.get('cinedot_token') ||
    Cookies.get('cinedot_admin_token') ||
    localStorage.getItem('cinedot_token') ||
    localStorage.getItem('cine_token') ||
    localStorage.getItem('cinedot_admin_token') ||
    null
  );
}
