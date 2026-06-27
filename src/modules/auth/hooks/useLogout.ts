import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      // Dù API backend có thành công hay lỗi (vd 401 token hết hạn), 
      // Client vẫn phải clear sạch bách dữ liệu tại chỗ
      
      // 1. Xóa Zustand, Cookie
      useAuthStore.getState().clearToken();

      // 2. Wipe all React Query caches
      queryClient.clear();

      // 3. Clear any local/session storage related to auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }

      // 4. Execute redirect using replace
      router.replace('/');
    },
  });
};
