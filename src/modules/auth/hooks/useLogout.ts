import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } finally {
        // 1. Wipe all React Query caches
        queryClient.clear();

        // 2. Clear any local/session storage related to auth
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }

        // 3. Execute redirect using replace
        router.replace('/');
      }
    },
  });
};
