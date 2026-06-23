import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services/auth.service';
import { LoginRequestDTO } from '../dto/auth.dto';
import { authKeys } from './useCurrentUser';
import { QUERY_KEYS } from '@lib/constants/queryKeys';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams ? searchParams.get('redirectTo') : null;

  return useMutation({
    mutationFn: (payload: LoginRequestDTO) => authService.login(payload),
    onSuccess: async (session) => {
      // 1. Set query data in cache
      queryClient.setQueryData(authKeys.me(), session);
      // 2. Invalidate to trigger updates across the app
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentUser });
      
      // 3. Refetch currentUser to avoid AuthGuard race condition
      await queryClient.refetchQueries({ queryKey: QUERY_KEYS.currentUser });
      
      // 4. Safely redirect using replace
      if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
        router.replace(redirectTo);
      } else {
        router.replace('/');
      }
    },
  });
};
