import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '../services/auth.service';
import { authKeys } from './useCurrentUser';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // 1. Reset auth cache
      queryClient.setQueryData(authKeys.me(), null);
      
      // 2. Invalidate dependencies
      void queryClient.invalidateQueries({ queryKey: authKeys.all });
      void queryClient.invalidateQueries({ queryKey: ['booking'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['history'] });
      
      // 3. Force clean other caches
      queryClient.clear();

      // 4. Redirect if user is in protected paths
      if (pathname && (pathname.startsWith('/booking') || pathname.startsWith('/profile') || pathname.startsWith('/tickets'))) {
        router.push('/');
      } else {
        router.refresh();
      }
    },
  });
};
