import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services/auth.service';
import { LoginRequestDTO } from '../dto/auth.dto';
import { authKeys } from './useCurrentUser';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams ? searchParams.get('redirectTo') : null;

  return useMutation({
    mutationFn: (payload: LoginRequestDTO) => authService.login(payload),
    onSuccess: (session) => {
      // 1. Set query data in cache
      queryClient.setQueryData(authKeys.me(), session);
      // 2. Invalidate to trigger updates across the app
      void queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      // 3. Safely redirect
      if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
        router.push(redirectTo);
      } else {
        router.push('/');
      }
    },
  });
};
